import "../../../stylesheets/principal_pages/admin_pages/config.css";
import {Modal, ModalContent, Button} from "@nextui-org/react";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import ModalEdit from "./configComponents/modalEditInfoBussiness";
import { FaEdit } from 'react-icons/fa';

function ConfigApp() {
  const [bussinessInfo, setBussinessInfo] = useState([{}]);
  useEffect(() => {
    fetch(`${url}business/`, {
      method: "GET",
      mode: "cors",
      headers: {
        Module: "business",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 200) {
          setBussinessInfo(data.results);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  },[]);

    /*Manejador Modal*/
    const [modalEditMenu, setModalIsOpenEditMenu] = useState(false);
    const url = useSelector((state) => state.auth.url);
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
              <h4>{bussinessInfo[0]["name_business"]}</h4>
              <div className="section_config_info_container--moreInfo">
                <p><strong>{bussinessInfo[0]["Description"]}</strong></p>
                <p>NIT:<strong>{bussinessInfo[0]["document_business"]}</strong></p>
                <p>Dirección: <strong>{bussinessInfo[0]["address"]}</strong></p>
                <p>Teléfono: <strong>{bussinessInfo[0]["number_phone"]}</strong> </p>
                <p>Horarios: <strong>{bussinessInfo[0]["office_hours"]}</strong></p>
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
