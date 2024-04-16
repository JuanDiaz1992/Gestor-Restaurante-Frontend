import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import getCookie from "../../../Scripts/getCookies";
import {AiFillCloseCircle} from "react-icons/ai";
import { confirmAlert } from "react-confirm-alert";
import compressImage from "../../../Scripts/comprimirImg"
import validateData from "../../../Scripts/validateData";
import GoToTop from "../../../Scripts/OnTop"
import {
  Button,
  Input,
  Textarea,
  Card,
  CardFooter,
  Image,
  CardBody,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure
} from "@nextui-org/react";
import { toast } from "react-hot-toast";

function Beginning(props){
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    const url = process.env.REACT_APP_URL_HOST;
    const idUser = useSelector((state) => state.auth.id_user);
    /*Sección de estados*/
    const [item, setItem] = useState([]); /*Aquí se almacenan los elementos creados en la bd*/
    const [updateItems, setUpdateItems] = useState(false); /*Este estado se usa para el useEffect para el momento en que se agrego una especialidad a la bd*/
    /*Inputs del formulario*/
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [photo, setPhoto] = useState();
    /*Sección de funciones*/
    /*Función que trae solo el item de la bd*/
    const menu_data = async () => {
      try {
        const response = await fetch(`${url}items_menu_from_creator/`, {
          method: "GET",
          mode: "cors",
          headers: {
            Authorization: "Token " + getCookie("token"),
            Module: "menu_management",
          },
        });
        const data = await response.json();
        if (data.status === 200) {
          const results = data.results;
          const ItemFilter = results.filter(
            (item) => item.menu_item_type === props.nameItem
          );
          setItem(ItemFilter);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    /*Función que crea nuevos elementos para el menú, este es el formulario*/
    let formOK = validateData(name, 1, 4);
    const sendForm = async  (e) => {
      e.preventDefault();
      const compressedImage = await compressImage(photo);
      let formData = new FormData();
      let priceFull = 0
      if(price!==""){
        priceFull = price
      }
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", priceFull);
      if (compressedImage !== "") {
        formData.append(
          "photo",
          new File([compressedImage], photo.name + ".webp", { type: "image/webp" })
        );
      }
      formData.append("menu_item_type", props.nameItem);
      formData.append("idProfile_user", idUser);
      formData.append("new_item_menu", true);
      if(formOK){
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
              props.setChangeFather(true);
              setUpdateItems(true);
              setName("");
              setDescription("");
              setPrice();
              let formRegis = document.getElementById('formRegis');
              formRegis.reset();
              onOpenChange()
            } else if (data.status === 404) {
              console.log("error 409");
            }
          });
      }

    };
    /*Cuando se agrega un nuevo elemento, se actualizan con este hook*/
    useEffect(() => {
      menu_data();
      setUpdateItems(false);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [updateItems]);

    /*Esta función es la que selecciona que elementos que van a ir en el menú del día*/
    const selectItem = async (id, name) => {
      const selectedSpeciality = item.find((items) => items.id === id);
      try {
        const response = await fetch(`${url}`, {
          method: "POST",
          mode: "cors",
          headers: {
            Authorization: "Token " + getCookie("token"),
            Module: "menu_management",
          },
          body: JSON.stringify({
            item: selectedSpeciality,
            menu_temp: true,
          }),
        });
        const data = await response.json();
        if (data.status === 200) {
          props.setChangeFather(true);
          toast.success(name + " se agregó al menú");
        } else if (data.status === 404) {
          toast.error(name + " ya está en el menú");
        }
      } catch (error) {
        console.log(error);
      }
    };

    const deleteItem = (id, name, picture) => {
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
                  id: id,
                  delete_item_bd_from_menu: true,
                }),
              })
                .then((response) => response.json())
                .then((data) => {
                  if (data.status === 200) {
                    setUpdateItems(true);
                    props.setChangeFather(true);
                    toast.success(name + " se eliminó de " + props.nameCategoryItem);
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

    /**MODAL**/
    
return(

    <>
      <>
        {item.length !== 0 ? (
          <>
            <h4>{props.nameCategoryItem}</h4>
            <div className="cardContainerMenu max-w-[900px] gap-2 grid grid-cols-12 grid-rows-2 px-8">
              {item.map((item) => (
                <div className="cardContainerMenu--div" key={item.id}>
                  <button onClick={()=>deleteItem(item.id, item.name, item.picture)} className="cardContainerImg__buttonDelete"><AiFillCloseCircle/></button>
                  <Card
                    className="cardEspecialities"
                    shadow="sm"
                    isPressable
                    onClick={() => {
                      selectItem(item.id, item.name);
                    }}
                  >
                    <CardBody className="overflow-visible p-0 cardContainerImg">
                      <Image
                        shadow="sm"
                        radius="lg"
                        alt={item.title}
                        className="opacity-1"
                        src={url + item.picture}
                      />
                    </CardBody>
                    <CardFooter className="text-small justify-between">
                      <b>{item.name}</b>
                      {item.price>0 && <b>{item.price}</b>}
                    </CardFooter>
                  </Card>
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="especialitiesEmpty">
              <h4>
                Aún no hay {props.onlyNameCategory}s creados, ingresa una en el siguiente
                formulario para empezar.
              </h4>
            </div>
          </>
        )}
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1"></ModalHeader>
                <ModalBody>
                  <div className="formEspecialitiesContainer">
                    <h4>Agregar {props.onlyNameCategory}</h4>
                    <form
                      id="formRegis"
                      encType="multipart/form-data"
                      onSubmit={(e) => {
                        sendForm(e);
                      }}
                    >
                      <div className="mb-3">
                        <label htmlFor="name">Nombre {props.labelNameItem}</label>
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
                          placeholder={"Describa brevemente que incluye o de que trata " + props.labedescriptionItem}
                        ></Textarea>
                      </div>
                      {props.type_menu === "especialities" &&
                        <div className="mb-3">
                        <label htmlFor="name">Precio de {props.labelNameItem}</label>
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
                      }
                      <div className="mb-3">
                        <label htmlFor="formFile" className="form-label colorBlack">
                          Foto
                        </label>
                        <input
                          type="file"
                          accept="image/*"
                          id="formFile"
                          className="form-control"
                          onChange={(e) => setPhoto(e.target.files[0])}
                        />
                      </div>
                      <Button type="submit" color={formOK? "primary":"secondary"} variant="bordered">
                        Crear item
                      </Button>
                    </form>
                  </div>
                </ModalBody>
                <ModalFooter>
                    <Button color="danger" variant="light" onPress={onClose}>
                      Cerrar
                    </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
        <Button className="button_add_new_item_from_creator_menu" onPress={onOpen}>Agregar {props.onlyNameCategory}</Button>
      </>
      <GoToTop/>
  </>
)
}

export default Beginning