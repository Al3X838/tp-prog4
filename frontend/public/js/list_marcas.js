document.addEventListener('DOMContentLoaded', function () {
    const apiUrl = '/marcas'; // Define la URL
    const marcasList = document.getElementById('marcas-list');

    function loadMarcas() {
        fetch(apiUrl, { method: 'GET' })
            .then(response => response.json())
            .then(data => {
                if (data.success && data.marcas) {
                    marcasList.innerHTML = data.marcas.map(marca => `
                        <tr>
                            <td>${marca.MARCA}</td>
                            <td>${marca.NOMBRE}</td>
                            <td>
                                <button class="btn btn-primary" onclick="editMarca(${marca.MARCA})">Actualizar</button>
                                <button class="btn btn-outline-danger" onclick="confirmDelete(${marca.MARCA})">Eliminar</button>
                            </td>
                        </tr>
                    `).join('');
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Error al cargar las marcas.',
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

    window.editMarca = function (id) {
        window.location.href = `upd_marca.html?id=${id}`;
    };

    window.confirmDelete = function (id) {
        Swal.fire({
            title: '¿Estás seguro?',
            text: 'Esta acción eliminará la marca de forma permanente.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                deleteMarca(id, loadMarcas);
            }
        });
    };

    function deleteMarca(id, callback) {
        fetch(`${apiUrl}/delete/${id}`, { method: 'DELETE' })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Éxito',
                        text: 'La marca fue eliminada exitosamente.',
                        confirmButtonText: 'Aceptar'
                    });
                    callback();
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: data.error || 'Error al eliminar la marca.',
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
                console.error('Error al eliminar la marca:', error);
            });
    }

    loadMarcas();
});
