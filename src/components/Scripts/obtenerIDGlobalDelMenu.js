import getDate from "./obtenerFechaActual";
import getCookie from "./getCookies";

async function obtenerIDMenu(url) {
  let formattedDate = getDate();

  try {
    const response = await fetch(`${url}menu?linkTo=date&equalTo=${formattedDate}`, {
      method: "GET",
      mode: "cors",
      headers: {
        Authorization: "Token " + getCookie("token"),
        Module: "menu_management",
      },
    });

    const data = await response.json();

    if (data.status === 200) {
      return data.results[0].id;
    } else {
      return 0;
    }
  } catch (error) {
    console.log("Error en la conexión a la bd:", error);
    throw error; // Puedes propagar el error para manejarlo en el componente que llama a esta función
  }
}

export default obtenerIDMenu;
