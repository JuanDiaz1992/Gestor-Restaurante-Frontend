import ComponenteBaseCreadorMenu from "../componenteBaseCreadorMenu";

function Soups(props){
    return(
        <>
          <ComponenteBaseCreadorMenu
          nameCategoryItem = {"Sopas"}
          onlyNameCategory = {"sopa"}
          nameItem = {"soups"}
          labedescriptionItem = {"la sopa"}
          labelNameItem = {"la sopa"}
          setChangeFather = {props.setChangeFather}
          />
        </>
    )
}

export default Soups