import "../../stylesheets/principal_pages/delivery.css";
import HomeDelivery from "./deliveryComponents/homeDelivery";
import GetDelivery from "./deliveryComponents/getDelivery";
import ViewDeliverys from "./deliveryComponents/viewDeliverys";

import { useEffect, useState } from "react";
function Delivery(){
    const [view,setView] = useState();
    const [optionView,setOoptionView] = useState(0)

    const setViewFunction=(option)=>{
        switch(option){
            case 1:
                setView(<GetDelivery setOoptionView={setOoptionView}/>)
                break;
            case 2:
                setView(<ViewDeliverys setOoptionView={setOoptionView}/>)
                break;
            default:
                setView(<HomeDelivery setOoptionView={setOoptionView}/>)
                break;
        }
    }
    useEffect(()=>{
        setViewFunction(optionView);
    },[optionView])
    return(
    <>
        <section className="section__delivery">
            {view}
        </section>
    </>
    );
}
export default Delivery;