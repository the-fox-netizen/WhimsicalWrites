'use client';

import { useEffect, useRef } from 'react';

export function ViewTracker({ slug }: { slug: string }) {
  const tracked = useRef(false);

  useEffect(() => {
    if (tracked.current) return;
    tracked.current = true;

    const viewedKey = `viewed_${slug}`;
    if (localStorage.getItem(viewedKey)) return;

    fetch('/api/posts/views', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ slug: slug }),
    }).then((res) => {
      if (res.ok) {
        localStorage.setItem(viewedKey, 'true');
      }
    }).catch(console.error);
  }, [slug]);

  return null;
}
