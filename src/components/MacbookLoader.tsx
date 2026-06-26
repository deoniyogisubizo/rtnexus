import React, { useState, useEffect } from 'react';

export default function MacbookLoader({ fadeOut }: { fadeOut?: boolean }) {
  const [darkMode, setDarkMode] = useState(() =>
    window.matchMedia('(prefers-color-scheme: dark)').matches
  );

  useEffect(() => {
    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => setDarkMode(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  const keys = new Array(47).fill(null);
  const afterSpace = new Array(8).fill(null);
  const fKeys = new Array(16).fill(null);

  return (
    <div className={`macbook-loader${fadeOut ? ' loader-fade-out' : ''}${darkMode ? ' dark-mode' : ''}`}>
      <div className="macbook">
        <div className="inner">
          <div className="screen">
            <div className="face-one">
              <div className="camera" />
              <div className="display">
                <div className="shade" />
              </div>
              <span>MacBook Air</span>
            </div>
          </div>
          <div className="macbody">
            <div className="face-one">
              <div className="touchpad" />
              <div className="keyboard">
                {keys.map((_, i) => <div key={i} className="key" />)}
                <div className="key space" />
                {afterSpace.map((_, i) => <div key={`as-${i}`} className="key" />)}
                {fKeys.map((_, i) => <div key={`f-${i}`} className="key f" />)}
              </div>
            </div>
            <div className="pad one" />
            <div className="pad two" />
            <div className="pad three" />
            <div className="pad four" />
          </div>
        </div>
        <div className="shadow" />
      </div>
      <div className="loader-text">WELCOME TO RT GROUP UNIVERSE</div>
    </div>
  );
}
