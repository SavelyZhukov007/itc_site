import { type ReactNode, useEffect, useId, useRef } from 'react';

type ModalProps = {
  title: string;
  onClose: () => void;
  children: ReactNode;
  originRect?: DOMRect | null;
};

const ANIMATION_OPTIONS: KeyframeAnimationOptions = {
  duration: 420,
  easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
  fill: 'forwards',
};

function shouldReduceMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function Modal({ title, onClose, children, originRect }: ModalProps) {
  const titleId = useId();
  const backdropRef = useRef<HTMLDivElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const closeInProgressRef = useRef(false);

  const animateCard = (direction: 'open' | 'close') => {
    const card = cardRef.current;
    if (!card) {
      return Promise.resolve();
    }

    if (!originRect || shouldReduceMotion()) {
      const fallback = card.animate(
        direction === 'open'
          ? [
            { opacity: 0, transform: 'translateY(18px) scale(0.96)' },
            { opacity: 1, transform: 'translateY(0) scale(1)' },
          ]
          : [
            { opacity: 1, transform: 'translateY(0) scale(1)' },
            { opacity: 0, transform: 'translateY(12px) scale(0.96)' },
          ],
        { ...ANIMATION_OPTIONS, duration: 240 },
      );

      return fallback.finished.catch(() => undefined);
    }

    const cardRect = card.getBoundingClientRect();
    const originCenterX = originRect.left + originRect.width / 2;
    const originCenterY = originRect.top + originRect.height / 2;
    const targetCenterX = cardRect.left + cardRect.width / 2;
    const targetCenterY = cardRect.top + cardRect.height / 2;
    const translateX = originCenterX - targetCenterX;
    const translateY = originCenterY - targetCenterY;
    const scaleX = Math.max(originRect.width / cardRect.width, 0.18);
    const scaleY = Math.max(originRect.height / cardRect.height, 0.18);

    const animation = card.animate(
      direction === 'open'
        ? [
          {
            opacity: 0.36,
            transform: `translate(${translateX}px, ${translateY}px) scale(${scaleX}, ${scaleY}) rotateY(-88deg)`,
            filter: 'blur(1px)',
            borderRadius: '18px',
          },
          {
            opacity: 1,
            transform: 'translate(0px, 0px) scale(1, 1) rotateY(0deg)',
            filter: 'blur(0px)',
            borderRadius: '28px',
          },
        ]
        : [
          {
            opacity: 1,
            transform: 'translate(0px, 0px) scale(1, 1) rotateY(0deg)',
            filter: 'blur(0px)',
            borderRadius: '28px',
          },
          {
            opacity: 0.2,
            transform: `translate(${translateX}px, ${translateY}px) scale(${scaleX}, ${scaleY}) rotateY(82deg)`,
            filter: 'blur(1px)',
            borderRadius: '18px',
          },
        ],
      ANIMATION_OPTIONS,
    );

    return animation.finished.catch(() => undefined);
  };

  const animateBackdrop = (direction: 'open' | 'close') => {
    const backdrop = backdropRef.current;
    if (!backdrop || shouldReduceMotion()) {
      return Promise.resolve();
    }

    const animation = backdrop.animate(
      direction === 'open'
        ? [{ opacity: 0 }, { opacity: 1 }]
        : [{ opacity: 1 }, { opacity: 0 }],
      { duration: direction === 'open' ? 220 : 180, easing: 'ease', fill: 'forwards' },
    );

    return animation.finished.catch(() => undefined);
  };

  const requestClose = async () => {
    if (closeInProgressRef.current) {
      return;
    }

    closeInProgressRef.current = true;
    await Promise.all([animateCard('close'), animateBackdrop('close')]);
    onClose();
  };

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    void Promise.all([animateCard('open'), animateBackdrop('open')]);

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        void requestClose();
      }
    };

    window.addEventListener('keydown', handleEscape);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleEscape);
    };
  });

  return (
    <div
      ref={backdropRef}
      className="modal-backdrop"
      role="presentation"
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          void requestClose();
        }
      }}
    >
      <div
        ref={cardRef}
        className="modal-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="modal-header">
          <h3 id={titleId}>{title}</h3>
          <button className="modal-close" type="button" aria-label="Закрыть окно" onClick={() => void requestClose()}>
            ×
          </button>
        </div>
        <div className="modal-content">{children}</div>
        <button className="primary-button full-width" type="button" onClick={() => void requestClose()}>
          Закрыть
        </button>
      </div>
    </div>
  );
}
