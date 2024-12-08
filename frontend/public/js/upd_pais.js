document.addEventListener('DOMContentLoaded', function () {
    const apiUrl = '/paises';
    const form = document.getElementById('update-pais-form');
    const paisIdInput = document.getElementById('pais-id');
    const paisNameInput = document.getElementById('pais-name');
    const errorMessage = document.getElementById('error-message');
    const cancelButton = document.getElementById('cancel-button'); // Botón de cancelar


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
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'No se encontró el país.'
                    });
                }
            })
            .catch(error => {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Error al obtener el país.'
                });
                console.error('Error:', error);
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
            if (data.success) {
                Swal.fire({
                    icon: 'success',
                    title: '¡Actualizado!',
                    text: 'El país ha sido actualizado correctamente.'
                }).then(() => {
                    history.go(-1);
                    history.replaceState(null, '', '/list_paises.html'); // Cambiar la URL actual a /list_area
                    history.replaceState(null, '', '/home.html'); 
                    setTimeout(() => {
                        location.reload(); // Asegura que la página se recargue
                    }, 100);
                    window.location.href = '/list_paises.html'; // Redirige tras el éxitopaises
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: data.error || 'Error al actualizar el país.'
                });
            }
        })
        .catch(error => {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error en la conexión con el servidor.'
            });
            console.error('Error al actualizar el país:', error);
        });
    });
    cancelButton.addEventListener('click', function () {
        window.location.href = '../list_paises.html'; // Regresa a la página anterior
    });

});
