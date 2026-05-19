import Reveal from '../components/Reveal.jsx';

export default function About() {
    return (
        <>
            <header className="page-title-bar">
                <div className="container">
                    <h1>Our <em style={{ background: 'linear-gradient(135deg, #ff6b35, #ffb627)', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent', fontStyle: 'italic' }}>Story</em></h1>
                    <p>From Naples to your plate — a decade of fire and flavor.</p>
                </div>
            </header>

            <section className="section about-section" style={{ borderTop: 'none' }}>
                <div className="container about-grid">
                    <Reveal className="about-images">
                        <img className="about-img-main" src="https://images.unsplash.com/photo-1593504049359-74330189a345?w=900&q=85&auto=format&fit=crop" alt="Pizza chef" />
                        <img className="about-img-sub" src="https://images.unsplash.com/photo-1571066811602-716837d681de?w=600&q=85&auto=format&fit=crop" alt="Fresh ingredients" />
                        <div className="about-badge">
                            <span className="badge-num">10+</span>
                            <span className="badge-text">Years of Craft</span>
                        </div>
                    </Reveal>
                    <Reveal className="about-text">
                        <span className="section-tag">Our Story</span>
                        <h2 className="section-title">Where tradition meets <em>fire</em></h2>
                        <p>
                            Slice &amp; Crust began in 2014 with a single dream: bring the soul of Naples
                            to our hometown. Our master pizzaiolo Antonio trained for years in Italy,
                            mastering the centuries-old technique of true Neapolitan pizza.
                        </p>
                        <p>
                            Every pizza you'll eat with us is made with imported '00' flour, San Marzano
                            tomatoes from the slopes of Mount Vesuvius, fresh fior di latte mozzarella,
                            and fragrant basil — all baked in our handcrafted brick oven at 800°F for
                            exactly 90 seconds.
                        </p>
                        <ul className="about-list">
                            <li><i className="fas fa-check"></i> Authentic Neapolitan technique</li>
                            <li><i className="fas fa-check"></i> Imported Italian flour &amp; tomatoes</li>
                            <li><i className="fas fa-check"></i> 72-hour cold-fermented dough</li>
                            <li><i className="fas fa-check"></i> Wood-fired in 90 seconds</li>
                            <li><i className="fas fa-check"></i> Daily-fresh ingredients only</li>
                        </ul>
                    </Reveal>
                </div>
            </section>

            <section className="section" style={{ background: 'var(--bg)' }}>
                <div className="container">
                    <Reveal>
                        <div className="section-head">
                            <span className="section-tag">Our Values</span>
                            <h2 className="section-title">What we <em>stand for</em></h2>
                        </div>
                    </Reveal>
                    <div className="feature-row" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                        {[
                            { i: 'fas fa-heart', t: 'Passion First', d: 'Every pizza is a love letter to Naples — and to you.' },
                            { i: 'fas fa-seedling', t: 'Sustainability', d: 'Local sourcing where possible, zero-waste kitchen practices.' },
                            { i: 'fas fa-handshake', t: 'Community', d: 'We support local farmers, artists, and food charities monthly.' },
                        ].map((v, i) => (
                            <Reveal key={i} delay={i * 0.1}>
                                <div className="feat" style={{ textAlign: 'center', alignItems: 'center' }}>
                                    <div className="feat-icon"><i className={v.i}></i></div>
                                    <h4>{v.t}</h4>
                                    <p>{v.d}</p>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}
