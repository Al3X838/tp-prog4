document.addEventListener('DOMContentLoaded', function () {
    const empleadosList = document.getElementById('empleados-list'); // Aquí se va a mostrar todo (id del tbody)
   
    function loadEmpleados() {
        fetch('/empleados', { method: 'GET' }) // Solicita al servidor para obtener los empleados
            .then(response => response.json())
            .then(data => {

                let empleados = data.empleados;
                console.log(empleados);
                console.log(data);

                if (data.success !== false) {
                    // Recorre cada empleado en el array y genera el <tr> (table row)
                    empleadosList.innerHTML = empleados.map(empleado => `
                        <tr>
                            <td>${empleado.EMPLEADO}</td>
                            <td>${empleado.EMPLEADO_NOMBRE} ${empleado.EMPLEADO_APELLIDO}</td>
                            <td>${empleado.DIRECCION}</td>
                            <td>${empleado.TELEFONO}</td>
                            <td>${empleado.EMAIL}</td>
                            <td>
                                <button class="btn btn-primary" onclick="editEmpleado(${empleado.EMPLEADO})">Actualizar</button>
                                <button class="btn btn-danger" onclick="confirmDelete(${empleado.EMPLEADO})">Eliminar</button>
                                <button class="btn btn-info" onclick="mostrarDetalles(${empleado.EMPLEADO})">Ver más</button>
                            </td>
                        </tr>
                        <tr id="detalles${empleado.EMPLEADO}" class="d-none bg-light">
                            <td colspan="6">
                                <div class="detalles-content p-3 border rounded shadow-sm">
                                    <div class="detalles-content">
                                        <p><strong>Pais:</strong> ${empleado.PAIS_NOMBRE} (${empleado.PAIS_ID})</p>
                                        <p><strong>Area:</strong> ${empleado.AREA_NOMBRE} (${empleado.AREA_ID})</p>
                                        <p><strong>Fecha de ingreso:</strong> ${empleado.FECHA_INGRESO}</p>
                                        <p><strong>Salario:</strong> ${empleado.SALARIO}</p>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    `).join(''); // Genera el HTML de la tabla con los datos
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: data.error || 'Error al cargar empleados.',
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
                console.error('Error al cargar empleados:', error);
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

    window.editEmpleado = function (id) {
        window.location.href = `upd_empleado.html?id=${id}`;
    };

    window.confirmDelete = function (id) {
        Swal.fire({
            title: '¿Estás seguro?',
            text: 'Esta acción eliminará al empleado de forma permanente.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                deleteEmpleado(id, loadEmpleados);
            }
        });
    };

    function deleteEmpleado(id, callback) {
        fetch(`/empleados/delete/${id}`, { method: 'DELETE' })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Éxito',
                        text: 'El empleado fue eliminado exitosamente.',
                        confirmButtonText: 'Aceptar'
                    });
                    callback(); // Recarga la lista de empleados
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: data.error || 'Error al eliminar el empleado.',
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
                console.error('Error al eliminar el empleado:', error);
            });
    }

    loadEmpleados(); // Carga la página con los empleados
});
