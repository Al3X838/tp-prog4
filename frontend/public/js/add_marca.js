document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('add-marca-form');

    form.addEventListener('submit', function (event) {
        event.preventDefault();
        const nombre = document.getElementById('nombre').value.trim();

        fetch('/marcas/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Marca agregada',
                    text: 'La marca se ha agregado correctamente.',
                    confirmButtonText: 'Aceptar'
                }).then(() => {
                    window.location.href = '../list_marcas.html'; // Redirige después de cerrar la alerta
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: data.error || 'Error al agregar la marca.',
                    confirmButtonText: 'Aceptar'
                });
            }
        })
        .catch(error => {
            console.error('Error al agregar marca:', error.message);
            Swal.fire({
                icon: 'error',
                title: 'Error de conexión',
                text: 'No se pudo conectar con el servidor. Por favor, inténtalo de nuevo.',
                confirmButtonText: 'Aceptar'
            });
        });
    });
});
