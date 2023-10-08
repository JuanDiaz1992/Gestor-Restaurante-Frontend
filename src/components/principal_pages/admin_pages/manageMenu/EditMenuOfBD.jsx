import { useEffect, useState, useMemo } from "react";
import getCookie from "../../../Scripts/getCookies";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import compressImage from "../../../Scripts/comprimirImg";
import {
  Listbox,
  ListboxItem,
  Button,
  ModalHeader,
  ModalBody,
  Spinner,
  Input,
  Textarea,
  Select,
  SelectItem,
} from "@nextui-org/react";
import date from "../../../Scripts/obtenerFechaActual";

function EditMenuOfBD(props) {
  const { idMenuFather, setIsChangeFather, closeModalEdit } = props;
  const idUser = useSelector((state) => state.auth.id_user);
  const url = useSelector((state) => state.auth.url);
  const [allItems, setAllItems] = useState([]);
  const [specialities, setEspecialities] = useState([]);
  const [soups, setSoups] = useState([]);
  const [beginning, setBegining] = useState([]);
  const [meats, setMeats] = useState([]);
  const [drinks, setDrinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [haveChanges,setChanges] = useState(false)


  /*Estados para el envio del formulario para item nuevo*/
  const [createItem, setCreateItem] = useState(false);
  const [typeSelect, setTypeSelect] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [photo, setPhoto] = useState();
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
        const results = data.results;

        const resultFilter = results.filter((result) => {
          return !props.allResults.some(
            (isInMenuresult) => isInMenuresult.name === result.name
          );
        });
        setAllItems(resultFilter);
        setEspecialities(
          resultFilter.filter(
            (especialitie) => especialitie.menu_item_type === "especialities"
          )
        );
        setSoups(
          resultFilter.filter(
            (especialitie) => especialitie.menu_item_type === "soups"
          )
        );
        setBegining(
          resultFilter.filter(
            (especialitie) => especialitie.menu_item_type === "beginning"
          )
        );
        setMeats(
          resultFilter.filter(
            (especialitie) => especialitie.menu_item_type === "meats"
          )
        );
        setDrinks(
          resultFilter.filter(
            (especialitie) => especialitie.menu_item_type === "drinks"
          )
        );
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setLoading(false);
  };
  useEffect(() => {
    menu_data();
    setChanges(false)
  }, [haveChanges]);

  const [selectedKeys, setSelectedKeys] = useState([]);
  const selectedValue = useMemo(
    () => Array.from(selectedKeys).join(","),
    [selectedKeys]
  );

  const editMenu = () => {
    const dateTime = date();
    const array = selectedValue.split(",");
    const ids = array.map((number) => parseInt(number));
    fetch(url, {
      method: "POST",
      mode: "cors",
      headers: {
        Authorization: "Token " + getCookie("token"),
        Module: "menu_management",
      },
      body: JSON.stringify({
        dateTime: dateTime,
        ids: ids,
        idMEnu: idMenuFather,
        edit_menu: true,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 200) {
          toast.success("Los items se agregaron correctamente al menú");
          closeModalEdit();
          setIsChangeFather(true);
        } else {
          toast.error("a ocurrido un error");
        }
      });
  };

  /*Función que crea nuevos elementos para el menú, este es el formulario*/
  const sendForm = async (e) => {
    e.preventDefault();
    const compressedImage = await compressImage(photo);
    console.log(compressedImage);
    let formData = new FormData();
    let priceFull = 0;
    if (price !== "") {
      priceFull = price;
    }
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", priceFull);
    formData.append(
      "photo",
      new File([compressedImage], photo.name + ".webp", { type: "image/webp" })
    );
    formData.append("menu_item_type", typeSelect);
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
          setTypeSelect("")
          setCreateItem(false)
          let formRegis = document.getElementById("formRegis");
          formRegis.reset();
        } else if (data.status === 404) {
          console.log("error 409");
        }
      });
      setChanges(true)
  };


  return (
    <>
      <div className="modal-dialog">
        <div className="modal-content ">
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
                {specialities.length > 0 && (
                  <div>
                    <h3>Especialidades</h3>
                    <Listbox
                      className="edit_menu_containers"
                      aria-label="Multiple selection example"
                      variant="faded"
                      selectionMode="multiple"
                      selectedKeys={selectedKeys}
                      onSelectionChange={setSelectedKeys}
                    >
                      {specialities.map((item) => (
                        <ListboxItem
                          key={item.id}
                          variant="faded"
                          radius="full"
                          color="success"
                        >
                          {item.name}
                        </ListboxItem>
                      ))}
                    </Listbox>
                  </div>
                )}
                {soups.length > 0 && (
                  <div>
                    <h3>Sopas</h3>
                    <Listbox
                      className="edit_menu_containers"
                      aria-label="Multiple selection example"
                      variant="faded"
                      selectionMode="multiple"
                      selectedKeys={selectedKeys}
                      onSelectionChange={setSelectedKeys}
                    >
                      {soups.map((item) => (
                        <ListboxItem
                          key={item.id}
                          variant="faded"
                          radius="full"
                          color="success"
                        >
                          {item.name}
                        </ListboxItem>
                      ))}
                    </Listbox>
                  </div>
                )}
                {beginning.length > 0 && (
                  <div>
                    <h3>Principios</h3>
                    <Listbox
                      className="edit_menu_containers"
                      aria-label="Multiple selection example"
                      variant="faded"
                      selectionMode="multiple"
                      selectedKeys={selectedKeys}
                      onSelectionChange={setSelectedKeys}
                    >
                      {beginning.map((item) => (
                        <ListboxItem
                          key={item.id}
                          variant="faded"
                          radius="full"
                          color="success"
                        >
                          {item.name}
                        </ListboxItem>
                      ))}
                    </Listbox>
                  </div>
                )}
                {meats.length > 0 && (
                  <div>
                    <h3>Carnes</h3>
                    <Listbox
                      className="edit_menu_containers"
                      aria-label="Multiple selection example"
                      variant="faded"
                      selectionMode="multiple"
                      selectedKeys={selectedKeys}
                      onSelectionChange={setSelectedKeys}
                    >
                      {meats.map((item) => (
                        <ListboxItem
                          key={item.id}
                          variant="faded"
                          radius="full"
                          color="success"
                        >
                          {item.name}
                        </ListboxItem>
                      ))}
                    </Listbox>
                  </div>
                )}
                {drinks.length > 0 && (
                  <div>
                    <h3>Bebidas</h3>
                    <Listbox
                      className="edit_menu_containers"
                      aria-label="Multiple selection example"
                      variant="faded"
                      selectionMode="multiple"
                      selectedKeys={selectedKeys}
                      onSelectionChange={setSelectedKeys}
                    >
                      {drinks.map((item) => (
                        <ListboxItem
                          key={item.id}
                          variant="faded"
                          radius="full"
                          color="success"
                        >
                          {item.name}
                        </ListboxItem>
                      ))}
                    </Listbox>
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
              <ModalBody className="mb-4">
                <h5>Crear nuevo item</h5>
                <form
                  id="formRegis"
                  encType="multipart/form-data"
                  onSubmit={(e) => {
                    sendForm(e);
                  }}
                >
                  <div className="mb-3">
                    <Select
                      color="default"
                      label="Seleccione el tipo"
                      className="max-w-xs"
                      value={typeSelect}
                      onChange={(e)=>setTypeSelect(e.target.value)}
                    >
                      <SelectItem key={"especialities"}>Especialidad</SelectItem>
                      <SelectItem key={"soups"}>Sopas</SelectItem>
                      <SelectItem key="beginning">Principios</SelectItem>
                      <SelectItem key="meats">Carnes</SelectItem>
                      <SelectItem key="drinks">Bebidas</SelectItem>
                    </Select>
                  </div>
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
                  <Button color="danger" onClick={() => setCreateItem(false)}>
                    Atrás
                  </Button>
                </form>
              </ModalBody>
            </>
          )}
          <div className="flex  flex-row gap-1 flex-wrap">
            {!createItem ? (
              <>
                {allItems.length !== 0 && (
                  <Button
                    color={selectedValue === "" ? "default" : "success"}
                    onClick={selectedValue === "" ? "" : editMenu}
                  >
                    Aceptar
                  </Button>
                )}
                <Button color="warning" onClick={() => setCreateItem(true)}>
                  Crear nuevo
                </Button>
                <Button color="danger" onClick={closeModalEdit}>
                  Cerrar
                </Button>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
}

export default EditMenuOfBD;
