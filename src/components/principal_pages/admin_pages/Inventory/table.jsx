import { useEffect, useState} from "react"
import formatPesosCop from "../../../Scripts/formatearPesos";
import { motion } from "framer-motion";



function Compras(props){
  const isLoading = props.isLoading;
  const [pagExist,setPagExist] = useState(false)
  useEffect (()=>{
    if(props.cantData>props.ITEMS_PER_PAGE){
      setPagExist(true)
    }else{
      setPagExist(false)
    }
  },[props.cantData,props.ITEMS_PER_PAGE])
  
  const [viewMore,setViewMore] = useState(true);
  
  const toggleState = (id) => {
    setViewMore(prevStates => ({
      ...prevStates,
      [id]: !prevStates[id] // Cambia el estado al contrario del estado anterior para el ID específico
    }));
  };
    return(
        <>
          {isLoading? 
                  props.isThereInventory === true ? (
            <>
              <div>
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th scope="col">id</th>
                      <th scope="col">Valor</th>
                      <th scope="col">Motivo</th>
                      <th scope="col">Observaciones</th>
                      <th scope="col">Hora</th>
                      <th scope="col">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {props.inventoryData?.map((value) => (
                      <tr key={value.id}>
                        <th scope="row">{value.id}</th>
                        <td>{formatPesosCop(value.purchaseValue)}</td>
                        <td>
                          {value.reason === "meet"
                            ? "Carnicería"
                            : value.reason === "vegetables"
                            ? "Verdurería"
                            : value.reason === "cheeseMaker"
                            ? "Quesera"
                            : value.reason === "investment"
                            ? "Inversión"
                            : value.reason === "personal_expenses"
                            ? "Gastos Personales"
                            : value.reason === "expenses_for_employee"
                            ? "Gastos para empleado"
                            : value.reason === "other"
                            ? "Otros"
                            : "Otros"}
                        </td>
                        <td className="valueObservations">{value.observations.length > 20 ? 
                            <>
                              {viewMore[value.id] === true
                                ? value.observations
                                : value.observations.slice(0, 20) + "..."
                              }
                              <p onClick={() => { toggleState(value.id) }} className="viewMore">
                                {viewMore[value.id] === true ? "Ver menos"  : "Ver más" }
                              </p>
                            </>
                            
                            : 
                            value.observations }</td>
                        <td>{value.date.split(" ")[1]}</td>
                        <td>
                          <motion.button
                            onClick={() => {
                              props.deleteItemInv(value.id);
                            
                            }}
                            whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.8 }} 
                            className="btn btn-danger"
                          >
                            X
                          </motion.button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div>
                  {pagExist? 
                    <nav aria-label="...">
                      <ul className="pagination">
                        <li className={props.isPreviusDisabled? "page-item" :  "page-item disabled" }>
                          <button onClick={props.handleClickPrevius} className="page-link"  tabIndex="-1" aria-disabled="true">Previous</button>
                        </li>
                        {Array.from({ length: props.cantPages }).map((_, index) => (
                          <li key={index} className={`page-item ${props.currentPage + 1 === index + 1 ? "active" : ""}`}>                         
                            <button className="page-link" onClick={() => {props.handleClickPage(index + 1)}}>{index + 1}</button>
                          </li>
                        ))}
                        <li className={props.isNextDisabled? "page-item disabled" :  "page-item" }>
                          <button onClick={props.handleClickNext} className="page-link">Next</button>
                        
                        </li>
                      </ul>
                    </nav>
                : <></>}

                  <h4>Total {props.tittle} en el día</h4>
                  {formatPesosCop(props.totalInventory)}
                </div>
              </div>
            </>
          ) : (
            <>
                <div>
                <h5>No hay datos registrados hoy</h5>
                <div className="alert alert-warning">
                    <p>
                    En caso de que estés seguro de que agregaste compras y no aparecen,
                    valida que la fecha de tu sistema esté bien configurada.
                    </p>
                </div>
                </div>

            </>
          )
          : 
          <div className="loading_container">
            <svg width="100" height="100" viewBox="0 0 44 44" xmlns="http://www.w3.org/2000/svg" stroke="#1ae743">
                <g fill="none" fillRule="evenodd" strokeWidth="2">
                    <circle cx="22" cy="22" r="1">
                        <animate attributeName="r"
                            begin="0s" dur="1.8s"
                            values="1; 20"
                            calcMode="spline"
                            keyTimes="0; 1"
                            keySplines="0.165, 0.84, 0.44, 1"
                            repeatCount="indefinite" />
                        <animate attributeName="stroke-opacity"
                            begin="0s" dur="1.8s"
                            values="1; 0"
                            calcMode="spline"
                            keyTimes="0; 1"
                            keySplines="0.3, 0.61, 0.355, 1"
                            repeatCount="indefinite" />
                    </circle>
                    <circle cx="22" cy="22" r="1">
                        <animate attributeName="r"
                            begin="-0.9s" dur="1.8s"
                            values="1; 20"
                            calcMode="spline"
                            keyTimes="0; 1"
                            keySplines="0.165, 0.84, 0.44, 1"
                            repeatCount="indefinite" />
                        <animate attributeName="stroke-opacity"
                            begin="-0.9s" dur="1.8s"
                            values="1; 0"
                            calcMode="spline"
                            keyTimes="0; 1"
                            keySplines="0.3, 0.61, 0.355, 1"
                            repeatCount="indefinite" />
                    </circle>
                </g>
            </svg>
            <p>Cargando...</p>

          </div>

      }
        </>
    )


}

export default Compras