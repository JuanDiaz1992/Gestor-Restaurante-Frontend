import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import getCookie from "../../../Scripts/getCookies";
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

function Specialities(props) {
  const url = useSelector((state) => state.auth.url);
  const idUser = useSelector((state) => state.auth.id_user);

  /*Sección de estados*/
  const [specialitiesInclude, setSpecialitiesInclude] =
    useState(
      false
    ); /*Esta variable la cambia el usuario y es la que decide si el menú del día actual incluye especialidades*/
  const [specialities, setSpecialites] = useState(
    []
  ); /*Aquí se almacenan las especialidades creadas en la bd*/
  const [updateSpecialites, setUpdateSpecialites] =
    useState(
      false
    ); /*Este estado se usa para el useEffect para el momento en que se agrego una especialidad a la bd*/

  /*Inputs del formulario*/
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [photo, setPhoto] = useState();

  /*Sección de funciones*/

  /*Esta función es la que valida si el menú del día incluye especialidades*/
  const isSpecialitiesInclude = (result) => {
    if (result) {
      setSpecialitiesInclude(true);
    } else {
      setSpecialitiesInclude(false);
      props.setChildrenUpdate(true);
    }
  };

  /*Función que trae solo las especialidades de la bd*/
  const menu_data = async () => {
    try {
      const response = await fetch(`${url}items_menu/`, {
        method: "GET",
        mode: "cors",
        headers: {
          Authorization: "Token " + getCookie("token"),
          Module: "inventory",
        },
      });
      const data = await response.json();
      if (data.status === 200) {
        const results = data.results;
        const especialitiesFilter = results.filter(
          (item) => item.menu_item_type === "especialities"
        );
        setSpecialites(especialitiesFilter);
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
    formData.append("menu_item_type", "especialities");
    formData.append("idProfile_user", idUser);
    formData.append("new_item_menu", true);

    fetch(url, {
      method: "POST",
      mode: "cors",
      body: formData,
      headers: {
        Authorization: "Token " + getCookie("token"),
        Module: "inventory",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 200) {
          toast.success(name + " se creo correctamente");
          props.setChangeFather(true);
          setUpdateSpecialites(true);
        } else if (data.status === 404) {
          console.log("error 409");
        }
      });
  };

  /*Cuando se agrega un nuevo elemento a las especialidades, se actualizan con este hook*/
  useEffect(() => {
    menu_data();
    setUpdateSpecialites(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateSpecialites]);




  /*Esta función es la que selecciona de las especialidades, que elementos que van a ir en el menú del día*/
  const selectItem = async (id, name) => {
    const selectedSpeciality = specialities.find((items) => items.id === id);
    try {
      const response = await fetch(`${url}`, {
        method: "POST",
        mode: "cors",
        headers: {
          Authorization: "Token " + getCookie("token"),
          Module: "inventory",
        },
        body: JSON.stringify({
          item: selectedSpeciality,
          menu_temp: true,
        }),
      });
      const data = await response.json();
      if (data.status === 200) {
        console.log(data);
        props.setChangeFather(true);
        toast.success(name + " se agregó al menú");
      } else if (data.status === 409) {
        console.log(data);
        toast.error(name + " ya está en el menú");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {specialitiesInclude === true ? (
        <>
          {specialities.length !== 0 ? (
            <>
              <h4>Seleccione la especialidad para hoy </h4>
              <div className="cardContainerMenu max-w-[900px] gap-2 grid grid-cols-12 grid-rows-2 px-8">
                {specialities.map((item) => (
                  <Card
                    className="cardEspecialities"
                    shadow="sm"
                    key={item.id}
                    isPressable
                    onClick={() => {
                      selectItem(item.id, item.name);
                    }}
                    onPress={() => console.log("item pressed")}
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
                      <p className="text-default-500">${item.price}</p>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </>
          ) : (
            <>
              <div className="especialitiesEmpty">
                <h4>
                  Aún no hay especialidades creadas, ingresa una en el siguiente
                  formulario para empezar.
                </h4>
              </div>
            </>
          )}
          <div className="formEspecialitiesContainer">
            <h4>Agregar otra especialidad</h4>
            <form
              encType="multipart/form-data"
              onSubmit={(e) => {
                sendForm(e);
              }}
            >
              <div className="mb-3">
                <label htmlFor="name">Nombre de la especialidad</label>
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
                  placeholder="Describa brevemente que incluye o de que trata la especialidad"
                ></Textarea>
              </div>
              <div className="mb-3">
                <label htmlFor="price">Costo</label>
                <Input
                  type="number"
                  id="price"
                  placeholder="0.00"
                  variant="faded"
                  radius="sm"
                  value={price}
                  onChange={(e) => {
                    setPrice(e.target.value);
                  }}
                  labelPlacement="outside"
                  endContent={
                    <div className="pointer-events-none flex items-center">
                      <span className="text-default-400 text-small">$</span>
                    </div>
                  }
                />
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
      ) : (
        <div>
          <h4>¿El menú de hoy incluye especialidades?</h4>
          <Button
            color="primary"
            onClick={() => {
              isSpecialitiesInclude(true);
            }}
          >
            Si
          </Button>
          <Button
            onClick={() => {
              isSpecialitiesInclude(false);
            }}
          >
            NO
          </Button>
        </div>
      )}
    </>
  );
}
export default Specialities;
