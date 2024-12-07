document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('add-proveedor-form');

    const loadPaises = () => {
        fetch('/paises/') // Asegúrate de que la URL está alineada con el microservicio
            .then(response => {
                if (!response.ok) throw new Error('Network response was not ok');
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    const paisSelect = document.getElementById('pais');

                    const defaultOption = document.createElement('option');
                    defaultOption.value = '';
                    defaultOption.textContent = 'Selecciona un Pais';
                    defaultOption.selected = true;
                    defaultOption.disabled = true;
                    paisSelect.appendChild(defaultOption);



                    data.paises.forEach(pais => {
                        const option = document.createElement('option');
                        option.value = pais.PAIS;
                        option.textContent = `${pais.NOMBRE} (${pais.PAIS})`;
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
                    text: 'No se pudo cargar la lista de países. Inténtalo más tarde.',
                    confirmButtonText: 'Aceptar'
                });
            });
    };

    loadPaises();

    form.addEventListener('submit', function (event) {
        event.preventDefault();

        const proveedorData = {
            nombre: document.getElementById('nombre').value.trim(),
            direccion: document.getElementById('direccion').value.trim(),
            pais: document.getElementById('pais').value,
            telefono: document.getElementById('telefono').value.trim(),
            email: document.getElementById('email').value.trim(),
            fecha: document.getElementById('fecha_inicio').value.trim(),

        };
        console.log(provedorData);
        console.log('tipo de dato nombre', typeof proveedorData.nombre);
        console.log('tipo de dato direccion', typeof proveedorData.direccion);
        console.log('tipo de dato pais', typeof proveedorData.pais);
        console.log('tipo de dato telefono', typeof proveedorData.telefono);
        console.log('tipo de dato email', typeof proveedorData.email);
        console.log('tipo de dato fecha', typeof proveedorData.fecha);
        

        fetch('/proveedores/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(proveedorData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Proveedor agregado',
                    text: 'El proveedor se ha agregado correctamente.',
                    confirmButtonText: 'Aceptar'
                }).then(() => {
                    window.location.href = '../list_proveedores.html'; // Redirige tras el éxito
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: data.error || 'Error al agregar el proveedor.',
                    confirmButtonText: 'Aceptar'
                });
            }
        })
        .catch(error => {
            console.error('Error al agregar el proveedor:', error.message);
            Swal.fire({
                icon: 'error',
                title: 'Error de conexión',
                text: 'No se pudo conectar con el servidor para agregar el proveedor.',
                confirmButtonText: 'Aceptar'
            });
        });
    });
});
