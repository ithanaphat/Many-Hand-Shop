import React, { useEffect, useState } from 'react';
import './SellerBoard.css';
import 'boxicons/css/boxicons.min.css';
import Header from '../components/layout/Header';

const PRODUCT_API = '/api/product';

const STATUS_LABELS = {
  available: 'Available',
  sold: 'Sold',
  hidden: 'Hidden',
};

const mapProductForBoard = (product) => ({
  id: product._id || product.id,
  image: Array.isArray(product.images) && product.images.length > 0
    ? product.images[0]
    : product.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300',
  name: product.name,
  price: Number(product.price) || 0,
  quantity: Number(product.stock ?? product.quantity) || 0,
  status: Number(product.stock ?? product.quantity) > 0 ? 'available' : 'sold',
});

function SellerBoard({ isLoggedIn, onLogout }) {
  const [products, setProducts] = useState([]);
  const [isSubmittingAdd, setIsSubmittingAdd] = useState(false);

  // Edit modal state
  const [editProduct, setEditProduct] = useState(null);
  const [form, setForm] = useState({});

  // Delete confirm state
  const [deleteId, setDeleteId] = useState(null);

  // Add modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState({
    imageFile: null,
    name: '',
    description: '',
    price: '',
    quantity: '',
    status: 'available',
  });

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const sellerId = localStorage.getItem('mhs_user_id');
        const url = sellerId ? `${PRODUCT_API}?seller=${sellerId}` : PRODUCT_API;
        const response = await fetch(url);
        if (!response.ok) return;
        const data = await response.json();
        setProducts(Array.isArray(data) ? data.map(mapProductForBoard) : []);
      } catch (error) {
      }
    };

    loadProducts();
  }, []);

  /* ---- Edit ---- */
  const openEdit = (product) => {
    setEditProduct(product);
    setForm({ ...product });
  };

  const closeEdit = () => {
    setEditProduct(null);
    setForm({});
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const saveEdit = () => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === editProduct.id
          ? {
              ...p,
              ...form,
              price: Number(form.price),
              quantity: Number(form.quantity),
            }
          : p
      )
    );
    closeEdit();
  };

  /* ---- Delete ---- */
  const confirmDelete = (id) => setDeleteId(id);
  const cancelDelete = () => setDeleteId(null);
  const doDelete = () => {
    setProducts((prev) => prev.filter((p) => p.id !== deleteId));
    setDeleteId(null);
  };

  /* ---- Add ---- */
  const openAdd = () => {
    setAddForm({ imageFile: null, name: '', description: '', price: '', quantity: '', status: 'available' });
    setShowAddModal(true);
  };

  const closeAdd = () => setShowAddModal(false);

  const handleAddFormChange = (e) => {
    const { name, value } = e.target;
    setAddForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddImageChange = (e) => {
    const pickedFile = e.target.files && e.target.files[0] ? e.target.files[0] : null;
    setAddForm((prev) => ({ ...prev, imageFile: pickedFile }));
  };

  const saveAdd = async () => {
    if (!addForm.name.trim() || addForm.price === '' || !addForm.description.trim() || !addForm.imageFile) return;

    setIsSubmittingAdd(true);
    try {
      const imageFormData = new FormData();
      imageFormData.append('image', addForm.imageFile);

      const uploadResponse = await fetch(`${PRODUCT_API}/upload-image`, {
        method: 'POST',
        body: imageFormData,
      });

      const uploadData = await uploadResponse.json().catch(() => ({}));
      if (!uploadResponse.ok || !uploadData.url) {
        alert(uploadData.message || 'Upload image failed');
        return;
      }

      const createResponse = await fetch(`${PRODUCT_API}/Addproduct`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: addForm.name.trim(),
          description: addForm.description.trim(),
          price: Number(addForm.price),
          images: [uploadData.url],
          stock: Number(addForm.quantity) || 0,
          seller: localStorage.getItem('mhs_user_id') || undefined,
        }),
      });

      const createData = await createResponse.json().catch(() => ({}));
      if (!createResponse.ok || !createData.product) {
        alert(createData.message || 'Add product failed');
        return;
      }

      setProducts((prev) => [...prev, mapProductForBoard(createData.product)]);
      closeAdd();
    } catch (error) {
      alert('Cannot connect to server');
    } finally {
      setIsSubmittingAdd(false);
    }
  };

  return (
    <div className="seller-board-page">
      <Header isLoggedIn={isLoggedIn} onLogout={onLogout} />

      <div className="seller-board-container">
        <div className="seller-board-card">
          {/* Top row */}
          <div className="sb-top-row">
            <div>
              <h2 className="sb-title">Seller Board</h2>
              <p className="sb-subtitle">Manage your listed products</p>
            </div>
            <button className="btn-sb-add" onClick={openAdd}>
              <i className="bx bx-plus"></i> Add Product
            </button>
          </div>

          {/* Table */}
          <div className="sb-table-wrapper">
            <table className="sb-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Price</th>
                  <th style={{ textAlign: 'center' }}>Qty</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td>
                      <img
                        src={product.image}
                        alt={product.name}
                        className="sb-product-img"
                      />
                    </td>
                    <td className="sb-product-name">{product.name}</td>
                    <td className="sb-price">
                      ฿{Number(product.price).toLocaleString()}
                    </td>
                    <td className="sb-qty">{product.quantity}</td>
                    <td>
                      <span
                        className={`sb-status-badge sb-status-${product.status}`}
                      >
                        {STATUS_LABELS[product.status]}
                      </span>
                    </td>
                    <td>
                      <div className="sb-actions">
                        <button
                          className="sb-btn-edit"
                          title="Edit"
                          onClick={() => openEdit(product)}
                        >
                          <i className="bx bx-edit-alt"></i>
                        </button>
                        <button
                          className="sb-btn-delete"
                          title="Delete"
                          onClick={() => confirmDelete(product.id)}
                        >
                          <i className="bx bx-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {products.length === 0 && (
                  <tr>
                    <td colSpan="6" className="sb-empty">
                      <i
                        className="bx bx-package"
                        style={{ fontSize: 40, display: 'block', marginBottom: 10, color: '#ccc' }}
                      ></i>
                      No products listed yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ===== Edit Modal ===== */}
      {editProduct && (
        <div className="sb-modal-backdrop" onClick={closeEdit}>
          <div className="sb-modal" onClick={(e) => e.stopPropagation()}>
            <div className="sb-modal-header">
              <h3>Edit Product</h3>
              <button className="sb-modal-close" onClick={closeEdit}>
                <i className="bx bx-x"></i>
              </button>
            </div>

            <div className="sb-modal-body">
              {/* Preview */}
              <div className="sb-modal-preview">
                <img
                  src={form.image}
                  alt="preview"
                  className="sb-preview-img"
                  onError={(e) => {
                    e.currentTarget.src =
                      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300';
                  }}
                />
              </div>

              <div className="sb-form-row">
                <label>Product Name</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleFormChange}
                  className="sb-input"
                  placeholder="Product name"
                />
              </div>

              <div className="sb-form-row">
                <label>Image URL</label>
                <input
                  type="text"
                  name="image"
                  value={form.image}
                  onChange={handleFormChange}
                  className="sb-input"
                  placeholder="https://..."
                />
              </div>

              <div className="sb-form-row-group">
                <div className="sb-form-row">
                  <label>Price (฿)</label>
                  <input
                    type="number"
                    name="price"
                    value={form.price}
                    onChange={handleFormChange}
                    className="sb-input"
                    min="0"
                  />
                </div>
                <div className="sb-form-row">
                  <label>Quantity</label>
                  <input
                    type="number"
                    name="quantity"
                    value={form.quantity}
                    onChange={handleFormChange}
                    className="sb-input"
                    min="0"
                  />
                </div>
              </div>

              <div className="sb-form-row">
                <label>Status</label>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleFormChange}
                  className="sb-input sb-select"
                >
                  <option value="available">Available</option>
                  <option value="sold">Sold</option>
                  <option value="hidden">Hidden</option>
                </select>
              </div>
            </div>

            <div className="sb-modal-footer">
              <button className="btn-sb-cancel" onClick={closeEdit}>
                Cancel
              </button>
              <button className="btn-sb-save" onClick={saveEdit}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== Add Modal ===== */}
      {showAddModal && (
        <div className="sb-modal-backdrop" onClick={closeAdd}>
          <div className="sb-modal" onClick={(e) => e.stopPropagation()}>
            <div className="sb-modal-header">
              <h3>Add Product</h3>
              <button className="sb-modal-close" onClick={closeAdd}>
                <i className="bx bx-x"></i>
              </button>
            </div>

            <div className="sb-modal-body">
              <div className="sb-form-row">
                <label>Product Name *</label>
                <input
                  type="text"
                  name="name"
                  value={addForm.name}
                  onChange={handleAddFormChange}
                  className="sb-input"
                  placeholder="e.g. Vintage Hat"
                />
              </div>

              <div className="sb-form-row">
                <label>Image File *</label>
                <label className="sb-file-upload-label">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAddImageChange}
                    style={{ display: 'none' }}
                  />
                  <span className="sb-file-upload-btn">
                    <i className='bx bx-upload' style={{ marginRight: '6px' }}></i>
                    {addForm.imageFile ? addForm.imageFile.name : 'Choose Image'}
                  </span>
                </label>
                {addForm.imageFile && (
                  <img
                    src={URL.createObjectURL(addForm.imageFile)}
                    alt="preview"
                    style={{ width: '100%', maxHeight: 140, objectFit: 'cover', borderRadius: 8, marginTop: 8 }}
                  />
                )}
              </div>

              <div className="sb-form-row">
                <label>Description *</label>
                <textarea
                  name="description"
                  value={addForm.description}
                  onChange={handleAddFormChange}
                  className="sb-input"
                  placeholder="Describe your product"
                  rows="3"
                />
              </div>

              <div className="sb-form-row-group">
                <div className="sb-form-row">
                  <label>Price (฿) *</label>
                  <input
                    type="number"
                    name="price"
                    value={addForm.price}
                    onChange={handleAddFormChange}
                    className="sb-input"
                    min="0"
                    placeholder="0"
                  />
                </div>
                <div className="sb-form-row">
                  <label>Quantity</label>
                  <input
                    type="number"
                    name="quantity"
                    value={addForm.quantity}
                    onChange={handleAddFormChange}
                    className="sb-input"
                    min="0"
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="sb-form-row">
                <label>Status</label>
                <select
                  name="status"
                  value={addForm.status}
                  onChange={handleAddFormChange}
                  className="sb-input sb-select"
                >
                  <option value="available">Available</option>
                  <option value="sold">Sold</option>
                  <option value="hidden">Hidden</option>
                </select>
              </div>
            </div>

            <div className="sb-modal-footer">
              <button className="btn-sb-cancel" onClick={closeAdd}>
                Cancel
              </button>
              <button
                className="btn-sb-save"
                onClick={saveAdd}
                disabled={!addForm.name.trim() || addForm.price === '' || !addForm.description.trim() || !addForm.imageFile || isSubmittingAdd}
                style={{ opacity: !addForm.name.trim() || addForm.price === '' || !addForm.description.trim() || !addForm.imageFile || isSubmittingAdd ? 0.5 : 1 }}
              >
                {isSubmittingAdd ? 'Uploading...' : 'Add'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== Delete Confirm ===== */}
      {deleteId !== null && (
        <div className="sb-modal-backdrop" onClick={cancelDelete}>
          <div className="sb-modal sb-modal-sm" onClick={(e) => e.stopPropagation()}>
            <div className="sb-modal-header">
              <h3>Delete Product</h3>
              <button className="sb-modal-close" onClick={cancelDelete}>
                <i className="bx bx-x"></i>
              </button>
            </div>
            <div className="sb-modal-body">
              <p className="sb-delete-msg">
                Are you sure you want to delete this product? This action cannot be
                undone.
              </p>
            </div>
            <div className="sb-modal-footer">
              <button className="btn-sb-cancel" onClick={cancelDelete}>
                Cancel
              </button>
              <button className="btn-sb-delete-confirm" onClick={doDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SellerBoard;
