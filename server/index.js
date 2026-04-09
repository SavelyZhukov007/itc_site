import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const port = Number(process.env.BACKEND_PORT || 8787);
const dataDir = path.resolve(__dirname, 'data');
const dataFile = path.resolve(dataDir, process.env.FORM_STORAGE_FILE || 'applications.json');

function json(response, statusCode, payload) {
  response.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
  });
  response.end(JSON.stringify(payload));
}

function normalizeForm(form) {
  return {
    name: String(form.name || '').trim(),
    group: String(form.group || '').trim(),
    phone: String(form.phone || '').trim(),
    email: String(form.email || '').trim(),
    telegram: String(form.telegram || '').trim(),
    about: String(form.about || '').trim(),
    department: String(form.department || '').trim(),
  };
}

function validateForm(form) {
  const requiredFields = ['name', 'group', 'phone', 'email', 'about', 'department'];
  return requiredFields.every((field) => Boolean(form[field]));
}

async function readRequestBody(request) {
  const chunks = [];

  for await (const chunk of request) {
    chunks.push(chunk);
  }

  const rawBody = Buffer.concat(chunks).toString('utf8');
  return rawBody ? JSON.parse(rawBody) : {};
}

async function persistApplication(application) {
  await mkdir(dataDir, { recursive: true });

  let current = [];
  try {
    current = JSON.parse(await readFile(dataFile, 'utf8'));
    if (!Array.isArray(current)) {
      current = [];
    }
  } catch {
    current = [];
  }

  current.push(application);
  await writeFile(dataFile, JSON.stringify(current, null, 2), 'utf8');
}

function buildTelegramMessage(application) {
  return [
    '📩 Новая заявка в ИТС КИПФИН',
    '',
    `ФИО: ${application.name}`,
    `Группа: ${application.group}`,
    `Телефон: ${application.phone}`,
    `Email: ${application.email}`,
    `Telegram: ${application.telegram || '—'}`,
    `Отдел: ${application.department}`,
    '',
    'О себе и мотивация:',
    application.about,
  ].join('\n');
}

async function sendToTelegram(application) {
  const token = process.env.TG_BOT_TOKEN;
  const chatId = process.env.TG_CHAT_ID;

  if (!token || !chatId) {
    return { delivered: false, reason: 'telegram_not_configured' };
  }

  const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      chat_id: chatId,
      text: buildTelegramMessage(application),
    }),
  });

  if (!response.ok) {
    const payload = await response.text();
    throw new Error(`Telegram API error: ${response.status} ${payload}`);
  }

  return { delivered: true };
}

const server = createServer(async (request, response) => {
  if (!request.url) {
    json(response, 404, { message: 'Not found.' });
    return;
  }

  if (request.method === 'OPTIONS') {
    json(response, 204, {});
    return;
  }

  if (request.method === 'GET' && request.url === '/api/health') {
    json(response, 200, { ok: true });
    return;
  }

  if (request.method === 'POST' && request.url === '/api/join') {
    try {
      const body = await readRequestBody(request);
      const normalizedForm = normalizeForm(body);

      if (!validateForm(normalizedForm)) {
        json(response, 400, { message: 'Заполните обязательные поля формы.' });
        return;
      }

      const application = {
        ...normalizedForm,
        createdAt: new Date().toISOString(),
      };

      await persistApplication(application);
      const telegramResult = await sendToTelegram(application);

      json(response, 200, {
        message: telegramResult.delivered
          ? 'Спасибо! Заявка сохранена и отправлена в Telegram.'
          : 'Спасибо! Заявка сохранена. Подключите TG_BOT_TOKEN и TG_CHAT_ID, чтобы включить отправку в Telegram.',
      });
      return;
    } catch (error) {
      console.error(error);
      json(response, 500, { message: 'Ошибка сервера при сохранении заявки.' });
      return;
    }
  }

  json(response, 404, { message: 'Not found.' });
});

server.listen(port, () => {
  console.log(`ITC backend is listening on http://localhost:${port}`);
});
