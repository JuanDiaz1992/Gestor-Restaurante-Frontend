function getDate() {
  /*Función para validar la fecha actual*/
  const currentDate = new Date();
  // Paso 2: Formatear la fecha en el formato 'YYYY-MM-DD'
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0");
  const day = String(currentDate.getDate()).padStart(2, "0");
  const formattedDate = `${year}-${month}-${day}`;
    return formattedDate
  }

export default getDate;