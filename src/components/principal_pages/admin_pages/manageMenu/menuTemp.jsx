import { useEffect, useState } from "react";
import { Button,Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Spinner } from "@nextui-org/react";
import { AiFillCloseCircle } from "react-icons/ai";
import { toast } from "react-hot-toast";
import getCookie from "../../../Scripts/getCookies";

function MenuTemp(props) {
  const [menuTemp, setMenuTemp] = useState([]);
  const [changesLocal, setChangesLocal] = useState(false);
  const url = process.env.REACT_APP_URL_HOST;


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
        method: "POST",
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
            <h4>Menú del día.</h4>
            <div className="buttomsEspcialitiesContainer">
              <Table  className="tableMenuTemp" isStriped isHeaderSticky aria-label="Menú temporal">
                <TableHeader>
                  <TableColumn>Nombre</TableColumn>
                  <TableColumn>Acción</TableColumn>
                </TableHeader>
                <TableBody>
                  {menuTemp.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>
                        <Button
                          color="danger"
                          endContent={<AiFillCloseCircle/>}
                          onClick={()=>{deleteItemOfMenu(item.id, item.name)}}
                          >Eliminar</Button>
                        </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </ Table>
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
