import { type MouseEvent } from 'react';

import { brandAssets } from '../../data/siteContent';

type HeroSectionProps = {
  onJoinClick: () => void;
  onChairClick: (originRect: DOMRect) => void;
};

export function HeroSection({ onJoinClick, onChairClick }: HeroSectionProps) {
  const handleChairClick = (event: MouseEvent<HTMLButtonElement>) => {
    onChairClick(event.currentTarget.getBoundingClientRect());
  };

  return (
    <section className="hero-section">
      <div className="container hero-grid">
        <div className="hero-copy" data-reveal="left">
          <span className="eyebrow">Информационно-техническое сообщество</span>
          <h1>ИТС КИПФИН</h1>
          <p>
            Мы — единая команда, где каждый отдел отвечает за свою часть процесса, а все вместе работают на общий
            результат. Здесь идеи превращаются в реальные цифровые проекты, медиа и визуальные решения.
          </p>
          <p>
            В ИТС КИПФИН ценят инициативу, живую коммуникацию и практику. Можно развивать технические и креативные
            навыки, пробовать себя в новых ролях и собирать опыт, который ощущается не только в портфолио, но и в
            командной работе.
          </p>

          <div className="hero-actions">
            <button className="primary-button" type="button" onClick={onJoinClick}>
              Вступить в ИТС
            </button>
            <button className="secondary-button morph-trigger" type="button" onClick={handleChairClick}>
              Председатель ИТС
            </button>
          </div>
        </div>

        <div className="hero-visual" data-reveal="right" data-delay="1">
          <img src={brandAssets.heroImage} alt="Команда сообщества ИТС КИПФИН" />
        </div>
      </div>
    </section>
  );
}
