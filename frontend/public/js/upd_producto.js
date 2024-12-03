document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('update-producto-form');
    const urlParams = new URLSearchParams(window.location.search);
    const productoId = urlParams.get('id');

    // Método para cargar la lista de categorías
    const loadCategorias = () => {
        fetch('/categorias/')
            .then(response => {
                if (!response.ok) throw new Error('Network response was not ok');
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    const categoriaSelect = document.getElementById('categoria');
                    data.categorias.forEach(categoria => {
                        const option = document.createElement('option');
                        option.value = categoria.CATEGORIA;
                        option.textContent = categoria.NOMBRE + ' (' + categoria.CATEGORIA + ')';
                        categoriaSelect.appendChild(option);
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: data.error || 'Error al cargar la lista de categorías.'
                    });
                }
            })
            .catch(error => console.error('Error al cargar categorías:', error));
    };

    // Método para cargar la lista de marcas
    const loadMarcas = () => {
        fetch('/marcas/')
            .then(response => {
                if (!response.ok) throw new Error('Network response was not ok');
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    const marcaSelect = document.getElementById('marca');
                    data.marcas.forEach(marca => {
                        const option = document.createElement('option');
                        option.value = marca.MARCA;
                        option.textContent = marca.NOMBRE + '(' + marca.MARCA + ')';
                        marcaSelect.appendChild(option);
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: data.error || 'Error al cargar la lista de marcas.'
                    });
                }
            })
            .catch(error => console.error('Error al cargar marcas:', error));
    };

    // Llama a la función para cargar listas al inicio
    loadCategorias();
    loadMarcas();

    // Cargar datos del producto actual
    if (productoId) {
        fetch(`/productos/producto/${productoId}`, { method: 'GET' })
            .then(response => response.json())
            .then(data => {
                if (data.success && data.producto) {
                    console.log(data.producto);
                    document.getElementById('nombre').value = data.producto.NOMBRE;
                    document.getElementById('categoria').value = data.producto.CATEGORIA;
                    document.getElementById('marca').value = data.producto.MARCA;
                    document.getElementById('precio_costo').value = data.producto.PRECIO_COSTO;
                    document.getElementById('precio_venta').value = data.producto.PRECIO_VENTA;
                    document.getElementById('existencia').value = data.producto.EXISTENCIA;
                    document.getElementById('fecha_adquisicion').value = data.producto.FECHA_ADQUISICION;
                    document.getElementById('garantia').value = data.producto.GARANTIA === 'S' ? 'Sí' : 'No';
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: data.error || 'Producto no encontrado.'
                    });
                }
            })
            .catch(error => {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Error al obtener datos del producto.'
                });
                console.error('Error:', error);
            });
    }

    form.addEventListener('submit', function (event) {
        event.preventDefault();

        const updatedProductoData = {
            nombre: document.getElementById('nombre').value.trim(),
            categoria: document.getElementById('categoria').value,
            marca: document.getElementById('marca').value,
            precio_costo: document.getElementById('precio_costo').value.trim(),
            precio_venta: document.getElementById('precio_venta').value.trim(),
            existencia: document.getElementById('existencia').value.trim(),
            fecha_adquisicion: document.getElementById('fecha_adquisicion').value,
            garantia: document.getElementById('garantia').value === 'Sí' ? 'S' : 'N',
        };

        fetch(`/productos/update/${productoId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedProductoData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                Swal.fire({
                    icon: 'success',
                    title: '¡Actualizado!',
                    text: 'El producto ha sido actualizado correctamente.'
                }).then(() => {
                    window.location.href = '/list_productos.html'; // Redirige a la página de productos
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: data.error || 'Error al actualizar el producto.'
                });
            }
        })
        .catch(error => {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error en la conexión con el servidor.'
            });
            console.error('Error al actualizar producto:', error);
        });
    });
});
