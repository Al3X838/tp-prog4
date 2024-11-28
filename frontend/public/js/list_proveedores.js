document.addEventListener('DOMContentLoaded', function () {
    const proveedorList = document.getElementById('proveedores-list'); // aca se va a mostrar todo (id del tbody )
   
    function loadProveedores() {
        fetch('/proveedores', { method: 'GET' }) // solicita al sevidor para obtener los empleados
            .then(response => response.json())
            .then(data => {

                let proveedores = data.proveedores;
                console.log(proveedores);
                console.log(data);

                if (data.success !== false) {
                                            // recorre cada empleado en el array y genera el <tr> (table row)
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
                    alert(data.error || 'Error al cargar empleados.');
                }
            })
            .catch(error => {
                alert('Error en la conexión con el servidor.');
                console.error('Error al cargar empleados:', error);
            });
    }

    /*
    window.mostrarDetalles = function (id) {
        const detalles = document.getElementById(`detalles${id}`);
        if (detalles.classList.contains('d-none')) {
            detalles.classList.remove('d-none'); // Mostrar detalles
        } else {
            detalles.classList.add('d-none'); // Ocultar detalles
        }
    };
    */


    window.editProveedor = function (id) { 
        window.location.href = `upd_proveedor.html?id=${id}`;
    };

    window.confirmDelete = function (id) {
        if (confirm('¿Estás seguro de que quieres eliminar este proveedor?')) {
            deleteProveedor(id, loadProveedores);

        }
    };

    function deleteProveedor(id, callback) {
        fetch(`/proveedores/delete/${id}`, { method: 'DELETE' }) // solicitud htpp
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    callback(); // recarga la lista
                } else {
                    alert(data.error || 'Error al eliminar el empleado.');
                }
            })
            .catch(error => {
                alert('Error en la conexión con el servidor.');
                console.error('Error al eliminar proveedor:', error);
            });
    }

    loadProveedores(); // carga la pagina
});
