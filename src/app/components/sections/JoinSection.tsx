import { type FormEvent } from 'react';

import { departments, joinSectionContent } from '../../data/siteContent';
import type { DepartmentKey, FormState } from '../../types';

type JoinSectionProps = {
  formData: FormState;
  submitMessage: string;
  isSubmitting: boolean;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onFieldChange: <K extends keyof FormState>(field: K, value: FormState[K]) => void;
};

export function JoinSection({ formData, submitMessage, isSubmitting, onSubmit, onFieldChange }: JoinSectionProps) {
  return (
    <section id="contact" className="contact-section">
      <div className="container contact-grid">
        <div className="contact-copy" data-reveal="left">
          <span className="eyebrow">Присоединяйся</span>
          <h2>{joinSectionContent.title}</h2>
          <p>{joinSectionContent.lead}</p>
          <ol className="join-steps">
            {joinSectionContent.steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
          <p>{joinSectionContent.note}</p>
        </div>

        <form className="contact-form" onSubmit={onSubmit} noValidate data-reveal="right" data-delay="1">
          <div className="form-grid">
            <label>
              <span>ФИО *</span>
              <input
                type="text"
                value={formData.name}
                onChange={(event) => onFieldChange('name', event.target.value)}
                placeholder="Иванов Иван Иванович"
                autoComplete="name"
                required
              />
            </label>

            <label>
              <span>Группа *</span>
              <input
                type="text"
                value={formData.group}
                onChange={(event) => onFieldChange('group', event.target.value)}
                placeholder="ПИ-21"
                required
              />
            </label>

            <label>
              <span>Телефон *</span>
              <input
                type="tel"
                value={formData.phone}
                onChange={(event) => onFieldChange('phone', event.target.value)}
                placeholder="+7 (999) 123-45-67"
                autoComplete="tel"
                required
              />
            </label>

            <label>
              <span>Email *</span>
              <input
                type="email"
                value={formData.email}
                onChange={(event) => onFieldChange('email', event.target.value)}
                placeholder="name@example.com"
                autoComplete="email"
                required
              />
            </label>

            <label>
              <span>Telegram</span>
              <input
                type="text"
                value={formData.telegram}
                onChange={(event) => onFieldChange('telegram', event.target.value)}
                placeholder="@username"
              />
            </label>

            <label>
              <span>Выбор отдела *</span>
              <select
                value={formData.department}
                onChange={(event) => onFieldChange('department', event.target.value as DepartmentKey | '')}
                required
              >
                <option value="">Выберите отдел</option>
                {departments.map((department) => (
                  <option key={department.key} value={department.key}>
                    {department.title}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className="textarea-field">
            <span>О себе и мотивация *</span>
            <textarea
              value={formData.about}
              onChange={(event) => onFieldChange('about', event.target.value)}
              placeholder="Расскажите, что вам интересно и в каком направлении вы хотите развиваться."
              rows={6}
              required
            />
          </label>

          <div className="form-footer">
            <button className="primary-button" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Отправляем…' : 'Отправить заявку'}
            </button>
            <p className={`submit-message ${submitMessage ? 'visible' : ''}`.trim()} role="status" aria-live="polite">
              {submitMessage}
            </p>
          </div>
        </form>
      </div>
    </section>
  );
}
