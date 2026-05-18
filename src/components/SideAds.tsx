import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

const SideAdUnit: React.FC<{ side: 'left' | 'right' }> = ({ side }) => {
  const pushed = useRef(false);

  useEffect(() => {
    if (pushed.current) return;
    pushed.current = true;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (_) {}
  }, []);

  return (
    <div
      className={`fixed top-1/2 -translate-y-1/2 z-30 hidden 2xl:block ${
        side === 'left' ? 'left-2' : 'right-2'
      }`}
      style={{ width: 160 }}
    >
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-5953527115992840"
        data-ad-slot="7214857217"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
};

export const SideAds: React.FC = () => (
  <>
    <SideAdUnit side="left" />
    <SideAdUnit side="right" />
  </>
);
