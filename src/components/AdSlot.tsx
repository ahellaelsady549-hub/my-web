import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface AdSlotProps {
  /** Unique slot id, e.g. "home-top" */
  id: string;
  label?: string;
  /** 'banner' = leaderboard, 'inline' = in-content native, 'square' = box, 'skyscraper' = tall side */
  format?: 'banner' | 'inline' | 'square' | 'skyscraper';
  className?: string;
}

type IframeAd = { key: string; width: number; height: number };

const IFRAME_ADS: Record<string, IframeAd> = {
  '728x90': { key: '6e842292200436ffe07d2eedbdce255b', width: 728, height: 90 },
  '468x60': { key: '1194e8b1822e231451dbd9ecb28113c2', width: 468, height: 60 },
  '320x50': { key: '8bfa9aa52d34b3e37bc672f6dc3c0b96', width: 320, height: 50 },
  '300x250': { key: 'eaabec85ae8ed3d48320731d20143bbe', width: 300, height: 250 },
  '160x600': { key: '340fe9c6005f413bb09c7924b94880c0', width: 160, height: 600 },
  '160x300': { key: 'fae67b7d32450d6a384d61e6a9110fc3', width: 160, height: 300 },
};

const NATIVE_CONTAINER = 'container-12b60a68916d0af791991fd91ff6e389';
const NATIVE_SRC =
  'https://pl30678284.effectivecpmnetwork.com/12b60a68916d0af791991fd91ff6e389/invoke.js';

const adDoc = (ad: IframeAd) => `<!DOCTYPE html><html><head><meta charset="utf-8">
<style>html,body{margin:0;padding:0;overflow:hidden;background:transparent}</style></head><body>
<script type="text/javascript">
  atOptions = { 'key':'${ad.key}', 'format':'iframe', 'height':${ad.height}, 'width':${ad.width}, 'params':{} };
<\/script>
<script type="text/javascript" src="https://www.highperformanceformat.com/${ad.key}/invoke.js"><\/script>
</body></html>`;

const IframeAdUnit = ({ size, className }: { size: keyof typeof IFRAME_ADS; className?: string }) => {
  const ad = IFRAME_ADS[size];
  return (
    <iframe
      title={`ad-${size}`}
      srcDoc={adDoc(ad)}
      width={ad.width}
      height={ad.height}
      scrolling="no"
      loading="lazy"
      sandbox="allow-scripts allow-popups allow-popups-to-escape-sandbox allow-same-origin"
      style={{ width: ad.width, height: ad.height, border: 0 }}
      className={cn('mx-auto block max-w-full', className)}
    />
  );
};

const NativeAdUnit = () => {
  const ref = useRef<HTMLDivElement>(null);
  const loaded = useRef(false);

  useEffect(() => {
    if (loaded.current || !ref.current) return;
    loaded.current = true;
    const script = document.createElement('script');
    script.src = NATIVE_SRC;
    script.async = true;
    script.setAttribute('data-cfasync', 'false');
    ref.current.appendChild(script);
  }, []);

  return (
    <div ref={ref} className="w-full">
      <div id={NATIVE_CONTAINER} />
    </div>
  );
};

/**
 * Advertising space. Renders real ad units (iframe banners / native banner)
 * while keeping layout stable to avoid CLS.
 */
export const AdSlot = ({ id, label = 'مساحة إعلانية', format = 'banner', className }: AdSlotProps) => {
  return (
    <div className={cn('container mx-auto px-4 my-6', className)} dir="rtl">
      <div
        id={`ad-${id}`}
        data-ad-slot={id}
        aria-label={label}
        className="flex w-full items-center justify-center overflow-hidden"
      >
        {format === 'banner' && (
          <>
            <div className="hidden md:block">
              <IframeAdUnit size="728x90" />
            </div>
            <div className="hidden sm:block md:hidden">
              <IframeAdUnit size="468x60" />
            </div>
            <div className="block sm:hidden">
              <IframeAdUnit size="320x50" />
            </div>
          </>
        )}

        {format === 'inline' && <NativeAdUnit />}

        {format === 'square' && <IframeAdUnit size="300x250" />}

        {format === 'skyscraper' && (
          <>
            <div className="hidden md:block">
              <IframeAdUnit size="160x600" />
            </div>
            <div className="block md:hidden">
              <IframeAdUnit size="160x300" />
            </div>
          </>
        )}
      </div>
    </div>
  );
};
