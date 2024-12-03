document.addEventListener('DOMContentLoaded', function () {
    const comprasList = document.getElementById('compras-list'); // Aquí se mostrará todo (id del tbody)

    // Función para cargar las compras
    function loadCompras() {
        fetch('/compras', { method: 'GET' }) // Solicita al servidor las compras
            .then(response => response.json())
            .then(data => {

                let compras = data.compras;
                console.log(compras);
                //console.log(data);

                if (data.success !== false) {
                    // Recorre cada compra en el array y genera el <tr> (table row)
                    comprasList.innerHTML = compras.map(compra => `
                        <tr>
                            <td>${compra.COMPRA}</td>
                            <td>${compra.PROVEEDOR_NOMBRE}</td>
                            <td>${compra.FECHA}</td>
                            <td>${compra.PRECIO_COSTO}</td>
                            <td>
                                <button class="btn btn-primary" onclick="editCompra(${compra.COMPRA})">Actualizar</button>
                                <button class="btn btn-danger" onclick="confirmDelete(${compra.COMPRA})">Eliminar</button>
                                <button class="btn btn-info" onclick="mostrarDetalles(${compra.COMPRA})">Ver más</button>
                            </td>
                        </tr>
                        <tr id="detalles${compra.COMPRA}" class="d-none bg-light">
                            <td colspan="5">
                                <div class="detalles-content p-3 border rounded shadow-sm">
                                    <div class="detalles-content">
                                        <p><strong>Proveedor:</strong> ${compra.PROVEEDOR_NOMBRE} (${compra.PROVEEDOR_ID})</p>
                                        <p><strong>Fecha:</strong> ${compra.FECHA}</p>
                                        <p><strong>Productos:</strong>${compra.PRODUCTO_NOMBRE} (${compras.PRODUCTO_ID})</p>
                        
                                    </div>
                                </div>
                            </td>
                        </tr>
                    `).join(''); // Genera el HTML de la tabla con los datos
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: data.error || 'Error al cargar las compras.',
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
                console.error('Error al cargar las compras:', error);
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

    window.editCompra = function (id) {
        window.location.href = `upd_compra.html?id=${id}`;
    };

    window.confirmDelete = function (id) {
        Swal.fire({
            title: '¿Estás seguro?',
            text: 'Esta acción eliminará la compra de forma permanente.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                deleteCompra(id, loadCompras);
            }
        });
    };

    function deleteCompra(id, callback) {
        fetch(`/compras/delete/${id}`, { method: 'DELETE' })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Éxito',
                        text: 'La compra fue eliminada exitosamente.',
                        confirmButtonText: 'Aceptar'
                    });
                    callback(); // Recarga la lista de compras
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: data.error || 'Error al eliminar la compra.',
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
                console.error('Error al eliminar la compra:', error);
            });
    }

    loadCompras(); // Carga la página con las compras
});
