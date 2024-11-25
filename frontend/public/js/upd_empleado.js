document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('update-empleado-form'); //update-empleado-form es donde se van a enviar los datos actualizados
    const urlParams = new URLSearchParams(window.location.search); // busca la URL. Esto es lo que dps aparece como upd_empleado.html?id=12
    const empleadoId = urlParams.get('id'); // toma el valor del id correspondiente

    // Método para cargar la lista de países
    const loadCountries = () => {
        fetch('/paises/') // hace la solicitud del http get
            .then(response => {
                if (!response.ok) throw new Error('Network response was not ok');
                return response.json(); // convierte la respuesta del servidor en un objeto de javaScript
            })
            .then(data => {
                if (data.success) { // procesa los datos 👌
                    const paisSelect = document.getElementById('pais'); // busca <select> con el id de pais
                    data.paises.forEach(pais => { // itera cada pais recibido
                        const option = document.createElement('option'); // crea la etiqueta option
                        option.value = pais.PAIS; // asigna los valores al atributo
                        option.textContent = pais.NOMBRE; // asigna el nomrbre como texto visible
                        paisSelect.appendChild(option); // agrega el option al select
                    });
                } else {
                    alert(data.error || 'Error al cargar la lista de países.');
                }
            })
            .catch(error => console.error('Error al cargar países:', error)); // una especie de try catch (creo)
    };

    /*{
    "success": true,
    "paises": [
        { "PAIS": 1, "NOMBRE": "Estados Unidos" },
        { "PAIS": 2, "NOMBRE": "México" },
        { "PAIS": 3, "NOMBRE": "España" }
        ]
    }*/



    // Método para cargar la lista de áreas
    // pasa lo mismo quearriba
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
                    alert(data.error || 'Error al cargar la lista de áreas.');
                }
            })
            .catch(error => console.error('Error al cargar áreas:', error));
    };

    // Llama a la funcion y Carga listas al inicio
    loadCountries();
    loadAreas();

    // Cargar datos del empleado actual
    if (empleadoId) { // verifica si existe 
        fetch(`/empleados/empleado/${empleadoId}`, { method: 'GET' })
            .then(response => response.json())
            .then(data => {
                if (data.success && data.empleado) {
                    document.getElementById('nombre').value = data.empleado.NOMBRE;
                    document.getElementById('apellido').value = data.empleado.APELLIDO;
                    document.getElementById('direccion').value = data.empleado.DIRECCION;
                    document.getElementById('pais').value = data.empleado.PAIS;
                    document.getElementById('telefono').value = data.empleado.TELEFONO;
                    document.getElementById('email').value = data.empleado.EMAIL;
                    document.getElementById('area').value = data.empleado.AREA;
                    document.getElementById('fecha_ingreso').value = data.empleado.FECHA_INGRESO;
                    document.getElementById('fecha_salida').value = data.empleado.FECHA_SALIDA;
                    document.getElementById('salario').value = data.empleado.SALARIO;
                } else {
                    alert(data.error || 'Empleado no encontrado.');
                }
            })
            .catch(error => {
                alert('Error al obtener datos del empleado.');
                console.error('Error:', error);
            });
    }


    form.addEventListener('submit', function (event) {
        event.preventDefault(); // evita que el formulario recargue la pagina
        
        const updatedEmpleadoData = { // recopila los datos del formulario
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

        fetch(`/empleados/update/${empleadoId}`, { // envia los datos al servidor
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedEmpleadoData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                window.location.href = '/list_empleados.html'; // te redirige a la pagina de empleados
            } else {
                alert(data.error || 'Error al actualizar el empleado.');
            }
        })
        .catch(error => {
            alert('Error en la conexión con el servidor.');
            console.error('Error al actualizar empleado:', error);
        });
    });
});
