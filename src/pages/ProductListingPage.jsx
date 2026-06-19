import React, { useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import FiltersSidebar from '../components/FiltersSidebar'
import ProductCard from '../components/ProductCard'
import Pagination from '../components/Pagination'
import { Filter, PackageOpen, AlertCircle, RotateCcw } from 'lucide-react'

const ITEMS_PER_PAGE = 8

function ProductListingPage({ sidebarOpen, setSidebarOpen }) {
  const [searchParams, setSearchParams] = useSearchParams()

  // API State
  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Parse filters from URLSearchParams
  const selectedCategories = useMemo(() => {
    const catParam = searchParams.get('category')
    return catParam ? catParam.split(',').filter(Boolean) : []
  }, [searchParams])

  const selectedBrands = useMemo(() => {
    const brandsParam = searchParams.get('brands')
    return brandsParam ? brandsParam.split(',').filter(Boolean) : []
  }, [searchParams])

  const minPrice = searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : ''
  const maxPrice = searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : ''
  const searchQuery = searchParams.get('q') || ''
  const currentPage = searchParams.get('page') ? Number(searchParams.get('page')) : 1

  // 1. Fetch Categories dynamically on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('https://dummyjson.com/products/categories')
        if (!res.ok) throw new Error('Failed to load categories.')
        const data = await res.json()
        setCategories(data)
      } catch (err) {
        console.error('Error fetching categories:', err)
      }
    }
    fetchCategories()
  }, [])

  // 2. Fetch products whenever selectedCategories changes
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      setError(null)
      try {
        let fetchedList = []
        if (selectedCategories.length === 0) {
          const res = await fetch('https://dummyjson.com/products?limit=100')
          if (!res.ok) throw new Error('Failed to fetch products.')
          const data = await res.json()
          fetchedList = data.products || []
        } else {
          // Fetch checked categories in parallel
          const fetchPromises = selectedCategories.map(async (catSlug) => {
            const res = await fetch(`https://dummyjson.com/products/category/${catSlug}?limit=100`)
            if (!res.ok) throw new Error(`Failed to load category: ${catSlug}`)
            const data = await res.json()
            return data.products || []
          })
          const results = await Promise.all(fetchPromises)
          fetchedList = results.flat()
        }
        setProducts(fetchedList)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [selectedCategories])

  // 3. Extract unique Brands dynamically from active fetched products list
  const uniqueBrands = useMemo(() => {
    const brandsSet = new Set()
    products.forEach((p) => {
      if (p.brand) {
        brandsSet.add(p.brand)
      }
    })
    return Array.from(brandsSet).sort()
  }, [products])

  // 4. Combine Filters client-side (Price, Brand, Search)
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Global/Header search query title filter
      if (searchQuery && !product.title.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false
      }
      // Min Price
      if (minPrice !== '' && product.price < minPrice) {
        return false
      }
      // Max Price
      if (maxPrice !== '' && product.price > maxPrice) {
        return false
      }
      // Brands (multi-select)
      if (selectedBrands.length > 0 && (!product.brand || !selectedBrands.includes(product.brand))) {
        return false
      }
      return true
    })
  }, [products, searchQuery, minPrice, maxPrice, selectedBrands])

  // 5. Paginate the filtered list
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE)
  
  // Reset page to 1 if it exceeds total pages
  const verifiedPage = useMemo(() => {
    if (currentPage > totalPages && totalPages > 0) {
      return 1
    }
    return currentPage
  }, [currentPage, totalPages])

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      updateUrlParam('page', 1)
    }
  }, [currentPage, totalPages])

  const paginatedProducts = useMemo(() => {
    const start = (verifiedPage - 1) * ITEMS_PER_PAGE
    const end = start + ITEMS_PER_PAGE
    return filteredProducts.slice(start, end)
  }, [filteredProducts, verifiedPage])

  // Helper to update URL params
  const updateUrlParam = (key, value) => {
    const params = new URLSearchParams(searchParams)
    
    if (value === null || value === '' || (Array.isArray(value) && value.length === 0)) {
      params.delete(key)
    } else {
      params.set(key, value)
    }
    
    if (key !== 'page') {
      params.set('page', 1) // Reset page on filter change
    }
    
    setSearchParams(params)
  }

  // Close sidebar drawer on mobile after applying filters
  const autoCloseSidebarOnMobile = () => {
    if (window.innerWidth <= 768) {
      setSidebarOpen(false)
    }
  }

  // Filter Handlers
  const handleToggleCategory = (catSlug) => {
    let nextCategories = [...selectedCategories]
    if (nextCategories.includes(catSlug)) {
      nextCategories = nextCategories.filter((c) => c !== catSlug)
    } else {
      nextCategories.push(catSlug)
    }
    
    const params = new URLSearchParams(searchParams)
    if (nextCategories.length > 0) {
      params.set('category', nextCategories.join(','))
    } else {
      params.delete('category')
    }
    params.delete('brands')
    params.set('page', 1)
    setSearchParams(params)
    autoCloseSidebarOnMobile()
  }

  const handleToggleBrand = (brandName) => {
    let nextBrands = [...selectedBrands]
    if (nextBrands.includes(brandName)) {
      nextBrands = nextBrands.filter((b) => b !== brandName)
    } else {
      nextBrands.push(brandName)
    }
    updateUrlParam('brands', nextBrands.join(','))
    autoCloseSidebarOnMobile()
  }

  const handlePriceApply = (min, max) => {
    const params = new URLSearchParams(searchParams)
    if (min !== '') params.set('minPrice', min)
    else params.delete('minPrice')
    
    if (max !== '') params.set('maxPrice', max)
    else params.delete('maxPrice')
    
    params.set('page', 1)
    setSearchParams(params)
    autoCloseSidebarOnMobile()
  }

  const handlePageChange = (newPage) => {
    updateUrlParam('page', newPage)
  }

  const handleClearFilters = () => {
    setSearchParams(new URLSearchParams())
    autoCloseSidebarOnMobile()
  }

  return (
    <div className="page-container" id="listing-page-frame">
      <div className={`content-layout ${!sidebarOpen ? 'sidebar-closed' : ''}`}>
        
        {/* Mobile Sidebar Backdrop Overlay */}
        {sidebarOpen && (
          <div className="sidebar-backdrop" onClick={() => setSidebarOpen(false)} />
        )}

        {/* Sidebar: Filters */}
        <FiltersSidebar
          categories={categories}
          selectedCategories={selectedCategories}
          onToggleCategory={handleToggleCategory}
          minPrice={minPrice}
          maxPrice={maxPrice}
          onPriceApply={handlePriceApply}
          brands={uniqueBrands}
          selectedBrands={selectedBrands}
          onToggleBrand={handleToggleBrand}
          onClearFilters={handleClearFilters}
        />

        {/* Right side: Product List */}
        <section className="products-panel">
          
          <div className="products-panel-header">
            <h2 className="products-panel-title">
              <Filter size={16} />
              Filters
            </h2>
            <div className="results-count" id="results-count">
              {loading ? (
                <span>Loading catalog...</span>
              ) : (
                <span>
                  Showing <strong>{filteredProducts.length}</strong> product{filteredProducts.length !== 1 ? 's' : ''}
                </span>
              )}
            </div>
          </div>

          {error ? (
            <div className="error-container" id="error-container">
              <AlertCircle size={32} style={{ color: 'red' }} />
              <h2 className="error-title">Unable to Load Catalog</h2>
              <p className="error-message">{error}</p>
              <button 
                className="sidebar-apply-btn" 
                onClick={() => handleToggleCategory('')}
                id="retry-fetch-btn"
                style={{ width: 'auto', padding: '0.5rem 1.5rem' }}
              >
                <RotateCcw size={14} style={{ marginRight: '6px' }} />
                Retry
              </button>
            </div>
          ) : loading ? (
            // Shimmer grid
            <div className="products-grid" id="shimmer-grid">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="skeleton-card">
                  <div className="skeleton-image skeleton-shimmer"></div>
                  <div className="skeleton-info">
                    <div className="skeleton-line skeleton-shimmer"></div>
                    <div className="skeleton-line skeleton-shimmer" style={{ width: '60%' }}></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            // Empty state
            <div className="empty-state" id="empty-state">
              <PackageOpen size={36} color="var(--text-muted)" />
              <h2 className="empty-state-title">No products found</h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Try relaxing your price constraints or category selections.
              </p>
              <button 
                className="sidebar-apply-btn" 
                onClick={handleClearFilters}
                id="empty-state-clear-btn"
                style={{ width: 'auto', padding: '0.5rem 1.5rem', marginTop: '0.5rem' }}
              >
                Clear Filters
              </button>
            </div>
          ) : (
            // Product grid
            <>
              <div className="products-grid" id="products-grid">
                {paginatedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Pagination controls */}
              <Pagination
                currentPage={verifiedPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </>
          )}

        </section>
      </div>
    </div>
  )
}

export default ProductListingPage
