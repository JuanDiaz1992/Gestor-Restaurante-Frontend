import { useState, useEffect} from "react";
import { Toaster } from "react-hot-toast";
import {Spinner} from "@nextui-org/react";
import Swal from "sweetalert2";
import getDate from "../../Scripts/obtenerFechaActual";
import getCookie from "../../Scripts/getCookies";
import obtenerIDMenu from "../../Scripts/obtenerIDGlobalDelMenu"
import CreatorMenu from "./manageMenu/creatorMenu";
import MenuTemp from "./manageMenu/menuTemp";
import MenuOfBd from "./manageMenu/menuOfBd";



function ManageMenu() {
  const url = process.env.REACT_APP_URL_HOST;
  /*Este estado actualiza la mayoria de los componentes del creador del menú*/
  const [isChange,setChange] = useState(false);
  /*El siguiente es el menú temporal el cual se guarda en la sesión antes de guardarlo en la bd*/
  const [menuTempFather,setMenuTempFather] = useState([]);
  const [newlyCreatedMenu, setNewlyCreatedMenu]= useState(false);
  const [isMenuCreated, setMenuCreate] = useState();
  const [loadingPage, setLoadingPage] = useState(true)
  const [btnCreateMenuAvalaible, setBtnCreateMenuAvalaible] = useState(true)
  /*Función que valida si ya existe un menú con la fecha actual creado*/
  const validateMenu = async ()=>{
      let getId = await obtenerIDMenu(url)
      if (getId !== 0 ) {
        setMenuCreate(true)
      }else{
        setMenuCreate(false)
      }
      setLoadingPage(false)
  }
  useEffect(()=>{
    validateMenu();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[newlyCreatedMenu])
/*********************************************************/
  /*Función que se ejecuta cuando el menú temporal está completo y lo guarda en la bd*/
  const createMenu =()=>{
    let formattedDate = getDate()
    let soups = menuTempFather.some((item) => item.menu_item_type === "soups");
    let beginning = menuTempFather.some((item) => item.menu_item_type === "beginning");
    let meats = menuTempFather.some((item) => item.menu_item_type === "meats");
    let drinks = menuTempFather.some((item) => item.menu_item_type === "drinks");

    let emptyItems = []
    if (!soups) {
      emptyItems.push("sopas");
    }if(!beginning){
      emptyItems.push("principios");
    }if(!meats){
      emptyItems.push("carnes");
    }if(!drinks){
      emptyItems.push("bebidas");
    }
    let message = "Aún faltan "
    if (emptyItems.length !== 0) {
      for (let i = 0; i < emptyItems.length; i++) {
        if (i === 0){
          message += emptyItems[i];
        }else if(i === emptyItems.length - 1){
          message += " y " + emptyItems[i];
        }else if (i < emptyItems.length && i > 0) {
          message += ", " + emptyItems[i];
        }
      }
      message += " para terminar de crear el menú"
      Swal.fire({
        title: "Error",
        text: message,
        icon: "error",
        confirmButtonText: "Ok",
        willClose: function () {},
        customClass: {
          container: "notification-modal",
        },
      });
    }else{
      setBtnCreateMenuAvalaible(false)
      setMenuTempFather([])
      fetch(url,{
        method: "POST",
        mode: "cors",
        headers:{
          Authorization: "Token " + getCookie("token"),
          Module: "menu_management",
        },
        body:JSON.stringify({
          create_menu:true,
          date : formattedDate
        })
      })
      .then(response =>response.json())
      .then(data=>{
        if(data.status === 200){
          setMenuCreate(true);
          setChange(true);
          setNewlyCreatedMenu(true)
          setBtnCreateMenuAvalaible(true)
        }
      }
      )
    }
  }



  return (
    <>
      <section className={
          "section_menu " +
          (menuTempFather.length !== 0 ? "" : "sectionMenuCenter")
        }>
        {loadingPage?
        <>
          <div className="spiner_container_creator_menu_principal">
            <Spinner label="Loading..." color="success" />
          </div>
        </>
        :
        <>
          <div className="sectionMenu_div--container">
            <MenuTemp
            isMenuCreated = {isMenuCreated}
            setMenuTempFather={setMenuTempFather}
            setChange = {setChange}
            isChange = {isChange}
            menuTempFather = {menuTempFather}
            />
            {isMenuCreated === true?
              <>
              <div>
                <MenuOfBd
                isMenuCreated={isMenuCreated}
                setMenuCreate={setMenuCreate}
                />
              </div>
              </>
            :
                <CreatorMenu
                menuTemp = {menuTempFather}
                createMenu = {createMenu}
                setChange = {setChange}
                setBtnCreateMenuAvalaible = {setBtnCreateMenuAvalaible}
                btnCreateMenuAvalaible = {btnCreateMenuAvalaible}
                />
            }
          </div>
        </>
        }
        <Toaster position="top-center" reverseOrder={true} />
      </section>
    </>
  );
}

export default ManageMenu;
