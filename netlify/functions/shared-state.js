import { getStore } from '@netlify/blobs';

export default async (req) => {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
  };

  if (req.method === 'OPTIONS') {
    return new Response('', { status: 204, headers });
  }

  try {
    const store = getStore('perimeter-desk-cloud');

    if (req.method === 'GET') {
      const data = await store.get('live_state_v1', { type: 'json' });
      return new Response(JSON.stringify({ ok: true, data: data || null }), {
        status: 200,
        headers
      });
    }

    if (req.method === 'POST') {
      const payload = await req.json();
      await store.setJSON('live_state_v1', payload);
      return new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers
      });
    }

    return new Response(JSON.stringify({ ok: false, error: 'Method Not Allowed' }), {
      status: 405,
      headers
    });
  } catch (err) {
    return new Response(JSON.stringify({ ok: false, error: err.message }), {
      status: 500,
      headers
    });
  }
};
