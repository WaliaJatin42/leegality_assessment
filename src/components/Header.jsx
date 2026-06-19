import React from 'react'
import { useSearchParams } from 'react-router-dom'
import { Menu, Search, ShoppingCart, History, User } from 'lucide-react'

function Header({ sidebarOpen, setSidebarOpen }) {
  const [searchParams, setSearchParams] = useSearchParams()

  // Track search query parameter
  const searchVal = searchParams.get('q') || ''

  const handleSearchChange = (e) => {
    const val = e.target.value
    const params = new URLSearchParams(searchParams)
    if (val) {
      params.set('q', val)
    } else {
      params.delete('q')
    }
    params.set('page', 1) // Reset page on search
    setSearchParams(params)
  }

  // Count active filters for badge
  let activeFiltersCount = 0
  if (searchParams.get('category')) activeFiltersCount++
  if (searchParams.get('brands')) {
    const brandsList = searchParams.get('brands').split(',').filter(Boolean)
    activeFiltersCount += brandsList.length
  }
  if (searchParams.get('minPrice')) activeFiltersCount++
  if (searchParams.get('maxPrice')) activeFiltersCount++

  return (
    <header className="app-header">
      <div className="header-container">
        {/* Hamburger Menu Icon */}
        <button 
          className="hamburger-btn" 
          onClick={() => setSidebarOpen(prev => !prev)}
          title="Toggle Filters Sidebar"
          id="hamburger-toggle-btn"
        >
          <Menu size={22} />
        </button>

        {/* Mock Search Bar connected to q query param */}
        <div className="header-search-bar">
          <Search size={16} className="header-search-icon" />
          <input
            type="text"
            placeholder="Search products..."
            className="header-search-input"
            value={searchVal}
            onChange={handleSearchChange}
            id="header-search-input"
          />
        </div>

        {/* Right side utility icons */}
        <div className="header-icons">
          <button className="header-icon-btn" title="Cart" id="header-cart-btn">
            <ShoppingCart size={20} />
            {activeFiltersCount > 0 && (
              <span className="header-cart-badge" id="header-cart-count">
                {activeFiltersCount}
              </span>
            )}
          </button>
          
          <button className="header-icon-btn" title="Order History" id="header-history-btn">
            <History size={20} />
          </button>
          
          <button className="header-icon-btn" title="User Profile" id="header-profile-btn">
            <User size={20} />
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header
