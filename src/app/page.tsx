// src/app/page.tsx
'use client';

import { useState } from 'react';

export default function HomePage() {
  const [prompt, setPrompt] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('Starting generation...');

    const response = await fetch('/api/start-generation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    });

    const result = await response.json();
    setMessage(result.message || result.error);
    // In a real app, you'd redirect to a dashboard page
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="w-full max-w-xl">
        <h1 className="text-4xl font-bold text-center mb-6">AI Website Builder</h1>
        <form onSubmit={handleSubmit}>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., A modern website for a bakery..."
          // Add text-black to fix the color issue
          className="w-full h-32 p-2 border rounded text-black" 
        />
          <button
            type="submit"
            className="w-full mt-4 bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
          >
            Build My Website
          </button>
        </form>
        {message && <p className="mt-4 text-center">{message}</p>}
      </div>
    </main>
  );
}