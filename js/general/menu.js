document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    menuToggle.addEventListener('click', function() {
        navMenu.classList.toggle('show');  // Alterna la clase 'show' para abrir/cerrar el menú
        menuToggle.classList.toggle('active');  // Añade o quita la clase 'active' al botón
        document.body.classList.toggle('menu-open');  // Previene el scroll cuando el menú está abierto
    });
});
