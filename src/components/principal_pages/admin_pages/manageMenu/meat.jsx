
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import getCookie from "../../../Scripts/getCookies";
import {AiFillCloseCircle} from "react-icons/ai";
import { confirmAlert } from "react-confirm-alert";
import GoToTop from "../../../Scripts/OnTop";
import {
  Button,
  Input,
  Textarea,
  Card,
  CardFooter,
  Image,
  CardBody,
} from "@nextui-org/react";
import { toast } from "react-hot-toast";

function Meat(props){
    const url = useSelector((state) => state.auth.url);
    const idUser = useSelector((state) => state.auth.id_user);
  
    /*Sección de estados*/
    const [meats, setMeats] = useState([]); /*Aquí se almacenan las carnes creadas en la bd*/
    const [updateItems, setUpdateItems] = useState(false); /*Este estado se usa para el useEffect para el momento en que se agrego una carne a la bd*/
  
    /*Inputs del formulario*/
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState(0);
    const [photo, setPhoto] = useState();
  
    /*Sección de funciones*/
  

    /*Función que trae solo las carnes de la bd*/
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
          const meatsFilter = results.filter(
            (item) => item.menu_item_type === "meats"
          );
          setMeats(meatsFilter);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    /*Función que crea nuevos elementos para el menú, este es el formulario*/
    const sendForm = (e) => {
      e.preventDefault();
      let formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("photo", photo);
      formData.append("menu_item_type", "meats");
      formData.append("idProfile_user", idUser);
      formData.append("new_item_menu", true);
  
      fetch(url, {
        method: "POST",
        mode: "cors",
        body: formData,
        headers: {
          Authorization: "Token " + getCookie("token"),
          Module: "menu_management",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.status === 200) {
            toast.success(name + " se creo correctamente");
            props.setChangeFather(true);
            setUpdateItems(true);
            setName("");
            setDescription("");
            setPrice(0);
            let formRegis = document.getElementById('formRegis');
            formRegis.reset();
          } else if (data.status === 404) {
            console.log("error 409");
          }
        });
    };
  
    /*Cuando se agrega un nuevo elemento a las carnes, se actualizan con este hook*/
    useEffect(() => {
      menu_data();
      setUpdateItems(false);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [updateItems]);
  
  
    /*Esta función es la que selecciona de las carnes, que elementos que van a ir en el menú del día*/
    const selectItem = async (id, name) => {
      const selectedSpeciality = meats.find((items) => items.id === id);
      try {
        const response = await fetch(`${url}`, {
          method: "POST",
          mode: "cors",
          headers: {
            Authorization: "Token " + getCookie("token"),
            Module: "menu_management",
          },
          body: JSON.stringify({
            item: selectedSpeciality,
            menu_temp: true,
          }),
        });
        const data = await response.json();
        if (data.status === 200) {
          props.setChangeFather(true);
          toast.success(name + " se agregó al menú");
        } else if (data.status === 409) {
          toast.error(name + " ya está en el menú");
        }
      } catch (error) {
        console.log(error);
      }
    };
  
  
    const deleteItem = (id, name) => {
      confirmAlert({
        title: "Confirmación de eliminación",
        message: `¿Estás seguro que deseas eiliminar a ${name}?`,
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
                  item: id,
                  delete_item_bd_from_menu: true,
                }),
              })
                .then((response) => response.json())
                .then((data) => {
                  if (data.status === 200) {
                    setUpdateItems(true);
                    props.setChangeFather(true);
                    toast.success(name + " se eliminó de las carnes");
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
    };
  
return(

    <>
      <>
        {meats.length !== 0 ? (
          <>
            <h4>Seleccione las carnes para hoy </h4>
            <div className="cardContainerMenu max-w-[900px] gap-2 grid grid-cols-12 grid-rows-2 px-8">
              {meats.map((item) => (
                <div className="cardContainerMenu--div" key={item.id}>
                  <button onClick={()=>deleteItem(item.id, item.name)} className="cardContainerImg__buttonDelete"><AiFillCloseCircle/></button>
                  <Card
                    className="cardEspecialities"
                    shadow="sm"

                    isPressable
                    onClick={() => {
                      selectItem(item.id, item.name);
                    }}
                  >

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
                </div>

              ))}
            </div>
          </>
        ) : (
          <>
            <div className="especialitiesEmpty">
              <h4>
                Aún no hay carnes creadas, ingresa una en el siguiente
                formulario para empezar.
              </h4>
            </div>
          </>
        )}
        <div className="formEspecialitiesContainer">
          <h4>Agregar carnes</h4>
          <form
            id="formRegis"
            encType="multipart/form-data"
            onSubmit={(e) => {
              sendForm(e);
            }}
          >
            <div className="mb-3">
              <label htmlFor="name">Nombre de la carne</label>
              <Input
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                }}
                id="name"
                variant="faded"
                radius="sm"
                type="text"
              />
            </div>

            <div className="mb-3">
              <label htmlFor="description">Descripción</label>
              <Textarea
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                }}
                id="description"
                rows="3"
                placeholder="Describa brevemente que incluye o de que trata la carne"
              ></Textarea>
            </div>
            <div className="mb-3">
              <label htmlFor="formFile" className="form-label colorBlack">
                Foto
              </label>
              <input
                type="file"
                id="formFile"
                className="form-control"
                onChange={(e) => setPhoto(e.target.files[0])}
              />
            </div>
            <Button type="submit" color="primary">
              Submit
            </Button>
          </form>
        </div>
      </>
      <GoToTop/>
  </>
)
}

export default Meat