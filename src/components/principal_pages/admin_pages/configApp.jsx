import "../../../stylesheets/principal_pages/admin_pages/config.css";
import {Modal, ModalContent, Button} from "@nextui-org/react";
import { useState, useEffect } from "react";
import ModalEdit from "./configComponents/modalEditInfoBussiness";
import { FaEdit } from 'react-icons/fa';
import getCookie from "../../Scripts/getCookies";
import { useSelector } from "react-redux";

function ConfigApp() {
  const id_business = useSelector((state) => state.auth.id_business);
  const url = process.env.REACT_APP_URL_HOST;
  const [bussinessInfo, setBussinessInfo] = useState([{}]);

  const getInfoBusinessFunction =()=>{
    fetch(`${url}getInfoBusiness?linkTo=id&equalTo=${id_business}`, {
      method: "GET",
      mode: "cors",
      headers: {
        Authorization: "Token " + getCookie("token"),
        Module: "business",
      }
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.status === 200) {
          setBussinessInfo(data.results);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }
  useEffect(() => {
    getInfoBusinessFunction();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[url]);


    /*Manejador Modal*/
    const [modalEditMenu, setModalIsOpenEditMenu] = useState(false);
    const closeModalEditMenu = () => {
      setModalIsOpenEditMenu(false);
    };
    /***************************/
  return (
    <>
      <section className="section_config">
        <h3>Información de la empresa</h3>
        <div>
          {bussinessInfo.length > 0 ? (
            <div className="section_config_info_container">
              <img src={url + bussinessInfo[0]["logo"]} alt="" />
              <h4>{bussinessInfo[0]["nameBusiness"]}</h4>
              <div className="section_config_info_container--moreInfo">
                <p><strong>{bussinessInfo[0]["description"]}</strong></p>
                <p>NIT:<strong>{bussinessInfo[0]["documentBusiness"]}</strong></p>
                <p>Dirección: <strong>{bussinessInfo[0]["address"]}</strong></p>
                <p>Teléfono: <strong>{bussinessInfo[0]["numberPhone"]}</strong> </p>
                <p>Horarios: <strong>{bussinessInfo[0]["officeHours"]}</strong></p>
              </div>
            </div>
          ) : (
            <div className="section_config_info_container">
              <h4>No hay información disponible aún.</h4>
            </div>
          )}
        </div>
        <div>
          <Button color="primary" onClick={()=>setModalIsOpenEditMenu(true)} endContent={<FaEdit/>}>Editar información</Button>
        </div>


        <Modal
        className="modal_config my-12"
        isOpen={modalEditMenu}
        onOpenChange={closeModalEditMenu}
        scrollBehavior={"inside"}
        size="2xl">
        <ModalContent className="">
          <ModalEdit closeModalEdit={closeModalEditMenu} bussinessInfo={bussinessInfo}/>
        </ModalContent>
      </Modal>
      </section>
    </>
  );
}
export default ConfigApp;
