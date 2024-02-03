import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Card, CardBody, Spinner } from "@nextui-org/react";
import obtenerIDMenu from "../Scripts/obtenerIDGlobalDelMenu";
import "../../stylesheets/principal_pages/index.css";
import LogoDefault from "../../img/logo2.png";
import useSWR from 'swr'




function Index() {
  const url = process.env.REACT_APP_URL_HOST;
  const business = useSelector((state) => state.auth);
  const [typeMenu, setTypeMenu] = useState([]);
  const [allItemsMenu, setAllItemsMenu] = useState([]);
  const [idMenu,getIdMenu] =useState();

  const fetcher = async (url) => {
    const response = await fetch(url, {
      method: 'GET',
      mode: 'cors',
      headers: {
        Module: 'menu_management',
      },
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  };



  useEffect(()=>{
    const getid = async()=>{
      let idMenu = await obtenerIDMenu(url);
      getIdMenu(idMenu)
    }
    getid();
  },[url])

  const { data, error, isLoading } = useSWR(`${url}get_menu_index?linkTo=menu&equalTo=${idMenu}`, fetcher)



useEffect(()=>{
    if (data) {
      const newArray = [
        ...new Set(data.results.map((menu_type) => menu_type.menu_item_type)),
      ];
      const categorias = {
        especialities: 1,
        soups: 2,
        beginning: 3,
        meats: 4,
        drinks: 5,
        soft_drinks: 6,
      };

      newArray.sort((a, b) => categorias[a] - categorias[b]);
      setTypeMenu(newArray);
      setAllItemsMenu(data.results);
    }else if(error){
      console.log(error)
    }

},[data,isLoading,error])

  return (
    <>
      <section className="section section_menu_index">
        {isLoading ? (
          <>
            <div className="spiner_container">
              <Spinner label="Cargando" color="warning" labelColor="warning" />
            </div>
          </>
        ) : typeMenu.length > 1 ? (
          <>
            <header className="header">
              {business.logo?
              <img src={url + business.logo} alt="" />
              :
              <img src={LogoDefault} alt="" />
              }

            </header>


            {typeMenu.map((type_menu) => (
              <div key={type_menu} className="section_menu_index--title">
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
                    : type_menu === "soft_drinks"
                    ? "Gaseosas"
                    : ""}
                </h3>

                <div className="menu_container--cards_container">
                  {allItemsMenu.map(
                    (item) =>
                      item.menu_item_type === type_menu && (
                        <div className="menu_container-card" key={item.id}>
                          <div className="card_text_container">
                            <div className="card_text_container--info">
                              <h5>{item.name}</h5>
                              <p>{item.description}</p>
                              {item.state === 0 && <p className="agotadoP">Agotado</p>}
                            </div>
                            {item.menu_item_type === "especialities" ||
                            item.menu_item_type === "soft_drinks" ? (
                              <p className="price">{item.price >0 && "$" + item.price}</p>
                            ) : null}
                          </div>
                          <div className="card_img_container">
                            <div>
                              <img
                                shadow="sm"
                                radius="lg"
                                alt={item.title}
                                className={"opacity-1 " + (item.state === 0 && "agotado")}
                                src={url + item.picture}
                              />
                            </div>

                          </div>
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
                    Estamos preparando el menú, en instantes lo subiremos para
                    tí.
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
