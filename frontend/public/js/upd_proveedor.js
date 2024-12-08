document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('update-proveedor-form'); 
    const urlParams = new URLSearchParams(window.location.search); 
    const proveedorId = urlParams.get('id');
    const errorMessage = document.getElementById('error-message');
    const cancelButton = document.getElementById('cancel-button'); // Botón de cancelar


    // Método para cargar la lista de países
    const loadPaises = () => {
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

    if (proveedorId) { 
        fetch(`/proveedores/proveedor/${proveedorId}`, { method: 'GET' })
            .then(response => response.json())
            .then(data => {
                if (data.success && data.proveedor) {
                    document.getElementById('nombre').value = data.proveedor.NOMBRE;
                    document.getElementById('direccion').value = data.proveedor.DIRECCION;
                    document.getElementById('pais').value = data.proveedor.PAIS;
                    document.getElementById('telefono').value = data.proveedor.TELEFONO;
                    document.getElementById('email').value = data.proveedor.EMAIL;
                    document.getElementById('fecha_inicio').value = data.proveedor.FECHA_INICIO;
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: data.error || 'Proveedor no encontrado.'
                    });
                }
            })
            .catch(error => {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Error al obtener datos del proveedor.'
                });
                console.error('Error:', error);
            });
    }

    form.addEventListener('submit', function (event) {
        event.preventDefault();
        
        const updateProveedorData = {
            nombre: document.getElementById('nombre').value.trim(),
            direccion: document.getElementById('direccion').value.trim(),
            pais: document.getElementById('pais').value,
            telefono: document.getElementById('telefono').value.trim(),
            email: document.getElementById('email').value.trim(),
            fecha_inicio: document.getElementById('fecha_inicio').value.trim(),
        };

        console.log('datos enviados', JSON.stringify(updateProveedorData));

        fetch(`/proveedores/update/${proveedorId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updateProveedorData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                Swal.fire({
                    icon: 'success',
                    title: '¡Actualizado!',
                    text: 'El proveedor ha sido actualizado correctamente.'
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
                    text: data.error || 'Error al actualizar el proveedor.'
                });
            }
        })
        .catch(error => {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error en la conexión con el servidor.'
            });
            console.error('Error al actualizar el proveedor:', error.message);
        });
    });

    cancelButton.addEventListener('click', function () {
        window.location.href = '../list_proveedores.html'; // Regresa a la página anterior
    });

});
