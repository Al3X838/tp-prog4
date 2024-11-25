document.addEventListener('DOMContentLoaded', function () {
    const apiUrl = '/marcas'; // Define la URL
    const marcasList = document.getElementById('marcas-list');

    function loadMarcas() {
        fetch(apiUrl, { method: 'GET' })
            .then(response => response.json())
            .then(data => {
                // Ajuste para acceder a data.marcas en lugar de data
                if (data.success && data.marcas) {
                    marcasList.innerHTML = data.marcas.map(marca => `
                        <tr>
                            <td>${marca.MARCA}</td>
                            <td>${marca.NOMBRE}</td>
                            <td>
                                <button class="btn btn-primary" onclick="editMarca(${marca.MARCA})">Actualizar</button>
                                <button class="btn btn-outline-danger" onclick="confirmDelete(${marca.MARCA})">Eliminar</button>
                            </td>
                        </tr>
                    `).join('');
                } else {
                    document.getElementById('error-message').style.display = 'block';
                    document.getElementById('error-message').innerText = 'Error al cargar las marcas.';
                }
            })
            .catch(error => {
                document.getElementById('error-message').style.display = 'block';
                document.getElementById('error-message').innerText = 'Error al cargar las marcas.';
            });
    }

    window.editMarca = function (id) {
        window.location.href = `upd_marca.html?id=${id}`;
    };

    window.confirmDelete = function (id) {
        if (confirm('¿Estás seguro de que quieres eliminar esta marca?')) {
            deleteMarca(id, loadMarcas);
        }
    };

    function deleteMarca(id, callback) {
        fetch(`${apiUrl}/delete/${id}`, { method: 'DELETE' })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    callback();
                } else {
                    alert(data.error || 'Error al eliminar la marca.');
                }
            })
            .catch(error => {
                alert('Error en la conexión con el servidor.');
                console.error('Error al eliminar la marca:', error);
            });
    }

    loadMarcas();
});
