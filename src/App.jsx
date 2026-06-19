import React, { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import ProductListingPage from './pages/ProductListingPage'
import ProductDetailPage from './pages/ProductDetailPage'

function App() {
  // Sidebar state toggleable from Header hamburger menu
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 768)

  return (
    <>
      <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <Routes>
        <Route 
          path="/" 
          element={<ProductListingPage sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />} 
        />
        <Route path="/product/:id" element={<ProductDetailPage />} />
      </Routes>
    </>
  )
}

export default App
