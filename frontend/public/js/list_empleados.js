document.addEventListener('DOMContentLoaded', function () {
    const empleadosList = document.getElementById('empleados-list'); // aca se va a mostrar todo (id del tbody )
   
    function loadEmpleados() {
        fetch('/empleados', { method: 'GET' }) // solicita al sevidor para obtener los empleados
            .then(response => response.json())
            .then(data => {

                let empleados = data.empleados;
                console.log(empleados);
                console.log(data);

                if (data.success !== false) {
                                            // recorre cada empleado en el array y genera el <tr> (table row)
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
                                <button class="btn btn-info" onclick="mostrarDetalles(${empleado.EMPLEADO})">Ver mas</button>
                            </td>
                        </tr>
                        <tr id="detalles${empleado.EMPLEADO}" class="d-none bg-light">
                            <td colspan="6">
                                <div class="detalles-content  p-3 border rounded shadow-sm">
                                    <div class="detalles-content ">
                                        <p><strong>Pais:</strong> ${empleado.PAIS_NOMBRE}(${empleado.PAIS_ID})</p>
                                        <p><strong>Area:</strong> ${empleado.AREA_NOMBRE}(${empleado.AREA_ID})</p>
                                        <p><strong>Fecha de ingreso:</strong> ${empleado.FECHA_INGRESO}</p>
                                        <p><strong>Salario:</strong> ${empleado.SALARIO}</p>
                                    </div>

                                </div>
                            </td>
                        </tr>
                    `).join(''); // genera el html de la tabla con los datos
                } else {
                    alert(data.error || 'Error al cargar empleados.');
                }
            })
            .catch(error => {
                alert('Error en la conexión con el servidor.');
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


    window.editEmpleado = function (id) { // te redirige a la pagina para actualizar los datos pasandole el id correspondiente
        window.location.href = `upd_empleado.html?id=${id}`;
    };

    window.confirmDelete = function (id) {
        if (confirm('¿Estás seguro de que quieres eliminar este empleado?')) {
            deleteEmpleado(id, loadEmpleados);

            // confirm es el que muestra la alerta 
            // si confirma llama a "deleteEmpleado" y lo borra
        }
    };

    function deleteEmpleado(id, callback) {
        fetch(`/empleados/delete/${id}`, { method: 'DELETE' }) // solicitud htpp
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    callback(); // recarga la lista de empleado
                } else {
                    alert(data.error || 'Error al eliminar el empleado.');
                }
            })
            .catch(error => {
                alert('Error en la conexión con el servidor.');
                console.error('Error al eliminar empleado:', error);
            });
    }

    loadEmpleados(); // carga la pagina
});
