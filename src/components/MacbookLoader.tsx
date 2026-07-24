import React from 'react';

export default function MacbookLoader({ fadeOut }: { fadeOut?: boolean }) {
  return (
    <div className={`macbook-loader${fadeOut ? ' loader-fade-out' : ''}`}>
      <img
        src="/logo/logoonly.png"
        alt="RT Group"
        style={{ width: 260, height: 'auto', objectFit: 'contain' }}
      />
      <div className="loader-text">WELCOME TO RT GROUP UNIVERSE</div>
    </div>
  );
}
