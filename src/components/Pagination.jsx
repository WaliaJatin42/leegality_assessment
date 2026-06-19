import React from 'react'

function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)

  return (
    <div className="pagination-row" id="pagination">
      <button
        className="pagination-btn"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        id="pagination-prev"
      >
        &larr; Previous
      </button>

      {pages.map((page) => (
        <button
          key={page}
          className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
          onClick={() => onPageChange(page)}
          id={`pagination-page-${page}`}
        >
          {page}
        </button>
      ))}

      <button
        className="pagination-btn"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        id="pagination-next"
      >
        Next &rarr;
      </button>
    </div>
  )
}

export default Pagination
