document.addEventListener('DOMContentLoaded', function () {
    const apiUrl = '/paises';
    const form = document.getElementById('update-pais-form');
    const paisIdInput = document.getElementById('pais-id');
    const paisNameInput = document.getElementById('pais-name');
    const errorMessage = document.getElementById('error-message');

    const urlParams = new URLSearchParams(window.location.search);
    const paisId = urlParams.get('id');

    if (paisId) {
        paisIdInput.value = paisId;

        fetch(`${apiUrl}/pais/${paisId}`, { method: 'GET' })
            .then(response => response.json())
            .then(data => {
                if (data.success && data.pais) {
                    paisNameInput.value = data.pais.NOMBRE;
                } else {
                    errorMessage.textContent = 'No se encontró el pais.'; 
                }
            })
            .catch(error => {
                errorMessage.textContent = 'Error al obtener el pais.';
            });
    }

    form.addEventListener('submit', function (event) {
        event.preventDefault();
        const newName = paisNameInput.value.trim();

        fetch(`${apiUrl}/update/${paisId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre: newName })
        })
        .then(response => response.json())
        .then(data => {
            console.log('respuesta upd_pais', response);
            if (data.success) {
                console.log(response.status);
                window.location.href = '/list_paises.html';
            } else {
                errorMessage.textContent = data.error || 'Error al actualizar el paises.';  // *** MODIFICACIÓN ***
            }
        })
        .catch(error => {
            errorMessage.textContent = 'Error en la conexión con el servidor.';
            console.error('Error al actualizar el pais:', error);
        });
    });
});