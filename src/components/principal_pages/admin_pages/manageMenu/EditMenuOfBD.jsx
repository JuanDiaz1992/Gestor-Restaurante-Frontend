import { useEffect, useState } from "react";
import getCookie from "../../../Scripts/getCookies";
import { toast } from "react-hot-toast";
import { MdOutlineDelete, MdEdit, MdAdd } from "react-icons/md";
import { confirmAlert } from "react-confirm-alert";
import {
  Button,
  ModalHeader,
  ModalBody,
  Spinner,
  ModalFooter,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@nextui-org/react";
import date from "../../../Scripts/obtenerFechaActual";
import ModalEditAndCreateItemMenu from "./ModalEditAndCreateItemMenu";

function EditMenuOfBD(props) {
  const { idMenuFather, setIsChangeFather, closeModalEdit } = props;

  const url = process.env.REACT_APP_URL_HOST;
  const [allItems, setAllItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [haveChanges, setChanges] = useState(false);

  /*Estados para el envio del formulario para item nuevo*/
  const [createItem, setCreateItem] = useState(false);


  /********************************************************/



  const menu_data = async () => {
    try {
      const response = await fetch(`${url}items_menu/`, {
        method: "GET",
        mode: "cors",
        headers: {
          Authorization: "Token " + getCookie("token"),
          Module: "menu_management",
        },
      });
      const data = await response.json();
      if (data.status === 200) {
        const categorias = {
          especialities: 1,
          soups: 2,
          beginning: 3,
          meats: 4,
          drinks: 5,
        };
        const newArray = data.results.sort((a, b) => {
          return categorias[a["menu_item_type"]] - categorias[b["menu_item_type"]];
        });
        const resultFilter = newArray.filter((result) => {
          return !props.allResults.some(
            (isInMenuresult) => isInMenuresult.name === result.name
          );
        });
        setAllItems(resultFilter);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setLoading(false);
  };
  useEffect(() => {
    menu_data();
    setChanges(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [haveChanges]);


  const deleteItem = (id,name) => {
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
                'Module': 'menu_management'
              },
              body: JSON.stringify({
                item: id,
                delete_item_bd_from_menu: true,
              }),
            })
              .then((response) => response.json())
              .then((data) => {
                if (data.status === 200) {
                  setChanges(true);
                  toast.success(name + " se eliminó correctamente");
                }
              })
            },
        },
        {
          label: "No",
          onClick: () => {}, // No hace nada
        },
      ],
    });
  };


  const addToMenu = (id,name) => {
    const dateTime = date();
    fetch(url, {
      method: "POST",
      mode: "cors",
      headers: {
        Authorization: "Token " + getCookie("token"),
        Module: "menu_management",
      },
      body: JSON.stringify({
        dateTime: dateTime,
        id:id,
        idMEnu: idMenuFather,
        add_to_menu: true,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 200) {
          toast.success(`${name} se agregó correctamente`);
          closeModalEdit();
          setIsChangeFather(true);
          props.sendState_socket();
        } else {
          toast.error("a ocurrido un error");
        }
      });
  };

  /*Función que crea nuevos elementos para el menú, este es el formulario*/


  return (
    <>
      <ModalHeader className="flex flex-col gap-1">
        <h3 className="text-2xl">Agregar items al menú</h3>
      </ModalHeader>
      {!createItem ? (
        loading ? (
          <>
            <Spinner label="Loading..." color="success" />
          </>
        ) : allItems.length !== 0 ? (
          <ModalBody>
            {allItems.length > 0 && (
              <div>
                <h3>Elementos disponibles</h3>
                <Table
                  isStriped
                  className="edit_menu_containers"
                  aria-label="Table items"
                >
                  <TableHeader>
                    <TableColumn>Nombre</TableColumn>
                    <TableColumn>Tipo</TableColumn>
                    <TableColumn>Acciones</TableColumn>
                  </TableHeader>
                  <TableBody>
                    {allItems.map((item, index) => (
                      item.menu_item_type !== "soft_drinks" &&
                      <TableRow key={index}>
                        <TableCell aria-label="Name">
                          {item.name.length > 16?
                            item.name.slice(0, 17) + "...":
                            item.name
                          }
                        </TableCell>
                        <TableCell aria-label="Type">
                          {
                          item.menu_item_type === "especialities"? "Especialidades":
                          item.menu_item_type === "soups"? "Sopas":
                          item.menu_item_type === "beginning"? "Principios":
                          item.menu_item_type === "meats"? "Carnes":
                          item.menu_item_type === "drinks"? "Bebidas":
                          ""
                          }
                        </TableCell>
                        <TableCell aria-label="Actions">
                          <div className="action_div_container_edit_item_menu">
                            <Button onClick={()=>{addToMenu(item.id, item.name)}} size="sm" color="success" isIconOnly >{<MdAdd />}</Button>
                            <Button size="sm" color="primary" isIconOnly>{<MdEdit />}</Button>
                            <Button onClick={()=>{deleteItem(item.id, item.name)}} size="sm" color="danger" isIconOnly>{<MdOutlineDelete />}</Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </ModalBody>
        ) : (
          <ModalBody>
            <h4>No existen más items para agregar al menú</h4>
          </ModalBody>
        )
      ) : (
        <>
          <ModalEditAndCreateItemMenu
          labelNameItem = {props.labelNameItem}
          setChanges = { setChanges }
          setCreateItem = { setCreateItem }
          createItem = {createItem}
          />
        </>
      )}
      <ModalFooter className="flex  flex-row gap-1 flex-wrap">
        {!createItem ? (
          <>
            <Button color="primary" onClick={() => setCreateItem(true)}>
              Crear nuevo
            </Button>
            <Button color="warning" onClick={closeModalEdit}>
              Cerrar
            </Button>
          </>
        ) : null}
      </ModalFooter>
    </>
  );
}

export default EditMenuOfBD;
