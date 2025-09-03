import { NextResponse } from 'next/server';

// This route acts as a proxy to the Python backend
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const backendUrl = 'http://localhost:8000/diagnose';

    const backendResponse = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      cache: 'no-store'
    });

    if (!backendResponse.ok) {
      const errorData = await backendResponse.json();
      // Forward the error from the backend
      return NextResponse.json({ detail: errorData.detail || 'An error occurred in the backend' }, { status: backendResponse.status });
    }

    const data = await backendResponse.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('API proxy error:', error);
    return NextResponse.json({ detail: 'Internal Server Error in API proxy' }, { status: 500 });
  }
}