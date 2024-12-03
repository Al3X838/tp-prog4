document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('add-empleado-form');

    // Cargar lista de países
    const loadCountries = () => {
        fetch('/paises/')
            .then(response => {
                if (!response.ok) throw new Error('Network response was not ok');
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    const paisSelect = document.getElementById('pais');
                    data.paises.forEach(pais => {
                        const option = document.createElement('option');
                        option.value = pais.PAIS;
                        option.textContent = pais.NOMBRE;
                        paisSelect.appendChild(option);
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: data.error || 'Error al cargar la lista de países.',
                        confirmButtonText: 'Aceptar'
                    });
                }
            })
            .catch(error => {
                console.error('Error al cargar países:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error de conexión',
                    text: 'No se pudo conectar con el servidor para cargar la lista de países.',
                    confirmButtonText: 'Aceptar'
                });
            });
    };

    // Cargar lista de áreas
    const loadAreas = () => {
        fetch('/areas/')
            .then(response => {
                if (!response.ok) throw new Error('Network response was not ok');
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    const areaSelect = document.getElementById('area');
                    data.areas.forEach(area => {
                        const option = document.createElement('option');
                        option.value = area.AREA;
                        option.textContent = area.NOMBRE;
                        areaSelect.appendChild(option);
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: data.error || 'Error al cargar la lista de áreas.',
                        confirmButtonText: 'Aceptar'
                    });
                }
            })
            .catch(error => {
                console.error('Error al cargar áreas:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error de conexión',
                    text: 'No se pudo conectar con el servidor para cargar la lista de áreas.',
                    confirmButtonText: 'Aceptar'
                });
            });
    };

    // Llamar a las funciones para cargar países y áreas
    loadCountries();
    loadAreas();

    // Procesar el formulario
    form.addEventListener('submit', function (event) {
        event.preventDefault();

        const empleadoData = {
            nombre: document.getElementById('nombre').value.trim(),
            apellido: document.getElementById('apellido').value.trim(),
            direccion: document.getElementById('direccion').value.trim(),
            pais: document.getElementById('pais').value,
            telefono: document.getElementById('telefono').value.trim(),
            email: document.getElementById('email').value.trim(),
            area: document.getElementById('area').value,
            fecha_ingreso: document.getElementById('fecha_ingreso').value,
            fecha_salida: document.getElementById('fecha_salida').value || null,
            salario: document.getElementById('salario').value
        };

        fetch('/empleados/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(empleadoData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Empleado agregado',
                    text: 'El empleado se ha agregado correctamente.',
                    confirmButtonText: 'Aceptar'
                }).then(() => {
                    window.location.href = '/list_empleados.html'; // Redirige después de la confirmación
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: data.error || 'Error al agregar el empleado.',
                    confirmButtonText: 'Aceptar'
                });
            }
        })
        .catch(error => {
            console.error('Error al agregar empleado:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error de conexión',
                text: 'No se pudo conectar con el servidor para agregar el empleado.',
                confirmButtonText: 'Aceptar'
            });
        });
    });
});
