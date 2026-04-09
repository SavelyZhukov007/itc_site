import { useEffect } from 'react';

export function useRevealOnScroll() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.querySelectorAll<HTMLElement>('[data-reveal]').forEach((element) => {
        element.classList.add('is-visible');
      });
      return;
    }

    const elements = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const target = entry.target as HTMLElement;
            target.classList.add('is-visible');
            observer.unobserve(target);
          }
        });
      },
      {
        threshold: 0.16,
        rootMargin: '0px 0px -10% 0px',
      },
    );

    elements.forEach((element, index) => {
      const delay = Number(element.dataset.delay ?? index % 4) * 70;
      element.style.setProperty('--reveal-delay', `${delay}ms`);
      observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);
}
