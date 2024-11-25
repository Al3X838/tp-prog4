document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('add-categoria-form');
    const errorMessage = document.getElementById('error-message');

    form.addEventListener('submit', function (event) {
        event.preventDefault();
        const nombre = document.getElementById('nombre').value.trim();

        fetch('/categorias/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                window.location.href = '../list_categorias.html';
            } else {
                errorMessage.textContent = data.error || 'Error al agregar la categoria.';  // 
            }
        })
        .catch(error => {
            errorMessage.textContent = 'Error en la conexión con el servidor.';
            console.error('Error al agregar la categoria:', error.message);
        });
    });
});