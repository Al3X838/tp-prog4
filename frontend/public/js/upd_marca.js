document.addEventListener('DOMContentLoaded', function () {
    const apiUrl = '/marcas';
    const form = document.getElementById('update-marca-form');
    const marcaIdInput = document.getElementById('marca-id');
    const marcaNameInput = document.getElementById('marca-name');
    const errorMessage = document.getElementById('error-message');
    const cancelButton = document.getElementById('cancel-button'); // Botón de cancelar


    const urlParams = new URLSearchParams(window.location.search);
    const marcaId = urlParams.get('id');

    if (marcaId) {
        marcaIdInput.value = marcaId;

        fetch(`${apiUrl}/marca/${marcaId}`, { method: 'GET' })
            .then(response => response.json())
            .then(data => {
                if (data.success && data.marca) {
                    marcaNameInput.value = data.marca.NOMBRE;
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'No se encontró la marca.'
                    });
                }
            })
            .catch(error => {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Error al obtener la marca.'
                });
                console.error('Error:', error);
            });
    }

    form.addEventListener('submit', function (event) {
        event.preventDefault();
        const newName = marcaNameInput.value.trim();

        fetch(`${apiUrl}/update/${marcaId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre: newName })
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    Swal.fire({
                        icon: 'success',
                        title: '¡Actualizado!',
                        text: 'La marca ha sido actualizada correctamente.'
                    }).then(() => {
                        history.go(-1);
                        history.replaceState(null, '', '/list_marcas.html'); // Cambiar la URL actual a /list_area
                        history.replaceState(null, '', '/home.html');
                        setTimeout(() => {
                            location.reload(); // Asegura que la página se recargue
                        }, 100);
                        window.location.href = '/list_marcas.html'; // Redirige tras el éxito
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: data.error || 'Error al actualizar la marca.'
                    });
                }
            })
            .catch(error => {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Error en la conexión con el servidor.'
                });
                console.error('Error al actualizar marca:', error);
            });
    });

    cancelButton.addEventListener('click', function () {
        window.location.href = '../list_marcas.html'; // Regresa a la página anterior
    });

});
