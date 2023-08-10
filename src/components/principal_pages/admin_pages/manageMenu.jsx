import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {Button} from "@nextui-org/react";
import getCookie from "../../Scripts/getCookies"
import Specialities from "./manageMenu/specialties";
import Soups from "./manageMenu/soup";
import Beginnings from "./manageMenu/beginning";
import Meats from "./manageMenu/meat";
import Drinks from "./manageMenu/drinks";

function ManageMenu() {
  const url = useSelector((state) => state.auth.url);

  const [isMenuCreated, setMenuCreate] = useState(false);
  const [menuSection, setMenuSection] = useState(0);
  const [seeMEnuOption, setSeeMenuOption] = useState();
  const [childrenUpdate,setChildrenUpdate] = useState(false);

  /*Los siguientes son los estados que guardan cada uno de los elementos del menú*/
  const [specialties,setEspecialities] = useState([]);
  const [soups,setSoups] = useState([]);
  const [beginning,setBeginning] = useState([]);
  const [meats,setMeat] = useState([]);
  const [drinks,setDrinks] = useState([]);
  const [isChange,setChange] = useState(false)

  /*El siguiente es el menú temporal el cual se guarda en la sesión antes de guardarlo en la bd*/
  const [menuTemp,setMenuTemp] = useState("");


  const menu_data = async () =>{
    try{
      const response = await fetch(
        `${url}items_menu/`,
        {
          method: "GET",
          mode: "cors",
          headers: {
            Authorization: "Token " + getCookie("token"),
            Module: "inventory",
          },
        }

      );
      const data = await response.json();
      if (data.status === 200){
        const results = data.results;
        const especialitiesFilter = results.filter(item => item.menu_item_type === "especialities");
        const soupsFilter  = results.filter(item => item.menu_item_type === "soups");
        const beginningFilter  = results.filter(item => item.menu_item_type === "beginning");
        const meatsFilter  = results.filter(item => item.menu_item_type === "meats");
        const drinksFilter  = results.filter(item => item.menu_item_type === "drinks");
        setEspecialities(especialitiesFilter);
        setSoups(soupsFilter);
        setBeginning(beginningFilter);
        setMeat(meatsFilter);
        setDrinks(drinksFilter)
      }
    }catch (error) {
      console.error("Error fetching data:", error);
    }
  }
  const menu_data_temp = async () =>{
    try{
      const response = await fetch(
        `${url}items_menu_temp/`,
        {
          method: "GET",
          mode: "cors",
          headers: {
            Authorization: "Token " + getCookie("token"),
            Module: "inventory",
          },
        }

      );
      const data = await response.json();
      if (data.status === 200){
        setMenuTemp(data.results)
      }
    }catch (error) {
      console.error("Error fetching data:", error);
    }
  }
  useEffect(()=>{
    menu_data();
    menu_data_temp();
    setChange(false);
  },[isChange])





  const viewSectionMenu = () => {
    let suma = menuSection + 1;
    setMenuSection(suma);
    switchMenu(suma)
  };
  const goBack=()=>{
    let resta = menuSection - 1;
    setMenuSection(resta);
    switchMenu(resta)
  }
  const switchMenu =(operador)=>{
    switch (operador) {
      case 1:
        console.log("caso1");
        setSeeMenuOption(
        <Specialities 
        menuTemp = {menuTemp}
        specialties = {specialties}
        setChange = {setChange}
        setChildrenUpdate = {setChildrenUpdate}/>);
        break;
      case 2:
        console.log("caso2");
        setSeeMenuOption(
        <Soups
        soups = {soups}
           />);
        break;
      case 3:
        console.log("caso3");
        setSeeMenuOption(
        <Beginnings
        beginning = {beginning}
         />);
        break;
      
      case 4:
        console.log("caso4")
        setSeeMenuOption(
        <Meats
        meats = {meats}
           />);
        break;
      case 5:
        console.log("caso5")
        setSeeMenuOption(
        <Drinks 
        drinks = {drinks}
        />);
        break;
      default:
        console.log("sale");
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

  return (
    <>
      <section className="section sectionMen">
        <h2 className="textoCentrado">Gestionar el menú del día</h2>
        <div className="sectionMenu_div--container">
          <div className="menuContainer">
            <h3>Menú</h3>
            {menuTemp !== ""? 
            <> 
              <h4>Especialidades</h4>
              {menuTemp.map((item)=>(
                  <Button color="primary" variant="ghost" key={item.id}>{item.name}</Button>                
              ))}
            </>
            :
            <>
            </>}
          </div>
          {isMenuCreated ? (
            <></>
          ) : (
            <div className="menuCreator">
              {menuSection === 0 ? <h4>Deseas crear el menú para hoy?</h4> : <></>}
              
              {seeMEnuOption}
              <div className="buttomsContainer">
                {menuSection ===0 ? <></>:<Button color="danger" onClick={()=>{goBack()}}>Atrás</Button>}
                <Button 
                  color ="success"
                  onClick={() => {
                    viewSectionMenu();
                  }}
                >
                  {menuSection === 0 ? "Iniciar" : "Siguiente"}
                </Button>
              </div>

            </div>
          )}
        </div>
      </section>
    </>
  );
}

export default ManageMenu;
