import getCookie from './getCookies'
import setCookie from './borrarCookies'

export const cerrarSesion = async () => {
  try {

    const response = await fetch('http://192.168.1.49:80/gestion_restaurante/', {
      method: 'DELETE',
      mode: 'cors',
      body:JSON.stringify({
        'token':getCookie("token"),
        'logout_request':true
      }),
      headers: {
        'Content-Type': 'application/json',
        'Module': 'user'
      },
    });
    if (response.ok) {
      setCookie('loggedIn', false);
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error('Error:', error);
    return false;
  }
};

export default cerrarSesion