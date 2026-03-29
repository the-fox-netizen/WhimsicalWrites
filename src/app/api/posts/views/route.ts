import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const { slug } = await request.json();

    if (!slug) {
      return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
    }

    const { error } = await supabase.rpc('increment_post_views', {
      post_slug: slug,
    });

    if (error) {
      console.error('Error incrementing views:', error);
      return NextResponse.json({ error: 'Failed to increment views' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in views route:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
