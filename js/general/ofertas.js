// Add this to your carrito.js or create a new file filters.js

function filtrarCartas() {
    const orden = document.getElementById('filtroOrden').value;
    const rareza = document.getElementById('filtroRareza').value;
    const descuento = document.getElementById('filtroDescuento').value;
    
    const cartas = document.querySelectorAll('.carta');
    let cartasArray = Array.from(cartas);
    
    cartasArray.forEach(carta => {
        let mostrar = true;
        const cartaRareza = carta.dataset.rareza;
        const descuentoValor = parseInt(carta.dataset.descuento);
        
        // Filtro por rareza
        if (rareza !== 'Rareza' && cartaRareza !== rareza) {
            mostrar = false;
        }
        
        // Filtro por descuento
        if (descuento && descuentoValor < parseInt(descuento)) {
            mostrar = false;
        }
        
        carta.closest('.col-md-4').style.display = mostrar ? 'block' : 'none';
    });
    
    // Ordenamiento
    if (orden !== 'Ordenar por') {
        cartasArray.sort((a, b) => {
            if (orden === 'discount') {
                return parseInt(b.dataset.descuento) - parseInt(a.dataset.descuento);
            } else if (orden === 'Precio: Menor a Mayor') {
                return parseFloat(a.dataset.precio) - parseFloat(b.dataset.precio);
            } else {
                return parseFloat(b.dataset.precio) - parseFloat(a.dataset.precio);
            }
        });
        
        const contenedor = document.getElementById('contenedor-cartas');
        cartasArray.forEach(carta => {
            contenedor.appendChild(carta.closest('.col-md-4'));
        });
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    const filtros = document.querySelectorAll('.filters select');
    filtros.forEach(filtro => {
        filtro.addEventListener('change', filtrarCartas);
    });
});