import React, { useState } from "react";
import { useSelector } from "react-redux";
import getCookie from "../../../Scripts/getCookies";
import {
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
} from "@nextui-org/react";
import compressImage from "../../../Scripts/comprimirImg";

export default function App({ closeModalEdit, bussinessInfo }) {
  const url = useSelector((state) => state.auth.url);
  const [nameBusiness, setNameBusiness] = useState( bussinessInfo[0]["name_business"] || "" );
  const [documentBusiness, setDocumentBusiness] = useState(bussinessInfo[0]["document_business"] || "");
  const [description, setDescription] = useState(bussinessInfo[0]["Description"] || "");
  const [address, setAddress] = useState(bussinessInfo[0]["address"] || "");
  const [numberPhone, setNumberPhone] = useState(bussinessInfo[0]["number_phone"] || "");
  const [officeHours, setOfficeHours] = useState(bussinessInfo[0]["office_hours"] || "");
  const [logo, setLogo] = useState("");

  const sendForm = async () => {
    if (
        nameBusiness && 
        documentBusiness && 
        description && 
        address && 
        numberPhone && 
        officeHours) {
          const newLogo = await compressImage(logo);
          let formData = new FormData();
          formData.append("nameBusiness", nameBusiness);
          formData.append("documentBusiness", documentBusiness);
          formData.append("description", description);
          formData.append("address", address);
          formData.append("officeHours", officeHours);
          formData.append("newLogo", newLogo);
          formData.append("numberPhone", numberPhone);
          formData.append(
              "photo",
              new File([newLogo], logo.name + ".webp", { type: "image/webp" })
            );
          formData.append("business_create_info", true);
          fetch(url,{
            method:"POST",
            mode:"cors",
            body:FormData,
            headers:{
              Authorization: "Token " + getCookie("token"),
              Module: "business",
            }
          })
          .then(response=>response.json())
          .then(data=>{
            console.log(data)
          })
    }


  };
  return (
    <>
      <ModalHeader className="flex flex-col gap-1">
        <h5>Editar información de la empresa</h5>
      </ModalHeader>
      <ModalBody>
        <form id="formRegis" encType="multipart/form-data">
          <div className="mb-3">
            <label htmlFor="nameBusiness">Nombre de la empresa</label>
            <Input
              value={nameBusiness}
              onChange={(e) => {
                setNameBusiness(e.target.value);
              }}
              id="nameBusiness"
              variant="faded"
              radius="sm"
              placeholder="EasyFood"
              type="text"
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="documentBusiness">Documento empresa</label>
            <Input
              value={documentBusiness}
              onChange={(e) => {
                setDocumentBusiness(e.target.value);
              }}
              id="documentBusiness"
              variant="faded"
              radius="sm"
              type="text"
              placeholder="150105-3"
              required
            />
            <p className="p_info">
              Si no cuenta con esta información, puede agregar el documento del
              representante.
            </p>
          </div>
          <div className="mb-3">
            <label htmlFor="address">Dirección</label>
            <Input
              value={address}
              onChange={(e) => {
                setAddress(e.target.value);
              }}
              id="address"
              rows="3"
              placeholder="Calle 30#28-54 Pereira - Risaralda"
              type="text"
              required
            ></Input>
          </div>
          <div className="mb-3">
            <label htmlFor="description">Descripción</label>
            <Input
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
              }}
              id="description"
              variant="faded"
              radius="sm"
              type="text"
              placeholder="Restaurante de comida típica Colombiana"
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="numberPhone">Teléfono</label>
            <Input
              value={numberPhone}
              onChange={(e) => {
                setNumberPhone(e.target.value);
              }}
              id="numberPhone"
              variant="faded"
              radius="sm"
              type="phone"
              placeholder="3005145531"
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="officeHours">Horarios</label>
            <Input
              value={officeHours}
              onChange={(e) => {
                setOfficeHours(e.target.value);
              }}
              id="officeHours"
              variant="faded"
              radius="sm"
              type="text"
              placeholder="Nuestros horarios son de lunes a sábado de 7am a 4pm"
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="formFile">Logo de su empresa</label>
            <input
              type="file"
              id="formFile"
              className="form-control"
              onChange={(e) => setLogo(e.target.files[0])}
            />
            <p className="p_info">
              Intente subir una imagen sin fondo, recuerde que este logo será
              visible en toda la aplicación.
            </p>
          </div>
        </form>
      </ModalBody>
      <ModalFooter>
        <Button
          onClick={(e) => {
            sendForm(e);
          }}
          color="primary"
        >
          Envíar información
        </Button>
        <Button color="danger" onPress={closeModalEdit}>
          Cerrar
        </Button>
      </ModalFooter>
    </>
  );
}
