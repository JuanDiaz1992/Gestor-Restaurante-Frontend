import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import getCookie from "../../../Scripts/getCookies";
import Swal from "sweetalert2";
import "../../../../stylesheets/principal_pages/admin_pages/admin_pages.css";

function CreateUser(props) {
  const { setChangeState } = props;
  const url = process.env.REACT_APP_URL_HOST;
  const idBusiness = useSelector((state) => state.auth.id);
  /********************Valores de los inputs*************************/
  const [userName, getUserName] = useState("");
  const [password, getPassword] = useState("");
  const [confirmPassword, getConfirmPassword] = useState("");
  const [name, getName] = useState("");
  const [photo, getPhoto] = useState();
  const [type_user, getType_user] = useState(2);
  /***************Estados para aplicar estilos a los inputs********************/
  const [isValidUserName, setIsValidUserName] = useState(true);
  const [isValidpassword, setIsValidpassword] = useState(true);
  const [isValidComfirmPassword, setIsValidComfimrPassword] = useState(true);
  const [isValidName, setIsValidName] = useState(true);
  /***************Mensajes de ErrorInput********************/
  const [infoUsername, setIsinfoUsername] = useState("");
  const [infoPassword, setIsinfoPassword] = useState("");
  const [infoComfirmPassword, setIsinfoComfirmPassword] = useState("");
  const [infoName, setIsinfoName] = useState("");

  /***************Validador formulario listo para el envío********************/
  const [isValidForm, setIsValidForm] = useState(false);

  const handleChange = (event) => {
    const input = event.target;
    const value = input.value;
    const inputID = input.id;
    const specialCharsRegex = /[!@#$%^&*(),.?":{}|<>]/;

    /*Funcíon que valida caracteres especiales y cantidad de caracteres y cambia las clases de los inputs */
    const validata = (valueInput, SetValueInput, setInfoInput, message1) => {
      if (valueInput.length < 4) {
        setInfoInput(message1);
        SetValueInput(false);
      } else if (specialCharsRegex.test(valueInput)) {
        SetValueInput(false);
        setInfoInput("Este campo no puede contener caracteres especiales");
      } else {
        SetValueInput(true);
      }
    };

    /*Aquí se valida que input cambio y se valida su estado con la función anterior */
    let message1 = "";
    switch (inputID) {
      case "username":
        message1 = "El usuario debe contener más de 4 caracteres";
        validata(value, setIsValidUserName, setIsinfoUsername, message1);
        getUserName(value);
        break;
      case "password":
        message1 = "La contraseña debe contener más de 4 caracteres";
        validata(value, setIsValidpassword, setIsinfoPassword, message1);
        getPassword(value);
        break;
      case "confirmPassword":
        message1 =
          "La contraseña debe contener más de 4 caracteres y debe ser igual a la anterior";
        validata(
          value,
          setIsValidComfimrPassword,
          setIsinfoComfirmPassword,
          message1
        );
        getConfirmPassword(value);
        break;
      case "name":
        message1 = "El nombre y apellido debe ser mayor a 4 digitos";
        validata(value, setIsValidName, setIsinfoName, message1);
        getName(value);
        break;
      case "type_user":
        getType_user(value);
        break;
      default:
        break;
    }
  };

  /*Si todos los inputs están ok, se habilita el envío del form*/

  /*No se hizo directamente en la función anterior porque el cambio de cada estado
de cada input no se ve reflejado inmediatamente al momento de la ejecución de la función
*/
  useEffect(() => {
    const specialCharsRegex = /[!@#$%^&*(),.?":{}|<>]/;
    if (
      userName.length >= 4 &&
      !specialCharsRegex.test(userName) &&
      password.length >= 4 &&
      !specialCharsRegex.test(password) &&
      confirmPassword.length >= 4 &&
      name.length >= 4 &&
      !specialCharsRegex.test(name) &&
      !specialCharsRegex.test(confirmPassword)
    ) {
      setIsValidForm(true);
    } else {
      setIsValidForm(false);
    }
  }, [userName, password, confirmPassword, name, type_user]);

  const executedSwalFire = (title, text, icon) => {
    Swal.fire({
      title: title,
      text: text,
      icon: icon,
      confirmButtonText: "Ok",
      willClose: function () {},
      customClass: {
        container: "notification-modal",
      },
    });
  };
  /*Envio del formulario*/
  const sendForm = (e) => {
    e.preventDefault();
    let typeUser =
      typeof type_user === "number" ? type_user : parseInt(type_user);
    try {
      if (isValidForm) {
        let formData = new FormData();
        formData.append("id_business", idBusiness);
        formData.append("userName", userName);
        formData.append("password", password);
        formData.append("confirmPassword", confirmPassword);
        formData.append("name", name);
        formData.append("photo", photo);
        formData.append("type_user", typeUser);
        formData.append("newUser_request", true);
        fetch(url, {
          method: "POST",
          body: formData,
          mode: "cors",
          headers: {
            Authorization: "Token " + getCookie("token"),
            Module: "user",
          },
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.status === 200) {
              setChangeState(true);
              getUserName("");
              getPassword("");
              getConfirmPassword("");
              getName("");
              getType_user("");
              let formRegis = document.getElementById("formRegis");
              formRegis.reset();
              executedSwalFire("Registrado","Usuario creado correctamente","success");
              props.closeModalEdit();
            } else {
              executedSwalFire("Error","Error al crear el usuario, valide la información e intente de nuevo","error");
            }
          });
      }
    } catch {
      Swal.fire({
        title: "Error",
        text: "Error, intentelo de nuevo",
        icon: "error",
        confirmButtonText: "Ok",
        customClass: {
          container: "notification-modal",
        },
      });
    }
  };
  return (
    <>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Crear nuevo usuario:</h5>
            <button
              className="btn-close"
              onClick={() => {
                props.closeModalEdit();
              }}
              aria-label="Close"
            ></button>
          </div>
          <form
            className="card-body"
            id="formRegis"
            onSubmit={sendForm}
            encType="multipart/form-data"
          >
            <div className="mb-3">
              <label htmlFor="username" className="label_createUser">
                Nombre de usuario:
              </label>
              <input
                type="text"
                className={
                  isValidUserName ? "form-control" : "is-invalid form-control"
                }
                id="username"
                value={userName}
                onChange={handleChange}
              />
              <div
                id="username"
                className={isValidUserName ? "d-none" : "form-text"}
              >
                {infoUsername}
              </div>
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="label_createUser">
                Contraseña:
              </label>
              <input
                type="password"
                className={
                  isValidpassword ? "form-control" : "is-invalid form-control"
                }
                id="password"
                value={password}
                onChange={handleChange}
              />
              <div
                id="username"
                className={isValidpassword ? "d-none" : "form-text"}
              >
                {infoPassword}
              </div>
            </div>
            <div className="mb-3">
              <label htmlFor="confirmPassword" className="label_createUser">
                Comfirma la contraseña:
              </label>
              <input
                type="password"
                className={
                  isValidComfirmPassword
                    ? "form-control"
                    : "is-invalid form-control"
                }
                id="confirmPassword"
                value={confirmPassword}
                onChange={handleChange}
              />
              <div
                id="username"
                className={isValidComfirmPassword ? "d-none" : "form-text"}
              >
                {infoComfirmPassword}
              </div>
            </div>
            <div className="mb-3">
              <label htmlFor="name" className="label_createUser">
                Primer nombre y primer apellido:
              </label>
              <input
                type="text"
                className={
                  isValidName ? "form-control" : "is-invalid form-control"
                }
                id="name"
                value={name}
                onChange={handleChange}
              />
              <div
                id="username"
                className={isValidName ? "d-none" : "form-text"}
              >
                {infoName}
              </div>
            </div>
            <div className="mb-3">
              <label htmlFor="photo" className="label_createUser">
                Foto:
              </label>
              <input
                type="file"
                accept="image/*"
                className="form-control"
                id="photo"
                onChange={(e) => getPhoto(e.target.files[0])}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="type_user" className="label_createUser">
                Tipo de usuario:
              </label>
              <select
                className="form-control"
                id="type_user"
                value={type_user}
                onChange={handleChange}
                required
              >
                <option value="2">Mesero</option>
                <option value="1">Administrador</option>
                <option value="3">Cocinero</option>
              </select>
            </div>
            <button
              className={isValidForm ? "btn btn-primary" : "btn btn-dark"}
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default CreateUser;
