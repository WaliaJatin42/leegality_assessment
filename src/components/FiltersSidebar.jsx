import React, { useEffect, useState } from 'react'
import { Search } from 'lucide-react'

function FiltersSidebar({
  categories,
  selectedCategories,
  onToggleCategory,
  minPrice,
  maxPrice,
  onPriceApply,
  brands,
  selectedBrands,
  onToggleBrand
}) {
  const [localMin, setLocalMin] = useState(minPrice || '')
  const [localMax, setLocalMax] = useState(maxPrice || '')
  const [brandSearch, setBrandSearch] = useState('')

  // Sync inputs on props update
  useEffect(() => {
    setLocalMin(minPrice || '')
  }, [minPrice])

  useEffect(() => {
    setLocalMax(maxPrice || '')
  }, [maxPrice])

  const handlePriceSubmit = (e) => {
    e.preventDefault()
    onPriceApply(localMin, localMax)
  }

  // Format slug text for human-friendly display (e.g., 'home-decoration' -> 'Home Decoration')
  const formatLabel = (slug) => {
    return slug
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  // Filter brands based on search input
  const filteredBrands = brands.filter((brand) =>
    brand.toLowerCase().includes(brandSearch.toLowerCase())
  )

  return (
    <aside className="sidebar-panel">
      {/* Sidebar Search - Mocked or filters the brands */}
      <div className="sidebar-search-wrapper">
        <Search size={14} className="header-search-icon" />
        <input
          type="text"
          placeholder="Search brands..."
          className="sidebar-search-input"
          value={brandSearch}
          onChange={(e) => setBrandSearch(e.target.value)}
          id="sidebar-brand-search"
        />
      </div>

      {/* Categories Multi-Select Section */}
      <div>
        <h3 className="sidebar-section-title">Categories</h3>
        <div className="checkbox-group" id="category-checkbox-group">
          {categories.map((cat) => {
            const slug = typeof cat === 'object' ? cat.slug : cat
            const label = typeof cat === 'object' ? cat.name : formatLabel(cat)
            const isChecked = selectedCategories.includes(slug)
            return (
              <label key={slug} className="checkbox-label" id={`category-label-${slug}`}>
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => onToggleCategory(slug)}
                />
                <span>{label}</span>
              </label>
            )
          })}
        </div>
      </div>

      {/* Price Range Section */}
      <div>
        <h3 className="sidebar-section-title">Price Range</h3>
        <form onSubmit={handlePriceSubmit} className="sidebar-price-form">
          <div className="price-inputs-row">
            <input
              type="number"
              placeholder="Min"
              value={localMin}
              onChange={(e) => setLocalMin(e.target.value)}
              className="price-input"
              min="0"
              id="price-min-input"
            />
            <input
              type="number"
              placeholder="Max"
              value={localMax}
              onChange={(e) => setLocalMax(e.target.value)}
              className="price-input"
              min="0"
              id="price-max-input"
            />
          </div>
          <button type="submit" className="sidebar-apply-btn" id="price-apply-btn">
            Apply
          </button>
        </form>
      </div>

      {/* Brands Multi-Select Section */}
      <div>
        <h3 className="sidebar-section-title">Brands</h3>
        <div className="checkbox-group" id="brand-checkbox-group">
          {filteredBrands.length === 0 ? (
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
              No brands found
            </span>
          ) : (
            filteredBrands.map((brand) => {
              const isChecked = selectedBrands.includes(brand)
              return (
                <label key={brand} className="checkbox-label" id={`brand-label-${brand.replace(/\s+/g, '-')}`}>
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => onToggleBrand(brand)}
                  />
                  <span>{brand}</span>
                </label>
              )
            })
          )}
        </div>
      </div>
    </aside>
  )
}

export default FiltersSidebar
