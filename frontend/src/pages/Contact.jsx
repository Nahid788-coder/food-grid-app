import Reveal from '../components/Reveal.jsx';

export default function Contact() {
    const cards = [
        { i: 'fas fa-location-dot', t: 'Address', d: '12 Crust Avenue\nHimatnagar, Gujarat' },
        { i: 'fas fa-phone', t: 'Call Us', d: '+91 98765 43210\n+91 99887 76543' },
        { i: 'fas fa-envelope', t: 'Email', d: 'hello@sliceandcrust.com\norders@sliceandcrust.com' },
        { i: 'fas fa-clock', t: 'Open Hours', d: 'Mon - Sun\n11 AM - 11 PM' },
    ];

    return (
        <>
            <header className="page-title-bar">
                <div className="container">
                    <h1>Visit us <em style={{ background: 'linear-gradient(135deg, #ff6b35, #ffb627)', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent', fontStyle: 'italic' }}>today</em></h1>
                    <p>We'd love to host you. Drop by, call, or send us a message.</p>
                </div>
            </header>

            <section className="section contact-section" style={{ borderTop: 'none' }}>
                <div className="container">
                    <div className="contact-grid">
                        {cards.map((c, i) => (
                            <Reveal key={i} delay={i * 0.07}>
                                <div className="contact-card">
                                    <div className="contact-icon"><i className={c.i}></i></div>
                                    <h4>{c.t}</h4>
                                    <p style={{ whiteSpace: 'pre-line' }}>{c.d}</p>
                                </div>
                            </Reveal>
                        ))}
                    </div>

                    <Reveal>
                        <div style={{ marginTop: 60, borderRadius: 'var(--radius-xl)', overflow: 'hidden', height: 380, border: '1px solid var(--border)' }}>
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3675.4!2d72.96!3d23.59!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395dc4d5b1a4a1cb%3A0x47d9e4c3b6dd2e72!2sHimatnagar%2C%20Gujarat!5e0!3m2!1sen!2sin!4v1700000000"
                                width="100%"
                                height="100%"
                                style={{ border: 0, filter: 'invert(0.92) hue-rotate(180deg)' }}
                                allowFullScreen=""
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title="Restaurant location"
                            ></iframe>
                        </div>
                    </Reveal>
                </div>
            </section>
        </>
    );
}
