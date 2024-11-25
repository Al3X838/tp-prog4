document.addEventListener('DOMContentLoaded', function () {
    const apiUrl = '/areas';
    const form = document.getElementById('update-area-form');
    const areaIdInput = document.getElementById('area-id');
    const areaNameInput = document.getElementById('area-name');
    const errorMessage = document.getElementById('error-message');

    
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
                    errorMessage.textContent = 'No se encontró el área.';  // *** MODIFICACIÓN ***
                }
            })
            .catch(error => {
                errorMessage.textContent = 'Error al obtener el área.';
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
                window.location.href = '/list_areas.html';
            } else {
                errorMessage.textContent = data.error || 'Error al actualizar el área.';  // *** MODIFICACIÓN ***
            }
        })
        .catch(error => {
            errorMessage.textContent = 'Error en la conexión con el servidor.';
            console.error('Error al actualizar área:', error);
        });
    });
});