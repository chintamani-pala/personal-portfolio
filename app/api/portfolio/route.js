import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const CACHE_FILE = require('path').join(process.cwd(), 'public', 'portfolio-cache.json');

export async function GET() {
  try {
    const versionRes = await fetch(`${BACKEND_URL}/api/v1/admin/portfolio/version`, {
      headers: { 'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN || ''}` },
      // next: { revalidate: 0 },
      cache: 'no-store',
    });

    if (!versionRes.ok) {
      return NextResponse.json({ error: 'Failed to fetch version' }, { status: 500 });
    }

    const versionData = await versionRes.json();
    const remoteVersion = versionData.data?.version;

    if (!remoteVersion) {
      return NextResponse.json({ error: 'Invalid version response' }, { status: 500 });
    }

    let cache = { version: null, data: null };
    try {
      const fs = await import('fs/promises');
      const content = await fs.readFile(CACHE_FILE, 'utf-8');
      cache = JSON.parse(content);
    } catch {
      // No cache file yet
    }

    if (cache.version && cache.version === remoteVersion && cache.data) {
      return NextResponse.json(cache.data);
    }

    const snapshotRes = await fetch(`${BACKEND_URL}/api/v1/admin/portfolio/snapshot`, {
      headers: { 'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN || ''}` },
      cache: 'no-store',
    });

    if (!snapshotRes.ok) {
      return NextResponse.json({ error: 'Failed to fetch snapshot' }, { status: 500 });
    }

    const snapshot = await snapshotRes.json();

    try {
      const fs = await import('fs/promises');
      await fs.writeFile(CACHE_FILE, JSON.stringify({
        version: remoteVersion,
        data: snapshot.data,
        updated_at: new Date().toISOString(),
      }));
    } catch (writeError) {
      console.error('Failed to write cache file:', writeError);
    }

    return NextResponse.json(snapshot.data);
  } catch (error) {
    console.error('Portfolio API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
