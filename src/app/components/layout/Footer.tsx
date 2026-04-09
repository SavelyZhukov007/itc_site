import { brandAssets, siteMeta } from '../../data/siteContent';

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container site-footer__inner">
        <div className="footer-brand">
          <img className="footer-logo" src={brandAssets.logo} alt={`Логотип ${siteMeta.name}`} />
          <div>
            <p className="footer-title">{siteMeta.name}</p>
            <p className="footer-description">Сообщество для практики, роста и реальных цифровых проектов.</p>
          </div>
        </div>
        <p className="footer-note">От идеи до финального результата — в одном рабочем ритме.</p>
      </div>
    </footer>
  );
}
