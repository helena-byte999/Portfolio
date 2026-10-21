import Link from 'next/link';

export default function NotFound() {
  return (
    <>
      <main className="section">
        <div className="wrap" style={{ textAlign: 'center' }}>
          <p className="eyebrow">404</p>
          <h1 className="display section-title">Record scratch.</h1>
          <p className="lede" style={{ marginInline: 'auto' }}>
            That page isn&apos;t in the crate. Let&apos;s get you back to the booth.
          </p>
          <p style={{ marginTop: 32 }}>
            <Link className="btn btn-primary" href="/">
              Back to the booth
            </Link>
          </p>
        </div>
      </main>
    </>
  );
}
