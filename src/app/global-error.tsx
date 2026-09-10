'use client';

/**
 * Last-resort boundary for errors thrown by the root layout itself (e.g. the
 * settings API is unreachable at render time). Replaces the whole document,
 * so it ships its own <html>/<body> and inline styles — no design tokens,
 * fonts, or components are guaranteed to be available here. Mirrors the Blade
 * storefront's standalone resources/views/errors/500.blade.php.
 */
export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1rem',
          padding: '2rem',
          textAlign: 'center',
          fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif',
          background: '#fcf8fa',
          color: '#1b1b1d',
        }}
      >
        <p style={{ fontSize: '3.5rem', fontWeight: 800, color: 'rgba(30,58,51,0.15)', margin: 0 }}>500</p>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1e3a33', margin: 0 }}>
          Something went wrong on our end
        </h1>
        <p style={{ maxWidth: 420, color: '#45464d', margin: 0 }}>
          We&apos;re already looking into it. Please try again in a moment.
        </p>
        <button
          type="button"
          onClick={reset}
          style={{
            marginTop: '0.5rem',
            padding: '0.65rem 1.5rem',
            borderRadius: '0.5rem',
            border: 'none',
            background: '#1e3a33',
            color: '#fff',
            fontWeight: 500,
            cursor: 'pointer',
          }}
        >
          Try Again
        </button>
      </body>
    </html>
  );
}
