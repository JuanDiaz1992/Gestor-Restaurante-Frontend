import { useSelector } from "react-redux";
import getCookie from "../../Scripts/getCookies";
import { useState, useEffect } from "react";
import { confirmAlert } from "react-confirm-alert";
import  cerrarSesion from "../../Scripts/cerrarSesion";
// import { useDispatch } from "react-redux";
// import { logout } from "../redux/userSlice";
import "react-confirm-alert/src/react-confirm-alert.css";
import Swal from "sweetalert2";
import Modal from "react-modal";
import EditUser from "./manageUSersComponents/editUser";
import ChangePassword from "./manageUSersComponents/changePassword";
import CreateUser from "./manageUSersComponents/createUser"
import "../../../stylesheets/principal_pages/admin_pages/admin_pages.css";

Modal.setAppElement("#root");

function ManageUser() {
  const userNAme = useSelector((state) => state.auth.username);
  const url = process.env.REACT_APP_URL_HOST;
  const [setUsers, setAllUsers] = useState([]);
  const [loading,setLoading] = useState(false)
  // const dispatch = useDispatch();
  const [changeState, setChangeState] =
    useState(false); /*Este estado fue creado para
    pasarse como props al modal para editar usuario con el fin de que cuando se realice un cambio
    se ejecute de nuevo la busqueda de los actualizados*/

  useEffect(() => {
    fetch(`${url}profile_user/`, {
      method: "GET",
      mode: "cors",
      headers: {
        Authorization: "Token " + getCookie("token"),
        'Module': 'user'
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 200) {
          setAllUsers(data.results);
          setLoading(true);
        }
        else if(data.status === 401){
          // dispatch(logout());
          cerrarSesion()
        }

      });

      setChangeState(false);

  }, [url, changeState]);

  const deleteUser = (id, name,username) => {
    confirmAlert({
      title: "Confirmación de eliminación",
      message: `¿Estás seguro que deseas eiliminar a ${name}?`,
      buttons: [
        {
          label: "Sí",
          onClick: () => {
            fetch(url, {
              method: "POST",
              mode: "cors",
              headers: {
                Authorization: "Token " + getCookie("token"),
                'Module': 'user'
              },
              body: JSON.stringify({
                id: id,
                username: username,
                delete_user: true,
              }),
            })
              .then((response) => response.json())
              .then((data) => {
                if (data.status === 200) {
                  setChangeState(true);
                  Swal.fire({
                    title: "Proceso completado",
                    text: `El usuario ${name} se eliminó correctamente del sistema.`,
                    icon: "success",
                    confirmButtonText: "Ok",
                    willClose: function () {},
                    customClass: {
                      container: "notification-modal",
                    },
                  });
                }else{
                  Swal.fire({
                    title: "Proceso completado",
                    text: data.message,
                    icon: "success",
                    confirmButtonText: "Ok",
                    willClose: function () {},
                    customClass: {
                      container: "notification-modal",
                    },
                  });
                }

              });
          },
        },
        {
          label: "No",
          onClick: () => {}, // No hace nada
        },
      ],
    });
  };

  /****************Función para modal modificar usuario***********************/
  const [modalIsOpenEditUser, setModalIsOpenEditUser] = useState(false);
  const [idUserEdit, setidUserEdit] = useState("");
  const [nameUserEdit, setnameUserEdit] = useState("");
  const [typeUserEdit, settypeUserEdit] = useState("");
  const [photoUser, setphotoUser] = useState("");
  const [userNameEdit, setuserNameEdit] = useState("");

  const openModal = (id, name, type_user, photo, username) => {
    setModalIsOpenEditUser(true);
    setidUserEdit(id);
    setnameUserEdit(name);
    settypeUserEdit(type_user);
    setphotoUser(photo);
    setuserNameEdit(username);
  };

  const closeModal = () => {
    setModalIsOpenEditUser(false);
  };

  /****************Función para modal cambiar contraseña de usuario***********************/
  const [modalIsOpenChangePassword, setModalIsOpenChangePassword] =
    useState(false);

  const openModalChangePassword = (id, name, photo, username) => {
    setModalIsOpenChangePassword(true);
    setidUserEdit(id);
    setnameUserEdit(name);
    setphotoUser(photo);
    setuserNameEdit(username);
  };

  const closeModalChangePassword = () => {
    setModalIsOpenChangePassword(false);
  };

    /****************Función para crear usuario***********************/
    const [modalIsOpenCreateUser, setModalIsOpenCreateUser] =
    useState(false);

  const openModalCreateUser = () => {
    setModalIsOpenCreateUser(true);
  };

  const closeModalCreateUser = () => {
    setModalIsOpenCreateUser(false);
  };


  return (
    <>
      <section className="section_editUser">
        <div className="section_editUser--div">
          {loading === true?
          <>
            <button className="btn btn-dark" onClick={()=>{openModalCreateUser()}}>
                Crear Usuario
            </button>
            <table className="table table-striped table-hover table_users">
              <thead>
                <tr>
                  <th scope="col">id</th>
                  <th scope="col">Foto</th>
                  <th scope="col">Usuario</th>
                  <th scope="col">Nombre</th>
                  <th scope="col">Tipo Usuario</th>
                  <th scope="col">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {setUsers.map((user) => (
                  <tr key={user.id}>
                    <th scope="row">{user.id}</th>
                    <td>
                      <img
                        className="profilePhoto"
                        src={url + user.photo}
                        alt=""
                      />
                    </td>
                    <td>{user.username}</td>
                    <td>{user.name}</td>
                    <td>
                      {user.type_user === 1
                        ? "Administrador"
                        : user.type_user === 3
                        ? "Cocinero"
                        : user.type_user === 2
                        ? "Mesero"
                        : "Otro"}
                    </td>
                    <td className="bton_actions_container">
                      <button
                        className="btn btn-info"
                        onClick={() => {
                          openModal(
                            user.id,
                            user.name,
                            user.type_user,
                            user.photo,
                            user.username
                          );
                        }}
                      >
                        Editar
                      </button>
                      {userNAme !== user.username ? (
                        <button
                          className="btn btn-danger"
                          onClick={(e) => deleteUser(user.id, user.name,user.username)}
                        >
                          Eliminar
                        </button>
                      ) : (
                        ""
                      )}
                      <button
                        className="btn btn-primary"
                        onClick={(e) => {
                          openModalChangePassword(
                            user.id,
                            user.name,
                            user.photo,
                            user.username
                          );
                        }}
                      >
                        Contraseña
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
          :
          <div className="loading_container">
            <svg width="100" height="100" viewBox="0 0 44 44" xmlns="http://www.w3.org/2000/svg" stroke="#1ae743">
                <g fill="none" fillRule="evenodd" strokeWidth="2">
                    <circle cx="22" cy="22" r="1">
                        <animate attributeName="r"
                            begin="0s" dur="1.8s"
                            values="1; 20"
                            calcMode="spline"
                            keyTimes="0; 1"
                            keySplines="0.165, 0.84, 0.44, 1"
                            repeatCount="indefinite" />
                        <animate attributeName="stroke-opacity"
                            begin="0s" dur="1.8s"
                            values="1; 0"
                            calcMode="spline"
                            keyTimes="0; 1"
                            keySplines="0.3, 0.61, 0.355, 1"
                            repeatCount="indefinite" />
                    </circle>
                    <circle cx="22" cy="22" r="1">
                        <animate attributeName="r"
                            begin="-0.9s" dur="1.8s"
                            values="1; 20"
                            calcMode="spline"
                            keyTimes="0; 1"
                            keySplines="0.165, 0.84, 0.44, 1"
                            repeatCount="indefinite" />
                        <animate attributeName="stroke-opacity"
                            begin="-0.9s" dur="1.8s"
                            values="1; 0"
                            calcMode="spline"
                            keyTimes="0; 1"
                            keySplines="0.3, 0.61, 0.355, 1"
                            repeatCount="indefinite" />
                    </circle>
                </g>
            </svg>
            <p>Cargando...</p>
          </div>
          }
        </div>
        <Modal
          isOpen={modalIsOpenEditUser}
          onRequestClose={closeModal}
          overlayClassName="overlay-custom"
        >
          <EditUser
            idUSer={idUserEdit}
            typeUser={typeUserEdit}
            nameUSer={nameUserEdit}
            photo={photoUser}
            userNameEdited={userNameEdit}
            setChangeState={setChangeState}
            closeModalEdit={closeModal}
          />
        </Modal>
        <Modal
          isOpen={modalIsOpenChangePassword}
          onRequestClose={closeModalChangePassword}
          overlayClassName="overlay-custom"
        >
          <ChangePassword
            idUSer={idUserEdit}
            nameUSer={nameUserEdit}
            photo={photoUser}
            userNameEdited={userNameEdit}
            closeModalEdit={closeModalChangePassword}
          />
        </Modal>
        <Modal
          isOpen={modalIsOpenCreateUser}
          onRequestClose={closeModalCreateUser}
          overlayClassName="overlay-custom"
        >
          <CreateUser
            setChangeState={setChangeState}
            closeModalEdit={closeModalCreateUser}
          />
        </Modal>
      </section>
    </>
  );
}

export default ManageUser;
