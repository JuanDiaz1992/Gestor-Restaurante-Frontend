import { useState } from "react";
import { Button } from "@nextui-org/react";
import ComponenteBaseCreadorMenu from "../componenteBaseCreadorMenu";

function Specialities(props) {
  /*Sección de estados*/
  const [specialitiesInclude, setSpecialitiesInclude] = useState(false); /*Esta variable la cambia el usuario y es la que decide si el menú del día actual incluye especialidades*/

  /*Esta función es la que valida si el menú del día incluye especialidades*/


  return (
    <>
      {specialitiesInclude === true ? (
          <>
            <ComponenteBaseCreadorMenu 
              nameCategoryItem = {"las especialidades"}
              onlyNameCategory = {"especialidad"}
              nameItem = {"especialities"}
              labedescriptionItem = {"la especialidad"}
              labelNameItem = {"la especialidad"}
              setChangeFather = {props.setChangeFather}
            />
          </>
      ) : (
        <div>
          <h4>¿El menú de hoy incluye especialidades?</h4>
          <Button
            color="primary"
            onClick={() => {
              setSpecialitiesInclude(true);
            }}
          >
            Si
          </Button>
        </div>
      )}
    </>
  );
}
export default Specialities;
