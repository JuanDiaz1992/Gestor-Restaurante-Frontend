import { useNavigate, NavLink, useLocation  } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/userSlice";
import React, { useEffect, useState } from "react";
import { Avatar } from "@nextui-org/react";
import cerrarSesion from "./Scripts/cerrarSesion";
import setCookie from "./Scripts/borrarCookies"
import logo from "../img/logo4.png";
import { Button, Tooltip  } from "@nextui-org/react";
import {BiArrowBack} from "react-icons/bi"

import  '../stylesheets/navbar.css'



function NavBar() {

  const location = useLocation()
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const infoBusiness = useSelector((state) => state.auth);
  const url = useSelector((state) => state.auth.url);
  const isLoggedIn = useSelector((state) => state.auth.is_logged_in);
  const type_user = useSelector((state) => state.auth.type_user);
  const name = useSelector((state) => state.auth.name);
  let img = useSelector((state) => state.auth.photo);


  const [navActive,setNavActive] = useState(true)
  const [setLogo, getLogo] = useState(false);
  const [buttonNavigate, setbuttonNavigate] = useState(false)
  
  const handleChange =()=>{
    setNavActive(!navActive);
  }
  const navigateTo = ()=>{
    if(location.pathname==="/Login"){
      navigate("/")
    }else{
      navigate(-1)
    }
    
  }
  
  useEffect(()=>{
    if(location.pathname === "/" || location.pathname === "/AdminPAge"
      || location.pathname === "/ChefPage" || location.pathname === "/WaiterPage" ){
      setbuttonNavigate(false)
    }else{
      setbuttonNavigate(true)
    }
  },[location])


  useEffect(() => {
    if (infoBusiness.logo) {
      getLogo(true);
    }
  }, [infoBusiness]);

  const cerraS = ()=> {

    dispatch(logout());
    cerrarSesion();
    setCookie("token")
    setNavActive(!navActive);
  }
  return (
    <>
      <nav  className="navbar navbar-expand-* navbar-ligth fixed-top">
        <div className="container-fluid">
          <NavLink to="/" className="navbar-brand">
            <img
              className="navBarLogo"
              src={setLogo === true ? url + infoBusiness.logo : logo}
              alt="logo"
            />
          </NavLink>
          
          {isLoggedIn ? (
            <>
              <div className="profileAndButtonContainer">
                {buttonNavigate? 
                  <Tooltip content="Volver atrás" placement="bottom"> 
                    <Button isIconOnly color="danger" variant="ligth"  onClick={navigateTo}>
                      <BiArrowBack />
                    </Button> 
                  </Tooltip> 
                  : <></> }
                <div className="navbar-nav ulProfileContainer">
                  <div className="nav-item ">
                    <div className="nav-link ">
                      <Avatar
                        isBordered 
                        color="success"
                        size="md"
                        classNames={{
                            img: "opacity-1"
                        }}
                        src={url + img}
                        alt={name}
                      />
                    </div>
                  </div>
                  <div className="nav-item">
                    <p className="nameUser">
                      {name}
                    </p>
                    <p className="typeUserNav">
                      {type_user === "Admin"? "Administrador": 
                      type_user === "Waiter"? "Mesero":
                      type_user === "Chef"? "Cocinero": ""}
                    </p>
                  </div>
                </div>
                <div  className={!navActive? "icon nav-icon-5 open" : "icon nav-icon-5"} onClick={handleChange}>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>

              <div
                className={"collapse navbar-collapse divContainerUl" + (navActive ? "" : " show")}
                id="navbarNav"
              >
                <ul className="navbar-nav nav_ul">
                  <li className="nav-item">
                    <NavLink className="nav-link active" to="/" as="a" onClick={handleChange}>
                      Inicio
                    </NavLink>
                  </li>
                  {type_user === "Admin" ? (
                    <>
                      <li className="nav-item">
                        <NavLink className="nav-link" to="/WaiterPage" as="a" onClick={handleChange}>
                          Tomar pedidos
                        </NavLink>
                      </li>
                      <li className="nav-item">
                        <NavLink className="nav-link" to="/ChefPage" as="a" onClick={handleChange}>
                          Pedidos pendientes
                        </NavLink>
                      </li>
                      <li className="nav-item">
                        <NavLink className="nav-link" to="AdminPAge" as="a" onClick={handleChange}>
                          Administrador
                        </NavLink>
                      </li>
                    </>
                  ) : (
                    <></>
                  )}
                  {type_user === "Waiter" ? (
                    <li className="nav-item">
                      <NavLink className="nav-link" to="/WaiterPage" as="a" onClick={handleChange}>
                        Tomar pedidos
                      </NavLink>
                    </li>
                  ) : (
                    <></>
                  )}
                  {type_user === "Chef" ? (
                    <li className="nav-item">
                      <NavLink className="nav-link" to="/ChefPage" as="a" onClick={handleChange}>
                        Pedidos pendientes
                      </NavLink>
                    </li>
                  ) : (
                    <></>
                  )}
                  <li className="nav-item">
                    <NavLink to="/Login" className="nav-link" as="a" onClick={cerraS}>
                      Cerrar Sesión
                    </NavLink>
                  </li>
                </ul>
              </div>
            </>
          ) : (
            <>
              <div className="profileAndButtonContainer">
                {buttonNavigate? <Button isIconOnly color="warning" variant="faded"  onClick={navigateTo}><BiArrowBack /></Button> : <></> }
                <div  className={!navActive? "icon nav-icon-5 open" : "icon nav-icon-5"} onClick={handleChange}>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
              <div className={navActive? "collapse navbar-collapse divContainerUl":"collapse navbar-collapse divContainerUl show"} id="navbarNav">
                <ul className="navbar-nav nav_ul">
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/" as="a" onClick={handleChange}>
                      Inicio
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/Login" as="a" onClick={handleChange}>
                      Login
                    </NavLink>
                  </li>
                </ul>
              </div>
            </>
          )}
        </div>
      </nav>
    </>
  );
}

export default NavBar;
