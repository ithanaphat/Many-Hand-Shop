import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import './OrderHistory.css';

function OrderHistory({ isLoggedIn, onLogout }) {
  const navigate = useNavigate();
  const userId = localStorage.getItem('mhs_user_id');
  const userName = localStorage.getItem('mhs_user_name') || 'Buyer';
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedRatings, setSelectedRatings] = useState({});
  const [submittingItemId, setSubmittingItemId] = useState('');

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const loadOrders = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await fetch(`${API_BASE_URL}/api/order/buyer/${userId}`);
        const data = await response.json().catch(() => ([]));

        if (!response.ok) {
          setError(data.message || 'Unable to load order history.');
          return;
        }

        setOrders(Array.isArray(data) ? data : []);
      } catch (err) {
        setError('Cannot connect to server.');
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [userId]);

  const totalItems = useMemo(
    () => orders.reduce((sum, order) => sum + order.items.length, 0),
    [orders]
  );

  const ratedItems = useMemo(
    () => orders.reduce((sum, order) => sum + order.items.filter((item) => item.review?.rating).length, 0),
    [orders]
  );

  const pendingRatings = Math.max(totalItems - ratedItems, 0);

  const filteredOrders = useMemo(() => {
    if (activeFilter === 'all') {
      return orders;
    }

    return orders
      .map((order) => ({
        ...order,
        items: order.items.filter((item) => (
          activeFilter === 'pending'
            ? !item.review?.rating
            : Boolean(item.review?.rating)
        )),
      }))
      .filter((order) => order.items.length > 0);
  }, [activeFilter, orders]);

  const updateSelectedRating = (itemId, rating) => {
    setSelectedRatings((prev) => ({ ...prev, [itemId]: rating }));
  };

  const handleRateSeller = async (orderId, item) => {
    const rating = selectedRatings[item._id];
    if (!rating) {
      alert('Please choose a rating first.');
      return;
    }

    try {
      setSubmittingItemId(item._id);
      const response = await fetch(`${API_BASE_URL}/api/order/${orderId}/items/${item._id}/rate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          buyerId: userId,
          rating,
        }),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        alert(data.message || 'Rating failed.');
        return;
      }

      setOrders((prevOrders) => prevOrders.map((order) => {
        if (order._id !== orderId) {
          return order;
        }

        return {
          ...order,
          items: order.items.map((orderItem) => (
            orderItem._id === item._id
              ? {
                  ...orderItem,
                  review: data.item?.review || { rating },
                  seller: {
                    ...orderItem.seller,
                    rating: data.seller?.rating ?? orderItem.seller?.rating,
                    ratingCount: data.seller?.ratingCount ?? orderItem.seller?.ratingCount,
                  },
                }
              : orderItem
          )),
        };
      }));

      setSelectedRatings((prev) => {
        const next = { ...prev };
        delete next[item._id];
        return next;
      });
    } catch (err) {
      alert('Cannot connect to server.');
    } finally {
      setSubmittingItemId('');
    }
  };

  return (
    <div className="order-history-page">
      <Header
        isLoggedIn={isLoggedIn}
        onLogout={onLogout}
        onSignIn={() => navigate('/login')}
        onRegister={() => navigate('/register')}
      />

      <main className="order-history-shell">
        <section className="order-history-banner">
          <div className="order-history-banner-copy">
            <p className="order-history-eyebrow">PURCHASED ITEMS</p>
            <h1>Order history</h1>
            <p className="order-history-subtitle">
              Keep track of everything you have bought and rate sellers after each completed purchase.
            </p>
            <div className="order-history-banner-badges">
              <span className="order-history-badge">Buyer: {userName}</span>
              <span className="order-history-badge">Rated items: {ratedItems}</span>
              <span className="order-history-badge soft">Pending ratings: {pendingRatings}</span>
            </div>
          </div>
          <div className="order-history-stats-panel">
            <div className="order-history-stat-card">
              <span className="order-history-stat-label">Orders</span>
              <strong>{orders.length}</strong>
            </div>
            <div className="order-history-stat-card accent">
              <span className="order-history-stat-label">Purchased items</span>
              <strong>{totalItems}</strong>
            </div>
            <div className="order-history-stat-card muted">
              <span className="order-history-stat-label">Waiting for review</span>
              <strong>{pendingRatings}</strong>
            </div>
          </div>
        </section>

        {!loading && !error && orders.length > 0 && (
          <section className="order-history-filter-bar section-card">
            <span className="order-history-filter-label">Filter items:</span>
            <button
              type="button"
              className={`order-history-filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
              onClick={() => setActiveFilter('all')}
            >
              All ({totalItems})
            </button>
            <button
              type="button"
              className={`order-history-filter-btn ${activeFilter === 'pending' ? 'active' : ''}`}
              onClick={() => setActiveFilter('pending')}
            >
              Pending rating ({pendingRatings})
            </button>
            <button
              type="button"
              className={`order-history-filter-btn ${activeFilter === 'rated' ? 'active' : ''}`}
              onClick={() => setActiveFilter('rated')}
            >
              Rated ({ratedItems})
            </button>
          </section>
        )}

        {loading ? (
          <section className="order-history-empty section-card">
            <p>Loading your orders...</p>
          </section>
        ) : error ? (
          <section className="order-history-empty section-card error">
            <p>{error}</p>
          </section>
        ) : orders.length === 0 ? (
          <section className="order-history-empty section-card">
            <h2>No purchase history yet</h2>
            <p>Once you complete checkout, your purchased items will appear here.</p>
            <button type="button" className="order-history-primary-btn" onClick={() => navigate('/products')}>
              Browse products
            </button>
          </section>
        ) : filteredOrders.length === 0 ? (
          <section className="order-history-empty section-card">
            <h2>No items in this filter</h2>
            <p>Try another filter to see your purchased items.</p>
            <button type="button" className="order-history-primary-btn" onClick={() => setActiveFilter('all')}>
              Show all
            </button>
          </section>
        ) : (
          <section className="order-history-list">
            {filteredOrders.map((order) => (
              <article key={order._id} className="order-history-card">
                <div className="order-history-card-head">
                  <div className="order-history-card-head-main">
                    <p className="order-history-order-id">Order #{String(order._id).slice(-6).toUpperCase()}</p>
                    <h2>{new Date(order.createdAt).toLocaleDateString('en-GB', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })}</h2>
                    <div className="order-history-meta-row">
                      <span className="order-history-meta-pill">{order.paymentMethod || 'Payment unavailable'}</span>
                      <span className="order-history-meta-pill">Shipping ฿{Number(order.shippingFee || 0).toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="order-history-summary">
                    <span>{order.items.length} item{order.items.length > 1 ? 's' : ''}</span>
                    <strong>฿{Number(order.totalPrice || 0).toLocaleString()}</strong>
                  </div>
                </div>

                {order.shippingInfo?.address && (
                  <div className="order-history-shipping-box">
                    <span className="order-history-shipping-label">Ship to</span>
                    <p>
                      {order.shippingInfo.name || 'Customer'}
                      {order.shippingInfo.phone ? ` • ${order.shippingInfo.phone}` : ''}
                    </p>
                    <p>{order.shippingInfo.address}</p>
                  </div>
                )}

                <div className="order-history-items">
                  {order.items.map((item) => {
                    const activeRating = selectedRatings[item._id] || item.review?.rating || 0;
                    const sellerProfile = item.seller?._id ? `/seller/${item.seller._id}` : null;

                    return (
                      <div key={item._id} className="order-history-item-row">
                        <div className="order-history-item-main">
                          {item.product?.images?.[0] ? (
                            <img
                              src={item.product.images[0]}
                              alt={item.product?.name || 'Product'}
                              className="order-history-item-image"
                            />
                          ) : (
                            <div className="order-history-item-image placeholder" />
                          )}

                          <div className="order-history-item-copy">
                            <h3>{item.product?.name || 'Product removed'}</h3>
                            <div className="order-history-item-subrow">
                              <button
                                type="button"
                                className="order-history-link-btn"
                                onClick={() => sellerProfile && navigate(sellerProfile)}
                                disabled={!sellerProfile}
                              >
                                {item.seller?.username || 'Unknown seller'}
                              </button>
                              <span className="order-history-item-status">
                                {item.review?.rating ? 'Reviewed' : 'Awaiting rating'}
                              </span>
                            </div>
                            <p>Quantity: {item.quantity}</p>
                            <p>Paid: ฿{(Number(item.price || 0) * Number(item.quantity || 0)).toLocaleString()}</p>
                          </div>
                        </div>

                        <div className="order-history-rating-panel">
                          {item.review?.rating ? (
                            <>
                              <span className="order-history-rating-label">Rated seller</span>
                              <div className="order-history-static-stars" aria-label={`Rated ${item.review.rating} out of 5`}>
                                {Array.from({ length: 5 }).map((_, index) => (
                                  <span key={index} className={index < item.review.rating ? 'filled' : ''}>★</span>
                                ))}
                              </div>
                              <small>
                                Seller rating now {Number(item.seller?.rating || 0).toFixed(1)} ({item.seller?.ratingCount || 0} reviews)
                              </small>
                            </>
                          ) : (
                            <>
                              <span className="order-history-rating-label">Rate this seller</span>
                              <div className="order-history-star-picker" aria-label="Rate seller from 1 to 5">
                                {Array.from({ length: 5 }).map((_, index) => {
                                  const starValue = index + 1;
                                  return (
                                    <button
                                      key={starValue}
                                      type="button"
                                      className={starValue <= activeRating ? 'active' : ''}
                                      onClick={() => updateSelectedRating(item._id, starValue)}
                                    >
                                      ★
                                    </button>
                                  );
                                })}
                              </div>
                              <button
                                type="button"
                                className="order-history-primary-btn"
                                onClick={() => handleRateSeller(order._id, item)}
                                disabled={submittingItemId === item._id}
                              >
                                {submittingItemId === item._id ? 'Saving...' : 'Submit rating'}
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </article>
            ))}
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default OrderHistory;