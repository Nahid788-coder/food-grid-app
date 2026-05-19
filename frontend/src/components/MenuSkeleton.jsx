export default function MenuSkeleton({ count = 8 }) {
    return (
        <div className="menu-grid">
            {Array.from({ length: count }).map((_, i) => (
                <div key={i} className="menu-card skel-card">
                    <div className="skel skel-img"></div>
                    <div className="menu-card-body">
                        <div className="skel skel-line w-70"></div>
                        <div className="skel skel-line w-90" style={{ marginTop: 10 }}></div>
                        <div className="skel skel-line w-60" style={{ marginTop: 6 }}></div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 18 }}>
                            <div className="skel skel-line w-30"></div>
                            <div className="skel skel-line w-30"></div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
