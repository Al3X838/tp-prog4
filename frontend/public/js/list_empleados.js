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
                            <td>${empleado.NOMBRE}</td>
                            <td>${empleado.APELLIDO}</td>
                            <td>${empleado.DIRECCION}</td>
                            <td>${empleado.TELEFONO}</td>
                            <td>${empleado.EMAIL}</td>
                            <td>
                                <button class="btn btn-primary" onclick="editEmpleado(${empleado.EMPLEADO})">Actualizar</button>
                                <button class="btn btn-outline-danger" onclick="confirmDelete(${empleado.EMPLEADO})">Eliminar</button>
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
