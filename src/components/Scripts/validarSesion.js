import  getCookie  from './getCookies';

async function validarSesion() {
  try {
    const response = await fetch('http://192.168.1.49:80/gestion_restaurante/validateSession/', {
      method: 'GET',
      mode: 'cors',
      credentials: 'include',
      headers: {
        'Authorization': 'Token ' + getCookie('token'),
        'Module': 'user'
      },
    });

    if (!response.ok) {
      throw new Error('Error al validar sesión');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export default validarSesion;
