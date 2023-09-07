import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import getCookie from "../../../Scripts/getCookies";
import obtenerIDMenu from "../../../Scripts/obtenerIDGlobalDelMenu"

function MenuOfBd(props){
    
    const url = useSelector((state) => state.auth.url);
    const [itemsMenu, setItemsMenu] = useState();
    const [specialities,setEspecialities] =useState([])
    const [soups,setSoups] =useState([])
    const [begining,setBegining] =useState([])
    const [meats,setMeats] =useState([])
    const [drinks,setDrinks] =useState([])

    const getMenu = async ()=>{
        let id =  await obtenerIDMenu(url)
        if(props.isMenuCreated){
            fetch(`${url}all_menus?linkTo=menu&equalTo=${id}`,{
                method: "GET",
                mode:"cors",
                headers:{
                    Authorization: "Token " + getCookie("token"),
                    Module: "menu_management",
                }
            })
            .then(response=>response.json())
            .then(data=>{
                console.log(data)
                setItemsMenu(data.results)
                
            })
        }
    }
    useEffect(()=>{
        getMenu()
    },[])

    return(
        <>
            
                  
        </>
    )

}
export default MenuOfBd;