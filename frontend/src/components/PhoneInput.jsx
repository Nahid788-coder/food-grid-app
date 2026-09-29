import { useState, useRef, useEffect } from 'react';

const COUNTRIES = [
    { code: '+93', iso: 'af', name: 'Afghanistan', len: 9 },
    { code: '+355', iso: 'al', name: 'Albania', len: 9 },
    { code: '+213', iso: 'dz', name: 'Algeria', len: 9 },
    { code: '+1', iso: 'as', name: 'American Samoa', len: 10 },
    { code: '+376', iso: 'ad', name: 'Andorra', len: 6 },
    { code: '+244', iso: 'ao', name: 'Angola', len: 9 },
    { code: '+1', iso: 'ai', name: 'Anguilla', len: 10 },
    { code: '+1', iso: 'ag', name: 'Antigua & Barbuda', len: 10 },
    { code: '+54', iso: 'ar', name: 'Argentina', len: 10 },
    { code: '+374', iso: 'am', name: 'Armenia', len: 8 },
    { code: '+297', iso: 'aw', name: 'Aruba', len: 7 },
    { code: '+61', iso: 'au', name: 'Australia', len: 9 },
    { code: '+43', iso: 'at', name: 'Austria', len: 11 },
    { code: '+994', iso: 'az', name: 'Azerbaijan', len: 9 },
    { code: '+1', iso: 'bs', name: 'Bahamas', len: 10 },
    { code: '+973', iso: 'bh', name: 'Bahrain', len: 8 },
    { code: '+880', iso: 'bd', name: 'Bangladesh', len: 10 },
    { code: '+1', iso: 'bb', name: 'Barbados', len: 10 },
    { code: '+375', iso: 'by', name: 'Belarus', len: 9 },
    { code: '+32', iso: 'be', name: 'Belgium', len: 9 },
    { code: '+501', iso: 'bz', name: 'Belize', len: 7 },
    { code: '+229', iso: 'bj', name: 'Benin', len: 8 },
    { code: '+1', iso: 'bm', name: 'Bermuda', len: 10 },
    { code: '+975', iso: 'bt', name: 'Bhutan', len: 8 },
    { code: '+591', iso: 'bo', name: 'Bolivia', len: 8 },
    { code: '+387', iso: 'ba', name: 'Bosnia & Herzegovina', len: 8 },
    { code: '+267', iso: 'bw', name: 'Botswana', len: 8 },
    { code: '+55', iso: 'br', name: 'Brazil', len: 11 },
    { code: '+673', iso: 'bn', name: 'Brunei', len: 7 },
    { code: '+359', iso: 'bg', name: 'Bulgaria', len: 9 },
    { code: '+226', iso: 'bf', name: 'Burkina Faso', len: 8 },
    { code: '+257', iso: 'bi', name: 'Burundi', len: 8 },
    { code: '+855', iso: 'kh', name: 'Cambodia', len: 9 },
    { code: '+237', iso: 'cm', name: 'Cameroon', len: 9 },
    { code: '+1', iso: 'ca', name: 'Canada', len: 10 },
    { code: '+238', iso: 'cv', name: 'Cape Verde', len: 7 },
    { code: '+1', iso: 'ky', name: 'Cayman Islands', len: 10 },
    { code: '+236', iso: 'cf', name: 'Central African Republic', len: 8 },
    { code: '+235', iso: 'td', name: 'Chad', len: 8 },
    { code: '+56', iso: 'cl', name: 'Chile', len: 9 },
    { code: '+86', iso: 'cn', name: 'China', len: 11 },
    { code: '+57', iso: 'co', name: 'Colombia', len: 10 },
    { code: '+269', iso: 'km', name: 'Comoros', len: 7 },
    { code: '+242', iso: 'cg', name: 'Congo', len: 9 },
    { code: '+243', iso: 'cd', name: 'Congo (DRC)', len: 9 },
    { code: '+506', iso: 'cr', name: 'Costa Rica', len: 8 },
    { code: '+225', iso: 'ci', name: "Côte d'Ivoire", len: 10 },
    { code: '+385', iso: 'hr', name: 'Croatia', len: 9 },
    { code: '+53', iso: 'cu', name: 'Cuba', len: 8 },
    { code: '+357', iso: 'cy', name: 'Cyprus', len: 8 },
    { code: '+420', iso: 'cz', name: 'Czech Republic', len: 9 },
    { code: '+45', iso: 'dk', name: 'Denmark', len: 8 },
    { code: '+253', iso: 'dj', name: 'Djibouti', len: 8 },
    { code: '+1', iso: 'dm', name: 'Dominica', len: 10 },
    { code: '+1', iso: 'do', name: 'Dominican Republic', len: 10 },
    { code: '+593', iso: 'ec', name: 'Ecuador', len: 9 },
    { code: '+20', iso: 'eg', name: 'Egypt', len: 10 },
    { code: '+503', iso: 'sv', name: 'El Salvador', len: 8 },
    { code: '+240', iso: 'gq', name: 'Equatorial Guinea', len: 9 },
    { code: '+291', iso: 'er', name: 'Eritrea', len: 7 },
    { code: '+372', iso: 'ee', name: 'Estonia', len: 8 },
    { code: '+251', iso: 'et', name: 'Ethiopia', len: 9 },
    { code: '+679', iso: 'fj', name: 'Fiji', len: 7 },
    { code: '+358', iso: 'fi', name: 'Finland', len: 10 },
    { code: '+33', iso: 'fr', name: 'France', len: 9 },
    { code: '+594', iso: 'gf', name: 'French Guiana', len: 9 },
    { code: '+689', iso: 'pf', name: 'French Polynesia', len: 8 },
    { code: '+241', iso: 'ga', name: 'Gabon', len: 8 },
    { code: '+220', iso: 'gm', name: 'Gambia', len: 7 },
    { code: '+995', iso: 'ge', name: 'Georgia', len: 9 },
    { code: '+49', iso: 'de', name: 'Germany', len: 11 },
    { code: '+233', iso: 'gh', name: 'Ghana', len: 9 },
    { code: '+350', iso: 'gi', name: 'Gibraltar', len: 8 },
    { code: '+30', iso: 'gr', name: 'Greece', len: 10 },
    { code: '+299', iso: 'gl', name: 'Greenland', len: 6 },
    { code: '+1', iso: 'gd', name: 'Grenada', len: 10 },
    { code: '+590', iso: 'gp', name: 'Guadeloupe', len: 9 },
    { code: '+1', iso: 'gu', name: 'Guam', len: 10 },
    { code: '+502', iso: 'gt', name: 'Guatemala', len: 8 },
    { code: '+224', iso: 'gn', name: 'Guinea', len: 9 },
    { code: '+245', iso: 'gw', name: 'Guinea-Bissau', len: 7 },
    { code: '+592', iso: 'gy', name: 'Guyana', len: 7 },
    { code: '+509', iso: 'ht', name: 'Haiti', len: 8 },
    { code: '+504', iso: 'hn', name: 'Honduras', len: 8 },
    { code: '+852', iso: 'hk', name: 'Hong Kong', len: 8 },
    { code: '+36', iso: 'hu', name: 'Hungary', len: 9 },
    { code: '+354', iso: 'is', name: 'Iceland', len: 7 },
    { code: '+91', iso: 'in', name: 'India', len: 10 },
    { code: '+62', iso: 'id', name: 'Indonesia', len: 10 },
    { code: '+98', iso: 'ir', name: 'Iran', len: 10 },
    { code: '+964', iso: 'iq', name: 'Iraq', len: 10 },
    { code: '+353', iso: 'ie', name: 'Ireland', len: 9 },
    { code: '+972', iso: 'il', name: 'Israel', len: 9 },
    { code: '+39', iso: 'it', name: 'Italy', len: 10 },
    { code: '+1', iso: 'jm', name: 'Jamaica', len: 10 },
    { code: '+81', iso: 'jp', name: 'Japan', len: 10 },
    { code: '+962', iso: 'jo', name: 'Jordan', len: 9 },
    { code: '+7', iso: 'kz', name: 'Kazakhstan', len: 10 },
    { code: '+254', iso: 'ke', name: 'Kenya', len: 9 },
    { code: '+686', iso: 'ki', name: 'Kiribati', len: 5 },
    { code: '+965', iso: 'kw', name: 'Kuwait', len: 8 },
    { code: '+996', iso: 'kg', name: 'Kyrgyzstan', len: 9 },
    { code: '+856', iso: 'la', name: 'Laos', len: 9 },
    { code: '+371', iso: 'lv', name: 'Latvia', len: 8 },
    { code: '+961', iso: 'lb', name: 'Lebanon', len: 8 },
    { code: '+266', iso: 'ls', name: 'Lesotho', len: 8 },
    { code: '+231', iso: 'lr', name: 'Liberia', len: 8 },
    { code: '+218', iso: 'ly', name: 'Libya', len: 9 },
    { code: '+423', iso: 'li', name: 'Liechtenstein', len: 7 },
    { code: '+370', iso: 'lt', name: 'Lithuania', len: 8 },
    { code: '+352', iso: 'lu', name: 'Luxembourg', len: 9 },
    { code: '+853', iso: 'mo', name: 'Macao', len: 8 },
    { code: '+261', iso: 'mg', name: 'Madagascar', len: 9 },
    { code: '+265', iso: 'mw', name: 'Malawi', len: 9 },
    { code: '+60', iso: 'my', name: 'Malaysia', len: 9 },
    { code: '+960', iso: 'mv', name: 'Maldives', len: 7 },
    { code: '+223', iso: 'ml', name: 'Mali', len: 8 },
    { code: '+356', iso: 'mt', name: 'Malta', len: 8 },
    { code: '+692', iso: 'mh', name: 'Marshall Islands', len: 7 },
    { code: '+222', iso: 'mr', name: 'Mauritania', len: 8 },
    { code: '+230', iso: 'mu', name: 'Mauritius', len: 8 },
    { code: '+52', iso: 'mx', name: 'Mexico', len: 10 },
    { code: '+691', iso: 'fm', name: 'Micronesia', len: 7 },
    { code: '+373', iso: 'md', name: 'Moldova', len: 8 },
    { code: '+377', iso: 'mc', name: 'Monaco', len: 8 },
    { code: '+976', iso: 'mn', name: 'Mongolia', len: 8 },
    { code: '+382', iso: 'me', name: 'Montenegro', len: 8 },
    { code: '+212', iso: 'ma', name: 'Morocco', len: 9 },
    { code: '+258', iso: 'mz', name: 'Mozambique', len: 9 },
    { code: '+95', iso: 'mm', name: 'Myanmar', len: 9 },
    { code: '+264', iso: 'na', name: 'Namibia', len: 9 },
    { code: '+674', iso: 'nr', name: 'Nauru', len: 7 },
    { code: '+977', iso: 'np', name: 'Nepal', len: 10 },
    { code: '+31', iso: 'nl', name: 'Netherlands', len: 9 },
    { code: '+687', iso: 'nc', name: 'New Caledonia', len: 6 },
    { code: '+64', iso: 'nz', name: 'New Zealand', len: 9 },
    { code: '+505', iso: 'ni', name: 'Nicaragua', len: 8 },
    { code: '+227', iso: 'ne', name: 'Niger', len: 8 },
    { code: '+234', iso: 'ng', name: 'Nigeria', len: 10 },
    { code: '+850', iso: 'kp', name: 'North Korea', len: 10 },
    { code: '+389', iso: 'mk', name: 'North Macedonia', len: 8 },
    { code: '+47', iso: 'no', name: 'Norway', len: 8 },
    { code: '+968', iso: 'om', name: 'Oman', len: 8 },
    { code: '+92', iso: 'pk', name: 'Pakistan', len: 10 },
    { code: '+680', iso: 'pw', name: 'Palau', len: 7 },
    { code: '+970', iso: 'ps', name: 'Palestine', len: 9 },
    { code: '+507', iso: 'pa', name: 'Panama', len: 8 },
    { code: '+675', iso: 'pg', name: 'Papua New Guinea', len: 8 },
    { code: '+595', iso: 'py', name: 'Paraguay', len: 9 },
    { code: '+51', iso: 'pe', name: 'Peru', len: 9 },
    { code: '+63', iso: 'ph', name: 'Philippines', len: 10 },
    { code: '+48', iso: 'pl', name: 'Poland', len: 9 },
    { code: '+351', iso: 'pt', name: 'Portugal', len: 9 },
    { code: '+1', iso: 'pr', name: 'Puerto Rico', len: 10 },
    { code: '+974', iso: 'qa', name: 'Qatar', len: 8 },
    { code: '+262', iso: 're', name: 'Réunion', len: 9 },
    { code: '+40', iso: 'ro', name: 'Romania', len: 9 },
    { code: '+7', iso: 'ru', name: 'Russia', len: 10 },
    { code: '+250', iso: 'rw', name: 'Rwanda', len: 9 },
    { code: '+1', iso: 'kn', name: 'Saint Kitts & Nevis', len: 10 },
    { code: '+1', iso: 'lc', name: 'Saint Lucia', len: 10 },
    { code: '+1', iso: 'vc', name: 'Saint Vincent & Grenadines', len: 10 },
    { code: '+685', iso: 'ws', name: 'Samoa', len: 7 },
    { code: '+378', iso: 'sm', name: 'San Marino', len: 10 },
    { code: '+239', iso: 'st', name: 'São Tomé & Príncipe', len: 7 },
    { code: '+966', iso: 'sa', name: 'Saudi Arabia', len: 9 },
    { code: '+221', iso: 'sn', name: 'Senegal', len: 9 },
    { code: '+381', iso: 'rs', name: 'Serbia', len: 9 },
    { code: '+248', iso: 'sc', name: 'Seychelles', len: 7 },
    { code: '+232', iso: 'sl', name: 'Sierra Leone', len: 8 },
    { code: '+65', iso: 'sg', name: 'Singapore', len: 8 },
    { code: '+421', iso: 'sk', name: 'Slovakia', len: 9 },
    { code: '+386', iso: 'si', name: 'Slovenia', len: 8 },
    { code: '+677', iso: 'sb', name: 'Solomon Islands', len: 7 },
    { code: '+252', iso: 'so', name: 'Somalia', len: 8 },
    { code: '+27', iso: 'za', name: 'South Africa', len: 9 },
    { code: '+82', iso: 'kr', name: 'South Korea', len: 10 },
    { code: '+211', iso: 'ss', name: 'South Sudan', len: 9 },
    { code: '+34', iso: 'es', name: 'Spain', len: 9 },
    { code: '+94', iso: 'lk', name: 'Sri Lanka', len: 9 },
    { code: '+249', iso: 'sd', name: 'Sudan', len: 9 },
    { code: '+597', iso: 'sr', name: 'Suriname', len: 7 },
    { code: '+268', iso: 'sz', name: 'Eswatini', len: 8 },
    { code: '+46', iso: 'se', name: 'Sweden', len: 9 },
    { code: '+41', iso: 'ch', name: 'Switzerland', len: 9 },
    { code: '+963', iso: 'sy', name: 'Syria', len: 9 },
    { code: '+886', iso: 'tw', name: 'Taiwan', len: 9 },
    { code: '+992', iso: 'tj', name: 'Tajikistan', len: 9 },
    { code: '+255', iso: 'tz', name: 'Tanzania', len: 9 },
    { code: '+66', iso: 'th', name: 'Thailand', len: 9 },
    { code: '+670', iso: 'tl', name: 'Timor-Leste', len: 8 },
    { code: '+228', iso: 'tg', name: 'Togo', len: 8 },
    { code: '+676', iso: 'to', name: 'Tonga', len: 7 },
    { code: '+1', iso: 'tt', name: 'Trinidad & Tobago', len: 10 },
    { code: '+216', iso: 'tn', name: 'Tunisia', len: 8 },
    { code: '+90', iso: 'tr', name: 'Turkey', len: 10 },
    { code: '+993', iso: 'tm', name: 'Turkmenistan', len: 8 },
    { code: '+688', iso: 'tv', name: 'Tuvalu', len: 5 },
    { code: '+256', iso: 'ug', name: 'Uganda', len: 9 },
    { code: '+380', iso: 'ua', name: 'Ukraine', len: 9 },
    { code: '+971', iso: 'ae', name: 'United Arab Emirates', len: 9 },
    { code: '+44', iso: 'gb', name: 'United Kingdom', len: 10 },
    { code: '+1', iso: 'us', name: 'United States', len: 10 },
    { code: '+598', iso: 'uy', name: 'Uruguay', len: 8 },
    { code: '+998', iso: 'uz', name: 'Uzbekistan', len: 9 },
    { code: '+678', iso: 'vu', name: 'Vanuatu', len: 7 },
    { code: '+58', iso: 've', name: 'Venezuela', len: 10 },
    { code: '+84', iso: 'vn', name: 'Vietnam', len: 9 },
    { code: '+967', iso: 'ye', name: 'Yemen', len: 9 },
    { code: '+260', iso: 'zm', name: 'Zambia', len: 9 },
    { code: '+263', iso: 'zw', name: 'Zimbabwe', len: 9 },
];

const flagUrl = (iso) => `https://flagcdn.com/w40/${iso}.png`;
const DEFAULT_COUNTRY = COUNTRIES.find((c) => c.iso === 'in');

export default function PhoneInput({ value = '', onChange, required, name = 'phone' }) {
    const parseInitial = () => {
        const sorted = [...COUNTRIES].sort((a, b) => b.code.length - a.code.length);
        const match = sorted.find((c) => value.startsWith(c.code));
        if (match) return { country: match, number: value.slice(match.code.length).replace(/\D/g, '') };
        return { country: DEFAULT_COUNTRY, number: value.replace(/\D/g, '') };
    };

    const [country, setCountry] = useState(parseInitial().country);
    const [number, setNumber] = useState(parseInitial().number);
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState('');
    const wrapRef = useRef(null);

    useEffect(() => {
        const onClick = (e) => {
            if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
        };
        document.addEventListener('mousedown', onClick);
        return () => document.removeEventListener('mousedown', onClick);
    }, []);

    const propagate = (c, n) => {
        onChange?.({ target: { name, value: n ? `${c.code} ${n}` : '' } });
    };

    const handleNumber = (e) => {
        const digits = e.target.value.replace(/\D/g, '').slice(0, country.len);
        setNumber(digits);
        propagate(country, digits);
    };

    const selectCountry = (c) => {
        setCountry(c);
        setOpen(false);
        setSearch('');
        const trimmed = number.slice(0, c.len);
        setNumber(trimmed);
        propagate(c, trimmed);
    };

    const isValid = number.length === 0 || number.length === country.len;

    const filtered = search.trim()
        ? COUNTRIES.filter((c) => {
            const q = search.toLowerCase();
            return c.name.toLowerCase().includes(q) || c.code.includes(search);
        })
        : COUNTRIES;

    return (
        <div ref={wrapRef} style={{ position: 'relative' }}>
            <div style={{
                display: 'flex',
                alignItems: 'stretch',
                border: `1px solid ${isValid ? 'var(--border)' : 'var(--danger)'}`,
                borderRadius: 'var(--radius)',
                background: 'var(--bg-2)',
                overflow: 'hidden',
                transition: 'border-color 0.3s, box-shadow 0.3s',
                height: 46,
            }}>
                <button
                    type="button"
                    onClick={() => setOpen((o) => !o)}
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 9,
                        padding: '0 14px',
                        borderRight: '1px solid var(--border)',
                        background: 'rgba(var(--ink-rgb), 0.04)',
                        color: 'var(--text)',
                        fontSize: 15,
                        fontWeight: 500,
                        whiteSpace: 'nowrap',
                        cursor: 'pointer',
                        height: '100%',
                    }}
                >
                    <img
                        src={flagUrl(country.iso)}
                        alt=""
                        width={22}
                        height={16}
                        style={{ borderRadius: 2, display: 'block', objectFit: 'cover' }}
                    />
                    <span style={{ lineHeight: 1 }}>{country.code}</span>
                    <i className="fas fa-chevron-down" style={{ fontSize: 12, opacity: 0.55, transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'none' }}></i>
                </button>
                <input
                    type="tel"
                    name={name}
                    value={number}
                    onChange={handleNumber}
                    placeholder={`${country.len}-digit number`}
                    required={required}
                    pattern={`\\d{${country.len}}`}
                    maxLength={country.len}
                    inputMode="numeric"
                    autoComplete="tel-national"
                    style={{
                        flex: 1,
                        border: 'none',
                        background: 'transparent',
                        padding: '0 16px',
                        outline: 'none',
                        fontSize: 15,
                        color: 'var(--text)',
                        fontFamily: 'inherit',
                        height: '100%',
                        width: '100%',
                    }}
                />
            </div>

            {!isValid && (
                <p style={{ fontSize: 13, color: 'var(--danger)', marginTop: 6, display: 'flex', alignItems: 'center', gap: 5 }}>
                    <i className="fas fa-circle-exclamation"></i>
                    Enter exactly {country.len} digits for {country.name}
                </p>
            )}

            {open && (
                <div style={{
                    position: 'absolute',
                    top: 'calc(100% + 6px)',
                    left: 0,
                    right: 0,
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius)',
                    boxShadow: '0 12px 40px rgba(59,42,32,0.18)',
                    maxHeight: 360,
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    zIndex: 50,
                }}>
                    <div style={{ padding: 10, borderBottom: '1px solid var(--border)' }}>
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search 200+ countries..."
                            autoFocus
                            style={{ padding: '8px 12px', fontSize: 14 }}
                        />
                    </div>
                    <div style={{ overflowY: 'auto', flex: 1 }}>
                        {filtered.length === 0 && (
                            <div style={{ padding: 20, textAlign: 'center', color: 'var(--text-muted)', fontSize: 14 }}>
                                No country found
                            </div>
                        )}
                        {filtered.map((c, i) => {
                            const active = country.iso === c.iso;
                            return (
                                <button
                                    key={`${c.iso}-${i}`}
                                    type="button"
                                    onClick={() => selectCountry(c)}
                                    style={{
                                        width: '100%',
                                        display: 'grid',
                                        gridTemplateColumns: '24px 1fr auto',
                                        alignItems: 'center',
                                        gap: 12,
                                        padding: '10px 14px',
                                        background: active ? 'rgba(var(--primary-rgb), 0.12)' : 'transparent',
                                        color: 'var(--text)',
                                        fontSize: 14,
                                        textAlign: 'left',
                                        borderBottom: '1px solid var(--border)',
                                        cursor: 'pointer',
                                    }}
                                    onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = 'rgba(var(--ink-rgb), 0.04)'; }}
                                    onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = 'transparent'; }}
                                >
                                    <img
                                        src={flagUrl(c.iso)}
                                        alt=""
                                        width={22}
                                        height={16}
                                        loading="lazy"
                                        style={{ borderRadius: 2, display: 'block', objectFit: 'cover' }}
                                    />
                                    <span>{c.name}</span>
                                    <span style={{ color: 'var(--text-muted)', fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>{c.code}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
