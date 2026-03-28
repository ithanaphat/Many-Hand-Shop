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
 
const displayCategoryName = (name) => {
  if (!name) return '';
  return name
    .split('&')
    .map(part => part.trim().charAt(0).toUpperCase() + part.trim().slice(1))
    .join(' & ');
};
 
const mapProductForBoard = (product) => ({
  id: product._id || product.id,
  image: Array.isArray(product.images) && product.images.length > 0
    ? product.images[0]
    : product.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300',
  images: Array.isArray(product.images) ? product.images : (product.image ? [product.image] : []),
  name: product.name,
  price: Number(product.price) || 0,
  quantity: Number(product.stock ?? product.quantity) || 0,
  status: Number(product.stock ?? product.quantity) > 0 ? 'available' : 'sold',
  category: product.category?.name || product.category || '',
  categoryId: product.category?._id?.toString() || '',
  description: product.description || '',
});
 
function SellerBoard({ isLoggedIn, onLogout }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isSubmittingAdd, setIsSubmittingAdd] = useState(false);
 
  // Edit modal state
  const [editProduct, setEditProduct] = useState(null);
  const [form, setForm] = useState({});
 
  // Delete confirm state
  const [deleteId, setDeleteId] = useState(null);
 
  // Add modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState({
    imageFiles: [],
    name: '',
    description: '',
    price: '',
    quantity: '',
    status: 'available',
    category: '',
  });
 
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load categories
        const categoriesResponse = await fetch(`${PRODUCT_API}/categories`);
        console.log("Categories response:", categoriesResponse.status);
        if (categoriesResponse.ok) {
          const categoriesData = await categoriesResponse.json();
          console.log("Categories data:", categoriesData);
          setCategories(categoriesData || []);
        } else {
          console.error("Failed to fetch categories:", categoriesResponse.statusText);
        }
 
        // Load products
        const sellerId = localStorage.getItem('mhs_user_id');
        const url = sellerId ? `${PRODUCT_API}?seller=${sellerId}` : PRODUCT_API;
        const response = await fetch(url);
        if (!response.ok) return;
        const data = await response.json();
        setProducts(Array.isArray(data) ? data.map(mapProductForBoard) : []);
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };
 
    loadData();
  }, []);
 
  /* ---- Edit ---- */
  const openEdit = (product) => {
    setEditProduct(product);
    const images = Array.isArray(product.images) ? product.images : (product.image ? [product.image] : []);
    setForm({
      ...product,
      images: images,
      newImageFiles: [],
      previewImage: images[0] || product.image
    });
  };
 
  const closeEdit = () => {
    setEditProduct(null);
    setForm({});
  };
 
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };
 
  const handleEditImageChange = (e) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    const totalImages = (form.images?.length || 0) + (form.newImageFiles?.length || 0) + files.length;
    if (totalImages > 5) {
      alert(`Total images cannot exceed 5. Current: ${(form.images?.length || 0) + (form.newImageFiles?.length || 0)}`);
      return;
    }
    setForm((prev) => ({
      ...prev,
      newImageFiles: [...(prev.newImageFiles || []), ...files]
    }));
  };
 
  const removeExistingImage = (index) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };
 
  const removeNewImage = (index) => {
    setForm((prev) => ({
      ...prev,
      newImageFiles: prev.newImageFiles.filter((_, i) => i !== index)
    }));
  };
 
  const setPreviewImage = (imageUrl) => {
    setForm((prev) => ({
      ...prev,
      previewImage: imageUrl
    }));
  };
 
  const saveEdit = async () => {
    if (!editProduct?.id) return;
    
    // Validate that at least one image exists
    const totalImages = (form.images?.length || 0) + (form.newImageFiles?.length || 0);
    if (totalImages === 0) {
      alert('Product must have at least one image');
      return;
    }
    
    try {
      let newImageUrls = [];
     
      // Upload new images if provided
      if (form.newImageFiles && form.newImageFiles.length > 0) {
        for (const imageFile of form.newImageFiles) {
          const imageFormData = new FormData();
          imageFormData.append('image', imageFile);
 
          const uploadResponse = await fetch(`${PRODUCT_API}/upload-image`, {
            method: 'POST',
            body: imageFormData,
          });
 
          const uploadData = await uploadResponse.json().catch(() => ({}));
          if (!uploadResponse.ok || !uploadData.url) {
            alert(uploadData.message || `Upload image failed: ${imageFile.name}`);
            return;
          }
          newImageUrls.push(uploadData.url);
        }
      }
 
      const body = {
        name: form.name?.trim(),
        description: form.description?.trim(),
        price: Number(form.price),
        stock: Number(form.quantity),
      };
     
      // Combine existing and new images
      const allImages = [...(form.images || []), ...newImageUrls];
      if (allImages.length > 0) {
        body.images = allImages;
      }
     
      if (form.categoryId) body.category = form.categoryId;
     
      const res = await fetch(`${PRODUCT_API}/${editProduct.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        alert(data.message || 'Update failed');
        return;
      }
      setProducts((prev) =>
        prev.map((p) =>
          p.id === editProduct.id
            ? {
                ...p,
                name: form.name,
                description: form.description,
                price: Number(form.price),
                quantity: Number(form.quantity),
                status: Number(form.quantity) > 0 ? 'available' : 'sold',
                category: form.category,
                categoryId: form.categoryId,
                image: allImages.length > 0 ? allImages[0] : form.image,
                images: allImages,
              }
            : p
        )
      );
      closeEdit();
    } catch (err) {
      alert('Cannot connect to server');
    }
  };
 
  /* ---- Delete ---- */
  const confirmDelete = (id) => setDeleteId(id);
  const cancelDelete = () => setDeleteId(null);
  const doDelete = async () => {
    try {
      const res = await fetch(`${PRODUCT_API}/${deleteId}`, { method: 'DELETE' });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert(data.message || 'Delete failed');
        return;
      }
      setProducts((prev) => prev.filter((p) => p.id !== deleteId));
      setDeleteId(null);
    } catch (err) {
      alert('Cannot connect to server');
    }
  };
 
  /* ---- Add ---- */
  const openAdd = () => {
    setAddForm({ imageFiles: [], name: '', description: '', price: '', quantity: '', status: 'available', category: '' });
    setShowAddModal(true);
  };
 
  const closeAdd = () => setShowAddModal(false);
 
  const handleAddFormChange = (e) => {
    const { name, value } = e.target;
    setAddForm((prev) => ({ ...prev, [name]: value }));
  };
 
  const handleAddImageChange = (e) => {
    const files = e.target.files ? Array.from(e.target.files) : [];

    const totalImages = addForm.imageFiles.length + files.length;
    
    if (totalImages > 5) {
      alert(`Total images cannot exceed 5. Current: ${addForm.imageFiles.length}`);
      return;
    }

    setAddForm((prev) => ({ 
      ...prev, 
      imageFiles: [...prev.imageFiles, ...files] 
    }));
  };
 
  const saveAdd = async () => {
    if (!addForm.name.trim() || addForm.price === '' || !addForm.description.trim() || addForm.imageFiles.length === 0 || !addForm.category) return;
 
    setIsSubmittingAdd(true);
    try {
      // Upload all images
      const uploadedUrls = [];
      for (const imageFile of addForm.imageFiles) {
        const imageFormData = new FormData();
        imageFormData.append('image', imageFile);
 
        const uploadResponse = await fetch(`${PRODUCT_API}/upload-image`, {
          method: 'POST',
          body: imageFormData,
        });
 
        const uploadData = await uploadResponse.json().catch(() => ({}));
        if (!uploadResponse.ok || !uploadData.url) {
          alert(uploadData.message || `Upload image failed: ${imageFile.name}`);
          setIsSubmittingAdd(false);
          return;
        }
        uploadedUrls.push(uploadData.url);
      }
 
      const createResponse = await fetch(`${PRODUCT_API}/Addproduct`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: addForm.name.trim(),
          description: addForm.description.trim(),
          price: Number(addForm.price),
          images: uploadedUrls,
          stock: Number(addForm.quantity) || 0,
          seller: localStorage.getItem('mhs_user_id') || undefined,
          category: addForm.category,
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
                  <th>Category</th>
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
                    <td>{displayCategoryName(product.category)}</td>
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
                    <td colSpan="7" className="sb-empty">
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
                  src={form.previewImage || (form.images && form.images[0] ? form.images[0] : form.image)}
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
                <label>Images (Maximum 5 files)</label>
                <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '16px', backgroundColor: '#fafafa' }}>
                  {/* Existing Images */}
                  {form.images && form.images.length > 0 && (
                    <div>
                      <h5 style={{ marginTop: 0, marginBottom: '12px', fontSize: '14px', fontWeight: '600' }}>Current Images ({form.images.length})</h5>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '8px', marginBottom: '16px' }}>
                        {form.images.map((imgUrl, idx) => (
                          <div key={`existing-${idx}`} style={{ position: 'relative', width: '100%', paddingBottom: '100%', cursor: 'pointer' }}>
                            <img
                              src={imgUrl}
                              alt={`existing-${idx}`}
                              onClick={() => setPreviewImage(imgUrl)}
                              onError={(e) => {
                                e.currentTarget.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100';
                              }}
                              style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                borderRadius: '6px',
                                opacity: form.previewImage === imgUrl ? 1 : 0.7,
                                border: form.previewImage === imgUrl ? '3px solid #3498db' : 'none',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                              }}
                            />
                            <button
                              type="button"
                              onClick={() => removeExistingImage(idx)}
                              style={{
                                position: 'absolute',
                                top: '4px',
                                right: '4px',
                                background: 'rgba(255, 0, 0, 0.7)',
                                border: 'none',
                                color: 'white',
                                width: '24px',
                                height: '24px',
                                borderRadius: '50%',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '14px',
                                fontWeight: 'bold',
                                padding: 0
                              }}
                              title="Delete image"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                 
                  {/* New Images */}
                  {form.newImageFiles && form.newImageFiles.length > 0 && (
                    <div>
                      <h5 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: '600', color: '#27ae60' }}>New Images ({form.newImageFiles.length})</h5>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '8px', marginBottom: '16px' }}>
                        {Array.from(form.newImageFiles).map((file, idx) => {
                          const previewUrl = URL.createObjectURL(file);
                          return (
                          <div key={`new-${idx}`} style={{ position: 'relative', width: '100%', paddingBottom: '100%', cursor: 'pointer' }}>
                            <img
                              src={previewUrl}
                              alt={`new-${idx}`}
                              onClick={() => setPreviewImage(previewUrl)}
                              style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                borderRadius: '6px',
                                border: form.previewImage === previewUrl ? '3px solid #3498db' : '2px solid #27ae60',
                                opacity: form.previewImage === previewUrl ? 1 : 0.7,
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                              }}
                            />
                            <button
                              type="button"
                              onClick={() => removeNewImage(idx)}
                              style={{
                                position: 'absolute',
                                top: '4px',
                                right: '4px',
                                background: 'rgba(255, 0, 0, 0.7)',
                                border: 'none',
                                color: 'white',
                                width: '24px',
                                height: '24px',
                                borderRadius: '50%',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '14px',
                                fontWeight: 'bold',
                                padding: 0
                              }}
                              title="Remove image"
                            >
                              ×
                            </button>
                          </div>
                        );
                        })}
                      </div>
                    </div>
                  )}
                 
                  {/* Add Images Button */}
                  {((form.images?.length || 0) + (form.newImageFiles?.length || 0)) < 5 && (
                    <label className="sb-file-upload-label">
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleEditImageChange}
                        style={{ display: 'none' }}
                      />
                      <button
                        type="button"
                        className="sb-file-upload-btn"
                        onClick={(e) => e.currentTarget.parentElement.querySelector('input').click()}
                        style={{
                          width: '100%',
                          padding: '12px',
                          border: '2px dashed #3498db',
                          borderRadius: '6px',
                          background: 'white',
                          cursor: 'pointer',
                          color: '#3498db',
                          fontWeight: '500',
                          fontSize: '14px'
                        }}
                      >
                        <i className='bx bx-plus' style={{ marginRight: '6px' }}></i>
                        Add Images
                      </button>
                    </label>
                  )}
                </div>
                <p style={{ fontSize: '12px', color: '#888', margin: '8px 0 0 0' }}>
                  {((form.images?.length || 0) + (form.newImageFiles?.length || 0))}/5 images
                </p>
              </div>
 
              <div className="sb-form-row">
                <label>Description</label>
                <textarea
                  name="description"
                  value={form.description || ''}
                  onChange={handleFormChange}
                  className="sb-input"
                  placeholder="Describe your product"
                  rows="3"
                />
              </div>
 
              <div className="sb-form-row">
                <label>Category</label>
                <select
                  name="categoryId"
                  value={form.categoryId || ''}
                  onChange={(e) => {
                    const selectedId = e.target.value;
                    const selectedCat = categories.find(c => c._id === selectedId);
                    setForm(prev => ({ ...prev, categoryId: selectedId, category: selectedCat?.name || '' }));
                  }}
                  className="sb-input sb-select"
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {displayCategoryName(cat.name)}
                    </option>
                  ))}
                </select>
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
                <label>Image Files (Multiple) *</label>
                <label className="sb-file-upload-label">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleAddImageChange}
                    style={{ display: 'none' }}
                  />
                  <span className="sb-file-upload-btn">
                    <i className='bx bx-upload' style={{ marginRight: '6px' }}></i>
                    {addForm.imageFiles.length > 0 ? `${addForm.imageFiles.length} image(s) selected` : 'Choose Images'}
                  </span>
                </label>
                {addForm.imageFiles.length > 0 && (
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: 8 }}>
                    {addForm.imageFiles.map((file, idx) => (
                      <div key={idx} style={{ position: 'relative', width: '100px', height: '100px' }}>
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`preview-${idx}`}
                          style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 8 }}
                        />
                        <span style={{ fontSize: '12px', position: 'absolute', bottom: 2, left: 2, background: 'rgba(0,0,0,0.6)', color: '#fff', padding: '2px 4px', borderRadius: 4 }}>
                          {idx + 1}
                        </span>
                      </div>
                    ))}
                  </div>
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
 
              <div className="sb-form-row">
                <label>Category *</label>
                <select
                  name="category"
                  value={addForm.category}
                  onChange={handleAddFormChange}
                  className="sb-input sb-select"
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat.name}>
                      {displayCategoryName(cat.name)}
                    </option>
                  ))}
                </select>
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
            </div>
 
            <div className="sb-modal-footer">
              <button className="btn-sb-cancel" onClick={closeAdd}>
                Cancel
              </button>
              <button
                className="btn-sb-save"
                onClick={saveAdd}
                disabled={!addForm.name.trim() || addForm.price === '' || !addForm.description.trim() || addForm.imageFiles.length === 0 || !addForm.category || isSubmittingAdd}
                style={{ opacity: !addForm.name.trim() || addForm.price === '' || !addForm.description.trim() || addForm.imageFiles.length === 0 || !addForm.category || isSubmittingAdd ? 0.5 : 1 }}
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