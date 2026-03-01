import React, { useState } from 'react';
import './SellerBoard.css';
import 'boxicons/css/boxicons.min.css';
import Header from '../components/layout/Header';

const initialProducts = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300',
    name: 'Vintage T-Shirt',
    price: 299,
    quantity: 5,
    status: 'available',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=300',
    name: 'Film Camera',
    price: 850,
    quantity: 2,
    status: 'available',
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1542272604-787c62d465d1?w=300',
    name: 'Denim Jacket',
    price: 590,
    quantity: 0,
    status: 'sold',
  },
];

const STATUS_LABELS = {
  available: 'Available',
  sold: 'Sold',
  hidden: 'Hidden',
};

let nextId = initialProducts.length + 1;

function SellerBoard({ isLoggedIn, onLogout }) {
  const [products, setProducts] = useState(initialProducts);

  // Edit modal state
  const [editProduct, setEditProduct] = useState(null);
  const [form, setForm] = useState({});

  // Delete confirm state
  const [deleteId, setDeleteId] = useState(null);

  // Add modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState({
    image: '',
    name: '',
    price: '',
    quantity: '',
    status: 'available',
  });

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
    setAddForm({ image: '', name: '', price: '', quantity: '', status: 'available' });
    setShowAddModal(true);
  };

  const closeAdd = () => setShowAddModal(false);

  const handleAddFormChange = (e) => {
    const { name, value } = e.target;
    setAddForm((prev) => ({ ...prev, [name]: value }));
  };

  const saveAdd = () => {
    if (!addForm.name.trim() || addForm.price === '') return;
    setProducts((prev) => [
      ...prev,
      {
        id: nextId++,
        image:
          addForm.image.trim() ||
          'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300',
        name: addForm.name.trim(),
        price: Number(addForm.price),
        quantity: Number(addForm.quantity) || 0,
        status: addForm.status,
      },
    ]);
    closeAdd();
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
                <label>Image URL</label>
                <input
                  type="text"
                  name="image"
                  value={addForm.image}
                  onChange={handleAddFormChange}
                  className="sb-input"
                  placeholder="https://... (leave blank for default)"
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
                disabled={!addForm.name.trim() || addForm.price === ''}
                style={{ opacity: !addForm.name.trim() || addForm.price === '' ? 0.5 : 1 }}
              >
                Add
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
