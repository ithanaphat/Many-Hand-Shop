import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import './OrderHistory.css';

function OrderHistory({ isLoggedIn, onLogout }) {
  const navigate = useNavigate();
  const userId = localStorage.getItem('mhs_user_id');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
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
        const response = await fetch(`/api/order/buyer/${userId}`);
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
      const response = await fetch(`/api/order/${orderId}/items/${item._id}/rate`, {
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
        <section className="order-history-hero">
          <div>
            <p className="order-history-eyebrow">PURCHASED ITEMS</p>
            <h1>Order history and seller ratings</h1>
            <p className="order-history-subtitle">
              Review the items you already bought and rate each seller after the purchase is complete.
            </p>
          </div>
          <div className="order-history-stats">
            <div className="order-history-stat-card">
              <span className="order-history-stat-label">Orders</span>
              <strong>{orders.length}</strong>
            </div>
            <div className="order-history-stat-card accent">
              <span className="order-history-stat-label">Purchased items</span>
              <strong>{totalItems}</strong>
            </div>
          </div>
        </section>

        {loading ? (
          <section className="order-history-empty">
            <p>Loading your orders...</p>
          </section>
        ) : error ? (
          <section className="order-history-empty error">
            <p>{error}</p>
          </section>
        ) : orders.length === 0 ? (
          <section className="order-history-empty">
            <h2>No purchase history yet</h2>
            <p>Once you complete checkout, your purchased items will appear here.</p>
            <button type="button" className="order-history-primary-btn" onClick={() => navigate('/products')}>
              Browse products
            </button>
          </section>
        ) : (
          <section className="order-history-list">
            {orders.map((order) => (
              <article key={order._id} className="order-history-card">
                <div className="order-history-card-head">
                  <div>
                    <p className="order-history-order-id">Order #{String(order._id).slice(-6).toUpperCase()}</p>
                    <h2>{new Date(order.createdAt).toLocaleDateString('en-GB', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })}</h2>
                  </div>
                  <div className="order-history-summary">
                    <span>{order.items.length} item{order.items.length > 1 ? 's' : ''}</span>
                    <strong>฿{Number(order.totalPrice || 0).toLocaleString()}</strong>
                  </div>
                </div>

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
                            <button
                              type="button"
                              className="order-history-link-btn"
                              onClick={() => sellerProfile && navigate(sellerProfile)}
                              disabled={!sellerProfile}
                            >
                              {item.seller?.username || 'Unknown seller'}
                            </button>
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