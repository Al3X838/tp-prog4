document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('add-categoria-form');

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
                Swal.fire({
                    icon: 'success',
                    title: 'Categoría agregada',
                    text: 'La categoría se ha agregado correctamente.',
                    confirmButtonText: 'Aceptar'
                }).then(() => {
                    window.location.href = '../list_categorias.html'; // Redirige tras el éxito
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: data.error || 'Error al agregar la categoría.',
                    confirmButtonText: 'Aceptar'
                });
            }
        })
        .catch(error => {
            console.error('Error al agregar la categoría:', error.message);
            Swal.fire({
                icon: 'error',
                title: 'Error de conexión',
                text: 'No se pudo conectar con el servidor para agregar la categoría.',
                confirmButtonText: 'Aceptar'
            });
        });
    });
});
