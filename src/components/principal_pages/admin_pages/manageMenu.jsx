import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {Button, Tooltip } from "@nextui-org/react";
import {AiFillCloseCircle} from "react-icons/ai"
import { Toaster, toast } from "react-hot-toast";
import getCookie from "../../Scripts/getCookies"
import Specialities from "./manageMenu/specialties";
import Soups from "./manageMenu/soup";
import Beginnings from "./manageMenu/beginning";
import Meats from "./manageMenu/meat";
import Drinks from "./manageMenu/drinks";
import Swal from "sweetalert2";

function ManageMenu() {
  const url = useSelector((state) => state.auth.url);

  const [isMenuCreated, setMenuCreate] = useState(false);
  const [menuSection, setMenuSection] = useState(0);
  const [seeMEnuOption, setSeeMenuOption] = useState();
  const [childrenUpdate,setChildrenUpdate] = useState(false);

  /*Los siguientes son los estados que guardan cada uno de los elementos del menú*/

  const [isChange,setChange] = useState(false)

  /*El siguiente es el menú temporal el cual se guarda en la sesión antes de guardarlo en la bd*/
  const [menuTemp,setMenuTemp] = useState([]);


  /*Este bloque de codigo obtiene los elementos del creador de menú temporal*/
  const menu_data_temp = async () =>{
    try{
      const response = await fetch(
        `${url}items_menu_temp/`,
        {
          method: "GET",
          mode: "cors",
          headers: {
            Authorization: "Token " + getCookie("token"),
            Module: "menu_management",
          },
        }

      );
      const data = await response.json();
      if (data.status === 200){
        setMenuTemp(data.results)
      }else{
        setMenuTemp([])
      }
    }catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  const deleteItemOfMenu= async (id, name)=>{
    try{
      const response = await fetch(url,{
          method: "DELETE",
          mode: "cors",
          body: JSON.stringify({
            idItemMenu: id,
            delete_item_data: true,
        }),
          headers: {
            Authorization: "Token " + getCookie("token"),
            Module: "menu_management",
          }
          
        }

      );
      const data = await response.json();
      if (data.status === 200){
        toast.success(name + " eliminado del menú",
        {
          icon: '🗑️',
          style: {
            borderRadius: '10px',
            background: 'rgba(139, 0, 0, 0.75)',
            color: 'white',
          },
        });
        setChange(true)
      }
    }catch (error) {
      console.error("Error fetching data:", error);
    }

  }

  /*Este useEffect refresca el menú temporal y los elementos del menú ya creados*/
  useEffect(()=>{
     menu_data_temp();
    setChange(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[isChange])

/*********************************************************/
  const viewSectionMenu = () => {   /*Este elemento se llama para incrementar un número el cual decide que opción del menú elegir*/
    let suma = menuSection + 1;
    setMenuSection(suma);
    switchMenu(suma)
  };
  const goBack=()=>{                /*Este elemento se llama para disminuir un número el cual decide que opción del menú elegir*/
    let resta = menuSection - 1;
    setMenuSection(resta);
    switchMenu(resta)
  }
  const switchMenu =(operador)=>{   /*Este es el switch menú, el cuál muestra un elemento del menú de acuerdo a la variable que recibe como parámetro*/
    switch (operador) {
      case 1:
        setSeeMenuOption(
        <Specialities 
        setChangeFather = {setChange}
        setChildrenUpdate = {setChildrenUpdate}
        />);
        break;
      case 2:
        setSeeMenuOption(
        <Soups
        setChangeFather = {setChange}
           />);
        break;
      case 3:
        setSeeMenuOption(
        <Beginnings
        setChangeFather = {setChange}
         />);
        break;
      
      case 4:
        setSeeMenuOption(
        <Meats
        setChangeFather = {setChange}
           />);
        break;
      case 5:
        setSeeMenuOption(
        <Drinks 
        setChangeFather = {setChange}
        />);
        break;
      default:
        setMenuSection(0);
        setSeeMenuOption(<></>);
        break;
    }
  }
  useEffect(()=>{
    if(childrenUpdate){
      viewSectionMenu()
      setChildrenUpdate(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[childrenUpdate])

  const createMenu =()=>{
    let soups = menuTemp.some((item) => item.menu_item_type === "soups");
    let beginning = menuTemp.some((item) => item.menu_item_type === "beginning");
    let meats = menuTemp.some((item) => item.menu_item_type === "meats");
    let drinks = menuTemp.some((item) => item.menu_item_type === "drinks");

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
      fetch(url,{
        method: "POST",
        mode: "cors",
        headers:{
          Authorization: "Token " + getCookie("token"),
          Module: "menu_management",
        },
        body:JSON.stringify({
          create_menu:true
        })
      })
      .then(response =>response.json())
      .then(data=>{
        console.log(data)
      })
    }
    
   
  }



  return (
    <>
      <section className="section sectionMen">
        <h2 className="textoCentrado principalTitle">Gestionar el menú del día</h2>
        <div className="sectionMenu_div--container">
          
            
            {menuTemp.length !== 0? 
            <> 
            <div className="menuContainer sticky">
              <h4>Menú para hoy:</h4>
                <div className="buttomsEspcialitiesContainer">
                {menuTemp.map((item)=>(
                  <Tooltip key={item.id}  content="Eliminar del menú" color="danger" placement="right">
                    <Button 
                      color={item.menu_item_type === "especialities"? "primary" : 
                            item.menu_item_type === "soups"? "warning": 
                            item.menu_item_type === "beginning"? "success" : 
                            item.menu_item_type === "meats"? "danger" : 
                            item.menu_item_type === "drinks"? "secondary" : ""} 
                      variant="flat" 
                      endContent={<AiFillCloseCircle/>} 
                      onClick={()=>{deleteItemOfMenu(item.id, item.name)}}
                      >{item.name} 
                    </Button>   
                  </Tooltip>             
                ))}
                </div>
              </div>
            </>
            :
            <>
            </>}
          
          {isMenuCreated ? (
            <></>
          ) : (

            <div className={"menuCreator " + (menuTemp.length !== 0? "menuCreator70" : "menuCreator100")}>
              {menuSection === 0 ? <h4>Deseas crear el menú para hoy?</h4> : <></>}
              
              {seeMEnuOption}
              
              <div className="buttomsContainer">
                {menuSection ===0 ? <></>:
                <Button color="danger" onClick={()=>{goBack()}}>Atrás</Button>}
                {menuSection >=5 ? 
                <>
                  <Button 
                    color ="success"
                    onClick={() => {
                      createMenu();
                    }}
                  >
                    Crear Menú
                  </Button>
                </>
                : 
                <>
                  <Button 
                    color ="success"
                    onClick={() => {
                      viewSectionMenu();
                    }}
                  >
                    {menuSection === 0 ? "Iniciar" : "Siguiente"}
                  </Button>
                </>}

              </div>

            </div>

          )}
        </div>
        <Toaster position="top-center" reverseOrder={true} />
      </section>
    </>
  );
}

export default ManageMenu;
