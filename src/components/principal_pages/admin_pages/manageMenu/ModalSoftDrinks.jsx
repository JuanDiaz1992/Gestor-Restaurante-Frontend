import { ModalBody, Input, Textarea, Button } from "@nextui-org/react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import compressImage from "../../../Scripts/comprimirImg";
import validateData from "../../../Scripts/validateData";
import getCookie from "../../../Scripts/getCookies";

function ModalSoftDrinks({
    editSoftDrink,
    sendState,
    setSreateNewSoftDrink,
    setChanges,
    dataEdit
  }) {
  const url = process.env.REACT_APP_URL_HOST;
  const idUser = useSelector((state) => state.auth.id_user);
  const [name, setName] = useState(dataEdit[1]?dataEdit[1]:"");
  const [description, setDescription] = useState(dataEdit[2]?dataEdit[2]:"");
  const [price, setPrice] = useState(dataEdit[3]?dataEdit[3]:"");
  const [amount, setAmount] = useState(dataEdit[4]?dataEdit[4]:"");
  const [photo, setPhoto] = useState();
  /*****************************************/

  let formOK = false;
  //Valida si los datos son correctos dependiendiendo si es una edición o una creación de bebida
  if (editSoftDrink) {
    if (name !== dataEdit[1] ||
        description !== dataEdit[2] ||
        parseInt(price) !== dataEdit[3] ||
        parseInt(amount) !== dataEdit[4]) {
          validateData([name, price, amount], 2, 4) ? formOK = true : formOK = false;
    }else if(photo && validateData([name, price, amount], 2, 4)){
      formOK = true
    }
    else{
      formOK = false;
    }
  }else{
    formOK = validateData([name, price, amount], 2, 4);
  }

  const sendForm = async (e) => {
    e.preventDefault();
    let formData = new FormData();
    const compressedImage = await compressImage(photo);
    let priceFull = 0;
    if (price !== "") {
      priceFull = price;
    }
    formData.append("name", name);
    formData.append("description", description);
    formData.append("amount", parseInt(amount));
    formData.append("price", parseInt(priceFull));
    formData.append("menu_item_type", "soft_drinks");
    formData.append("idProfile_user", idUser);
    if (compressedImage !== "") {
      formData.append(
        "photo",
        new File([compressedImage], photo.name + ".webp", {
          type: "image/webp",
        })
      );
    }
    if (editSoftDrink) {
      formData.append("idItem", dataEdit[0]);
      if(compressedImage !== ""){
        formData.append("beforePicture", dataEdit[5]);
      }
      formData.append("edit_item_menu", true);
    } else {
      formData.append("new_item_menu", true);
    }
    if (formOK) {
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
            if(editSoftDrink){
              toast.success(name + " se editó correctamente");
            }else{
              toast.success(name + " se añadió correctamente");
            }
            setName("");
            setDescription("");
            setPrice();
            setSreateNewSoftDrink(true);
            let formRegis = document.getElementById("formRegis");
            formRegis.reset();
          } else if (data.status === 404) {
            console.log("error 409");
          }
        });
      setChanges(true);
      sendState();
    }
  };
  return (
    <>
      <ModalBody className="mb-4">
        <h5>{editSoftDrink ? "Editar Producto" : "Crear Producto"}</h5>
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
          <Button type="submit" color={formOK ? "primary" : "secondary"}>
            Submit
          </Button>
        </form>
      </ModalBody>
    </>
  );
}
export default ModalSoftDrinks;
