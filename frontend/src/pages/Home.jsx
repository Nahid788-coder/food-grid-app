import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getMenu, cachedMenu } from '../api/menuCache';
import Reveal, { fadeUp, stagger } from '../components/Reveal.jsx';
import MenuCard from '../components/MenuCard.jsx';

function AnimatedCounter({ target, suffix = '+' }) {
    const [val, setVal] = useState(0);
    useEffect(() => {
        let raf;
        const start = performance.now();
        const duration = 1600;
        const tick = (now) => {
            const t = Math.min(1, (now - start) / duration);
            const eased = 1 - Math.pow(1 - t, 3);
            setVal(Math.round(target * eased));
            if (t < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, [target]);
    return <>{val.toLocaleString()}{suffix}</>;
}

const featuredOf = (menu) => menu.filter((m) => m.isFeatured).slice(0, 6);

export default function Home() {
    // Shares the menu request with the Menu page (see api/menuCache.js).
    const [popular, setPopular] = useState(() => featuredOf(cachedMenu() || []));

    useEffect(() => {
        let alive = true;
        getMenu()
            .then((data) => alive && setPopular(featuredOf(data)))
            .catch(() => { /* the section stays empty */ });
        return () => { alive = false; };
    }, []);

    return (
        <>
            {/* Hero */}
            <section className="hero">
                <div className="hero-bg">
                    <div className="hero-orb orb-1"></div>
                    <div className="hero-orb orb-2"></div>
                    <div className="hero-orb orb-3"></div>
                </div>

                <div className="hero-grid">
                    <motion.div
                        initial="hidden"
                        animate="show"
                        variants={stagger}
                        className="hero-text"
                    >
                        <motion.span variants={fadeUp} className="eyebrow">
                            <span className="eyebrow-dot"></span>
                            Wood-fired since 2014
                        </motion.span>
                        <motion.h1 variants={fadeUp} className="hero-title">
                            <span className="line">Hand-tossed,</span>
                            <span className="line italic">flame-kissed</span>
                            <span className="line gradient-text">perfection.</span>
                        </motion.h1>
                        <motion.p variants={fadeUp} className="hero-sub">
                            Authentic Italian-style pizzas crafted with imported San Marzano tomatoes,
                            fresh mozzarella, and our signature 72-hour cold-fermented dough.
                        </motion.p>
                        <motion.div variants={fadeUp} className="hero-ctas">
                            <Link to="/menu" className="btn btn-primary">
                                <i className="fas fa-utensils"></i> View Menu
                            </Link>
                            <Link to="/booking" className="btn btn-ghost">
                                <i className="far fa-calendar-check"></i> Book a Table
                            </Link>
                        </motion.div>
                        <motion.div variants={fadeUp} className="hero-stats">
                            <div>
                                <div className="stat-num"><AnimatedCounter target={50} /></div>
                                <div className="stat-label">Menu Items</div>
                            </div>
                            <div>
                                <div className="stat-num"><AnimatedCounter target={12000} /></div>
                                <div className="stat-label">Happy Diners</div>
                            </div>
                            <div>
                                <div className="stat-num"><AnimatedCounter target={10} /></div>
                                <div className="stat-label">Years Crafting</div>
                            </div>
                        </motion.div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.85 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                        className="hero-visual"
                    >
                        <div className="hero-pizza-wrap">
                            <img
                                className="hero-pizza"
                                src="https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=900&q=85&auto=format&fit=crop"
                                alt="Signature pizza"
                            />
                            <div className="hero-ring r1"></div>
                            <div className="hero-ring r2"></div>
                            <div className="float-chip chip-1"><i className="fas fa-fire"></i> Wood-fired</div>
                            <div className="float-chip chip-2"><i className="fas fa-leaf"></i> Fresh basil</div>
                            <div className="float-chip chip-3"><i className="fas fa-pepper-hot"></i> Spicy options</div>
                        </div>
                    </motion.div>
                </div>

                <div className="scroll-down">
                    <span>Scroll</span>
                    <div className="mouse"><div className="mouse-dot"></div></div>
                </div>
            </section>

            {/* Features */}
            <section className="features">
                <div className="container">
                    <motion.div
                        className="feature-row"
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, amount: 0.2 }}
                        variants={stagger}
                    >
                        {[
                            { i: 'fas fa-fire-flame-curved', t: 'Wood-Fired Oven', d: '800°F brick oven for that perfect crispy crust.' },
                            { i: 'fas fa-leaf', t: 'Farm-Fresh', d: 'Daily-sourced organic veggies and herbs.' },
                            { i: 'fas fa-truck-fast', t: '30-min Delivery', d: 'Hot, fast, and right to your doorstep.' },
                            { i: 'fas fa-medal', t: 'Award Winning', d: 'Best Pizzeria — City Food Awards 2024.' },
                        ].map((f, i) => (
                            <motion.div className="feat" variants={fadeUp} key={i}>
                                <div className="feat-icon"><i className={f.i}></i></div>
                                <h4>{f.t}</h4>
                                <p>{f.d}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Popular */}
            <section className="section menu-section">
                <div className="container">
                    <Reveal>
                        <div className="section-head">
                            <span className="section-tag">Popular Picks</span>
                            <h2 className="section-title">Fan <em>favorites</em></h2>
                            <p className="section-sub">The pizzas our guests can't stop ordering. Try one — or all.</p>
                        </div>
                    </Reveal>

                    <div className="menu-grid">
                        {popular.length === 0
                            ? <p style={{ gridColumn: '1/-1', textAlign: 'center', color: 'var(--text-muted)' }}>Loading menu... (start backend if not running)</p>
                            : popular.map((item, i) => <MenuCard item={item} key={item._id} index={i} />)
                        }
                    </div>

                    <div style={{ textAlign: 'center', marginTop: 50 }}>
                        <Link to="/menu" className="btn btn-ghost">
                            Browse Full Menu <i className="fas fa-arrow-right"></i>
                        </Link>
                    </div>
                </div>
            </section>

            {/* About preview */}
            <section className="section about-section">
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
                            At Slice &amp; Crust, we believe great pizza starts with great ingredients
                            and ends with the perfect kiss of fire. Our master pizzaiolo trained in Naples,
                            bringing authentic technique and passion to every pie.
                        </p>
                        <p>
                            From our 72-hour cold-fermented dough to our hand-crushed San Marzano tomatoes —
                            we obsess over every detail. The result? A pizza you'll remember.
                        </p>
                        <ul className="about-list">
                            <li><i className="fas fa-check"></i> Authentic Neapolitan technique</li>
                            <li><i className="fas fa-check"></i> Imported Italian flour &amp; tomatoes</li>
                            <li><i className="fas fa-check"></i> 72-hour fermented dough</li>
                            <li><i className="fas fa-check"></i> Wood-fired in 90 seconds</li>
                        </ul>
                        <Link to="/booking" className="btn btn-primary">
                            <i className="far fa-calendar-check"></i> Reserve Your Table
                        </Link>
                    </Reveal>
                </div>
            </section>

            {/* Testimonials */}
            <section className="section testi-section">
                <div className="container">
                    <Reveal>
                        <div className="section-head">
                            <span className="section-tag">Reviews</span>
                            <h2 className="section-title">What guests <em>say</em></h2>
                        </div>
                    </Reveal>
                    <motion.div
                        className="testi-grid"
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, amount: 0.2 }}
                        variants={stagger}
                    >
                        {[
                            { n: 'Priya Sharma', r: 'Food Blogger', i: 12, t: '"Best pizza in the city — period. The crust is perfectly charred and the flavors burst in every bite."', s: 5 },
                            { n: 'Rahul Verma', r: 'Regular Customer', i: 33, t: '"Authentic Italian taste with a warm, cozy ambiance. Our family\'s new favorite Friday spot!"', s: 5 },
                            { n: 'Sneha Patel', r: 'Travel Vlogger', i: 47, t: '"That wood-fired crust is something else. Service was friendly and quick — 10/10 would recommend."', s: 4.5 },
                        ].map((t, idx) => (
                            <motion.div className="testi" key={idx} variants={fadeUp}>
                                <div className="testi-stars">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <i key={i} className={`fas ${i < Math.floor(t.s) ? 'fa-star' : (i < t.s ? 'fa-star-half-stroke' : 'fa-star')}`} style={{ opacity: i < t.s ? 1 : 0.3 }}></i>
                                    ))}
                                </div>
                                <p>{t.t}</p>
                                <div className="testi-author">
                                    <img src={`https://i.pravatar.cc/100?img=${t.i}`} alt="" />
                                    <div>
                                        <strong>{t.n}</strong>
                                        <span>{t.r}</span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* CTA */}
            <section className="section" style={{ paddingBottom: 0 }}>
                <div className="container">
                    <Reveal>
                        <div style={{
                            background: 'linear-gradient(135deg, rgba(var(--primary-rgb), 0.15), rgba(var(--accent-rgb), 0.1))',
                            border: '1px solid rgba(var(--primary-rgb), 0.25)',
                            borderRadius: '32px',
                            padding: '70px 50px',
                            textAlign: 'center',
                            position: 'relative',
                            overflow: 'hidden',
                        }}>
                            <h2 className="section-title" style={{ marginBottom: 16 }}>
                                Hungry yet? Order in <em>seconds</em>.
                            </h2>
                            <p className="section-sub" style={{ marginBottom: 32, maxWidth: 580, marginLeft: 'auto', marginRight: 'auto' }}>
                                Free delivery on orders over ₹599. Hot, fresh, and at your door in 30 min.
                            </p>
                            <Link to="/menu" className="btn btn-primary">
                                <i className="fas fa-utensils"></i> Order Now
                            </Link>
                        </div>
                    </Reveal>
                </div>
            </section>
        </>
    );
}
