document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('add-pais-form');
    const cancelButton = document.getElementById('cancel-button'); // Botón de cancelar


    form.addEventListener('submit', function (event) {
        event.preventDefault();
        const nombre = document.getElementById('nombre').value.trim();

        fetch('/paises/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'País agregado',
                    text: 'El país se ha agregado correctamente.',
                    confirmButtonText: 'Aceptar'
                }).then(() => {
                    history.go(-1);
                    history.replaceState(null, '', '/list_paises.html'); // Cambiar la URL actual a /list_area
                    history.replaceState(null, '', '/home.html'); 
                    setTimeout(() => {
                        location.reload(); // Asegura que la página se recargue
                    }, 100);
                    window.location.href = '/list_paises.html'; // Redirige tras el éxito
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: data.error || 'Error al agregar el país.',
                    confirmButtonText: 'Aceptar'
                });
            }
        })
        .catch(error => {
            console.error('Error al agregar el país:', error.message);
            Swal.fire({
                icon: 'error',
                title: 'Error de conexión',
                text: 'No se pudo conectar con el servidor. Por favor, inténtalo de nuevo.',
                confirmButtonText: 'Aceptar'
            });
        });
    });
    cancelButton.addEventListener('click', function () {
        window.location.href = '../list_paises.html'; // Regresa a la página anterior
    });

});
