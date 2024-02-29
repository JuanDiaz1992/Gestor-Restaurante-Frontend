import { useSelector } from "react-redux";
import getCookie from "../../../Scripts/getCookies";
import { useState, useEffect } from "react";
import { Toaster, toast } from "react-hot-toast";
import { confirmAlert } from "react-confirm-alert";
import Table from "./table";
import date from "../../../Scripts/obtenerFechaActual";


function InventoryAll() {
  const [purchaseValue, setPurchaseValue] = useState("");
  const [reason, setReason] = useState("");
  const [observations, setObservations] = useState("");

  const idProfile_user = useSelector((state) => state.auth.id_user);
  const url = process.env.REACT_APP_URL_HOST;
  const [isThereInventory, setIsThereInventory] = useState(false);
  const [inventoryData, setInventoryData] = useState("");
  const [totalInventory, setTotalInventory] = useState(0);
  const [changeState, setChangeState] = useState(false);

  /*PAGINADOR*/
  const ITEMS_PER_PAGE = 5;
  const [items, setItems] = useState();
  const [currentPage, setCurrentPage] = useState(0);
  const [isNextDisabled, setIsNextDisabled] = useState(false);
  const [isPreviusDisabled, setIsPreviusDisabled] = useState(true);

  const [cantPages, setCantPages] = useState(0);
  const [loading,setLoading] = useState(false)




  /*Función para traer los datos*/
  useEffect(() => {
    const formattedDate = date()
    /*Función para traer datos de las compras*/
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${url}inventoryBuysForDate?linkTo=date&equalTo=${formattedDate}`,
          {
            method: "GET",
            mode: "cors",
            headers: {
              Authorization: "Token " + getCookie("token"),
              Module: "inventory",
            },
          }
        );
        const data = await response.json();
        if (data.status === 200) {
          setIsThereInventory(true);
          setInventoryData(data.results);
          setItems([...data.results].splice(0, ITEMS_PER_PAGE));
          let TotalDia = 0;
          for (let index = 0; index < data.results.length; index++) {
            TotalDia = TotalDia + data.results[index].purchaseValue;
          }
          setTotalInventory(TotalDia);
        } else {
          setIsThereInventory(false);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
      setChangeState(false);
      setLoading(true)
    };

    fetchData();

  }, [url, changeState]);


  /*Función para eliminar datos de las compras*/
  const deleteItemInv = (idItem) => {
    confirmAlert({
      title: "Confirmación de eliminación",
      message: `¿Estás seguro que deseas eiliminar este registro?`,
      buttons: [
        {
          label: "Sí",
          onClick: async () => {
            try {
              const response = await fetch(url, {
                method: "POST",
                mode: "cors",
                body: JSON.stringify({
                  idItem: idItem,
                  delete_buy_inventory: true,
                }),
                headers: {
                  Authorization: "Token " + getCookie("token"),
                  Module: "inventory",
                },
              });
              if (!response) {
                throw new Error("Error al enviar el formulario");
              }
              const data = await response.json();
              if (data.status) {
                toast.success("Eliminado", {
                  style: {
                    borderRadius: "10px",
                    background: "#333",
                    color: "#fff",
                  },
                });
                setChangeState(true);
                setCurrentPage(0);
              }
            } catch (error) {
              console.log(error);
            }
          },
        },
        {
          label: "No",
          onClick: () => {}, // No hace nada
        },
      ],
    });
  };

  /*Función para agregar datos de las compras*/
  const inventory = async (e) => {
    e.preventDefault();
    const formattedDate = date()
    try {
      const response = await fetch(url, {
        method: "POST",
        mode: "cors",
        body: JSON.stringify({
          purchaseValue: purchaseValue,
          reason: reason,
          observations: observations,
          idProfile_user: idProfile_user,
          dateTime:formattedDate,
          record_buys: true
        }),
        headers: {
          Authorization: "Token " + getCookie("token"),
          Module: "inventory",
        },
      });
      if (!response) {
        throw new Error("Error al enviar el formulario");
      }
      const data = await response.json();
      if (data.registered) {
        setChangeState(true);
        setPurchaseValue("");
        setReason("");
        setObservations("");
        toast.success("Registro agregado");
        setCurrentPage(0);
      }
    } catch (error) {
      console.log(error);
    }
  };

  /***************Funciones botónes paginador*****************/
  const handleClickNext = () => {
    const totalData = Object.values(inventoryData).length;
    const netxPage = currentPage + 1;
    const firstIndex = netxPage * ITEMS_PER_PAGE;
    if (totalData <= firstIndex) {
      return;
    }
    setItems(
      [...Object.values(inventoryData)].splice(firstIndex, ITEMS_PER_PAGE)
    );
    setCurrentPage(netxPage);
  };

  /*Función para des habilitar el botón Next del paginador*/
  useEffect(() => {
    const totalData = Object.values(inventoryData).length;
    if (totalData <= (currentPage + 1) * ITEMS_PER_PAGE) {
      setIsNextDisabled(true);
    } else {
      setIsNextDisabled(false);
    }

    /*Aprovechando que está función valida cuantos elementos hay se pasa
      como argumento esa cantidad a la función que valida cuantas páginas
      se van a renderizar*/
    checkExactDivision(totalData, ITEMS_PER_PAGE);
    checkExactDivision(totalData, ITEMS_PER_PAGE);
  }, [currentPage, ITEMS_PER_PAGE, inventoryData, changeState]);

  /*funciones botón previous*/
  const handleClickPrevius = () => {
    const prevPage = currentPage - 1;
    if (prevPage < 0) {
      return;
    }
    const firstIndex = prevPage * ITEMS_PER_PAGE;
    setItems(
      [...Object.values(inventoryData)].splice(firstIndex, ITEMS_PER_PAGE)
    );
    setCurrentPage(prevPage);
  };

  /*Función para des habilitar el botón Next del paginador*/
  useEffect(() => {
    if (currentPage === 0) {
      setIsPreviusDisabled(false);
    } else {
      setIsPreviusDisabled(true);
    }
  }, [currentPage, changeState]);

  /*******************Botones númericos de del páginador***************/
  /*
      Esta función se encarga de validar cuantas páginas se crearán
      a partir de la cantidad de elementos
    */
  function checkExactDivision(dividend, divisor) {
    const result = dividend / divisor;
    const remainder = dividend % divisor;

    if (remainder === 0) {
      setCantPages(result);
    } else {
      const roundedResult =
        Math.ceil(
          result
        ); /*Lo que hace es validar si la cantidad de elementos da un número inexacto, si es así lo redondea*/
      setCantPages(roundedResult);
    }
  }

  /*Función pasar página por medio de numeros*/
  const handleClickPage = (index) => {
    setCurrentPage(index - 1);
    setItems(
      [...Object.values(inventoryData)].splice(
        index * ITEMS_PER_PAGE - ITEMS_PER_PAGE,
        ITEMS_PER_PAGE
      )
    );
  };

  /***************************************************************/
  return (
    <>
      <section className="sectionRegistreInventory">
        <div className="sectionRegistreInventory--div1">
          <h3>Compras ya registrados en el día</h3>
          <Table
            currentPage={currentPage}
            tittle = {"compras"}
            isThereInventory={isThereInventory}
            inventoryData={items}
            totalInventory={totalInventory}
            deleteItemInv={deleteItemInv}
            changeState={changeState}
            handleClickPrevius={handleClickPrevius}
            handleClickNext={handleClickNext}
            isNextDisabled={isNextDisabled}
            isPreviusDisabled={isPreviusDisabled}
            cantPages={cantPages}
            handleClickPage={handleClickPage}
            cantData={Object.values(inventoryData).length}
            ITEMS_PER_PAGE={ITEMS_PER_PAGE}
            isLoading = {loading}
          ></Table>
        </div>
        <div className="sectionRegistreInventory--div2">
          <h3>Registre las compras del día</h3>
          <form
            className="card-body"
            id="formRegis"
            onSubmit={(e) => {
              inventory(e);
            }}
            encType="multipart/form-data"
          >
            <div className="mb-3">
              <label htmlFor="valuePurchase" className="label_createUser">
                Valor de la compra:
              </label>
              <input
                type="number"
                className={"form-control"}
                id="valuePurchase"
                value={purchaseValue}
                onChange={(e) => {
                  setPurchaseValue(e.target.value);
                }}
                placeholder="Ingrese el valor total de la compra"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="reason" className="label_createUser">
                Motivo del pago:
              </label>
              <select
                className={"form-control"}
                id="reason"
                value={reason}
                onChange={(e) => {
                  setReason(e.target.value);
                }}
                required
              >
                <option>Elige una opción</option>
                <option value="meet">Carnicería</option>
                <option value="vegetables">Verduras</option>
                <option value="cheeseMaker">Quesera</option>
                <option value="investment">Inversión</option>
                <option value="personal_expenses">Gastos Personales</option>
                <option value="expenses_for_employee">Gastos para empleado</option>
                <option value="other">Otros</option>
              </select>
            </div>
            <div className="mb-3">
              <label htmlFor="observations" className="label_createUser">
                Observaciones
              </label>
              <textarea
                className={"form-control"}
                id="observations"
                value={observations}
                onChange={(e) => {
                  setObservations(e.target.value);
                }}
                placeholder="Aquí puedes ingresar información como detalles de la compra, o novedades."
              />
            </div>
            <button className={"btn btn-primary"}>Submit</button>
          </form>
        </div>
        <Toaster position="top-center" reverseOrder={true} />
      </section>
    </>
  );
}

export default InventoryAll;
