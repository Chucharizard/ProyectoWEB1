
        // Inicializar AOS
        AOS.init({
            duration: 1000,
            once: true
        });

        // Crear campo de estrellas
        function createStarfield() {
            const starfield = document.getElementById('starfield');
            const numberOfStars = 200;

            for (let i = 0; i < numberOfStars; i++) {
                const star = document.createElement('div');
                star.className = 'star';
                
                // Tamaño aleatorio para las estrellas
                const size = Math.random() * 3;
                star.style.width = size + 'px';
                star.style.height = size + 'px';
                
                // Posición aleatoria
                star.style.left = Math.random() * 100 + '%';
                star.style.top = Math.random() * 100 + '%';
                
                // Duración aleatoria del parpadeo
                star.style.setProperty('--twinkle-duration', Math.random() * 3 + 2 + 's');
                
                starfield.appendChild(star);
            }
        }

        // Efecto parallax al hacer scroll
        function handleScroll() {
            const navbar = document.querySelector('.navbar');
            const scrollPosition = window.scrollY;

            if (scrollPosition > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }

            // Parallax para elementos en la página
            document.querySelectorAll('[data-parallax]').forEach(element => {
                const speed = element.dataset.parallax;
                element.style.transform = `translateY(${scrollPosition * speed}px)`;
            });
        }

        // Animación suave para los enlaces del menú
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Observador de Intersección para las tarjetas
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, {
            threshold: 0.1
        });

        // Carrito de compras
        class ShoppingCart {
            constructor() {
                this.items = [];
                this.total = 0;
                this.init();
            }

            init() {
                this.loadCart();
                this.updateUI();
            }

            loadCart() {
                const savedCart = localStorage.getItem('pokeCart');
                if (savedCart) {
                    this.items = JSON.parse(savedCart);
                    this.calculateTotal();
                }
            }

            saveCart() {
                localStorage.setItem('pokeCart', JSON.stringify(this.items));
            }

            addItem(item) {
                this.items.push(item);
                this.calculateTotal();
                this.updateUI();
                this.saveCart();
            }

            removeItem(index) {
                this.items.splice(index, 1);
                this.calculateTotal();
                this.updateUI();
                this.saveCart();
            }

            calculateTotal() {
                this.total = this.items.reduce((sum, item) => sum + item.price, 0);
            }

            updateUI() {
                const cartItems = document.getElementById('cartItems');
                const cartTotal = document.getElementById('cartTotal');
                const checkoutBtn = document.getElementById('checkoutBtn');
                const cartBadge = document.querySelector('.badge');

                if (this.items.length === 0) {
                    cartItems.innerHTML = 'Tu carrito está vacío';
                    checkoutBtn.disabled = true;
                } else {
                    cartItems.innerHTML = this.items.map((item, index) => `
                        <div class="cart-item d-flex align-items-center mb-3">
                            <img src="${item.image}" alt="${item.name}" class="me-3" style="width: 50px">
                            <div class="flex-grow-1">
                                <h6 class="mb-0">${item.name}</h6>
                                <small>$${item.price.toFixed(2)}</small>
                            </div>
                            <button class="btn btn-danger btn-sm" onclick="cart.removeItem(${index})">
                                <i class="bi bi-trash"></i>
                            </button>
                        </div>
                    `).join('');
                    checkoutBtn.disabled = false;
                }

                cartTotal.textContent = this.total.toFixed(2);
                cartBadge.textContent = this.items.length;
            }
        }

        // Inicializar todo cuando el DOM esté listo
        document.addEventListener('DOMContentLoaded', () => {
            createStarfield();
            window.cart = new ShoppingCart();
            
            // Observar las tarjetas para animaciones
            document.querySelectorAll('.card-pokemon').forEach(card => {
                observer.observe(card);
            });
        });

        // Eventos de scroll
        window.addEventListener('scroll', handleScroll);


        // Crear partículas flotantes
        function createParticles() {
            const container = document.getElementById('particles');
            const particleCount = 50;

            for (let i = 0; i < particleCount; i++) {
                const particle = document.createElement('div');
                particle.className = 'particle';
                
                // Tamaño aleatorio
                const size = Math.random() * 5 + 2;
                particle.style.width = `${size}px`;
                particle.style.height = `${size}px`;
                
                // Posición inicial aleatoria
                particle.style.left = `${Math.random() * 100}%`;
                particle.style.top = `${Math.random() * 100}%`;
                
                // Duración aleatoria
                particle.style.setProperty('--duration', `${Math.random() * 3 + 2}s`);
                
                container.appendChild(particle);
            }
        }

        // Función para scroll suave
        function scrollToContent() {
            window.scrollTo({
                top: window.innerHeight,
                behavior: 'smooth'
            });
        }

   
        // Inicializar
        document.addEventListener('DOMContentLoaded', createParticles);
