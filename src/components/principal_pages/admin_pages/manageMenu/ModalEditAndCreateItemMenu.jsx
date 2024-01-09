import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import {
    Button,
    ModalBody,
    Input,
    Textarea,
    Select,
    SelectItem,
    ModalFooter
    } from "@nextui-org/react";
import getCookie from "../../../Scripts/getCookies";
import compressImage from "../../../Scripts/comprimirImg";
import validateData from "../../../Scripts/validateData";

function ModalEditAndCreateItemMenu({createItem, setCreateItem, setChanges, labelNameItem}) {
  const [typeSelect, setTypeSelect] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState();
  const [photo, setPhoto] = useState();
  const url = process.env.REACT_APP_URL_HOST;
  let DataOk = validateData([name, typeSelect], 2, 4);
  useEffect(() => {
    if (!createItem) {
      setName("");
      setDescription("");
      setPrice();
      setPhoto(null);
    }
  }, [createItem]);
  const idUser = useSelector((state) => state.auth.id_user);




  const sendForm = async () => {
    const compressedImage = await compressImage(photo);
    let formData = new FormData();
    let priceFull = 0;
    if (price > 0) {
      priceFull = price;
    }
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", priceFull);
    if (compressedImage) {
      formData.append(
        "photo",
        new File([compressedImage], photo.name + ".webp", {
          type: "image/webp",
        })
      );
    }
    formData.append("menu_item_type", typeSelect);
    formData.append("idProfile_user", idUser);
    formData.append("new_item_menu", true);
    if (DataOk) {
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
            setTypeSelect("");
            setCreateItem(false);
            let formRegis = document.getElementById("formRegis");
            formRegis.reset();
          } else if (data.status === 404) {
            console.log("error 409");
          }
        });
      setChanges(true);
    }
  };


  return (
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
              onChange={(e) => setTypeSelect(e.target.value)}
            >
              <SelectItem key="especialities">Especialidad</SelectItem>
              <SelectItem key="soups">Sopas</SelectItem>
              <SelectItem key="beginning">Principios</SelectItem>
              <SelectItem key="meats">Carnes</SelectItem>
              <SelectItem key="drinks">Bebidas</SelectItem>
            </Select>
          </div>
          <div className="mb-3">
            <label htmlFor="name">Nombre {labelNameItem}</label>
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
              placeholder={"Describa brevemente que incluye o de que trata"}
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
        </form>
      </ModalBody>
      <ModalFooter className="flex  flex-row gap-1 flex-wrap">
        <Button onClick={sendForm} color={DataOk ? "primary" : "default"}>
          Submit
        </Button>
        <Button color="danger" onClick={() => setCreateItem(false)}>
          Atrás
        </Button>
      </ModalFooter>
    </>
  );
}
export default ModalEditAndCreateItemMenu;
