document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('add-producto-form');
    const cancelButton = document.getElementById('cancel-button'); // Botón de cancelar


    // Cargar lista de categorías
    const loadCategorias = () => {
        fetch('/categorias/')
            .then(response => {
                if (!response.ok) throw new Error('Network response was not ok');
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    const categoriaSelect = document.getElementById('categoria');
                    
                    const defaultOption = document.createElement('option');
                    defaultOption.value = '';
                    defaultOption.textContent = 'Selecciona una categoria';
                    defaultOption.selected = true;
                    defaultOption.disabled = true;
                    categoriaSelect.appendChild(defaultOption);
                    
                    data.categorias.forEach(categoria => {
                        const option = document.createElement('option');
                        option.value = categoria.CATEGORIA;
                        option.textContent = categoria.NOMBRE + '(' + categoria.CATEGORIA + ')';
                        categoriaSelect.appendChild(option);
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: data.error || 'Error al cargar la lista de categorías.',
                        confirmButtonText: 'Aceptar'
                    });
                }
            })
            .catch(error => {
                console.error('Error al cargar categorías:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error de red',
                    text: 'No se pudo conectar al servidor para cargar las categorías.',
                    confirmButtonText: 'Aceptar'
                });
            });
    };

    // Cargar lista de marcas
    const loadMarcas = () => {
        fetch('/marcas/')
            .then(response => {
                if (!response.ok) throw new Error('Network response was not ok');
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    const marcaSelect = document.getElementById('marca');
                    
                    const defaultOption = document.createElement('option');
                    marcaSelect.appendChild(defaultOption);
                    defaultOption.value = '';
                    defaultOption.textContent = 'Selecciona una marca';
                    defaultOption.selected = true;
                    defaultOption.disabled = true;
                    
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
                        text: data.error || 'Error al cargar la lista de marcas.',
                        confirmButtonText: 'Aceptar'
                    });
                }
            })
            .catch(error => {
                console.error('Error al cargar marcas:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error de red',
                    text: 'No se pudo conectar al servidor para cargar las marcas.',
                    confirmButtonText: 'Aceptar'
                });
            });
    };

    // Llamar a las funciones para cargar categorías y marcas
    loadCategorias();
    loadMarcas();

    // Procesar el formulario
    form.addEventListener('submit', function (event) {
        event.preventDefault();

        const productoData = {
            nombre: document.getElementById('nombre').value.trim(),
            categoria: document.getElementById('categoria').value,
            marca: document.getElementById('marca').value,
            garantia: document.getElementById('garantia').value || 'N',
            
        };
        console.log(productoData);
        

        fetch('/productos/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(productoData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Producto agregado',
                    text: 'El producto se ha agregado correctamente.',
                    confirmButtonText: 'Aceptar'
                }).then(() => {
                    history.go(-1);
                    history.replaceState(null, '', '/list_productos.html'); // Cambiar la URL actual a /list_area
                    history.replaceState(null, '', '/home.html'); 
                    setTimeout(() => {
                        location.reload(); // Asegura que la página se recargue
                    }, 100);
                    window.location.href = '/list_productos.html'; // Redirige tras el éxito 
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: data.error || 'Error al agregar el producto.',
                    confirmButtonText: 'Aceptar'
                });
            }
        })
        .catch(error => {
            console.error('Error al agregar producto:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error de conexión',
                text: 'Hubo un error en la conexión con el servidor.',
                confirmButtonText: 'Aceptar'
            });
        });
    });
    cancelButton.addEventListener('click', function () {
        window.location.href = '../list_productos.html'; // Regresa a la página anterior
    });

});
