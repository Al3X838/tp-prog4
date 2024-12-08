document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('add-proveedor-form');
    const cancelButton = document.getElementById('cancel-button'); // Botón de cancelar


    const loadPaises = () => {
        fetch('/paises/') 
            .then(response => {
                if (!response.ok) throw new Error('Network response was not ok');
                return response.json(); 
            })
            .then(data => {
                if (data.success) { 
                    const paisSelect = document.getElementById('pais'); 

                    const defaultOption = document.createElement('option');
                    paisSelect.appendChild(defaultOption);
                    defaultOption.value = '';
                    defaultOption.textContent = 'Selecciona un pais';
                    defaultOption.selected = true;
                    defaultOption.disabled = true;

                    data.paises.forEach(pais => { 
                        const option = document.createElement('option'); 
                        option.value = pais.PAIS; 
                        option.textContent = pais.NOMBRE + '('+ pais.PAIS +')'; 
                        paisSelect.appendChild(option);
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: data.error || 'Error al cargar la lista de países.'
                    });
                }
            })
            .catch(error => {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Error al cargar países.'
                });
                console.error('Error al cargar países:', error);
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
            fecha_inicio: document.getElementById('fecha_inicio').value,

        };
        console.log(proveedorData);
        
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
                    history.go(-1);
                    history.replaceState(null, '', '/list_proveedores.html'); // Cambiar la URL actual a /list_area
                    history.replaceState(null, '', '/home.html'); 
                    setTimeout(() => {
                        location.reload(); // Asegura que la página se recargue
                    }, 100);
                    window.location.href = '/list_proveedores.html'; // Redirige tras el éxito
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

    cancelButton.addEventListener('click', function () {
        window.location.href = '../list_proveedores.html'; // Regresa a la página anterior
    });

});
