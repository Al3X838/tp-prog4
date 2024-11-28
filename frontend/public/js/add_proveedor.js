document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('add-proveedor-form');
    const errorMessage = document.getElementById('error-message');

    const loadPaises = () => {
        fetch('/paises/') // Asegúrate de que la URL está alineada con el microservicio
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
                        option.textContent = pais.NOMBRE + '(' + pais.PAIS + ')';
                        paisSelect.appendChild(option);
                    });
                } else {
                    alert(data.error || 'Error al cargar la lista de países.');
                }
            })
            .catch(error => console.error('Error al cargar países:', error));
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
        };
        fetch('/proveedores/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ proveedorData })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                window.location.href = '../list_proveedores.html';
            } else {
                errorMessage.textContent = data.error || 'Error al agregar el proveedor.';  
            }
        })
        .catch(error => {
            errorMessage.textContent = 'Error en la conexión con el servidor.';
            console.error('Error al agregar el proveedor:', error.message);
        });
    });
});