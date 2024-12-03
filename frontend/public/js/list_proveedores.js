document.addEventListener('DOMContentLoaded', function () {
    const proveedorList = document.getElementById('proveedores-list'); // Aquí se va a mostrar todo (id del tbody)
   
    function loadProveedores() {
        fetch('/proveedores', { method: 'GET' }) // Solicita al servidor para obtener los proveedores
            .then(response => response.json())
            .then(data => {

                let proveedores = data.proveedores;
                console.log(proveedores);
                console.log(data);

                if (data.success !== false) {
                    // Recorre cada proveedor en el array y genera el <tr> (table row)
                    proveedorList.innerHTML = proveedores.map(proveedor => `
                        <tr>
                            <td>${proveedor.PROVEEDOR}</td>
                            <td>${proveedor.NOMBRE}</td>
                            <td>${proveedor.DIRECCION}</td>
                            <td>${proveedor.TELEFONO}</td>
                            <td>${proveedor.EMAIL}</td>
                            <td>
                                <button class="btn btn-primary" onclick="editProveedor(${proveedor.PROVEEDOR})">Actualizar</button>
                                <button class="btn btn-danger" onclick="confirmDelete(${proveedor.PROVEEDOR})">Eliminar</button>
                            </td>
                        </tr>
                    `).join('');
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: data.error || 'Error al cargar proveedores.',
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
                console.error('Error al cargar proveedores:', error);
            });
    }

    window.editProveedor = function (id) {
        window.location.href = `upd_proveedor.html?id=${id}`;
    };

    window.confirmDelete = function (id) {
        Swal.fire({
            title: '¿Estás seguro?',
            text: 'Esta acción eliminará al proveedor de forma permanente.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                deleteProveedor(id, loadProveedores);
            }
        });
    };

    function deleteProveedor(id, callback) {
        fetch(`/proveedores/delete/${id}`, { method: 'DELETE' }) // Solicitud HTTP
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Éxito',
                        text: 'El proveedor fue eliminado exitosamente.',
                        confirmButtonText: 'Aceptar'
                    });
                    callback(); // Recarga la lista
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: data.error || 'Error al eliminar el proveedor.',
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
                console.error('Error al eliminar proveedor:', error);
            });
    }

    loadProveedores(); // Carga la página
});
