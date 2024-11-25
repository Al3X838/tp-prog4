document.addEventListener('DOMContentLoaded', function () {
    const apiUrl = '/categorias';
    const form = document.getElementById('update-categoria-form');
    const categoriaIdInput = document.getElementById('categoria-id');
    const categoriaNameInput = document.getElementById('categoria-name');
    const errorMessage = document.getElementById('error-message');

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
                    errorMessage.textContent = 'No se encontró la categoria.';  // *** MODIFICACIÓN ***
                }
            })
            .catch(error => {
                errorMessage.textContent = 'Error al obtener la categoria.';
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
                window.location.href = '/list_categorias.html';
            } else {
                errorMessage.textContent = data.error || 'Error al actualizar la categoria.';  // *** MODIFICACIÓN ***
            }
        })
        .catch(error => {
            errorMessage.textContent = 'Error en la conexión con el servidor.';
            console.error('Error al actualizar la categoria:', error);
        });
    });
});