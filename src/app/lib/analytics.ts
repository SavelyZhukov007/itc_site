declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    ym?: (counterId: number, method: string, ...args: unknown[]) => void;
  }
}

const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID?.trim();
const YANDEX_METRIKA_ID = import.meta.env.VITE_YANDEX_METRIKA_ID?.trim();

let initialized = false;

function injectScript(options: { src?: string; content?: string; id: string; async?: boolean }) {
  if (document.getElementById(options.id)) {
    return;
  }

  const script = document.createElement('script');
  script.id = options.id;

  if (options.src) {
    script.src = options.src;
    script.async = options.async ?? true;
  }

  if (options.content) {
    script.textContent = options.content;
  }

  document.head.appendChild(script);
}

export function initAnalytics() {
  if (initialized || typeof window === 'undefined') {
    return;
  }

  if (GA_MEASUREMENT_ID) {
    injectScript({
      id: 'ga-script-loader',
      src: `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`,
    });

    injectScript({
      id: 'ga-script-config',
      content: `
        window.dataLayer = window.dataLayer || [];
        function gtag(){window.dataLayer.push(arguments);}
        window.gtag = gtag;
        gtag('js', new Date());
        gtag('config', '${GA_MEASUREMENT_ID}', {
          send_page_view: false,
          anonymize_ip: true
        });
      `,
    });
  }

  if (YANDEX_METRIKA_ID) {
    injectScript({
      id: 'yandex-metrika-script',
      content: `
        (function(m,e,t,r,i,k,a){
          m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
          m[i].l=1*new Date();
          for (var j = 0; j < document.scripts.length; j++) {
            if (document.scripts[j].src === r) return;
          }
          k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
        })(window, document, 'script', 'https://mc.yandex.ru/metrika/tag.js', 'ym');

        ym(${Number(YANDEX_METRIKA_ID)}, 'init', {
          clickmap: true,
          trackLinks: true,
          accurateTrackBounce: true,
          webvisor: true
        });
      `,
    });
  }

  initialized = true;
}

export function trackPageView(path = window.location.pathname) {
  if (GA_MEASUREMENT_ID && window.gtag) {
    window.gtag('event', 'page_view', {
      page_path: path,
      page_title: document.title,
      page_location: window.location.href,
    });
  }

  if (YANDEX_METRIKA_ID && window.ym) {
    window.ym(Number(YANDEX_METRIKA_ID), 'hit', path, {
      title: document.title,
      referer: document.referrer,
    });
  }
}

export function trackEvent(eventName: string, params: Record<string, string | number | boolean> = {}) {
  if (GA_MEASUREMENT_ID && window.gtag) {
    window.gtag('event', eventName, params);
  }

  if (YANDEX_METRIKA_ID && window.ym) {
    window.ym(Number(YANDEX_METRIKA_ID), 'reachGoal', eventName, params);
  }
}
