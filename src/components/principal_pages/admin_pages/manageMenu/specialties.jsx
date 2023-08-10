import { useState } from "react";
import { useSelector } from "react-redux";
import getCookie from "../../../Scripts/getCookies";


function Specialities(props){
    const url = useSelector((state) => state.auth.url);
    const [specialitiesInclude, setSpecialitiesInclude] = useState(false)
    
    const isSpecialitiesInclude = (result)=>{
        if (result){
            setSpecialitiesInclude(true)
        }else{
            setSpecialitiesInclude(false)
            props.setChildrenUpdate(true)
        }
    }
    const specialities = props.specialties
    const selectItem = async (id)=>{
        const selectedSpeciality = specialities.find(items => items.id === id);
        try{
            const response = await fetch(
                `${url}`,
                {
                  method: "POST",
                  mode: "cors",
                  headers: {
                    Authorization: "Token " + getCookie("token"),
                    Module: "inventory",
                  },
                  body: JSON.stringify({
                    item : selectedSpeciality,
                    menu_temp: true,
                  }),
                }
            )
            const data = await response.json();
            if(data.status === 200){
                console.log(data)
                props.setChange(true)
            }else if(data.status === 409){
                console.log(data)
            }

        }catch (error){
            console.log(error)
        }
    }



    return(
        <>  
           
            {specialitiesInclude === true? 
            <>  
                <div>
                    {specialities.map((item)=>(
                        <button className="btn btn-secondary"  key={item.id} onClick={()=>{selectItem(item.id)}} >{item.name}</button>
                    ))}
                </div>
                <div>
                    <h4>Agregar otra especialidad</h4>
                    <form encType='multipart/form-data'>
                    <div className="mb-3">
                        <label htmlFor="name" >Nombre de la especialidad</label>
                        <input type="text" className="form-control" id="name" />
                    </div>
                    
                    <div className="mb-3">
                        <label htmlFor="description" >Descripción</label>
                        <textarea className="form-control" name="" id="description" rows="3" placeholder="Describa brevemente que incluye o de que trata la especialidad"></textarea>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="price" >Costo</label>
                        <input type="text" className="form-control" id="price"/>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="file">Foto</label>
                        <input type="file" className="form-control" id="file"/>
                    </div>
                    <button type="submit" className="btn btn-primary">Submit</button>
                    </form>
                </div> 
            </>
            : 
            <div>
                <h4>¿El menú de hoy incluye especialidades?</h4>
                <button className="btn btn-primary" onClick={()=>{isSpecialitiesInclude(true)}}>Si</button>
                <button className="btn btn-danger" onClick={()=>{isSpecialitiesInclude(false)}}>NO</button>
            </div>
            }


        </>
    )

}
export default Specialities