function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
        return parts.pop().split(';').shift().trim(); // Agregar el método trim() para eliminar espacios en blanco adicionales
    }
    return null; // Agregar un valor de retorno predeterminado en caso de que la cookie no se encuentre
}

export default getCookie;
