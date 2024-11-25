document.addEventListener('DOMContentLoaded', function () {
    const apiUrl = '/paises'; // define la URL 
    const paisesList = document.getElementById('paises-list');

    function loadPaises() {
        fetch(apiUrl, { method: 'GET' })
            .then(response => response.json())
            .then(data => {
                 // Ajuste para acceder a data.paises en lugar de data
                 if (data.success && data.paises) {
                    paisesList.innerHTML = data.paises.map(pais => `
                        <tr>
                            <td>${pais.PAIS}</td>
                            <td>${pais.NOMBRE}</td>
                            <td>
                                <button class="btn btn-primary" onclick="editPais(${pais.PAIS})">Actualizar</button>
                                <button class="btn btn-outline-danger" onclick="confirmDelete(${pais.PAIS})">Eliminar</button>
                            </td>
                        </tr>
                    `).join('');
                } else {
                    document.getElementById('error-message').style.display = 'block';
                    document.getElementById('error-message').innerText = 'Error al cargar las áreas.';
                }
            })
            .catch(error => {
                document.getElementById('error-message').style.display = 'block';
                document.getElementById('error-message').innerText = 'Error al cargar las áreas.';  // *** MODIFICACIÓN ***
            });
    }

    window.editPais = function (id) {
        window.location.href = `upd_pais.html?id=${id}`;
    };

    window.confirmDelete = function (id) {
        if (confirm('¿Estás seguro de que quieres eliminar este pais?')) {
            deletePais(id, loadPaises);
        }
    };

    function deletePais(id, callback) {
        fetch(`${apiUrl}/delete/${id}`, { method: 'DELETE' })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    callback();
                } else {
                    alert(data.error || 'Error al eliminar el área.');  // *** MODIFICACIÓN ***
                }
            })
            .catch(error => {
                alert('Error en la conexión con el servidor.');
                console.error('Error al eliminar área:', error);
            });
    }

    loadPaises();
});