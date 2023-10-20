import { useNavigate } from "react-router-dom";
import menu from '../../../img/menuDelDia.webp';
import grapich from '../../../img/config.png';
import user from '../../../img/usuario.png';
import { motion } from "framer-motion";

import foto1 from "../../../img/bannerVentas/foto1.webp";
import foto2 from "../../../img/bannerVentas/foto2.webp";
import foto3 from "../../../img/bannerVentas/foto3.webp";
import foto4 from "../../../img/bannerVentas/foto4.webp";
import foto5 from "../../../img/bannerVentas/foto5.webp";
import foto6 from "../../../img/bannerVentas/foto6.webp";
import '../../../stylesheets/principal_pages/admin_pages/admin_pages.css';




function AdminPage(){

    

    const navigate = useNavigate()
   
    const handleCiclik=(link)=>{
        navigate(`/${link}`)
    }

    return(
        <>
            <section className="sectionAdmin">
                <div className="section_div1_container">
                    <motion.div className="element1" onClick={()=>{handleCiclik('ManageMenu')}}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ 
                            delay:.5,
                            duration: .5,
                            ease: "linear"
                        }}>

                        <motion.img className="food1" src={menu} alt="comida1" 
                            initial={{ y: -30, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -30, opacity: 0 }}
                            transition={{ 
                                delay:1,
                                duration: 0.5,
                                ease: "linear", }}
                        />


                        <motion.h3 className="h3menu"
                                initial={{ y: 150, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: -150, opacity: 0 }}
                                transition={{ 
                                delay:1,
                                duration: 0.5,
                                ease: [0, 0.71, 0.2, 1.01], }}
                        >Crea aquí el menú del día</motion.h3>
                    </motion.div>

                    <motion.div className="element2" onClick={()=>{handleCiclik('Inventory')}}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ 
                                    delay:0.5,
                                    duration: .5,
                                    ease: "linear",
                                }}
                    >
                        <h3 className="colorWhite h3invent">Registra aquí <br/>el inventario</h3>
                        <p className="colorWhite">Lleva un control de tu inventario</p>
                    </motion.div>

                    <motion.div className="element3" onClick={()=>{handleCiclik('Config')}}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ 
                                    delay:0.7,
                                    duration: .5,
                                    ease: "linear", }}
                    
                    
                    >
                        <img className="grapich" src={grapich} alt="" />
                    </motion.div>
                    
                    <motion.div className="element4" onClick={()=>{handleCiclik('ManageUser')}}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ 
                                    delay:1,
                                    duration: .5,
                                    ease: "linear", }}
                    >
                        <img className="imgUser" src={user} alt="" />
                        <h3 className="colorWhite">Gestionar usuarios</h3>
                    </motion.div>

                    <motion.div className="element5" onClick={()=>{handleCiclik('ManageUser')}}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ 
                                    delay:1.3,
                                    duration: .5,
                                    ease: "linear",
                                }}
                    >
                        <h3 className="colorWhite">Punto de venta</h3>
                        <p className="colorWhite">Empieza a registrar tus ventas</p>

                        <motion.img className="imgBannerVenta foto1" src={foto1}
                                    initial={{ x: 0 }}
                                    animate={{ x: -5 }} 
                                    transition={{
                                    delay:2.3,
                                    duration: .5, 
                                    ease: "easeInOut", 
                                    type: "spring"
                                    }}
                        />
                        <motion.img className="imgBannerVenta foto2" src={foto2}
                                    initial={{ x: 0 }}
                                    animate={{ x: 5 }} 
                                    transition={{
                                    delay:2.3,
                                    duration: 1, 
                                    ease: "easeInOut", 
                                    }}                        
                        />
                        <motion.img className="imgBannerVenta foto3" src={foto3}
                                    initial={{ y: 0 }}
                                    animate={{ y: -10 }} 
                                    transition={{
                                    repeat: Infinity, 
                                    repeatType: "reverse", 
                                    duration: 3, 
                                    ease: "easeInOut", 
                                    
                                    }}                        
                        />
                        <motion.img className="imgBannerVenta foto4" src={foto4}
                                    initial={{ y: 0 }}
                                    animate={{ y: 10 }} 
                                    transition={{
                                    repeat: Infinity, 
                                    repeatType: "reverse", 
                                    duration: 3, 
                                    ease: "easeInOut", 
                                    }}                      
                        />
                        <motion.img className="imgBannerVenta foto6" src={foto6}
                                    initial={{ y: 0 }}
                                    animate={{ y: 5 }} 
                                    transition={{
                                    delay:2.3,
                                    duration: 1, 
                                    ease: "easeInOut", 
                                    }}                        
                        />
                        <motion.img className="foto5" src={foto5}/>

                    </motion.div>




                </div>
                
            </section>
            
        </>
    )
}

export default AdminPage