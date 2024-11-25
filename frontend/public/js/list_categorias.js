document.addEventListener('DOMContentLoaded', function () {
    const apiUrl = '/categorias'; // define la URL 
    const categoriasList = document.getElementById('categorias-list');

    function loadCategorias() {
        fetch(apiUrl, { method: 'GET' })
            .then(response => response.json())
            .then(data => {
                 // Ajuste para acceder a data.areas en lugar de data
                 if (data.success && data.categorias) {
                    categoriasList.innerHTML = data.categorias.map(categoria => `
                        <tr>
                            <td>${categoria.CATEGORIA}</td>
                            <td>${categoria.NOMBRE}</td>
                            <td>
                                <button class="btn btn-primary" onclick="editCategoria(${categoria.CATEGORIA})">Actualizar</button>
                                <button class="btn btn-outline-danger" onclick="confirmDelete(${categoria.CATEGORIA})">Eliminar</button>
                            </td>
                        </tr>
                    `).join('');
                } else {
                    document.getElementById('error-message').style.display = 'block';
                    document.getElementById('error-message').innerText = 'Error al cargar las categorias.';
                }
            })
            .catch(error => {
                document.getElementById('error-message').style.display = 'block';
                document.getElementById('error-message').innerText = 'Error al cargar las categorias.';  // *** MODIFICACIÓN ***
            });
    }

    window.editCategoria = function (id) {
        window.location.href = `upd_categorias.html?id=${id}`;
    };

    window.confirmDelete = function (id) {
        if (confirm('¿Estás seguro de que quieres eliminar esta categoria?')) {
            deleteCategoria(id, loadCategorias);
        }
    };

    function deleteCategoria(id, callback) {
        fetch(`${apiUrl}/delete/${id}`, { method: 'DELETE' })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    callback();
                } else {
                    alert(data.error || 'Error al eliminar la Categoria.');  // *** MODIFICACIÓN ***
                }
            })
            .catch(error => {
                alert('Error en la conexión con el servidor.');
                console.error('Error al eliminar la Categoria:', error);
            });
    }

    loadCategorias();
});