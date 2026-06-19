# E-Commerce Product Catalog App (Mockup UI Match)

A highly responsive, custom-styled e-commerce Product Listing & Detail page application built with **React**, **React Router**, and **Custom CSS**. The design has been meticulously updated to match the custom mockup UI layouts provided, featuring a sleek slate-gray header, rounded card frames, collapsible filters sidebar, inline pricing/stars, and interactive reviews pagination.

---

## 🚀 Setup & Installation Instructions

Ensure you have [Node.js](https://nodejs.org/) installed (v18+ recommended).

1. **Navigate to the project root:**
   ```bash
   cd leegality
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the local development server:**
   ```bash
   npm run dev
   ```
   Open your browser to `http://localhost:5173/`.

4. **Build the production bundle:**
   ```bash
   npm run build
   ```

---

## 🎨 Layout & UI Implementation Details

The interface is built to replicate the user's mockup screenshots:
* **Slate Header:** Sleek steel/slate gray background (`#34495e`) featuring a Hamburger menu button to toggle the sidebar, a centered search bar with an internal search icon, and right-hand utility icons (`Cart`, `History`, `User`).
* **Sidebar Toggle:** Clicking the hamburger button in the header collapses/expands the filters sidebar.
* **Product Card Grid:** Renders cards with rounded borders, a centered image, product title, and a compact single-row container displaying `Price`, `Stars`, and `(Rating)` side-by-side.
* **Detail Page (PDP):** Organizes the layout into two main columns:
  * **Left Column:** A clean white card displaying the product image, and a functional reviews pagination component underneath.
  * **Right Column:** Title, price, rating stars, brand, category, description, and the active reviewer comment (paginated by the reviews pager on the left).

---

## 🛠️ Architectural Decisions

### 1. Filters & Navigation State Memory (URL Search Params)
All filters (categories, brands, min/max price, search query `q`, listing page number) are managed as URL Search Parameters. When navigating to the Product Detail Page and clicking `← Back`, the application reads `location.search` to restore the exact filter selections and scroll position.

### 2. Multi-Select Category API Combinations
To support department multi-select checkboxes:
* If no checkboxes are checked, the app fetches all items from `/products?limit=100`.
* If multiple checkboxes are checked, the app fetches those categories in parallel via `Promise.all` (e.g. `/products/category/{category}`) and merges them client-side.
* This ensures that filters like price ranges and brands can be applied correctly over combined category sets.

### 3. Price Filter Apply Trigger
To provide a smooth user typing experience, price inputs use local state. Clicking the **Apply** button updates the URLSearchParams and re-evaluates the filters.

### 4. Interactive Review Pagination
Reviews are paginated (1 review per page) using the pagination controls under the product image. This makes the detail page highly interactive and functional.

---

## 📌 Assumptions Made

1. **DummyJSON Category Responses:** normalizes both string list and object lists returned from `/products/categories` dynamically.
2. **Catalog Scale:** All matching items are fetched locally for optimal combined filtering and client-side pagination.

---

## 💎 Improvements If Given More Time

* **Debounced Header Search:** Add automatic debouncing to the header search input to search without page reloads.
* **Local Shopping Cart:** Connect the `Cart` icon in the header to a local-storage-backed shopping cart.
* **Unit Testing:** Implement test files for checking state combinations using Vitest.
