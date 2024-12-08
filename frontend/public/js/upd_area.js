document.addEventListener('DOMContentLoaded', function () {
    const apiUrl = '/areas';
    const form = document.getElementById('update-area-form');
    const areaIdInput = document.getElementById('area-id');
    const areaNameInput = document.getElementById('area-name');

    const urlParams = new URLSearchParams(window.location.search);
    const areaId = urlParams.get('id');

    if (areaId) {
        areaIdInput.value = areaId;

        fetch(`${apiUrl}/area/${areaId}`, { method: 'GET' })
            .then(response => response.json())
            .then(data => {
                if (data.success && data.area) {
                    areaNameInput.value = data.area.NOMBRE;
                } else {
                    // Error al obtener el área
                    Swal.fire({
                        icon: 'error',
                        title: 'No se encontró el área',
                        text: 'Por favor, inténtalo de nuevo.',
                    });
                }
            })
            .catch(error => {
                // Error al obtener el área
                Swal.fire({
                    icon: 'error',
                    title: 'Error al obtener el área',
                    text: 'Hubo un problema al intentar cargar los datos.',
                });
            });
    }

    form.addEventListener('submit', function (event) {
        event.preventDefault();
        const newName = areaNameInput.value.trim();

        fetch(`${apiUrl}/update/${areaId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre: newName })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Success - Redirige después de la actualización
                Swal.fire({
                    icon: 'success',
                    title: 'Área Actualizada',
                    text: 'La información del área ha sido actualizada exitosamente.',
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
                // Error al actualizar el área
                Swal.fire({
                    icon: 'error',
                    title: 'Error al actualizar',
                    text: data.error || 'Hubo un error al actualizar el área.',
                });
            }
        })
        .catch(error => {
            // Error al hacer la solicitud
            Swal.fire({
                icon: 'error',
                title: 'Error en la conexión',
                text: 'No se pudo conectar con el servidor. Intenta nuevamente más tarde.',
            });
            console.error('Error al actualizar área:', error);
        });
    });
});
