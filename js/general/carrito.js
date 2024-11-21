// Clase Carrito
class Carrito {
    constructor() {
        this.items = [];
        this.total = 0;
        this.init();
    }

    init() {
        this.cargarCarritoGuardado();
        this.actualizarUI();
        this.inicializarEventos();
    }

    inicializarEventos() {
        document.getElementById('btnPagar')?.addEventListener('click', () => this.procesarPago());
    }

    cargarCarritoGuardado() {
        const carritoGuardado = localStorage.getItem('carrito');
        if (carritoGuardado) {
            this.items = JSON.parse(carritoGuardado);
            this.calcularTotal();
        }
    }

    guardarCarrito() {
        localStorage.setItem('carrito', JSON.stringify(this.items));
    }

    agregarItem(boton) {
        // Obtener datos de la carta desde el HTML
        const carta = boton.closest('.carta');
        const id = parseInt(carta.dataset.id);
        const nombre = carta.dataset.nombre;
        const precio = parseFloat(carta.dataset.precio);
        const imagen = carta.dataset.imagen;

        const itemExistente = this.items.find(item => item.id === id);
        
        if (itemExistente) {
            itemExistente.cantidad++;
        } else {
            this.items.push({
                id,
                nombre,
                precio,
                imagen,
                cantidad: 1
            });
        }

        this.calcularTotal();
        this.actualizarUI();
        this.guardarCarrito();
        this.mostrarModal();
        this.mostrarNotificacion(`${nombre} añadido al carrito`);
    }

    eliminarItem(id) {
        const index = this.items.findIndex(item => item.id === id);
        if (index !== -1) {
            if (this.items[index].cantidad > 1) {
                this.items[index].cantidad--;
            } else {
                this.items.splice(index, 1);
            }
            this.calcularTotal();
            this.actualizarUI();
            this.guardarCarrito();
        }
    }

    calcularTotal() {
        this.total = this.items.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
    }

    actualizarUI() {
        const contador = document.getElementById('contadorCarrito');
        if (contador) {
            const totalItems = this.items.reduce((sum, item) => sum + item.cantidad, 0);
            contador.textContent = totalItems;
            contador.style.display = totalItems > 0 ? 'block' : 'none';
        }

        const contenidoCarrito = document.getElementById('contenidoCarrito');
        const totalElement = document.getElementById('totalCarrito');

        if (!contenidoCarrito || !totalElement) return;

        if (this.items.length === 0) {
            contenidoCarrito.innerHTML = `
                <div class="text-center py-4">
                    <i class="bi bi-cart-x" style="font-size: 2rem;"></i>
                    <p class="mt-2">Tu carrito está vacío</p>
                </div>
            `;
        } else {
            contenidoCarrito.innerHTML = this.items.map(item => `
                <div class="carrito-item">
                    <div class="d-flex align-items-center">
                        <img src="${item.imagen}" class="carrito-imagen me-3" alt="${item.nombre}">
                        <div class="flex-grow-1">
                            <h6 class="mb-0">${item.nombre}</h6>
                            <div class="d-flex align-items-center mt-2">
                                <button class="btn btn-sm btn-outline-danger" 
                                        onclick="carrito.eliminarItem(${item.id})">
                                    <i class="bi bi-dash"></i>
                                </button>
                                <span class="mx-2">${item.cantidad}</span>
                                <button class="btn btn-sm btn-outline-success" 
                                        onclick="carrito.agregarItem(document.querySelector('.carta[data-id=\\"${item.id}\\"]').querySelector('.btn-anadir'))">
                                    <i class="bi bi-plus"></i>
                                </button>
                            </div>
                        </div>
                        <div class="text-end">
                            <div class="fw-bold">$${(item.precio * item.cantidad).toFixed(2)}</div>
                            <small class="text-muted">$${item.precio.toFixed(2)} c/u</small>
                        </div>
                    </div>
                </div>
            `).join('');
        }

        totalElement.textContent = this.total.toFixed(2);

        const btnPagar = document.getElementById('btnPagar');
        if (btnPagar) {
            btnPagar.disabled = this.items.length === 0;
        }
    }

    mostrarModal() {
        // Remover cualquier backdrop existente
        const backdrops = document.getElementsByClassName('modal-backdrop');
        while(backdrops.length > 0) {
            backdrops[0].remove();
        }

        // Obtener el modal existente
        const modalElement = document.getElementById('modalCarrito');
        
        // Si ya hay un modal abierto, solo actualizar contenido
        if (modalElement.classList.contains('show')) {
            this.actualizarUI();
            return;
        }

        // Si no hay modal abierto, mostrar uno nuevo
        const modalCarrito = new bootstrap.Modal(modalElement);
        modalCarrito.show();
    }

    mostrarNotificacion(mensaje) {
        let toastContainer = document.querySelector('.toast-container');
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.className = 'toast-container position-fixed bottom-0 end-0 p-3';
            document.body.appendChild(toastContainer);
        }

        const toast = document.createElement('div');
        toast.className = 'toast align-items-center text-white bg-success border-0';
        toast.setAttribute('role', 'alert');
        toast.setAttribute('aria-live', 'assertive');
        toast.setAttribute('aria-atomic', 'true');
        
        toast.innerHTML = `
            <div class="d-flex">
                <div class="toast-body">
                    ${mensaje}
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
            </div>
        `;

        toastContainer.appendChild(toast);

        const bsToast = new bootstrap.Toast(toast, {
            autohide: true,
            delay: 3000
        });
        bsToast.show();

        toast.addEventListener('hidden.bs.toast', () => {
            toast.remove();
        });
    }

    procesarPago() {
        if (this.items.length === 0) return;

        this.mostrarNotificacion('¡Compra realizada con éxito!');
        this.items = [];
        this.total = 0;
        this.actualizarUI();
        this.guardarCarrito();

        const modalCarrito = bootstrap.Modal.getInstance(document.getElementById('modalCarrito'));
        if (modalCarrito) {
            modalCarrito.hide();
        }
    }
}

// Función de búsqueda
function buscarCartas(termino) {
    const cartas = document.querySelectorAll('.carta');
    let cartasVisibles = 0;
    termino = termino.toLowerCase().trim();

    cartas.forEach(carta => {
        const columna = carta.closest('.col-md-4');
        const nombre = carta.dataset.nombre.toLowerCase();
        const rareza = carta.dataset.rareza.toLowerCase();
        const descripcion = carta.querySelector('p').textContent.toLowerCase();

        if (nombre.includes(termino) || 
            rareza.includes(termino) || 
            descripcion.includes(termino)) {
            columna.style.display = 'block';
            carta.classList.remove('oculta');
            cartasVisibles++;
        } else {
            columna.style.display = 'none';
            carta.classList.add('oculta');
        }
    });

    // Mostrar mensaje si no hay resultados
    const mensajeNoResultados = document.querySelector('.no-resultados');
    if (cartasVisibles === 0) {
        if (!mensajeNoResultados) {
            const mensaje = document.createElement('div');
            mensaje.className = 'no-resultados';
            mensaje.innerHTML = 'No se encontraron cartas que coincidan con tu búsqueda';
            document.getElementById('contenedor-cartas').appendChild(mensaje);
        }
    } else if (mensajeNoResultados) {
        mensajeNoResultados.remove();
    }
}

// Función para filtrar las cartas
function filtrarCartas() {
    const filtroOrden = document.getElementById('filtroOrden').value;
    const filtroRareza = document.getElementById('filtroRareza').value;
    const filtroEdicion = document.getElementById('filtroEdicion').value;
    const filtroEstado = document.getElementById('filtroEstado').value;

    const contenedorCartas = document.getElementById('contenedor-cartas');
    const cartas = document.querySelectorAll('.carta');
    let cartasVisibles = 0;

    // Aplicar filtros
    cartas.forEach(carta => {
        let mostrar = true;
        const columna = carta.closest('.col-md-4');

        // Filtrar por rareza
        if (filtroRareza !== 'Rareza') {
            const rarezaCarta = carta.dataset.rareza;
            if (rarezaCarta !== filtroRareza) {
                mostrar = false;
            }
        }

        // Mostrar u ocultar cartas
        if (mostrar) {
            columna.style.display = 'block';
            carta.classList.remove('oculta');
            cartasVisibles++;
        } else {
            columna.style.display = 'none';
            carta.classList.add('oculta');
        }
    });

    // Ordenar por precio
    if (filtroOrden !== 'Ordenar por') {
        const cartasArray = Array.from(cartas);
        cartasArray.sort((a, b) => {
            const precioA = parseFloat(a.dataset.precio);
            const precioB = parseFloat(b.dataset.precio);
            return filtroOrden === 'Precio: Menor a Mayor' ? precioA - precioB : precioB - precioA;
        });

        cartasArray.forEach(carta => {
            const columna = carta.closest('.col-md-4');
            contenedorCartas.appendChild(columna);
        });
    }
}

// Inicializar carrito
const carrito = new Carrito();

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar buscador
    const buscador = document.getElementById('buscarCartas');
    if (buscador) {
        buscador.addEventListener('input', (e) => buscarCartas(e.target.value));
    }

    // Inicializar filtros
    const filtros = document.querySelectorAll('.form-select');
    filtros.forEach(filtro => {
        filtro.addEventListener('change', filtrarCartas);
    });

    // Inicializar tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Inicializar modales
    const modals = document.querySelectorAll('.modal');
    modals.forEach(function(modal) {
        new bootstrap.Modal(modal);
    });
});