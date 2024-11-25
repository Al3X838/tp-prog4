document.addEventListener('DOMContentLoaded', function () {
    const apiUrl = '/areas'; // define la URL 
    const areasList = document.getElementById('areas-list');

    function loadAreas() {
        fetch(apiUrl, { method: 'GET' })
            .then(response => response.json())
            .then(data => {
                 // Ajuste para acceder a data.areas en lugar de data
                 if (data.success && data.areas) {
                    areasList.innerHTML = data.areas.map(area => `
                        <tr>
                            <td>${area.AREA}</td>
                            <td>${area.NOMBRE}</td>
                            <td>
                                <button class="btn btn-primary" onclick="editArea(${area.AREA})">Actualizar</button>
                                <button class="btn btn-outline-danger" onclick="confirmDelete(${area.AREA})">Eliminar</button>
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
                document.getElementById('error-message').innerText = 'Error al cargar las áreas.'; 
            });
    }

    window.editArea = function (id) {
        window.location.href = `upd_area.html?id=${id}`;
    };

    window.confirmDelete = function (id) {
        if (confirm('¿Estás seguro de que quieres eliminar esta área?')) {
            deleteArea(id, loadAreas);
        }
    };

    function deleteArea(id, callback) {
        fetch(`${apiUrl}/delete/${id}`, { method: 'DELETE' })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    callback();
                } else {
                    alert(data.error || 'Error al eliminar el área.'); 
                }
            })
            .catch(error => {
                alert('Error en la conexión con el servidor.');
                console.error('Error al eliminar área:', error);
            });
    }

    loadAreas();
});