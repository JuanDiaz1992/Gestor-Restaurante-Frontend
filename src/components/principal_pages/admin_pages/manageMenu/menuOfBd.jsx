import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Button, Tooltip } from "@nextui-org/react";
import { AiFillCloseCircle } from "react-icons/ai";
import { toast } from "react-hot-toast";
import { confirmAlert } from "react-confirm-alert";
import Swal from "sweetalert2";
import getCookie from "../../../Scripts/getCookies";
import obtenerIDMenu from "../../../Scripts/obtenerIDGlobalDelMenu";

function MenuOfBd(props) {

  const url = useSelector((state) => state.auth.url);
  const [specialities, setEspecialities] = useState([]);
  const [soups, setSoups] = useState([]);
  const [beginning, setBegining] = useState([]);
  const [meats, setMeats] = useState([]);
  const [drinks, setDrinks] = useState([]);
  const [allResults,setAllResults] = useState([]);
  const [isChange,setIsChange] = useState(false);
  const [idMenu,setIdMenu] = useState()

  const getMenu = async () => {
    let id = await obtenerIDMenu(url);
    setIdMenu(id)
    if (props.isMenuCreated) {
      fetch(`${url}items_menuJoin?linkTo=menu&equalTo=${id}`, {
        method: "GET",
        mode: "cors",
        headers: {
          Authorization: "Token " + getCookie("token"),
          Module: "menu_management",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setAllResults(data.results)
          setEspecialities(
            data.results.filter(
              (especialitie) => especialitie.menu_item_type === "especialities"
            )
            
          );
          setSoups(
            data.results.filter(
              (especialitie) => especialitie.menu_item_type === "soups"
            )
          );
          setBegining(
            data.results.filter(
              (especialitie) => especialitie.menu_item_type === "beginning"
            )
          );
          setMeats(
            data.results.filter(
              (especialitie) => especialitie.menu_item_type === "meats"
            )
          );
          setDrinks(
            data.results.filter(
              (especialitie) => especialitie.menu_item_type === "drinks"
            )
          );
        });
    }
  };
  useEffect(() => {
    getMenu();
    setIsChange(false)
  }, [isChange]);


  const deleteItemFromMenuBd=(id, name)=>{
    let delete_item_menu_bd_bolean = false;
    let delete_all_menu_bolean = false;
    if(allResults.length>1){
      delete_item_menu_bd_bolean = true
    }else if(allResults.length===1){
      delete_all_menu_bolean = true
    }
    try{
      fetch(url,{
        method:"DELETE",
        mode:"cors",
        headers:{
          Authorization: "Token " + getCookie("token"),
          Module: "menu_management"
        },
        body:JSON.stringify({
          idMenu: idMenu,
          id: id,
          delete_item_menu_bd: delete_item_menu_bd_bolean,
          delete_all_menu: delete_all_menu_bolean
        })
      })
      .then(response=>response.json())
      .then(data=>{
        if(data.status === 200){
          toast.success(name + " se eliminó de le menú.");
          

        }else{
          toast.error("Ha ocurrido un error al eliminar " + name + ", valide con el administrador del sistema.");
        }
        if(allResults.length===1){
          props.setMenuCreate(false);
        }
        setIsChange(true)
      })
    }catch(error){
      console.log(error)
    }

  }

  const deleteMenu=()=>{
    confirmAlert({
      title: "Confirmación de eliminación",
      message: `¿Estás seguro que deseas eiliminar todo el menú?`,
      buttons: [
        {
          label: "Sí",
          onClick: () => {
            fetch(url, {
              method: "DELETE",
              mode: "cors",
              headers: {
                Authorization: "Token " + getCookie("token"),
                'Module': 'menu_management'
              },
              body: JSON.stringify({
                delete_menu:true,
                idMenu:idMenu
              }),
            })
              .then((response) => response.json())
              .then((data) => {
                if (data.status === 200) {
                  Swal.fire({
                    title: "Eliminado",
                    text: "Menú eliminado, puedes crear uno nuevo",
                    icon: "success",
                    confirmButtonText: "Ok",
                    customClass: {
                      container: "notification-modal",
                    },
                  });
                  props.setMenuCreate(false);
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
  }
  return (
    <>
    <div className="menu_of_day_container">
      <div className="menu_of_day_container--div1">
        {specialities.length > 0 && (
          <div className="buttons_menu_container">
            <h3>Especialidades</h3>
            {specialities.map((item) => (
              <Tooltip key={item.id} color="danger" content={"Eliminar " + item.name}>
                <Button 
                  onClick={()=>deleteItemFromMenuBd(item.id, item.name)} 
                  variant="flat" 
                  radius="full"
                  color={item.state === 1? "primary" : "default"} 
                  endContent={<AiFillCloseCircle />} >{item.name}
                </Button>
              </Tooltip>
            ))}
          </div>
        )}
        {soups.length > 0 && (
          <div className="buttons_menu_container"> 
            <h3>Sopas</h3>
            {soups.map((item) => (
              <Tooltip key={item.id} color="danger" content={"Eliminar " + item.name}>
                <Button 
                  onClick={()=>deleteItemFromMenuBd(item.id, item.name)} 
                  variant="flat" 
                  radius="full" 
                  color={item.state === 1 ? "warning" : "default"} 
                  endContent={<AiFillCloseCircle />}>{item.name}
                </Button>
              </Tooltip>
            ))}
          </div>
        )}

        {beginning.length > 0 && (
          <div className="buttons_menu_container">
            <h3>Principios</h3>
            {beginning.map((item) => (
              <Tooltip key={item.id} color="danger" content={"Eliminar " + item.name}>
                <Button 
                  onClick={()=>deleteItemFromMenuBd(item.id, item.name)} 
                  variant="flat" 
                  radius="full"
                  color={item.state === 1 ? "success" : "default"} 
                  endContent={<AiFillCloseCircle />}>{item.name}
                </Button>
              </Tooltip>
            ))}
          </div>
        )}

        {meats.length > 0 && (
          <div className="buttons_menu_container">
            <h3>Carnes</h3>
            {meats.map((item) => (
              <Tooltip key={item.id} color="danger" content={"Eliminar " + item.name}>
                <Button 
                  onClick={()=>deleteItemFromMenuBd(item.id, item.name)} 
                  variant="flat" 
                  radius="full" 
                  color={item.state === 1 ? "danger" : "default"} 
                  endContent={<AiFillCloseCircle />}>{item.name}
                </Button>
              </Tooltip>
            ))}
          </div>
        )}

        {drinks.length > 0 && (
          <div className="buttons_menu_container">
            <h3>Bebidas</h3>
            {drinks.map((item) => (
              <Tooltip key={item.id} color="danger" content={"Eliminar " + item.name}>
                <Button 
                  onClick={()=>deleteItemFromMenuBd(item.id, item.name)} 
                  variant="flat" 
                  radius="full" 
                  color={item.state === 1 ? "secondary" : "default"} 
                  endContent={<AiFillCloseCircle />}>{item.name}
                </Button>
              </Tooltip>
            ))}
          </div>
        )}

      </div>
      <div className="menu_of_day_container--div2">
        <Button onClick={()=>deleteMenu()} color="danger">Eliminar Menú</Button>
        <Button>Agregar elementos</Button>
      </div>
    </div>


    </>
  );
}
export default MenuOfBd;
