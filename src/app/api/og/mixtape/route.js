import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';

export const config = {
  runtime: 'edge',
};

// Example: /api/og/mixtape?ids=1,2,3
export default async function handler(req) {
  const { searchParams } = new URL(req.url);
  const idsParam = searchParams.get('ids');
  const ids = idsParam
    ? idsParam.split(',').map(id => parseInt(id, 10)).filter(n => !isNaN(n)).filter((n, i, arr) => arr.indexOf(n) === i).slice(0, 20)
    : [];

  // Fetch game covers from your DB or static assets
  // For demo, use placeholder images
  const covers = ids.map((id, idx) =>
    `https://placehold.co/80x80?text=Game+${id}`
  );

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          background: '#fff',
          width: '600px',
          height: '315px',
          padding: '32px',
        }}
      >
        {covers.map((src, i) => (
          <img
            key={i}
            src={src}
            width={80}
            height={80}
            style={{ marginRight: 16, borderRadius: 8, border: '2px solid #6366f1' }}
            alt={`Game ${ids[i]}`}
          />
        ))}
        <span style={{ fontSize: 32, color: '#6366f1', fontWeight: 700, marginLeft: 24 }}>
          Mood Mixtape
        </span>
      </div>
    ),
    {
      width: 600,
      height: 315,
    }
  );
}
