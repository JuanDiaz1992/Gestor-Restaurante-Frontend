import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { Card, CardBody, Image, CardFooter, Spinner } from "@nextui-org/react";
import obtenerIDMenu from "../Scripts/obtenerIDGlobalDelMenu";
import "../../stylesheets/principal_pages/index.css";

function Index() {
  const url = useSelector((state) => state.auth.url);
  const [typeMenu, setTypeMenu] = useState([]);
  const [allItemsMenu, setAllItemsMenu] = useState([]);
  const [loading, setLoading] = useState(true);

  const getMEnu = async () => {
    try {
      let idMenu = await obtenerIDMenu(url);
      fetch(`${url}get_menu_index?linkTo=menu&equalTo=${idMenu}`, {
        method: "GET",
        mode: "cors",
        headers: {
          Module: "menu_management",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.status === 200) {
            const newArray = [
              ...new Set(
                data.results.map((menu_type) => menu_type.menu_item_type)
              ),
            ];
            const categorias = {
              'especialities': 1,
              'soups': 2,
              'beginning': 3,
              'meats': 4,
              'drinks': 5
            };
            newArray.sort((a, b) => categorias[a] - categorias[b]);
            setTypeMenu(newArray);
            setAllItemsMenu(data.results);
            setLoading(false);
          }else{
            setLoading(false);
          }
        });
    } catch (error) {
      console.log(error);
      setLoading(false);
      
    }
    
  };
  useEffect(() => {
    getMEnu();
    
  }, []);

  return (
    <>
      <section className="section section_menu_index">
        {loading ? (
          <>
            <div className="spiner_container">
              <Spinner label="Cargando" color="warning" labelColor="warning" />
            </div>
          </>
        ) : typeMenu.length > 0 ? (
          <>
            <h1 className="section_menu_index--tittle">MENÚ DEL DÍA</h1>
            {typeMenu.map((type_menu) => (
              <div key={type_menu}>
                <h3 className="section_menu_index--subTittle">
                  {type_menu === "especialities"
                    ? "Especialidades"
                    : type_menu === "soups"
                    ? "Sopas"
                    : type_menu === "beginning"
                    ? "Principios"
                    : type_menu === "meats"
                    ? "Carnes"
                    : type_menu === "drinks"
                    ? "Bebidas"
                    : ""}
                </h3>

                <div className="menu_container--cards_container">
                  {allItemsMenu.map(
                    (item) =>
                      item.menu_item_type === type_menu && (
                        <div
                          className="menu_container--cards_container"
                          key={item.id}
                        >
                          <Card
                            className="cardEspecialities"
                            shadow="sm"
                            isPressable
                          >
                            <CardBody className="overflow-visible p-0">
                              <Image
                                shadow="sm"
                                radius="lg"
                                alt={item.title}
                                className="opacity-1 w-full object-cover h-[140px]"
                                src={url + item.picture}
                              />
                            </CardBody>
                            <CardFooter className="text-small justify-between">
                              <b>{item.name}</b>
                              {item.menu_item_type === "especialities" && 
                              <p className="text-default-500">${item.price}</p>
                              }
                            </CardFooter>
                          </Card>
                        </div>
                      )
                  )}
                </div>
              </div>
            ))}
          </>
        ) : (
          <>
            <div className="section_menu_index--menu_empty">
              <Card>
                <CardBody>
                  <p>
                    Estamos preparando el menú, en instantes lo subiremos para tí.
                  </p>
                </CardBody>
              </Card>
            </div>
          </>
        )}
      </section>
    </>
  );
}
export default Index;
