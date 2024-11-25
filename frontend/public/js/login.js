// Función para enviar datos de conexión al servidor
async function connectDatabase() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;


    if (!username || !password) {
        document.getElementById('error-message').style.display = 'block';
        document.getElementById('error-message').innerText = "complete todos los campos.";
        return;
    };

    try {
        console.log('envia los datos', { username, password });
        // Enviar solicitud de conexión al backend

        const response = await fetch('/connect', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        console.log('respuesta del servidor', response);

        if (response.ok) {
            const data = await response.json();
            mostrarVentana("Conexión exitosa a la base de datos.",0);
            localStorage.setItem('authToken', data.token); // Guardar el token en el cliente

            console.log(data.token);
            setTimeout(() => {
                window.location.href = '/home.html';}, 3000); // Redirige a home.html en caso de éxito

        } else {
            document.getElementById('error-message').style.display = 'block';
            document.getElementById('error-message').innerText = "Error en la conexión.";
        }
    } catch (error) {
        document.getElementById('error-message').style.display = 'block';
        document.getElementById('error-message').innerText = "Error al conectar.";
    }
}

