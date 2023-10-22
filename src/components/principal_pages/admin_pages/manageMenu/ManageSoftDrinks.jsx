import { useEffect, useState } from "react";
import getCookie from "../../../Scripts/getCookies";
import { AiFillDelete, AiFillEdit } from "react-icons/ai";
import compressImage from "../../../Scripts/comprimirImg"
import { useSelector } from "react-redux";
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
  Input,
  Textarea
} from "@nextui-org/react";


function ManageSoftDrinks({ closeModalEdit, sendState }) {
  const [createNewSoftDrink, setSreateNewSoftDrink] = useState(true)
  const [softDrinks, setSoftDrinks] = useState([]);
  const [haveChanges,setChanges] = useState(false)
  const url = useSelector((state) => state.auth.url);
  const idUser = useSelector((state) => state.auth.id_user);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [photo, setPhoto] = useState();
  const [amount, setAmount] = useState();
  
  /*****************************************/



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
  };

  useEffect(() => {
    getMenu();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [haveChanges]);

  const sendForm = async (e) => {
    e.preventDefault();
    const compressedImage = await compressImage(photo);
    let formData = new FormData();
    let priceFull = 0;
    if (price !== "") {
      priceFull = price;
    }
    formData.append("name", name);
    formData.append("description", description);
    formData.append("amount", amount);
    formData.append("price", priceFull);
    if (compressedImage !== "") {
      formData.append(
        "photo",
        new File([compressedImage], photo.name + ".webp", { type: "image/webp" })
      );
    }
    formData.append("menu_item_type", "soft_drinks");
    formData.append("idProfile_user", idUser);
    formData.append("new_item_menu", true);

    fetch(url, {
      method: "POST",
      mode: "cors",
      body: formData,
      headers: {
        Authorization: "Token " + getCookie("token"),
        Module: "menu_management",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 200) {
          toast.success(name + " se creo correctamente");
          setName("");
          setDescription("");
          setPrice();
          setSreateNewSoftDrink(true)
          let formRegis = document.getElementById("formRegis");
          formRegis.reset();
        } else if (data.status === 404) {
          console.log("error 409");
        }
      });
      setChanges(true)
      sendState()
  };

  const deleteItemFromMenuBd=(id, name)=>{
    confirmAlert({
      title: "Confirmación de eliminación",
      message: `¿Estás seguro que deseas eiliminar a ${name}?`,
      buttons: [
        {
          label: "Sí",
          onClick: () => {
            fetch(url, {
              method: "DELETE",
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
              });
              sendState()
          },
        },
        {
          label: "No",
          onClick: () => {}, // No hace nada
        },
      ],
    });
  }

  const editItemFromMEnuBD=(id,name,description,price,photo,amount)=>{
    setSreateNewSoftDrink(false)
    setName(name)
    setDescription(description)
    setPrice(price)
    setAmount(amount)
  }
  
  const comeBack=()=>{
    setSreateNewSoftDrink(true)
    setName("")
    setDescription("")
    setPrice("")
    setAmount("")
    setPhoto("")
  }
  return (
    <>
      <div className="modal-dialog">
        <div className="modal-content ">
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
                        <Button isIconOnly color="warning" variant="faded" aria-label="Take a photo"                         onClick={()=>
                          editItemFromMEnuBD(
                            softDrink.id,
                            softDrink.name,
                            softDrink.description,
                            softDrink.price,
                            softDrink.picture,
                            softDrink.amount
                            
                            )}  >
                        <AiFillEdit/>
                        </Button>
                        <Button isIconOnly color="danger" variant="faded" aria-label="Take a photo" 
                            onClick={() =>
                            deleteItemFromMenuBd(softDrink.id, softDrink.name)
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
              <ModalBody className="mb-4">
                <h5>Crear producto</h5>
                <form
                  id="formRegis"
                  encType="multipart/form-data"
                  onSubmit={(e) => {
                    sendForm(e);
                  }}
                >
                  <div className="mb-3">
                    <label htmlFor="name">Nombre</label>
                    <Input
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                      }}
                      id="name"
                      variant="faded"
                      radius="sm"
                      type="text"
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="description">Descripción</label>
                    <Textarea
                      value={description}
                      onChange={(e) => {
                        setDescription(e.target.value);
                      }}
                      id="description"
                      rows="3"
                      placeholder={
                        "Describa brevemente que incluye o de que trata"
                      }
                    ></Textarea>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="name">Precio</label>
                    <Input
                      value={price}
                      onChange={(e) => {
                        setPrice(e.target.value);
                      }}
                      id="name"
                      variant="faded"
                      radius="sm"
                      type="number"
                      placeholder="0.00"
                      labelPlacement="outside"
                      startContent={
                        <div className="pointer-events-none flex items-center">
                          <span className="text-default-400 text-small">$</span>
                        </div>
                      }
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="amount">Cantidad</label>
                    <Input
                      value={amount}
                      onChange={(e) => {
                        setAmount(e.target.value);
                      }}
                      id="amount"
                      variant="faded"
                      radius="sm"
                      type="number"
                      placeholder="0"
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="formFile" className="form-label colorBlack">
                      Foto
                    </label>
                    <input
                      type="file"
                      id="formFile"
                      className="form-control"
                      onChange={(e) => setPhoto(e.target.files[0])}
                    />
                  </div>
                  <Button type="submit" color="primary">
                    Submit
                  </Button>
                  <Button color="danger" onClick={comeBack}>
                    Atrás
                  </Button>
                </form>
              </ModalBody>
            </>
            }

            <div className="flex  flex-row gap-1 flex-wrap">
              {createNewSoftDrink &&
                <>
                  <Button color="warning" onClick={()=>setSreateNewSoftDrink(false)}>Crear nuevo</Button>
                  <Button color="danger" onClick={closeModalEdit}> Cerrar</Button>
                </>
              }
            </div>
          </ModalBody>
        </div>
      </div>
    </>
  );
}

export default ManageSoftDrinks;
