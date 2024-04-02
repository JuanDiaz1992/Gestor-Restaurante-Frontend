import {Button, Input} from "@nextui-org/react";
function GetDelivery({setOoptionView}){
    return(
        <>
            <div className="section__getdelivery__container">
                <Button onClick={()=>setOoptionView(0)}>Volver atrás</Button>
                Tomar Pedidos
                <div>
                <Input
                    type="number"
                    label="Cantidad de almuerzos"
                    placeholder="1"
                    min="1"
                    labelPlacement="outside"
                    startContent={
                        <div className="pointer-events-none flex items-center">
                        <span className="text-default-400 text-small"></span>
                        </div>
                    }
                    />
                </div>
            </div>
        </>
    );
}
export default GetDelivery;