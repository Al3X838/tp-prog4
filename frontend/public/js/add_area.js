document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('add-area-form');
    const errorMessage = document.getElementById('error-message');

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
                window.location.href = '../list_areas.html';
            } else {
                errorMessage.textContent = data.error || 'Error al agregar el área.';  
            }
        })
        .catch(error => {
            errorMessage.textContent = 'Error en la conexión con el servidor.';
            console.error('Error al agregar área:', error.message);
        });
    });
});