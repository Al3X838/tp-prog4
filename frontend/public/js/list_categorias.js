document.addEventListener('DOMContentLoaded', function () {
    const apiUrl = '/categorias'; // define la URL 
    const categoriasList = document.getElementById('categorias-list');
    const errorMessage = document.getElementById('error-message');

    // Función para cargar las categorías
    function loadCategorias() {
        fetch(apiUrl, { method: 'GET' })
            .then(response => response.json())
            .then(data => {
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
                    errorMessage.style.display = 'none'; // Ocultar mensaje de error si la carga es exitosa
                } else {
                    showError('Error al cargar las categorías.');
                }
            })
            .catch(error => {
                console.error('Error al cargar las categorías:', error);
                showError('Error en la conexión con el servidor.');
            });
    }

    // Función para mostrar errores con SweetAlert2
    function showError(message) {
        errorMessage.style.display = 'block';
        errorMessage.innerText = message;
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: message,
            confirmButtonText: 'Aceptar'
        });
    }

    // Función para redirigir a la página de actualización
    window.editCategoria = function (id) {
        window.location.href = `upd_categorias.html?id=${id}`;
    };

    // Función para confirmar eliminación usando SweetAlert2
    window.confirmDelete = function (id) {
        Swal.fire({
            title: '¿Estás seguro?',
            text: 'No podrás recuperar esta categoría si la eliminas.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                deleteCategoria(id, loadCategorias);
            }
        });
    };

    // Función para eliminar una categoría
    function deleteCategoria(id, callback) {
        fetch(`${apiUrl}/delete/${id}`, { method: 'DELETE' })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Categoría eliminada',
                        text: 'La categoría fue eliminada exitosamente.',
                        confirmButtonText: 'Aceptar'
                    });
                    callback(); // Recargar las categorías después de eliminar
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: data.error || 'Error al eliminar la categoría.',
                        confirmButtonText: 'Aceptar'
                    });
                }
            })
            .catch(error => {
                console.error('Error al eliminar la categoría:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error de conexión',
                    text: 'No se pudo conectar con el servidor para eliminar la categoría.',
                    confirmButtonText: 'Aceptar'
                });
            });
    }

    // Cargar las categorías al iniciar
    loadCategorias();
});
