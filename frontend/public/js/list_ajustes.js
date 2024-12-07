document.addEventListener('DOMContentLoaded', function () {
    const ajustesList = document.getElementById('ajustes-list'); // ID del tbody donde se mostrarán los ajustes

    function loadAjustes() {
        fetch('/ajustes', { method: 'GET' }) // Solicita al servidor la lista de ajustes
            .then(response => response.json())
            .then(data => {

                let ajustes = data.ajustes;
                console.log(ajustes);
                console.log(data);

                if (data.success !== false) {
                    // Recorre cada ajuste y genera el <tr> con detalles
                    ajustesList.innerHTML = ajustes.map(ajuste => `
                        <tr>
                            <td>${ajuste.AJUSTE}</td>
                            <td>${ajuste.FECHA}</td>
                            <td>${ajuste.TIPO_AJUSTE}</td>
                            <td>${ajuste.PRODUCTO_NOMBRE}</td>
                            <td>${ajuste.EMPLEADO_NOMBRE} ${ajuste.EMPLEADO_APELLIDO}</td>
                            <td>${ajuste.CANTIDAD}</td>
                            <td>
                                <button class="btn btn-primary" onclick="editAjuste(${ajuste.AJUSTE})">Actualizar</button>
                                <button class="btn btn-danger" onclick="confirmDelete(${ajuste.AJUSTE})">Eliminar</button>
                                <button class="btn btn-info" onclick="mostrarDetalles(${ajuste.AJUSTE})">Ver más</button>
                            </td>
                        </tr>
                        <tr id="detalles${ajuste.AJUSTE}" class="d-none bg-light">
                            <td colspan="7">
                                <div class="detalles-content p-3 border rounded shadow-sm">
                                    <div class="detalles-content">
                                        <p><strong>Producto:</strong> ${ajuste.PRODUCTO_NOMBRE} (${ajuste.PRODUCTO_ID})</p>
                                        <p><strong>Empleado:</strong> ${ajuste.EMPLEADO_NOMBRE} ${ajuste.EMPLEADO_APELLIDO}</p>
                                        <p><strong>Fecha:</strong> ${ajuste.FECHA}</p>
                                        <p><strong>Tipo de Ajuste:</strong> ${ajuste.TIPO_AJUSTE}</p>
                                        <p><strong>Cantidad:</strong> ${ajuste.CANTIDAD}</p>
                                        <p><strong>Precio Costo:</strong> ${ajuste.PRECIO_COSTO}</p>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    `).join(''); // Genera el HTML de la tabla con los datos
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: data.error || 'Error al cargar ajustes.',
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
                console.error('Error al cargar ajustes:', error);
            });
    }

    window.mostrarDetalles = function (id) {
        const detalles = document.getElementById(`detalles${id}`);
        if (detalles.classList.contains('d-none')) {
            detalles.classList.remove('d-none'); // Mostrar detalles
        } else {
            detalles.classList.add('d-none'); // Ocultar detalles
        }
    };

    window.editAjuste = function (id) {
        window.location.href = `upd_ajuste.html?id=${id}`;
    };

    window.confirmDelete = function (id) {
        Swal.fire({
            title: '¿Estás seguro?',
            text: 'Esta acción eliminará el ajuste de forma permanente.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                deleteAjuste(id, loadAjustes);
            }
        });
    };

    function deleteAjuste(id, callback) {
        fetch(`/ajustes/delete/${id}`, { method: 'DELETE' })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Éxito',
                        text: 'El ajuste fue eliminado exitosamente.',
                        confirmButtonText: 'Aceptar'
                    });
                    callback(); // Recarga la lista de ajustes
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: data.error || 'Error al eliminar el ajuste.',
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
                console.error('Error al eliminar el ajuste:', error);
            });
    }

    loadAjustes(); // Carga la página con los ajustes
});
