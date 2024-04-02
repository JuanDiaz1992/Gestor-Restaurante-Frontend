import {Button, Image} from "@nextui-org/react";
import img1 from "../../../img/delivery/foto1.png";
function HomeDelivery({setOoptionView}){
    return(
        <>
            <div className="section__delivery__container">
                <div className="section__delivery__img__container">
                    <Image src={img1} alt="" />
                </div>
                <div className="section__delivery__container__text__buttons">
                    <div>
                        <h3>Tomar pedidos a domicilio</h3>
                        <p>Desde esta sección se puede gestionar todos los pedidos que se llevan a domicilio</p>
                    </div>
                    <div className="section__delivery__container__buttons__container">
                        <Button onClick={()=>setOoptionView(1)} color="warning">Tomar Pedidos</Button>
                        <Button onClick={()=>setOoptionView(2)} color="warning">Ver Pedidos del día</Button>
                    </div>
                </div>
                </div>
        </>
    );
}
export default HomeDelivery;