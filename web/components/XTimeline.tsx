'use client';

import { useEffect, useRef } from 'react';
import styles from './XTimeline.module.css';

declare global {
  interface Window {
    twttr?: {
      widgets: { load: (el?: HTMLElement) => void };
    };
  }
}

export default function XTimeline({ handle }: { handle: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const existing = document.getElementById('twitter-widgets-js');

    function loadWidgets() {
      if (window.twttr?.widgets && containerRef.current) {
        window.twttr.widgets.load(containerRef.current);
      }
    }

    if (existing) {
      loadWidgets();
      return;
    }

    const script = document.createElement('script');
    script.id = 'twitter-widgets-js';
    script.src = 'https://platform.twitter.com/widgets.js';
    script.async = true;
    script.onload = loadWidgets;
    document.body.appendChild(script);
  }, [handle]);

  return (
    <div ref={containerRef} className={styles.wrap}>
      <a
        className="twitter-timeline"
        data-theme="light"
        data-chrome="noheader nofooter noborders transparent"
        data-tweet-limit="5"
        href={`https://twitter.com/${handle}?ref_src=twsrc%5Etfw`}
      >
        Tweets by @{handle}
      </a>
    </div>
  );
}