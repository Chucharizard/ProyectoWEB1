function crearParticula(x, y, tipo) {
    const particula = document.createElement('div');
    particula.className = 'particula';
    
    const tamanho = Math.random() * 8 + 4;
    particula.style.width = `${tamanho}px`;
    particula.style.height = `${tamanho}px`;
    
    let color;
    switch(tipo) {
        case 'fuego': color = `hsl(${Math.random() * 60 + 0}, 100%, 50%)`; break;
        case 'agua': color = `hsl(${Math.random() * 60 + 180}, 100%, 60%)`; break;
        case 'planta': color = `hsl(${Math.random() * 60 + 90}, 100%, 50%)`; break;
        case 'electrico': color = `hsl(${Math.random() * 30 + 40}, 100%, 50%)`; break;
        case 'psiquico': color = `hsl(${Math.random() * 60 + 300}, 100%, 70%)`; break;
        case 'lucha': color = `hsl(${Math.random() * 30 + 0}, 100%, 40%)`; break;
        default: color = '#fff';
    }
    particula.style.background = color;
    particula.style.boxShadow = `0 0 ${tamanho}px ${tamanho/2}px ${color}`;
    
    particula.style.left = `${x}px`;
    particula.style.top = `${y}px`;
    
    return particula;
}

function animarParticulas(tarjeta) {
    const contenedor = tarjeta.querySelector('.contenedor-particulas');
    const tipo = tarjeta.dataset.tipo;
    const rect = tarjeta.getBoundingClientRect();

    function emitirParticula() {
        let x, y, dx, dy;
        const lado = Math.floor(Math.random() * 4);

        switch(lado) {
            case 0: // arriba
                x = Math.random() * rect.width;
                y = -10;
                dx = (Math.random() - 0.5) * 4;
                dy = Math.random() * 3 + 2;
                break;
            case 1: // derecha
                x = rect.width + 10;
                y = Math.random() * rect.height;
                dx = -(Math.random() * 3 + 2);
                dy = (Math.random() - 0.5) * 4;
                break;
            case 2: // abajo
                x = Math.random() * rect.width;
                y = rect.height + 10;
                dx = (Math.random() - 0.5) * 4;
                dy = -(Math.random() * 3 + 2);
                break;
            case 3: // izquierda
                x = -10;
                y = Math.random() * rect.height;
                dx = Math.random() * 3 + 2;
                dy = (Math.random() - 0.5) * 4;
                break;
        }

        const particula = crearParticula(x, y, tipo);
        contenedor.appendChild(particula);

        let opacidad = 1;
        let escala = 1;
        let vida = 0;
        const vidaMax = 100 + Math.random() * 100;

        function animar() {
            if (vida >= vidaMax) {
                contenedor.removeChild(particula);
                return;
            }

            vida++;
            particula.style.left = `${parseFloat(particula.style.left) + dx}px`;
            particula.style.top = `${parseFloat(particula.style.top) + dy}px`;
            
            if (vida < vidaMax * 0.7) {
                opacidad = 1;
            } else {
                opacidad = 1 - (vida - vidaMax * 0.7) / (vidaMax * 0.3);
            }
            
            escala = 1 - vida / vidaMax;
            
            particula.style.opacity = opacidad;
            particula.style.transform = `scale(${escala})`;

            requestAnimationFrame(animar);
        }

        requestAnimationFrame(animar);
    }

    return setInterval(emitirParticula, 50);
}

document.addEventListener('DOMContentLoaded', () => {
    const tarjetasTipo = document.querySelectorAll('.tarjeta-tipo');
    
    tarjetasTipo.forEach(tarjeta => {
        let intervalo;
        tarjeta.addEventListener('mouseenter', () => {
            intervalo = animarParticulas(tarjeta);
        });
        tarjeta.addEventListener('mouseleave', () => {
            clearInterval(intervalo);
        });
    });
});