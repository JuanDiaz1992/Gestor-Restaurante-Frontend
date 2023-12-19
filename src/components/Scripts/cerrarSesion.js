import getCookie from './getCookies'
import setCookie from './borrarCookies'

export const cerrarSesion = async () => {
  const url = process.env.REACT_APP_URL_HOST;
  try {
    const response = await fetch(url, {
      method:'POST',
      mode:'cors',
      body:JSON.stringify({
        'logout_request':true
      }),
      headers: {
        'Module': 'user',
        Authorization: "Token " + getCookie("token"),
      },
    });
    if (response["status"] === 200) {
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