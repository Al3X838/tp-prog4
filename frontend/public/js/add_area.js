document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('add-area-form');
    const cancelButton = document.getElementById('cancel-button'); // Botón de cancelar


    form.addEventListener('submit', function (event) {
        event.preventDefault();
        const nombre = document.getElementById('nombre').value.trim();

        fetch('/areas/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Área agregada',
                    text: 'El área se ha agregado correctamente.',
                    confirmButtonText: 'Aceptar'
                }).then(() => {
                    history.go(-1);
                    history.replaceState(null, '', '/list_areas.html'); // Cambiar la URL actual a /list_area
                    history.replaceState(null, '', '/home.html'); 
                    setTimeout(() => {
                        location.reload(); // Asegura que la página se recargue
                    }, 100);
                    window.location.href = '/list_areas.html'; // Redirige tras el éxito
                    
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: data.error || 'Error al agregar el área.',
                    confirmButtonText: 'Aceptar'
                });
            }
        })
        .catch(error => {
            console.error('Error al agregar área:', error.message);
            Swal.fire({
                icon: 'error',
                title: 'Error de conexión',
                text: 'No se pudo conectar con el servidor para agregar el área.',
                confirmButtonText: 'Aceptar'
            });
        });
    });
    cancelButton.addEventListener('click', function () {
        window.location.href = '../list_areas.html'; // Regresa a la página anterior
    });
});

