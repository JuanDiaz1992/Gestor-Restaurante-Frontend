import ComponenteBaseCreadorMenu from "../componenteBaseCreadorMenu";
function Drinks(props){
    return(
        <>
        <ComponenteBaseCreadorMenu
            nameCategoryItem = {"Bebidas"}
            onlyNameCategory = {"bebida"}
            nameItem = {"drinks"}
            labedescriptionItem = {"la bebida"}
            labelNameItem = {"la bebida"}
            setChangeFather = {props.setChangeFather}
        />
        </>
    )
}

export default Drinks