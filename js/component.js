// Components Loader and Manager
class ComponentLoader {
    constructor() {
        this.components = new Map();
        this.registered = false;
    }

    // Register all components
    registerComponents() {
        if (this.registered) return;

        // Register product card web component
        if (!customElements.get('product-card')) {
            const productCardTemplate = document.querySelector('[data-product-card]');
            if (productCardTemplate) {
                this.registerProductCard();
            }
        }

        this.registered = true;
    }

    // Register product card web component
    registerProductCard() {
        class ProductCard extends HTMLElement {
            constructor() {
                super();
                this.attachShadow({ mode: 'open' });
            }

            connectedCallback() {
                this.render();
                this.addEventListeners();
            }

            static get observedAttributes() {
                return ['product-id', 'product-name', 'description', 'category', 
                       'price', 'image-url', 'stock-quantity', 'featured', 'admin'];
            }

            attributeChangedCallback() {
                this.render();
            }

            render() {
                const productId = this.getAttribute('product-id') || '';
                const productName = this.getAttribute('product-name') || 'Product Name';
                const description = this.getAttribute('description') || 'No description available';
                const category = this.getAttribute('category') || 'Uncategorized';
                const price = this.getAttribute('price') || '$0.00';
                const imageUrl = this.getAttribute('image-url') || 'assets/images/placeholder.jpg';
                const stockQuantity = parseInt(this.getAttribute('stock-quantity') || '0');
                const featured = this.getAttribute('featured') === 'true';
                const admin = this.getAttribute('admin') === 'true';

                const stockStatus = this.getStockStatus(stockQuantity);
                const stockText = this.getStockText(stockQuantity);

                this.shadowRoot.innerHTML = `
                    <style>
                        .product-card {
                            background: white;
                            border-radius: 12px;
                            overflow: hidden;
                            box-shadow: var(--shadow);
                            transition: var(--transition);
                            position: relative;
                        }

                        .product-card:hover {
                            transform: translateY(-5px);
                            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
                        }

                        .product-image {
                            height: 200px;
                            overflow: hidden;
                            position: relative;
                        }

                        .product-image img {
                            width: 100%;
                            height: 100%;
                            object-fit: cover;
                            transition: var(--transition);
                        }

                        .product-card:hover .product-image img {
                            transform: scale(1.05);
                        }

                        .product-badge {
                            position: absolute;
                            top: 1rem;
                            left: 1rem;
                            background-color: var(--accent-color);
                            color: var(--dark-color);
                            padding: 0.25rem 0.75rem;
                            border-radius: 20px;
                            font-size: 0.8rem;
                            font-weight: 600;
                        }

                        .product-info {
                            padding: 1.5rem;
                        }

                        .product-info h3 {
                            color: var(--primary-color);
                            margin-bottom: 0.5rem;
                            font-size: 1.2rem;
                        }

                        .product-description {
                            color: var(--text-light);
                            margin-bottom: 1rem;
                            font-size: 0.9rem;
                            line-height: 1.5;
                            display: -webkit-box;
                            -webkit-line-clamp: 2;
                            -webkit-box-orient: vertical;
                            overflow: hidden;
                        }

                        .product-meta {
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                            margin-bottom: 1rem;
                            font-size: 0.9rem;
                        }

                        .product-category {
                            background-color: var(--light-color);
                            padding: 0.25rem 0.75rem;
                            border-radius: 15px;
                            font-weight: 500;
                            color: var(--primary-color);
                        }

                        .product-stock {
                            display: flex;
                            align-items: center;
                            gap: 0.5rem;
                            color: var(--text-light);
                        }

                        .stock-indicator {
                            width: 8px;
                            height: 8px;
                            border-radius: 50%;
                        }

                        .stock-in-stock { background-color: var(--success-color); }
                        .stock-low-stock { background-color: var(--warning-color); }
                        .stock-out-of-stock { background-color: var(--error-color); }

                        .product-price {
                            font-size: 1.25rem;
                            font-weight: 600;
                            color: var(--primary-color);
                            margin-bottom: 1rem;
                        }

                        .product-actions {
                            display: flex;
                            gap: 0.5rem;
                        }

                        .product-actions .btn {
                            flex: 1;
                        }

                        @media (max-width: 480px) {
                            .product-actions {
                                flex-direction: column;
                            }
                        }
                    </style>
                    <div class="product-card">
                        <div class="product-image">
                            <img src="${imageUrl}" alt="${productName}" onerror="this.src='assets/images/placeholder.jpg'">
                            ${featured ? '<span class="product-badge">Featured</span>' : ''}
                        </div>
                        
                        <div class="product-info">
                            <h3>${productName}</h3>
                            <p class="product-description">${description}</p>
                            
                            <div class="product-meta">
                                <span class="product-category">${category}</span>
                                <span class="product-stock">
                                    <span class="stock-indicator stock-${stockStatus}"></span>
                                    ${stockText}
                                </span>
                            </div>
                            
                            <p class="product-price">${price}</p>
                            
                            <div class="product-actions">
                                <button class="btn btn-outline view-product" data-id="${productId}">
                                    View Details
                                </button>
                                
                                ${admin ? `
                                <button class="btn btn-outline edit-product" data-id="${productId}">
                                    <i class="fas fa-edit"></i>
                                </button>
                                ` : ''}
                            </div>
                        </div>
                    </div>
                `;
            }

            getStockStatus(quantity) {
                if (quantity === 0) return 'out-of-stock';
                if (quantity < 10) return 'low-stock';
                return 'in-stock';
            }

            getStockText(quantity) {
                if (quantity === 0) return 'Out of stock';
                if (quantity < 10) return `${quantity} left`;
                return 'In stock';
            }

            addEventListeners() {
                this.shadowRoot.addEventListener('click', (e) => {
                    const viewBtn = e.target.closest('.view-product');
                    const editBtn = e.target.closest('.edit-product');

                    if (viewBtn) {
                        this.dispatchEvent(new CustomEvent('view-product', {
                            detail: { productId: viewBtn.dataset.id },
                            bubbles: true
                        }));
                    }

                    if (editBtn) {
                        this.dispatchEvent(new CustomEvent('edit-product', {
                            detail: { productId: editBtn.dataset.id },
                            bubbles: true
                        }));
                    }
                });
            }
        }

        customElements.define('product-card', ProductCard);
    }

    // Load header component
    async loadHeader() {
        try {
            const response = await fetch('components/header.html');
            const html = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            
            const headerElement = doc.querySelector('header');
            if (headerElement) {
                const headerContainer = document.getElementById('header');
                if (headerContainer) {
                    headerContainer.innerHTML = headerElement.outerHTML;
                    this.setupHeaderEvents();
                }
            }
        } catch (error) {
            console.error('Failed to load header:', error);
        }
    }

    // Load footer component
    async loadFooter() {
        try {
            const response = await fetch('components/footer.html');
            const html = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            
            const footerElement = doc.querySelector('footer');
            if (footerElement) {
                const footerContainer = document.getElementById('footer');
                if (footerContainer) {
                    footerContainer.innerHTML = footerElement.outerHTML;
                }
            }
        } catch (error) {
            console.error('Failed to load footer:', error);
        }
    }

    // Setup header event listeners
    setupHeaderEvents() {
        // Mobile menu toggle
        const mobileMenuBtn = document.getElementById('mobile-menu-btn');
        const mobileMenu = document.getElementById('mobile-menu');
        
        if (mobileMenuBtn && mobileMenu) {
            mobileMenuBtn.addEventListener('click', () => {
                mobileMenu.classList.toggle('hidden');
            });
        }

        // User dropdown
        const userDropdown = document.querySelector('.user-dropdown');
        if (userDropdown) {
            userDropdown.addEventListener('click', (e) => {
                e.stopPropagation();
                const menu = userDropdown.querySelector('.dropdown-menu');
                menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
            });

            // Close dropdown when clicking outside
            document.addEventListener('click', () => {
                const menu = userDropdown.querySelector('.dropdown-menu');
                menu.style.display = 'none';
            });
        }

        // Logout button
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                App.handleLogout();
            });
        }
    }

    // Load all components
    async loadComponents() {
        await Promise.all([
            this.loadHeader(),
            this.loadFooter()
        ]);
        
        this.registerComponents();
    }

    // Create product card element
    createProductCard(product) {
        const card = document.createElement('product-card');
        card.setAttribute('product-id', product._id);
        card.setAttribute('product-name', product.name);
        card.setAttribute('description', product.description);
        card.setAttribute('category', product.category);
        card.setAttribute('price', App.formatPrice(product.price));
        card.setAttribute('image-url', product.images[0]?.url || 'assets/images/placeholder.jpg');
        card.setAttribute('stock-quantity', product.stockQuantity);
        card.setAttribute('featured', product.featured);
        card.setAttribute('admin', App.isAdmin());
        
        card.addEventListener('view-product', (e) => {
            window.location.href = `product-details.html?id=${e.detail.productId}`;
        });

        card.addEventListener('edit-product', (e) => {
            if (App.requireAdmin()) {
                window.location.href = `admin/dashboard.html#products`;
            }
        });

        return card;
    }
}

// Initialize component loader
const componentLoader = new ComponentLoader();

// Global function to load components
async function loadComponents() {
    await componentLoader.loadComponents();
}

// Export for global use
window.ComponentLoader = componentLoader;
window.loadComponents = loadComponents;

// Auto-load components when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('header') || document.getElementById('footer')) {
        loadComponents();
    }
});