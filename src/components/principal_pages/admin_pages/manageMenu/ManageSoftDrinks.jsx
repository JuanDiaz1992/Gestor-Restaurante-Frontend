import { useEffect, useState } from "react";
import getCookie from "../../../Scripts/getCookies";
import { AiFillDelete, AiFillEdit } from "react-icons/ai";
import { toast } from "react-hot-toast";
import { confirmAlert } from "react-confirm-alert";

import {
  ModalHeader,
  ModalBody,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Image,
  Button,
  ModalFooter
} from "@nextui-org/react";
import ModalSoftDrinks from "./ModalSoftDrinks";

function ManageSoftDrinks({ closeModalEdit }) {
  const [createNewSoftDrink, setSreateNewSoftDrink] = useState(true);
  const [editSoftDrink,setEditSoftDrink] = useState(false);
  const [softDrinks, setSoftDrinks] = useState([]);
  const [haveChanges,setChanges] = useState(false);
  const [dataEdit,setDataEdit] = useState([])


  const url = process.env.REACT_APP_URL_HOST;
  const getMenu = async () => {
    fetch(
      `${url}items_menu_soft_driks?linkTo=menu_item_type&equalTo=soft_drinks`,
      {
        method: "GET",
        mode: "cors",
        headers: {
          Authorization: "Token " + getCookie("token"),
          Module: "menu_management",
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        setSoftDrinks(data.results);
      });
      setChanges(false);
  };

  useEffect(() => {
    getMenu();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [haveChanges]);
  const createSoftDrinkOption =()=>{
    setSreateNewSoftDrink(false);
    setEditSoftDrink(false);
  }


  const deleteItemFromMenuBd=(id, name, picture)=>{
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
                picture:picture,
                delete_item_bd_from_menu: true,
              }),
            })
              .then((response) => response.json())
              .then((data) => {
                if (data.status === 200) {
                  setChanges(true);
                  toast.success(name + " se eliminó correctamente");
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
  }
  const editItemFromMEnuBD=(id,name,description,price,amount,picture)=>{
    setSreateNewSoftDrink(false)
    setEditSoftDrink(true)
    setDataEdit([id,name,description,price,amount,picture])
  }
  const comeBack=()=>{
    setSreateNewSoftDrink(true)
    setDataEdit(["","","","",""])
  }

  return (
    <>
          <ModalHeader className="flex flex-col gap-1">
            <h3 className="text-2xl">Gestión Gaseosas</h3>
          </ModalHeader>
          <ModalBody>
            {createNewSoftDrink?
            <Table aria-label="Example static collection table">
              <TableHeader>
                <TableColumn>Nombre</TableColumn>
                <TableColumn>Precio</TableColumn>
                <TableColumn>Cantidad</TableColumn>
                <TableColumn>Foto</TableColumn>
                <TableColumn>Acciones</TableColumn>
              </TableHeader>
              <TableBody>
                {softDrinks.map((softDrink, index) => (
                  <TableRow key={index}>
                    <TableCell>{softDrink.name}</TableCell>
                    <TableCell>${softDrink.price}</TableCell>
                    <TableCell>{softDrink.amount}</TableCell>
                    <TableCell>
                      <Image
                        width={100}
                        className="opacity-1 object-cover h-[140px]"
                        src={url + softDrink.picture}
                        alt={softDrink.name}
                      />
                    </TableCell>
                    <TableCell>
                      <span className="delete_softDrink">
                        <Button isIconOnly color="warning" variant="faded" aria-label="Take a photo" onClick={()=>
                          editItemFromMEnuBD(
                            softDrink.id,
                            softDrink.name,
                            softDrink.description,
                            softDrink.price,
                            softDrink.amount,
                            softDrink.picture
                            )}  >
                        <AiFillEdit/>
                        </Button>
                        <Button isIconOnly color="danger" variant="faded" aria-label="Take a photo"
                            onClick={() =>
                            deleteItemFromMenuBd(softDrink.id, softDrink.name, softDrink.picture)
                          }>
                        <AiFillDelete />
                        </Button>
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            :
            <>
              {/*Componente para crear o editar una bebida*/}
              <ModalSoftDrinks
                dataEdit = {dataEdit}
                editSoftDrink = {editSoftDrink}
                setSreateNewSoftDrink = {setSreateNewSoftDrink}
                setChanges = {setChanges}
              />
            </>
            }
          </ModalBody>
          <ModalFooter className="flex  flex-row gap-1 flex-wrap">
            {createNewSoftDrink ?
                  <>
                    <Button color="warning" onClick={()=>createSoftDrinkOption()}>Crear nuevo</Button>
                    <Button color="danger" onClick={closeModalEdit}> Cerrar</Button>
                  </>:
                  <>
                    <Button color="danger" onClick={comeBack}>
                      Atrás
                    </Button>
                  </>
            }
          </ModalFooter>
    </>
  );
}

export default ManageSoftDrinks;
