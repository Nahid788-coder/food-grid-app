export default function PageLoader({ gone }) {
    return (
        <div className={`page-loader ${gone ? 'gone' : ''}`}>
            <div className="loader-spinner" />
            <div className="loader-text">Slice &amp; Crust</div>
        </div>
    );
}
