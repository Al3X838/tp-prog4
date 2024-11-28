// funcion para crear la ventana
function crearVentanaEmergente() {
    // Verifica si ya existe una ventana
    if (document.getElementById('ventana-alerta')) {
        return;
    }
    // crea el div
    const ventana = document.createElement('div');
    ventana.id = 'ventana-alerta';
    ventana.style.cssText = `
        display: none;
        position: fixed;
        z-index: 1000;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(5px);
    `;

    // el div para el contenido
    const ventanaContent = document.createElement('div');
    ventanaContent.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        padding: 20px;
        border-radius: 10px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
        width: 90%;
        max-width: 400px;
        text-align: center;
    `;

    
    /*
    // no anda
    const closeButton = document.createElement('span');
    closeButton.id = 'close-ventana';
    closeButton.textContent = 'x';
    closeButton.style.cssText = `
        position: absolute;
        top: 10px;
        right: 20px;
        font-size: 18px;
        cursor: pointer;
    `;
    */
    

    // elemento para mostrar el mensaje
    const mensaje = document.createElement('p');
    mensaje.style.cssText = `
        margin: 0;
        
    `;
    const gif = document.createElement('img');
    gif.style.cssText = `
        display: none;
        margin: 10px auto;
        max-width: 250px;
        height: 250px;
        object-fit: contain;
    `;
    gif.id = 'ventana-gif';

    // agrega los elementos al DOM
   // ventanaContent.appendChild(closeButton);
    ventanaContent.appendChild(mensaje);
    ventana.appendChild(ventanaContent);
    ventanaContent.appendChild(gif);
    ventanaContent.appendChild(gif);
    document.body.appendChild(ventana);

}

// funcion para mostrar la ventana
function mostrarVentana(mensaje, b1) {
    crearVentanaEmergente();
    const ventana = document.getElementById('ventana-alerta');
    const ventanaMensaje = ventana.querySelector('p');
    let gif = document.getElementById('ventana-gif');
    ventanaMensaje.textContent = mensaje;
    
    if (b1 === 1) {
        gif.src = "../img/no-emotiguy.gif";
        gif.style.display = 'block';
    } else {
        gif.src = "../img/alpelo1.gif";
        gif.style.display = 'block';
    }

    ventana.style.display = 'block';
}




function cerrarVentana() {
    const ventana = document.getElementById('ventana-alerta');
    ventana.style.display = 'none';
}


window.mostrarVentana = mostrarVentana;
window.cerrarVentana = cerrarVentana;
