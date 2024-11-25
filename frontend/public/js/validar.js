async function checkearAut() {
    const token = localStorage.getItem('authToken'); // obtiene el token del almacenamiento local
    console.log('token: ', token); // ver si hay token

    if (!token || token == null) {
        mostrarVentana("Tienes que iniciar sesión para continuar.🤙🤙",1);
        setTimeout(() => {
            window.location.href = '/login.html';}, 3000); // espera 3 segiundos        
        return;
    }
    try {
        // obtiene el nombre del archivo. home.html, list_areas.html o el que sea
        const ruta1 = window.location.pathname.split('/').pop();
        const ruta2 = `/${ruta1}`;
        

        const response = await fetch(ruta2, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`, 
                'Accept': 'application/json'
            },
        });
        console.log('respuesta', response.status);

        if (!response.ok) {
            console.log('', response.status);

            mostrarVentana("Sesión invalida o expirada.",1);
            localStorage.removeItem('authToken'); // elimina el token y redirige
            setTimeout(() => {
                window.location.href = '/login.html';}, 5000);
            return;
            
        }

    } catch (error) {
        
        console.error("error con la verificacion", error);
        mostrarVentana("error al conectar con el servidor",0);
        window.location.href = '/login.html';
    }
}



function logout() {
    localStorage.removeItem('authToken'); // Eliminar el token del localStorage
    window.location.href = '/login.html'; // Redirigir al login
}



function inicializarAut() {
    checkearAut();

}

window.onload = checkearAut;
