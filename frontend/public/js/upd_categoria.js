document.addEventListener('DOMContentLoaded', function () {
    const apiUrl = '/categorias';
    const form = document.getElementById('update-categoria-form');
    const categoriaIdInput = document.getElementById('categoria-id');
    const categoriaNameInput = document.getElementById('categoria-name');
    const errorMessage = document.getElementById('error-message');
    const cancelButton = document.getElementById('cancel-button'); // Botón de cancelar


    const urlParams = new URLSearchParams(window.location.search);
    const categoriaId = urlParams.get('id');

    if (categoriaId) {
        categoriaIdInput.value = categoriaId;

        fetch(`${apiUrl}/categoria/${categoriaId}`, { method: 'GET' })
            .then(response => response.json())
            .then(data => {
                if (data.success && data.categoria) {
                    categoriaNameInput.value = data.categoria.NOMBRE;
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'No se encontró la categoría.'
                    });
                }
            })
            .catch(error => {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Error al obtener la categoría.'
                });
            });
    }

    form.addEventListener('submit', function (event) {
        event.preventDefault();
        const newName = categoriaNameInput.value.trim();

        fetch(`${apiUrl}/update/${categoriaId}`, {
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
                    text: 'La categoría ha sido actualizada correctamente.'
                }).then(() => {
                    history.go(-1);
                    history.replaceState(null, '', '/list_categorias.html'); // Cambiar la URL actual a /list_area
                    history.replaceState(null, '', '/home.html'); 
                    setTimeout(() => {
                        location.reload(); // Asegura que la página se recargue
                    }, 100);
                    window.location.href = '/list_categorias.html'; // Redirige tras el éxito
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: data.error || 'Error al actualizar la categoría.'
                });
            }
        })
        .catch(error => {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error en la conexión con el servidor.'
            });
            console.error('Error al actualizar la categoría:', error);
        });
    });
    cancelButton.addEventListener('click', function () {
        window.location.href = '../list_categorias.html'; // Regresa a la página anterior
    });

});
