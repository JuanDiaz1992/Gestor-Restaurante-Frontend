import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { Card, CardBody, Image, CardFooter } from "@nextui-org/react";
import obtenerIDMenu from "../Scripts/obtenerIDGlobalDelMenu";
import "../../stylesheets/principal_pages/index.css";

function Index() {
  const url = useSelector((state) => state.auth.url);
  const [allItems, setAllItems] = useState([]);
  const [specialities, setEspecialities] = useState([]);
  const [soups, setSoups] = useState([]);
  const [beginning, setBegining] = useState([]);
  const [meats, setMeats] = useState([]);
  const [drinks, setDrinks] = useState([]);
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
            const results = data.results;

            setAllItems(results);
            setEspecialities(
              results.filter(
                (especialitie) => especialitie.menu_item_type === "especialities"
              )
            );
            setSoups(
              results.filter(
                (especialitie) => especialitie.menu_item_type === "soups"
              )
            );
            setBegining(
              results.filter(
                (especialitie) => especialitie.menu_item_type === "beginning"
              )
            );
            setMeats(
              results.filter(
                (especialitie) => especialitie.menu_item_type === "meats"
              )
            );
            setDrinks(
              results.filter(
                (especialitie) => especialitie.menu_item_type === "drinks"
              )
            );
        }

        });
    } catch (error) {}
  };
  useEffect(() => {
    getMEnu();
  }, []);

  return (
    <>
      <section className="section section_menu_index">
        {allItems.length > 0 ? (
          <div className="menu_container">
            {specialities.length > 0 && (
              <div>
                <h4>Especialidad</h4>
                <div className="menu_container--cards_container">
                  {specialities.map((item) => (
                    <Card key={item.id} className="cardEspecialities" shadow="sm" isPressable>
                      <CardBody className="overflow-visible p-0 cardContainerImg">
                        <Image
                          shadow="sm"
                          radius="lg"
                          alt={item.title}
                          className="opacity-1"
                          src={url + item.picture}
                        />
                      </CardBody>
                      <CardFooter className="text-small justify-between">
                        <b>{item.name}</b>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <></>
        )}
      </section>
    </>
  );
}
export default Index;
