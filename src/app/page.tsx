import Link from 'next/link';

export default function Home() {
  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
        {/* Background glow effects */}
        <div className="absolute" style={{ top: '-10%', left: '-10%', width: '500px', height: '500px', background: 'var(--primary-color)', filter: 'blur(150px)', opacity: 0.2, borderRadius: '50%' }}></div>
        <div className="absolute" style={{ bottom: '-10%', right: '-10%', width: '500px', height: '500px', background: 'var(--secondary-color)', filter: 'blur(150px)', opacity: 0.2, borderRadius: '50%' }}></div>

        <div className="container relative z-10 text-center">
          <h1 className="mb-6 animate-pulse-glow" style={{ fontSize: '4.5rem', display: 'inline-block' }}>
            Elevate Your Shopping Experience
          </h1>
          <p className="mb-8 mx-auto" style={{ maxWidth: '600px', fontSize: '1.25rem', color: 'var(--text-muted)' }}>
            Discover unique products from top vendors around the world. Lumina is your premium destination for quality and style.
          </p>
          
          <div className="flex justify-center gap-4">
            <Link href="/products" className="btn btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>
              Start Exploring
            </Link>
            <Link href="/vendor/register" className="btn btn-secondary" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>
              Become a Vendor
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-16 bg-surface">
        <div className="container">
          <h2 className="text-center mb-8">Curated Collections</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((item) => (
              <div key={item} className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{ height: '200px', background: 'linear-gradient(45deg, var(--bg-surface-hover), var(--border-color))' }}></div>
                <div className="py-4 px-6">
                  <h3>Collection {item}</h3>
                  <p>Explore the finest items curated just for you.</p>
                  <Link href={`/products?category=${item}`} style={{ color: 'var(--primary-color)', fontWeight: 600 }}>
                    View Details &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
