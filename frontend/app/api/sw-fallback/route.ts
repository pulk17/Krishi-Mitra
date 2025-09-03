// Fallback route to prevent service worker 404 errors
export async function GET() {
  return new Response('// No service worker needed', {
    headers: {
      'Content-Type': 'application/javascript',
    },
  });
}