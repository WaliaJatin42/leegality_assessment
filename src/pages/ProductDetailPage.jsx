import React, { useState, useEffect, useMemo } from 'react'
import { useParams, Link, useLocation } from 'react-router-dom'
import { ArrowLeft, Star, StarHalf, AlertTriangle, RefreshCw } from 'lucide-react'
import Pagination from '../components/Pagination'

function ProductDetailPage() {
  const { id } = useParams()
  const location = useLocation()

  // API State
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Review Pagination state (1 review per page to demonstrate pagination)
  const [reviewPage, setReviewPage] = useState(1)

  // Fetch product detail on mount/id change
  useEffect(() => {
    const fetchProductDetail = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(`https://dummyjson.com/products/${id}`)
        if (!res.ok) {
          if (res.status === 404) throw new Error('Product not found.')
          throw new Error('Failed to load product details.')
        }
        const data = await res.json()
        setProduct(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchProductDetail()
  }, [id])

  // Helper to render rating stars
  const renderStars = (ratingVal) => {
    const stars = []
    const fullStars = Math.floor(ratingVal)
    const hasHalfStar = (ratingVal - fullStars) >= 0.5

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<Star key={i} className="star-icon" />)
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<StarHalf key={i} className="star-icon" />)
      } else {
        stars.push(<Star key={i} className="star-icon empty" />)
      }
    }
    return stars
  }

  // Preserve the search query parameters when navigating back
  const backPath = `/${location.search}`

  // Format category slugs beautifully
  const formatLabel = (slug) => {
    if (!slug) return ''
    return slug
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  // Reviews calculations
  const reviews = useMemo(() => {
    if (!product || !product.reviews) return []
    return product.reviews
  }, [product])

  const paginatedReviews = useMemo(() => {
    // Show 1 review per page to have a functional reviews pagination matching Screenshot 3
    const start = (reviewPage - 1) * 1
    return reviews.slice(start, start + 1)
  }, [reviews, reviewPage])

  const totalReviewPages = reviews.length || 1

  if (error) {
    return (
      <div className="page-container" style={{ padding: '2rem' }}>
        <Link to="/" className="pdp-back-btn" id="pdp-error-back-btn">
          <ArrowLeft size={16} />
          Back
        </Link>
        <div className="error-container" id="detail-error-container">
          <AlertTriangle size={32} style={{ color: 'red' }} />
          <h2 className="error-title">Error Loading Product</h2>
          <p className="error-message">{error}</p>
          <button 
            className="sidebar-apply-btn" 
            onClick={() => window.location.reload()}
            id="pdp-reload-btn"
            style={{ width: 'auto', padding: '0.5rem 1.5rem' }}
          >
            <RefreshCw size={14} style={{ marginRight: '6px' }} />
            Reload Page
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="page-container" id="pdp-page-frame">
      {/* Back button row */}
      <div className="pdp-back-row">
        <Link to={backPath} className="pdp-back-btn" id="pdp-back-btn">
          &larr; Back
        </Link>
      </div>

      {loading ? (
        // Custom Detail Page Skeleton Loader matching user style
        <div className="detail-layout-grid" id="detail-skeleton">
          <div className="detail-left-col">
            <div className="detail-image-card skeleton-shimmer"></div>
            <div className="pagination-row skeleton-shimmer" style={{ height: '35px', width: '200px' }}></div>
          </div>
          <div className="detail-right-col">
            <div className="skeleton-line skeleton-shimmer" style={{ height: '2.5rem', width: '80%' }}></div>
            <div className="skeleton-line skeleton-shimmer" style={{ height: '1.5rem', width: '30%' }}></div>
            <div className="skeleton-line skeleton-shimmer" style={{ height: '6rem', width: '100%' }}></div>
            <div className="skeleton-line skeleton-shimmer" style={{ height: '3rem', width: '50%' }}></div>
          </div>
        </div>
      ) : (
        product && (
          <div className="detail-layout-grid" id={`pdp-layout-${product.id}`}>
            {/* Left Column: Image Card and Reviews Pager */}
            <div className="detail-left-col">
              <div className="detail-image-card">
                <img
                  src={product.thumbnail}
                  alt={product.title}
                  className="detail-image"
                />
              </div>

              {/* Functional Reviews Pager under Image Card (as shown in Screenshot 3) */}
              <Pagination
                currentPage={reviewPage}
                totalPages={totalReviewPages}
                onPageChange={(page) => setReviewPage(page)}
              />
            </div>

            {/* Right Column: Information, Specs, Description & Reviews List */}
            <div className="detail-right-col">
              <h1 className="detail-pdp-title" id="pdp-title">{product.title}</h1>
              
              {/* Price and star rating on the same line */}
              <div className="detail-pdp-price-row">
                <span>${product.price}</span>
                <div className="rating-stars-inline">
                  <div className="stars-row">
                    {renderStars(product.rating)}
                  </div>
                  <span className="rating-val" style={{ fontSize: '0.9rem' }}>
                    ({product.rating.toFixed(1)})
                  </span>
                </div>
              </div>

              {/* Brand and Category Metadata */}
              {product.brand && (
                <div className="detail-meta-text">
                  <span>Brand: </span>
                  <strong>{product.brand}</strong>
                </div>
              )}
              {product.category && (
                <div className="detail-meta-text">
                  <span>Category: </span>
                  <strong>{formatLabel(product.category)}</strong>
                </div>
              )}

              {/* Description Section */}
              <div className="detail-section-block">
                <h3 className="detail-section-header">Description</h3>
                <p className="detail-description-text" id="pdp-description">
                  {product.description}
                </p>
              </div>

              {/* Reviews List Section */}
              <div className="detail-section-block">
                <h3 className="detail-section-header">Reviews</h3>
                <div className="reviews-list" id="pdp-reviews-list">
                  {paginatedReviews.length === 0 ? (
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                      No reviews available for this product.
                    </span>
                  ) : (
                    paginatedReviews.map((rev, index) => (
                      <div key={index} className="review-item">
                        <div className="review-author-row">
                          <span className="review-author">{rev.reviewerName}</span>
                          <div className="rating-stars-inline">
                            <div className="stars-row">
                              {renderStars(rev.rating)}
                            </div>
                            <span className="rating-val">({rev.rating.toFixed(1)})</span>
                          </div>
                        </div>
                        <p className="review-comment">{rev.comment}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>
          </div>
        )
      )}
    </div>
  )
}

export default ProductDetailPage
