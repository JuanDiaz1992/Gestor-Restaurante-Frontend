import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Button } from "@nextui-org/react";
import { AiFillCloseCircle } from "react-icons/ai";
import getCookie from "../../../Scripts/getCookies";
import obtenerIDMenu from "../../../Scripts/obtenerIDGlobalDelMenu";

function MenuOfBd(props) {
  const url = useSelector((state) => state.auth.url);
  const [specialities, setEspecialities] = useState([]);
  const [soups, setSoups] = useState([]);
  const [beginning, setBegining] = useState([]);
  const [meats, setMeats] = useState([]);
  const [drinks, setDrinks] = useState([]);

  const getMenu = async () => {
    let id = await obtenerIDMenu(url);
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
  }, []);


  return (
    <>
    <div className="menu_of_day_container">
      {specialities.length > 0 && (
        <div className="buttons_menu_container">
          <h3>Especialidades</h3>
          {specialities.map((especiality) => (
            <Button variant="flat" radius="full" color={especiality.state === 1? "primary" : "default"} key={especiality.id} endContent={<AiFillCloseCircle />} >{especiality.name}</Button>
          ))}
        </div>
      )}
      {soups.length > 0 && (
        <div className="buttons_menu_container"> 
          <h3>Sopas</h3>
          {soups.map((soup) => (
            <Button variant="flat" radius="full" color={soup.state === 1 ? "warning" : "default"} key={soup.id} endContent={<AiFillCloseCircle />}>{soup.name}</Button>
          ))}
        </div>
      )}

      {beginning.length > 0 && (
        <div className="buttons_menu_container">
          <h3>Principios</h3>
          {beginning.map((beginnin) => (
            <Button variant="flat" radius="full" color={beginnin.state === 1 ? "success" : "default"} key={beginnin.id} endContent={<AiFillCloseCircle />}>{beginnin.name}</Button>
          ))}
        </div>
      )}

      {meats.length > 0 && (
        <div className="buttons_menu_container">
          <h3>Carnes</h3>
          {meats.map((meat) => (
            <Button variant="flat" radius="full" color={meat.state === 1 ? "danger" : "default"} key={meat.id} endContent={<AiFillCloseCircle />}>{meat.name}</Button>
          ))}
        </div>
      )}

      {drinks.length > 0 && (
        <div className="buttons_menu_container">
          <h3>Bebidas</h3>
          {drinks.map((drink) => (
            <Button variant="flat" radius="full" color={drink.state === 1 ? "secondary" : "default"} key={drink.id} endContent={<AiFillCloseCircle />}>{drink.name}</Button>
          ))}
        </div>
      )}

    </div>

    </>
  );
}
export default MenuOfBd;
