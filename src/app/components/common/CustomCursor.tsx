import { useEffect, useRef, useState } from 'react';

import clickIcon from '../../../assets/cursor/click.svg';

const INTERACTIVE_SELECTOR = 'a, button, input, select, textarea, label, summary, [role="button"], [data-cursor="interactive"]';

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const [interactive, setInteractive] = useState(false);
  const [visible, setVisible] = useState(false);
  const [pressed, setPressed] = useState(false);

  useEffect(() => {
    const supportsFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!supportsFinePointer) {
      return;
    }

    document.body.classList.add('custom-cursor-enabled');

    let animationFrame = 0;
    let currentX = window.innerWidth / 2;
    let currentY = window.innerHeight / 2;
    let targetX = currentX;
    let targetY = currentY;

    const animate = () => {
      currentX += (targetX - currentX) * 0.22;
      currentY += (targetY - currentY) * 0.22;

      if (cursorRef.current) {
        cursorRef.current.style.setProperty('--cursor-x', `${currentX}px`);
        cursorRef.current.style.setProperty('--cursor-y', `${currentY}px`);
      }

      animationFrame = window.requestAnimationFrame(animate);
    };

    const handleMove = (event: MouseEvent) => {
      targetX = event.clientX;
      targetY = event.clientY;
      setVisible(true);
    };

    const handleOver = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      setInteractive(Boolean(target?.closest(INTERACTIVE_SELECTOR)));
    };

    const handleLeaveWindow = () => setVisible(false);
    const handlePress = () => setPressed(true);
    const handleRelease = () => setPressed(false);

    animationFrame = window.requestAnimationFrame(animate);
    window.addEventListener('mousemove', handleMove, { passive: true });
    window.addEventListener('mouseover', handleOver, { passive: true });
    window.addEventListener('mouseout', handleLeaveWindow);
    window.addEventListener('mousedown', handlePress);
    window.addEventListener('mouseup', handleRelease);

    return () => {
      document.body.classList.remove('custom-cursor-enabled');
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseover', handleOver);
      window.removeEventListener('mouseout', handleLeaveWindow);
      window.removeEventListener('mousedown', handlePress);
      window.removeEventListener('mouseup', handleRelease);
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className={`custom-cursor ${visible ? 'is-visible' : ''} ${interactive ? 'is-interactive' : ''} ${pressed ? 'is-pressed' : ''}`.trim()}
      aria-hidden="true"
    >
      <div className="custom-cursor__outer">
        <div className="custom-cursor__inner" />
        <img className="custom-cursor__icon" src={clickIcon} alt="" />
      </div>
    </div>
  );
}
