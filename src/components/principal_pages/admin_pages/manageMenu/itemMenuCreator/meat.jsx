import ComponenteBaseCreadorMenu from "../componenteBaseCreadorMenu";
function Meat(props){
  return(

      <>
        <ComponenteBaseCreadorMenu
        nameCategoryItem = {"Carnes"}
        onlyNameCategory = {"carne"}
        nameItem = {"meats"}
        labedescriptionItem = {"la carne"}
        labelNameItem = {"la carne"}
        setChangeFather = {props.setChangeFather}
        />
      </>
  )
}

export default Meat