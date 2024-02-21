import { useEffect, useState, useContext } from "react";
import { SocketContext } from "../../../../context/SocketContex";
import {
  Button,
  ModalContent,
  Modal,
  Spinner,
  Avatar,
  Tooltip,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@nextui-org/react";
import { AiFillDelete, AiOutlinePauseCircle } from "react-icons/ai";
import { MdEdit } from "react-icons/md";
import { toast } from "react-hot-toast";
import { confirmAlert } from "react-confirm-alert";
import Swal from "sweetalert2";
import getCookie from "../../../Scripts/getCookies";
import obtenerIDMenu from "../../../Scripts/obtenerIDGlobalDelMenu";
import EditMenuOfBD from "./EditMenuOfBD";
import ManageSoftDrinks from "./ManageSoftDrinks";
import GoToTop from "../../../Scripts/OnTop";
import getDate from "../../../Scripts/obtenerFechaActual";

function MenuOfBd(props) {
  const url = process.env.REACT_APP_URL_HOST;
  const [allItemsMenu, setAllItemsMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isChange, setIsChange] = useState(false);
  const [idMenu, setIdMenu] = useState();

  /*Conexión websocket para actualizar el menú cliente*/
  const socket = useContext(SocketContext);
  const sendState = () => {
    socket.emit("change_state", {
      change_menu: true,
    });
  };


  let date = getDate();
  const getMenu = async () => {
    try {
      let idMenu = await obtenerIDMenu(url);
      setIdMenu(idMenu);
      fetch(`${url}menu_from_creator_menu?linkTo=date&equalTo=${date}`, {
        method: "GET",
        mode: "cors",
        headers: {
          Authorization: "Token " + getCookie("token"),
          Module: "menu_management",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.status === 200) {
            const categorias = {
              especialities: 1,
              soups: 2,
              beginning: 3,
              meats: 4,
              drinks: 5,
              soft_drinks: 6,
            };
            const newArray = data.results.sort((a, b) => {
              return (
                categorias[a["menu_item_type"]] -
                categorias[b["menu_item_type"]]
              );
            });
            setAllItemsMenu(newArray);
            setLoading(false);
          } else {
            setLoading(false);
          }
        });
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };
  useEffect(() => {
    getMenu();
    setIsChange(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isChange]);

  const deleteItemFromMenuBd = (id, name) => {
    let delete_item_menu_bd_bolean = false;
    let delete_all_menu_bolean = false;
    if (allItemsMenu.length > 1) {
      delete_item_menu_bd_bolean = true;
    } else if (allItemsMenu.length === 1) {
      delete_all_menu_bolean = true;
    }
    try {
      fetch(url, {
        method: "POST",
        mode: "cors",
        headers: {
          Authorization: "Token " + getCookie("token"),
          Module: "menu_management",
        },
        body: JSON.stringify({
          idMenu: idMenu,
          id: id,
          delete_item_menu_bd: delete_item_menu_bd_bolean,
          delete_all_menu: delete_all_menu_bolean,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.status === 200) {
            toast.success(name + " se eliminó de le menú.");
          } else {
            toast.error(
              "Ha ocurrido un error al eliminar " +
                name +
                ", valide con el administrador del sistema."
            );
          }
          if (allItemsMenu.length === 1) {
            props.setMenuCreate(false);
          }
          setIsChange(true);
          sendState();
        });
    } catch (error) {
      console.log(error);
    }
  };

  const supend = (id, name, state) => {
    const newsState = state === 1 ? 0 : 1;
    try {
      fetch(url, {
        method: "POST",
        mode: "cors",
        headers: {
          Authorization: "Token " + getCookie("token"),
          Module: "menu_management",
        },
        body: JSON.stringify({
          idMenu: idMenu,
          id: id,
          state: newsState,
          supend_item_menu: true,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.status === 200) {
            if (state === 1) {
              toast.success(name + " marcado como agotado.");
            } else {
              toast.success(name + " marcado como disponible.");
            }
          } else {
            toast.error(
              "Ha ocurrido un error al supender " +
                name +
                ", valide con el administrador del sistema."
            );
          }
          setIsChange(true);
          sendState();
        });
    } catch (error) {
      console.log(error);
    }
  };

  const deleteMenu = () => {
    confirmAlert({
      title: "Confirmación de eliminación",
      message: `¿Estás seguro que deseas eiliminar todo el menú?`,
      buttons: [
        {
          label: "Sí",
          onClick: () => {
            fetch(url, {
              method: "POST",
              mode: "cors",
              headers: {
                Authorization: "Token " + getCookie("token"),
                Module: "menu_management",
              },
              body: JSON.stringify({
                delete_menu: true,
                idMenu: idMenu,
              }),
            })
              .then((response) => response.json())
              .then((data) => {
                if (data.status === 200) {
                  Swal.fire({
                    title: "Eliminado",
                    text: "Menú eliminado, puedes crear uno nuevo",
                    icon: "success",
                    confirmButtonText: "Ok",
                    customClass: {
                      container: "notification-modal",
                    },
                  });
                  props.setMenuCreate(false);
                  sendState();
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

  /*Modal*/

  const [modalEditMenu, setModalIsOpenEditMenu] = useState(false);
  const [modalConten, setModalContent] = useState();

  const openModalEditMenu = (option, data) => {
    switch (option) {
      case 1:
        setModalContent(
          <EditMenuOfBD
            allResults={allItemsMenu}
            idMenuFather={idMenu}
            closeModalEdit={closeModalEditMenu}
            setIsChangeFather={setIsChange}
            sendState_socket={sendState}
          />
        );
        break;
      case 2:
        setModalContent(
          <ManageSoftDrinks
            closeModalEdit={closeModalEditMenu}
            sendState={sendState}
          />
        );
        break;
      case 3:
        setModalContent(
          <EditMenuOfBD
            allResults={allItemsMenu}
            idMenuFather={idMenu}
            closeModalEdit={closeModalEditMenu}
            setIsChangeFather={setIsChange}
            sendState_socket={sendState}
            openEditItem={true}
            editItemFromMenu={true}
            dataItemsEdit={data}
            openModalEditFromMenu = {true}
          />
        );
        break;

      default:
        break;
    }
    setModalIsOpenEditMenu(true);
  };

  const closeModalEditMenu = () => {
    setModalIsOpenEditMenu(false);
  };
  return (
    <>
      <div className="menu_of_day_container">
        <div className="menu_of_day_container--div1">
          {loading ? (
            <>
              <div className="spiner_container_creator_menu_principal">
                <Spinner label="Loading..." color="success" />
              </div>
            </>
          ) : (
            <>
              <h1 className="sectionMenu_div--container--tile_menu">
                MENÚ DEL DÍA
              </h1>
              <Table
                className="table_menu_bd"
                isStriped
                aria-label="Items menu of bd"
              >
                <TableHeader>
                  <TableColumn>Nombre</TableColumn>
                  <TableColumn>Tipo</TableColumn>
                  <TableColumn>Precio</TableColumn>
                  <TableColumn>Estatus</TableColumn>
                  <TableColumn>Acciones</TableColumn>
                </TableHeader>
                <TableBody>
                  {allItemsMenu.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <div className="avata_and_name_container">
                          <Avatar
                            radius="lg"
                            size="lg"
                            alt={item.title}
                            className={item.state === 1 ? "" : "agotado"}
                            classNames={{ img: "opacity-1" }}
                            src={url + item.picture}
                          />
                          <p>{item.name}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p>
                          {item.menu_item_type === "especialities"
                            ? "Especialidades"
                            : item.menu_item_type === "soups"
                            ? "Sopas"
                            : item.menu_item_type === "beginning"
                            ? "Principios"
                            : item.menu_item_type === "meats"
                            ? "Carnes"
                            : item.menu_item_type === "drinks"
                            ? "Bebidas"
                            : ""}
                        </p>
                      </TableCell>
                      <TableCell>
                        {item.menu_item_type === "especialities" ? (
                          <p>{item.price > 0 && "$" + item.price}</p>
                        ) : null}
                      </TableCell>
                      <TableCell>
                        {item.state === 1 ? "Disponible" : "Agotado"}
                      </TableCell>
                      <TableCell>
                        <div className="relative flex items-center gap-2">
                          <Tooltip color="default" content="Suspender">
                            <span
                              onClick={() =>
                                supend(item.id, item.name, item.state)
                              }
                              className="icon_container"
                            >
                              <AiOutlinePauseCircle />
                            </span>
                          </Tooltip>
                          <Tooltip color="danger" content="Borrar del menú">
                            <span
                              onClick={() =>
                                deleteItemFromMenuBd(item.id, item.name)
                              }
                              className="icon_container"
                            >
                              <AiFillDelete />
                            </span>
                          </Tooltip>
                          <Tooltip color="primary" content="Editar">
                            <span
                              onClick={() =>
                                openModalEditMenu(3, [
                                  item.contenido,
                                  item.menu_item_type,
                                  item.name,
                                  item.description,
                                  item.price,
                                  item.picture,
                                ])
                              }
                              className="icon_container"
                            >
                              <MdEdit />
                            </span>
                          </Tooltip>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </>
          )}
        </div>
        {loading ? (
          <></>
        ) : (
          <div className="menu_of_day_container--div2">
            <Button color="danger" onClick={deleteMenu}>
              {" "}
              Eliminar Menú
            </Button>
            <Button color="secondary" onClick={() => openModalEditMenu(1)}>
              Agregar elementos
            </Button>
            <Button color="warning" onClick={() => openModalEditMenu(2)}>
              {" "}
              Administrar Gaseosas
            </Button>
          </div>
        )}
      </div>
      <Modal
        isOpen={modalEditMenu}
        onOpenChange={closeModalEditMenu}
        scrollBehavior={"inside"}
        size="xl"
      >
        <ModalContent className="modal_content_edit_menu">
          {modalConten}
        </ModalContent>
      </Modal>
      <GoToTop />
    </>
  );
}
export default MenuOfBd;
