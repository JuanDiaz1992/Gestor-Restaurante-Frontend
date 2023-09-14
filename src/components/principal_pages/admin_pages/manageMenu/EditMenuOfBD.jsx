import { useEffect, useState, useMemo } from "react";
import getCookie from "../../../Scripts/getCookies";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { Listbox, ListboxItem, Button } from "@nextui-org/react";
import date from "../../../Scripts/obtenerFechaActual";

function EditMenuOfBD(props) {
  const url = useSelector((state) => state.auth.url);
  const [allItems, setAllItems] = useState([]);
  const [specialities, setEspecialities] = useState([]);
  const [soups, setSoups] = useState([]);
  const [beginning, setBegining] = useState([]);
  const [meats, setMeats] = useState([]);
  const [drinks, setDrinks] = useState([]);
  const { idMenuFather, setIsChangeFather, closeModalEdit } = props;

  const menu_data = async () => {
    try {
      const response = await fetch(`${url}items_menu/`, {
        method: "GET",
        mode: "cors",
        headers: {
          Authorization: "Token " + getCookie("token"),
          Module: "menu_management",
        },
      });
      const data = await response.json();
      if (data.status === 200) {
        const results = data.results;
        
        const resultFilter = results.filter((result) => {
          return !props.allResults.some(
            (isInMenuresult) => isInMenuresult.name === result.name
          );
        });
        setAllItems(resultFilter);
        setEspecialities(
          resultFilter.filter(
            (especialitie) => especialitie.menu_item_type === "especialities"
          )
        );
        setSoups(
          resultFilter.filter(
            (especialitie) => especialitie.menu_item_type === "soups"
          )
        );
        setBegining(
          resultFilter.filter(
            (especialitie) => especialitie.menu_item_type === "beginning"
          )
        );
        setMeats(
          resultFilter.filter(
            (especialitie) => especialitie.menu_item_type === "meats"
          )
        );
        setDrinks(
          resultFilter.filter(
            (especialitie) => especialitie.menu_item_type === "drinks"
          )
        );
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    menu_data();
  }, []);

  const [selectedKeys, setSelectedKeys] = useState([]);
  const selectedValue = useMemo(
    () => Array.from(selectedKeys).join(","),
    [selectedKeys]
  );

  const editMenu = () => {
    const dateTime = date();
    const array = selectedValue.split(",");
    const ids = array.map((number) => parseInt(number));
    fetch(url, {
      method: "POST",
      mode: "cors",
      headers: {
        Authorization: "Token " + getCookie("token"),
        Module: "menu_management",
      },
      body: JSON.stringify({
        dateTime: dateTime,
        ids: ids,
        idMEnu: idMenuFather,
        edit_menu: true,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 200) {
          toast.success("Los items se agregaron correctamente al menú");
          closeModalEdit();
          setIsChangeFather(true);
        } else {
          toast.error("a ocurrido un error");
        }
      });
  };

  
  return (
    <>
      <div className="modal-dialog">
        <div className="modal-content ">
          <div className="modal-header">
            <h5 className="modal-title">Agregar items al menú</h5>
            <button
              className="btn-close"
              aria-label="Close"
              onClick={closeModalEdit}
            ></button>
          </div>
          {allItems.length === 0 ? (
            <div>
              <h4>No existen más items para agregar al menú</h4>
            </div>
          ) : (
            <div>
              {specialities.length > 0 && (
                <div>
                  <h3>Especialidades</h3>
                  <Listbox
                    className="edit_menu_containers"
                    aria-label="Multiple selection example"
                    variant="faded"
                    selectionMode="multiple"
                    selectedKeys={selectedKeys}
                    onSelectionChange={setSelectedKeys}
                  >
                    {specialities.map((item) => (
                      <ListboxItem
                        key={item.id}
                        variant="faded"
                        radius="full"
                        color="success"
                      >
                        {item.name}
                      </ListboxItem>
                    ))}
                  </Listbox>
                </div>
              )}
              {soups.length > 0 && (
                <div>
                  <h3>Sopas</h3>
                  <Listbox
                    className="edit_menu_containers"
                    aria-label="Multiple selection example"
                    variant="faded"
                    selectionMode="multiple"
                    selectedKeys={selectedKeys}
                    onSelectionChange={setSelectedKeys}
                  >
                    {soups.map((item) => (
                      <ListboxItem
                        key={item.id}
                        variant="faded"
                        radius="full"
                        color="success"
                      >
                        {item.name}
                      </ListboxItem>
                    ))}
                  </Listbox>
                </div>
              )}
              {beginning.length > 0 && (
                <div>
                  <h3>Principios</h3>
                  <Listbox
                    className="edit_menu_containers"
                    aria-label="Multiple selection example"
                    variant="faded"
                    selectionMode="multiple"
                    selectedKeys={selectedKeys}
                    onSelectionChange={setSelectedKeys}
                  >
                    {beginning.map((item) => (
                      <ListboxItem
                        key={item.id}
                        variant="faded"
                        radius="full"
                        color="success"
                      >
                        {item.name}
                      </ListboxItem>
                    ))}
                  </Listbox>
                </div>
              )}
              {meats.length > 0 && (
                <div>
                  <h3>Carnes</h3>
                  <Listbox
                    className="edit_menu_containers"
                    aria-label="Multiple selection example"
                    variant="faded"
                    selectionMode="multiple"
                    selectedKeys={selectedKeys}
                    onSelectionChange={setSelectedKeys}
                  >
                    {meats.map((item) => (
                      <ListboxItem
                        key={item.id}
                        variant="faded"
                        radius="full"
                        color="success"
                      >
                        {item.name}
                      </ListboxItem>
                    ))}
                  </Listbox>
                </div>
              )}
              {drinks.length > 0 && (
                <div>
                  <h3>Bebidas</h3>
                  <Listbox
                    className="edit_menu_containers"
                    aria-label="Multiple selection example"
                    variant="faded"
                    selectionMode="multiple"
                    selectedKeys={selectedKeys}
                    onSelectionChange={setSelectedKeys}
                  >
                    {drinks.map((item) => (
                      <ListboxItem
                        key={item.id}
                        variant="faded"
                        radius="full"
                        color="success"
                      >
                        {item.name}
                      </ListboxItem>
                    ))}
                  </Listbox>
                </div>
              )}
            </div>
          )}

          <div>
            {allItems.length!==0 &&
                (<Button onClick={editMenu}>Agregar al menú</Button>)
            }
            
            <Button>Crear nuevo item</Button>
          </div>
        </div>
      </div>
    </>
  );
}

export default EditMenuOfBD;
