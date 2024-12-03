// Particle animation
function createParticles() {
    const container = document.querySelector('.particles-container');
    const particleCount = 50;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Random size
        const size = Math.random() * 5 + 2;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        // Random position
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        
        // Random animation delay
        particle.style.animationDelay = `${Math.random() * 5}s`;
        
        container.appendChild(particle);
    }
}

// Filter functionality
const searchInput = document.getElementById('searchCards');
const sortFilter = document.getElementById('sortFilter');
const rarityFilter = document.getElementById('rarityFilter');
const discountFilter = document.getElementById('discountFilter');

function filterCards() {
    const cards = document.querySelectorAll('.card');
    const searchTerm = searchInput.value.toLowerCase();
    const sortValue = sortFilter.value;
    const rarityValue = rarityFilter.value;
    const discountValue = parseInt(discountFilter.value) || 0;

    cards.forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        const rarity = card.dataset.rarity;
        const discount = parseInt(card.dataset.discount);
        
        const matchesSearch = title.includes(searchTerm);
        const matchesRarity = !rarityValue || rarity === rarityValue;
        const matchesDiscount = discount >= discountValue;
        
        card.style.display = 
            matchesSearch && matchesRarity && matchesDiscount ? 'block' : 'none';
    });

    if (sortValue) {
        sortCards(sortValue);
    }
}

function sortCards(sortBy) {
    const cardsContainer = document.querySelector('.offers-grid');
    const cards = Array.from(cardsContainer.children);

    cards.sort((a, b) => {
        switch(sortBy) {
            case 'discount':
                return parseInt(b.dataset.discount) - parseInt(a.dataset.discount);
            case 'priceAsc':
                return getPrice(a) - getPrice(b);
            case 'priceDesc':
                return getPrice(b) - getPrice(a);
            default:
                return 0;
        }
    });

    cards.forEach(card => cardsContainer.appendChild(card));
}

function getPrice(card) {
    return parseFloat(card.querySelector('.discounted-price').textContent.replace('$', ''));
}

class ShoppingCart {
    constructor() {
        this.items = JSON.parse(localStorage.getItem('cart')) || [];
        this.total = 0;
        this.init();
    }

    init() {
        this.updateCartCount();
        this.initAddToCartButtons();
        this.calculateTotal();
    }

    addItem(item) {
        const existingItem = this.items.find(i => i.id === item.id);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            this.items.push({ ...item, quantity: 1 });
        }
        this.saveCart();
        this.updateUI();
        this.showNotification('Producto añadido al carrito');
    }

    removeItem(id) {
        const index = this.items.findIndex(item => item.id === id);
        if (index !== -1) {
            this.items.splice(index, 1);
            this.saveCart();
            this.updateUI();
        }
    }

    updateQuantity(id, delta) {
        const item = this.items.find(item => item.id === id);
        if (item) {
            item.quantity += delta;
            if (item.quantity <= 0) {
                this.removeItem(id);
            } else {
                this.saveCart();
                this.updateUI();
            }
        }
    }

    calculateTotal() {
        this.total = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    }

    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.items));
        this.calculateTotal();
        this.updateCartCount();
    }

    updateCartCount() {
        const count = this.items.reduce((sum, item) => sum + item.quantity, 0);
        const badge = document.querySelector('.badge');
        if (badge) {
            badge.textContent = count;
            badge.style.display = count > 0 ? 'block' : 'none';
        }
    }

    initAddToCartButtons() {
        document.querySelectorAll('.add-to-cart-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const card = e.target.closest('.card');
                const item = {
                    id: card.dataset.id || Math.random().toString(36).substr(2, 9),
                    name: card.querySelector('h3').textContent,
                    price: parseFloat(card.querySelector('.discounted-price').textContent.replace('$', '')),
                    image: card.querySelector('.card-image img').src
                };
                this.addItem(item);
            });
        });
    }

    updateUI() {
        const cartItems = document.getElementById('cartItems');
        const cartTotal = document.getElementById('cartTotal');
        const checkoutBtn = document.getElementById('checkoutBtn');

        if (this.items.length === 0) {
            cartItems.innerHTML = '<p class="text-center">Tu carrito está vacío</p>';
            checkoutBtn.disabled = true;
        } else {
            cartItems.innerHTML = this.items.map(item => `
                <div class="cart-item mb-3">
                    <div class="d-flex align-items-center">
                        <img src="${item.image}" alt="${item.name}" class="me-3" style="width: 50px; height: 50px; object-fit: contain;">
                        <div class="flex-grow-1">
                            <h6 class="mb-0">${item.name}</h6>
                            <div class="d-flex align-items-center mt-2">
                                <button class="btn btn-sm btn-outline-danger" onclick="cart.updateQuantity('${item.id}', -1)">
                                    <i class="bi bi-dash"></i>
                                </button>
                                <span class="mx-2">${item.quantity}</span>
                                <button class="btn btn-sm btn-outline-success" onclick="cart.updateQuantity('${item.id}', 1)">
                                    <i class="bi bi-plus"></i>
                                </button>
                            </div>
                            <div class="mt-2">
                                <span class="text-muted">$${item.price.toFixed(2)} c/u</span>
                                <span class="ms-2">Total: $${(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                        </div>
                        <button class="btn btn-sm btn-danger ms-2" onclick="cart.removeItem('${item.id}')">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </div>
            `).join('');

            cartTotal.textContent = this.total.toFixed(2);
            checkoutBtn.disabled = false;
        }
    }

    showNotification(message) {
        // Simple alert for now
        alert(message);
    }
}

// Initialize cart
const cart = new ShoppingCart();
// Initialize
document.addEventListener('DOMContentLoaded', () => {
    createParticles();
    
    // Initialize filters
    searchInput.addEventListener('input', filterCards);
    sortFilter.addEventListener('change', filterCards);
    rarityFilter.addEventListener('change', filterCards);
    discountFilter.addEventListener('change', filterCards);
    
    // Initialize shopping cart
    window.cart = new ShoppingCart();
});