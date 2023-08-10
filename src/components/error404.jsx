import React from "react";
import img404 from "../img/404.jpg"

function Error404(){
    return(
        <>
            <section className="sectionError404">
                <img className="sectionError404_img" src={img404} alt="Error 404" />
            </section>
            
        </>
    )
}

export default Error404