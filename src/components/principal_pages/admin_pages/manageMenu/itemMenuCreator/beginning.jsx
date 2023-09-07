
import ComponenteBaseCreadorMenu from "../componenteBaseCreadorMenu";
function Beginning(props){ 
return(

    <>
        <ComponenteBaseCreadorMenu 
            nameCategoryItem = {"los principios"}
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