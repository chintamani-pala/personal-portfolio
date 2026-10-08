import { NextResponse } from 'next/server';

const CACHE_FILE = require('path').join(process.cwd(), 'public', 'portfolio-cache.json');

export async function GET() {
  try {
    const fs = await import('fs/promises');
    const content = await fs.readFile(CACHE_FILE, 'utf-8');
    const cache = JSON.parse(content);
    if (cache?.data) {
      return NextResponse.json(cache.data);
    }
  } catch {
    // No cache file yet
  }
  return NextResponse.json({ cached: false });
}
