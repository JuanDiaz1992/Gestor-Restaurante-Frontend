import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Button,ButtonGroup, Tooltip } from "@nextui-org/react";
import { AiFillCloseCircle } from "react-icons/ai";
import { toast } from "react-hot-toast";
import getCookie from "../../../Scripts/getCookies";

function MenuTemp(props) {
  const [menuTemp, setMenuTemp] = useState([]);
  const [changesLocal, setChangesLocal] = useState(false);
  const url = useSelector((state) => state.auth.url);

  
  /*Este bloque de codigo obtiene los elementos del creador de menú temporal*/
  const menu_data_temp = () => {
    fetch(`${url}items_menu_temp/`, {
      method: "GET",
      mode: "cors",
      headers: {
        Authorization: "Token " + getCookie("token"),
        Module: "menu_management",
      },
    })     
      .then((response) => response.json())
      .then((data) => {
        
        if (data.status === 200) {
          setMenuTemp(data.results);
          props.setMenuTempFather(data.results);
        } else {
          
          props.setMenuTempFather([]);
          setMenuTemp([]);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };


  /*Este useEffect refresca el menú temporal y los elementos del menú ya creados*/
  useEffect(() => {
    menu_data_temp();

    props.setChange(false);
    setChangesLocal(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.isChange, changesLocal]);

  const deleteItemOfMenu = async (id, name) => {
    try {
      const response = await fetch(url, {
        method: "DELETE",
        mode: "cors",
        body: JSON.stringify({
          idItemMenu: id,
          delete_item_data: true,
        }),
        headers: {
          Authorization: "Token " + getCookie("token"),
          Module: "menu_management",
        },
      });
      const data = await response.json();
      if (data.status === 200) {
        toast.success(name + " eliminado del menú", {
          icon: "🗑️",
          style: {
            borderRadius: "10px",
            background: "rgba(139, 0, 0, 0.75)",
            color: "white",
          },
        });
        props.setChange(true);
        setChangesLocal(true);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  return (
    <>
      {menuTemp.length !== 0 ? (
        <>
          <div className="menuContainer sticky">
            <h4>Menú para hoy:</h4>
            <div className="buttomsEspcialitiesContainer">
              {menuTemp.map((item, index) => (
                  <ButtonGroup key = {index}>
                    <Button

                      color={
                        item.menu_item_type === "especialities"
                          ? "primary"
                          : item.menu_item_type === "soups"
                          ? "warning"
                          : item.menu_item_type === "beginning"
                          ? "success"
                          : item.menu_item_type === "meats"
                          ? "danger"
                          : item.menu_item_type === "drinks"
                          ? "secondary"
                          : ""
                      }
                      variant="flat"
                    >
                      {item.name}
                    </Button>
                    <Button 
                        color={
                          item.menu_item_type === "especialities"
                            ? "primary"
                            : item.menu_item_type === "soups"
                            ? "warning"
                            : item.menu_item_type === "beginning"
                            ? "success"
                            : item.menu_item_type === "meats"
                            ? "danger"
                            : item.menu_item_type === "drinks"
                            ? "secondary"
                            : ""
                        }
                      endContent={<AiFillCloseCircle />}
                      onClick={() => {
                        deleteItemOfMenu(item.id, item.name);
                      }}>

                    </Button>
                  </ButtonGroup>

              ))}
            </div>
          </div>
        </>
      ) : (
        <></>
      )}
    </>
  );
}

export default MenuTemp;
