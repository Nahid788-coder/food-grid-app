import { useState } from 'react';
import toast from 'react-hot-toast';
import api from '../api/axios';

const CATS = ['classic', 'signature', 'veggie', 'spicy', 'sides', 'beverages', 'desserts'];

export default function MenuItemForm({ item, onSaved, onClose }) {
    const [form, setForm] = useState({
        name: item?.name || '',
        description: item?.description || '',
        price: item?.price || '',
        category: item?.category || 'classic',
        image: item?.image || '',
        rating: item?.rating || 4.5,
        isVeg: item?.isVeg || false,
        isSpicy: item?.isSpicy || false,
        isFeatured: item?.isFeatured || false,
        ingredients: (item?.ingredients || []).join(', '),
    });
    const [uploading, setUploading] = useState(false);
    const [saving, setSaving] = useState(false);

    const onChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
    };

    const onUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setUploading(true);
        try {
            const fd = new FormData();
            fd.append('image', file);
            const { data } = await api.post('/upload/image', fd, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setForm((f) => ({ ...f, image: data.url }));
            toast.success('Image uploaded');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Upload failed (configure Cloudinary in .env)');
        } finally {
            setUploading(false);
        }
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        if (!form.image) return toast.error('Please add an image');
        setSaving(true);
        try {
            const payload = {
                ...form,
                price: Number(form.price),
                rating: Number(form.rating),
                ingredients: form.ingredients.split(',').map((s) => s.trim()).filter(Boolean),
            };
            let saved;
            if (item?._id) {
                ({ data: saved } = await api.put(`/menu/${item._id}`, payload));
                toast.success('Item updated');
            } else {
                ({ data: saved } = await api.post('/menu', payload));
                toast.success('Item added');
            }
            onSaved?.(saved);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Save failed');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-card" onClick={(e) => e.stopPropagation()}>
                <div className="modal-head">
                    <h3>{item ? 'Edit Item' : 'Add Menu Item'}</h3>
                    <button className="cart-close" onClick={onClose}>
                        <i className="fas fa-xmark"></i>
                    </button>
                </div>
                <form onSubmit={onSubmit} className="modal-body">
                    <div className="form-row">
                        <div className="form-field">
                            <label>Name *</label>
                            <input name="name" value={form.name} onChange={onChange} required />
                        </div>
                        <div className="form-field">
                            <label>Price (₹) *</label>
                            <input name="price" type="number" min="0" value={form.price} onChange={onChange} required />
                        </div>
                    </div>

                    <div className="form-field" style={{ marginBottom: 14 }}>
                        <label>Description *</label>
                        <textarea name="description" value={form.description} onChange={onChange} required />
                    </div>

                    <div className="form-row">
                        <div className="form-field">
                            <label>Category *</label>
                            <select name="category" value={form.category} onChange={onChange} required>
                                {CATS.map((c) => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <div className="form-field">
                            <label>Rating (0-5)</label>
                            <input name="rating" type="number" step="0.1" min="0" max="5" value={form.rating} onChange={onChange} />
                        </div>
                    </div>

                    <div className="form-field" style={{ marginBottom: 14 }}>
                        <label>Image *</label>
                        {form.image && (
                            <img src={form.image} alt="" style={{ width: 120, height: 90, objectFit: 'cover', borderRadius: 'var(--radius)', marginBottom: 8, border: '1px solid var(--border)' }} />
                        )}
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                            <input
                                name="image"
                                value={form.image}
                                onChange={onChange}
                                placeholder="Image URL or upload below"
                                style={{ flex: 1 }}
                            />
                        </div>
                        <label className="btn btn-ghost btn-sm" style={{ marginTop: 8, cursor: 'pointer', display: 'inline-flex' }}>
                            <i className="fas fa-cloud-arrow-up"></i> {uploading ? 'Uploading...' : 'Upload (Cloudinary)'}
                            <input type="file" accept="image/*" onChange={onUpload} hidden disabled={uploading} />
                        </label>
                    </div>

                    <div className="form-field" style={{ marginBottom: 14 }}>
                        <label>Ingredients (comma-separated)</label>
                        <input name="ingredients" value={form.ingredients} onChange={onChange} placeholder="Tomato, Mozzarella, Basil" />
                    </div>

                    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 18 }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14 }}>
                            <input type="checkbox" name="isVeg" checked={form.isVeg} onChange={onChange} style={{ width: 'auto' }} /> Veg
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14 }}>
                            <input type="checkbox" name="isSpicy" checked={form.isSpicy} onChange={onChange} style={{ width: 'auto' }} /> Spicy
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14 }}>
                            <input type="checkbox" name="isFeatured" checked={form.isFeatured} onChange={onChange} style={{ width: 'auto' }} /> Featured
                        </label>
                    </div>

                    <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                        <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn btn-primary" disabled={saving}>
                            {saving ? <><i className="fas fa-spinner fa-spin"></i> Saving...</> : <>{item ? 'Update' : 'Create'}</>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
