
import ComponenteBaseCreadorMenu from "../componenteBaseCreadorMenu";
function Beginning(props){
return(

    <>
        <ComponenteBaseCreadorMenu
            nameCategoryItem = {"Principios"}
            onlyNameCategory = {"principio"}
            nameItem = {"beginning"}
            labedescriptionItem = {"el principio"}
            labelNameItem = {"del principio"}
            setChangeFather = {props.setChangeFather}
        />
    </>
)
}

export default Beginning