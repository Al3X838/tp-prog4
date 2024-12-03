document.addEventListener('DOMContentLoaded', function () {
    const apiUrl = '/paises'; // define la URL 
    const paisesList = document.getElementById('paises-list');

    function loadPaises() {
        fetch(apiUrl, { method: 'GET' })
            .then(response => response.json())
            .then(data => {
                if (data.success && data.paises) {
                    paisesList.innerHTML = data.paises.map(pais => `
                        <tr>
                            <td>${pais.PAIS}</td>
                            <td>${pais.NOMBRE}</td>
                            <td>
                                <button class="btn btn-primary" onclick="editPais(${pais.PAIS})">Actualizar</button>
                                <button class="btn btn-outline-danger" onclick="confirmDelete(${pais.PAIS})">Eliminar</button>
                            </td>
                        </tr>
                    `).join('');
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Error al cargar los países.',
                        confirmButtonText: 'Aceptar'
                    });
                }
            })
            .catch(error => {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Error en la conexión con el servidor.',
                    confirmButtonText: 'Aceptar'
                });
            });
    }

    window.editPais = function (id) {
        window.location.href = `upd_pais.html?id=${id}`;
    };

    window.confirmDelete = function (id) {
        Swal.fire({
            title: '¿Estás seguro?',
            text: 'Esta acción eliminará el país de forma permanente.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                deletePais(id, loadPaises);
            }
        });
    };

    function deletePais(id, callback) {
        fetch(`${apiUrl}/delete/${id}`, { method: 'DELETE' })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Éxito',
                        text: 'El país fue eliminado exitosamente.',
                        confirmButtonText: 'Aceptar'
                    });
                    callback();
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: data.error || 'Error al eliminar el país.',
                        confirmButtonText: 'Aceptar'
                    });
                }
            })
            .catch(error => {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Error en la conexión con el servidor.',
                    confirmButtonText: 'Aceptar'
                });
                console.error('Error al eliminar el país:', error);
            });
    }

    loadPaises();
});
