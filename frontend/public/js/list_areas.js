document.addEventListener('DOMContentLoaded', function () {
    const apiUrl = '/areas'; // define la URL 
    const areasList = document.getElementById('areas-list');
    const errorMessage = document.getElementById('error-message');

    // Función para cargar las áreas
    function loadAreas() {
        fetch(apiUrl, { method: 'GET' })
            .then(response => response.json())
            .then(data => {
                if (data.success && data.areas) {
                    areasList.innerHTML = data.areas.map(area => `
                        <tr>
                            <td>${area.AREA}</td>
                            <td>${area.NOMBRE}</td>
                            <td>
                                <button class="btn btn-primary" onclick="editArea(${area.AREA})">Actualizar</button>
                                <button class="btn btn-outline-danger" onclick="confirmDelete(${area.AREA})">Eliminar</button>
                            </td>
                        </tr>
                    `).join('');
                    errorMessage.style.display = 'none'; // Oculta el mensaje de error si la carga es exitosa
                } else {
                    showError('Error al cargar las áreas.');
                }
            })
            .catch(error => {
                console.error('Error al cargar las áreas:', error);
                showError('Error en la conexión con el servidor.');
            });
    }

    // Función para mostrar errores con SweetAlert2
    function showError(message) {
        errorMessage.style.display = 'block';
        errorMessage.innerText = message;
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: message,
            confirmButtonText: 'Aceptar'
        });
    }

    // Función para redirigir a la página de actualización
    window.editArea = function (id) {
        window.location.href = `upd_area.html?id=${id}`;
    };

    // Función para confirmar eliminación usando SweetAlert2
    window.confirmDelete = function (id) {
        Swal.fire({
            title: '¿Estás seguro?',
            text: 'No podrás recuperar esta área si la eliminas.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                deleteArea(id, loadAreas);
            }
        });
    };

    // Función para eliminar un área
    function deleteArea(id, callback) {
        fetch(`${apiUrl}/delete/${id}`, { method: 'DELETE' })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Área eliminada',
                        text: 'El área fue eliminada exitosamente.',
                        confirmButtonText: 'Aceptar'
                    });
                    callback(); // Recargar las áreas después de eliminar
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: data.error || 'Error al eliminar el área.',
                        confirmButtonText: 'Aceptar'
                    });
                }
            })
            .catch(error => {
                console.error('Error al eliminar área:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error de conexión',
                    text: 'No se pudo conectar con el servidor para eliminar el área.',
                    confirmButtonText: 'Aceptar'
                });
            });
    }

    // Cargar las áreas al iniciar
    loadAreas();
});
