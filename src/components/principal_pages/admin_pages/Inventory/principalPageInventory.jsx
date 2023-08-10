import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
 
function PrincipalPageInventory(){
    const navigate = useNavigate()
   
    const handleCiclik=(link)=>{
        navigate(`/${link}`)
    }

    return(
        <>
            <section className="principalPagueRegistreInventory">
                <div className="principalPagueRegistreInventory-div1">
                    <motion.div className="principalPagueRegistreInventory-div1-item1 card-div1-item" onClick={()=>{handleCiclik("Buys")}}
                                initial={{ opacity: 0}}
                                animate={{ opacity: 1}}
                                exit={{ opacity: 0 }}
                                transition={{ 
                                    duration: 1,
                                    ease: "linear",
                                }}
                        >
                            <h3>Compras</h3>
                            <p>Ingrese aquí las compras del día</p>
                    </motion.div>
                    <motion.div className="principalPagueRegistreInventory-div1-item2 card-div1-item" onClick={()=>{handleCiclik("Bills")}}
                                initial={{ opacity: 0}}
                                animate={{ opacity: 1}}
                                exit={{ opacity: 0 }}
                                transition={{ 
                                    delay:0.5,
                                    duration: 1,
                                    ease: "linear",
                                }}
                        >
                            <h3>Gastos</h3>
                            <p>Aquí solo registra gastos</p>
                    </motion.div>
                </div>
            </section>
        </>
    )   
}
export default PrincipalPageInventory