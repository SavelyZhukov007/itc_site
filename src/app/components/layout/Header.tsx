import { brandAssets, navigationItems, siteMeta } from '../../data/siteContent';
import type { SectionId } from '../../types';

type HeaderProps = {
  onNavigate: (sectionId: SectionId) => void;
};

export function Header({ onNavigate }: HeaderProps) {
  return (
    <header className="site-header" data-reveal="fade-down">
      <div className="container header-inner">
        <button className="brand-text-button" type="button" onClick={() => onNavigate('top')}>
          <span className="brand-kicker">Информационно-техническое сообщество</span>
          <span className="brand-text">{siteMeta.name}</span>
        </button>

        <button className="brand-logo-button" type="button" onClick={() => onNavigate('top')} aria-label={`Перейти к началу: ${siteMeta.name}`}>
          <img className="brand-logo" src={brandAssets.logo} alt={`Логотип ${siteMeta.name}`} />
        </button>

        <nav className="header-nav" aria-label="Основная навигация">
          {navigationItems.map((item) => (
            <button key={item.id} type="button" onClick={() => onNavigate(item.id)}>
              {item.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}
