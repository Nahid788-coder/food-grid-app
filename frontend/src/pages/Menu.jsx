import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMenu, cachedMenu } from '../api/menuCache';
import MenuCard from '../components/MenuCard.jsx';
import MenuSkeleton from '../components/MenuSkeleton.jsx';

const FILTERS = [
    { id: 'all', label: 'All' },
    { id: 'classic', label: 'Classic' },
    { id: 'signature', label: 'Signature' },
    { id: 'veggie', label: 'Veggie' },
    { id: 'spicy', label: 'Spicy' },
    { id: 'sides', label: 'Sides' },
    { id: 'beverages', label: 'Beverages' },
    { id: 'desserts', label: 'Desserts' },
];

export default function Menu() {
    // One request for the whole menu; category filters and search run in the browser.
    const [items, setItems] = useState(() => cachedMenu() || []);
    const [filter, setFilter] = useState('all');
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(() => !cachedMenu());
    const [failed, setFailed] = useState(false);

    useEffect(() => {
        let alive = true;
        getMenu()
            .then((data) => alive && setItems(data))
            .catch(() => alive && setFailed(true))
            .finally(() => alive && setLoading(false));
        return () => { alive = false; };
    }, []);

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        return items.filter((i) =>
            (filter === 'all' || i.category === filter) &&
            (!q ||
                i.name.toLowerCase().includes(q) ||
                i.description.toLowerCase().includes(q) ||
                i.ingredients?.some((x) => x.toLowerCase().includes(q)))
        );
    }, [items, filter, search]);

    return (
        <>
            <header className="page-title-bar">
                <div className="container">
                    <h1>Our <em style={{ background: 'linear-gradient(135deg, var(--primary), var(--accent))', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent', fontStyle: 'italic' }}>Menu</em></h1>
                    <p>Crafted with passion, served with love.</p>
                </div>
            </header>

            <section className="section menu-section">
                <div className="container">
                    <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 30 }}>
                        <div className="search-bar">
                            <i className="fas fa-search"></i>
                            <input
                                type="search"
                                placeholder="Search dishes, ingredients..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            {search && (
                                <button onClick={() => setSearch('')} className="search-clear" aria-label="Clear">
                                    <i className="fas fa-xmark"></i>
                                </button>
                            )}
                        </div>
                        <Link to="/customizer" className="btn btn-primary btn-sm">
                            <i className="fas fa-sliders"></i> Build Your Own
                        </Link>
                    </div>

                    <div className="menu-filters">
                        {FILTERS.map((f) => (
                            <button
                                key={f.id}
                                className={`filter ${filter === f.id ? 'active' : ''}`}
                                onClick={() => setFilter(f.id)}
                            >
                                {f.label}
                            </button>
                        ))}
                    </div>

                    {loading ? (
                        <MenuSkeleton count={8} />
                    ) : filtered.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: 80, color: 'var(--text-muted)' }}>
                            <i className="fas fa-utensils" style={{ fontSize: 48, marginBottom: 16, color: 'var(--text-dim)' }}></i>
                            <p style={{ fontSize: 18, fontWeight: 600 }}>
                                {failed ? 'Could not load the menu' : search ? 'No matches found' : 'No items in this category'}
                            </p>
                            <span style={{ fontSize: 15 }}>
                                {failed ? 'Please check your connection and refresh the page.' : search ? 'Try a different search term.' : 'Try a different category.'}
                            </span>
                        </div>
                    ) : (
                        <div className="menu-grid">
                            {filtered.map((item, i) => (
                                <MenuCard item={item} key={item._id} index={i} />
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </>
    );
}
