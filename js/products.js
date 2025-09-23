// Products Page Functionality
let currentPage = 1;
let totalPages = 1;
let currentCategory = 'all';
let currentSearch = '';
let currentSort = 'newest';

// Initialize products page
function initializeProductsPage() {
    loadProducts();
    setupEventListeners();
    updateURLParams();
}

// Setup event listeners for filters
function setupEventListeners() {
    const searchInput = document.getElementById('search-input');
    const categoryFilter = document.getElementById('category-filter');
    const sortFilter = document.getElementById('sort-filter');
    
    // Search with debounce
    if (searchInput) {
        searchInput.addEventListener('input', debounce((e) => {
            currentSearch = e.target.value;
            currentPage = 1;
            loadProducts();
            updateURLParams();
        }, 300));
    }
    
    // Category filter
    if (categoryFilter) {
        categoryFilter.addEventListener('change', (e) => {
            currentCategory = e.target.value;
            currentPage = 1;
            loadProducts();
            updateURLParams();
        });
    }
    
    // Sort filter
    if (sortFilter) {
        sortFilter.addEventListener('change', (e) => {
            currentSort = e.target.value;
            currentPage = 1;
            loadProducts();
            updateURLParams();
        });
    }
    
    // Check URL parameters on load
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');
    const search = urlParams.get('search');
    const page = urlParams.get('page');
    const sort = urlParams.get('sort');
    
    if (category) {
        currentCategory = category;
        if (categoryFilter) categoryFilter.value = category;
    }
    
    if (search) {
        currentSearch = search;
        if (searchInput) searchInput.value = search;
    }
    
    if (page) {
        currentPage = parseInt(page);
    }
    
    if (sort) {
        currentSort = sort;
        if (sortFilter) sortFilter.value = sort;
    }
}

// Load products from API
async function loadProducts() {
    const productsGrid = document.getElementById('products-grid');
    const pagination = document.getElementById('pagination');
    
    if (!productsGrid) return;
    
    // Show loading state
    productsGrid.innerHTML = `
        <div class="products-loading">
            ${Array(8).fill().map(() => `
                <div class="product-card-loading">
                    <div class="loading-image"></div>
                    <div class="loading-content">
                        <div class="loading-line"></div>
                        <div class="loading-line short"></div>
                        <div class="loading-line medium"></div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
    
    try {
        // Build query parameters
        const params = new URLSearchParams({
            page: currentPage,
            limit: 12,
            sortBy: getSortField(),
            sortOrder: getSortOrder()
        });
        
        if (currentCategory !== 'all') {
            params.append('category', currentCategory);
        }
        
        if (currentSearch) {
            params.append('search', currentSearch);
        }
        
        const response = await fetch(`${API_BASE_URL}/products?${params}`);
        const result = await response.json();
        
        if (result.success) {
            displayProducts(result.data.products);
            updatePagination(result.data.pagination);
        } else {
            throw new Error(result.message);
        }
    } catch (error) {
        console.error('Error loading products:', error);
        productsGrid.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-exclamation-circle"></i>
                <h3>Failed to load products</h3>
                <p>Please try again later</p>
                <button class="btn btn-primary" onclick="loadProducts()">Retry</button>
            </div>
        `;
    }
}

// Get sort field based on current sort selection
function getSortField() {
    switch (currentSort) {
        case 'price-low':
        case 'price-high':
            return 'price';
        case 'name':
            return 'name';
        default:
            return 'createdAt';
    }
}

// Get sort order based on current sort selection
function getSortOrder() {
    switch (currentSort) {
        case 'price-high':
            return 'desc';
        case 'price-low':
        case 'name':
            return 'asc';
        default:
            return 'desc';
    }
}

// Display products in the grid
function displayProducts(products) {
    const productsGrid = document.getElementById('products-grid');
    
    if (products.length === 0) {
        productsGrid.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-search"></i>
                <h3>No products found</h3>
                <p>Try adjusting your search or filters</p>
            </div>
        `;
        return;
    }
    
    productsGrid.innerHTML = products.map(product => `
        <div class="product-card">
            ${product.featured ? '<span class="product-badge">Featured</span>' : ''}
            <div class="product-image">
                <img src="${product.images[0]?.url || 'assets/images/placeholder.jpg'}" 
                     alt="${product.name}" 
                     onerror="this.src='assets/images/placeholder.jpg'">
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p class="product-description">${truncateText(product.description, 100)}</p>
                <div class="product-meta">
                    <span class="product-category">${product.category}</span>
                    <span class="product-stock">
                        <span class="stock-indicator ${getStockClass(product.stockQuantity)}"></span>
                        ${getStockText(product.stockQuantity)}
                    </span>
                </div>
                <p class="product-price">${formatPrice(product.price)}</p>
                <div class="product-actions">
                    <button class="btn btn-outline view-product" data-id="${product._id}">
                        View Details
                    </button>
                    ${App.isAdmin() ? `
                        <button class="btn btn-outline edit-product" data-id="${product._id}">
                            <i class="fas fa-edit"></i>
                        </button>
                    ` : ''}
                </div>
            </div>
        </div>
    `).join('');
    
    // Add event listeners
    addProductEventListeners();
}

// Get stock status class
function getStockClass(quantity) {
    if (quantity === 0) return 'out';
    if (quantity < 10) return 'low';
    return '';
}

// Get stock status text
function getStockText(quantity) {
    if (quantity === 0) return 'Out of stock';
    if (quantity < 10) return `${quantity} left`;
    return 'In stock';
}

// Truncate text with ellipsis
function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

// Add event listeners to product cards
function addProductEventListeners() {
    // View product details
    document.querySelectorAll('.view-product').forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = e.target.getAttribute('data-id');
            viewProductDetails(productId);
        });
    });
    
    // Edit product (admin only)
    document.querySelectorAll('.edit-product').forEach(button => {
        button.addEventListener('click', (e) => {
            if (!App.requireAdmin()) return;
            const productId = e.target.getAttribute('data-id');
            editProduct(productId);
        });
    });
}

// View product details
function viewProductDetails(productId) {
    window.location.href = `product-details.html?id=${productId}`;
}

// Edit product (admin)
function editProduct(productId) {
    window.location.href = `admin/dashboard.html#products`;
    // In a real implementation, this would open the edit modal
    // or navigate to the admin product edit page
}

// Update pagination controls
function updatePagination(pagination) {
    const paginationContainer = document.getElementById('pagination');
    
    if (!paginationContainer) return;
    
    if (pagination.totalPages <= 1) {
        paginationContainer.innerHTML = '';
        return;
    }
    
    let paginationHTML = '';
    
    // Previous button
    paginationHTML += `
        <button class="pagination-btn" ${currentPage === 1 ? 'disabled' : ''} 
                onclick="changePage(${currentPage - 1})">
            <i class="fas fa-chevron-left"></i>
        </button>
    `;
    
    // Page numbers
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(pagination.totalPages, startPage + 4);
    
    for (let i = startPage; i <= endPage; i++) {
        paginationHTML += `
            <button class="pagination-btn ${i === currentPage ? 'active' : ''}" 
                    onclick="changePage(${i})">
                ${i}
            </button>
        `;
    }
    
    // Next button
    paginationHTML += `
        <button class="pagination-btn" ${currentPage === pagination.totalPages ? 'disabled' : ''} 
                onclick="changePage(${currentPage + 1})">
            <i class="fas fa-chevron-right"></i>
        </button>
    `;
    
    // Page info
    paginationHTML += `
        <span class="pagination-info">
            Page ${currentPage} of ${pagination.totalPages}
        </span>
    `;
    
    paginationContainer.innerHTML = paginationHTML;
}

// Change page
function changePage(page) {
    currentPage = page;
    loadProducts();
    updateURLParams();
    window.scrollTo(0, 0);
}

// Update URL parameters
function updateURLParams() {
    const url = new URL(window.location);
    
    if (currentCategory !== 'all') {
        url.searchParams.set('category', currentCategory);
    } else {
        url.searchParams.delete('category');
    }
    
    if (currentSearch) {
        url.searchParams.set('search', currentSearch);
    } else {
        url.searchParams.delete('search');
    }
    
    if (currentPage > 1) {
        url.searchParams.set('page', currentPage);
    } else {
        url.searchParams.delete('page');
    }
    
    if (currentSort !== 'newest') {
        url.searchParams.set('sort', currentSort);
    } else {
        url.searchParams.delete('sort');
    }
    
    window.history.replaceState({}, '', url);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('products-grid')) {
        initializeProductsPage();
    }
});

// Global functions for pagination
window.changePage = changePage;