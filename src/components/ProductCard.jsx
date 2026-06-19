import React from 'react'
import { Link } from 'react-router-dom'
import { Star, StarHalf } from 'lucide-react'

function ProductCard({ product }) {
  const { id, title, price, rating, thumbnail } = product

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

  return (
    <Link 
      to={`/product/${id}${window.location.search}`} 
      className="product-card" 
      id={`product-card-${id}`}
    >
      <div className="product-card-image-box">
        <img 
          src={thumbnail} 
          alt={title} 
          className="product-card-image"
          loading="lazy" 
        />
      </div>

      <h3 className="product-card-title" title={title}>
        {title}
      </h3>

      <div className="product-card-row">
        <span className="product-card-price">${price}</span>
        
        <div className="rating-stars-inline">
          <div className="stars-row">
            {renderStars(rating)}
          </div>
          <span className="rating-val">({rating.toFixed(1)})</span>
        </div>
      </div>
    </Link>
  )
}

export default ProductCard
