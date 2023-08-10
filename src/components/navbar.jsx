import { useNavigate, NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/userSlice";
import React, { useEffect, useState } from "react";
import cerrarSesion from "./Scripts/cerrarSesion";
import logo from "../img/logo4.png";

import  '../stylesheets/navbar.css'



function NavBar() {
  const infoBusiness = useSelector((state) => state.auth);
  const url = useSelector((state) => state.auth.url);
  const isLoggedIn = useSelector((state) => state.auth.is_logged_in);
  const type_user = useSelector((state) => state.auth.type_user);
  const name = useSelector((state) => state.auth.name);
  let img = useSelector((state) => state.auth.photo);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [navActive,setNavActive] = useState(true)
  const [setLogo, getLogo] = useState(false);
  
  const handleChange =()=>{
    setNavActive(!navActive);
  }
  

  useEffect(() => {
    if (infoBusiness.logo) {
      getLogo(true);
    }
  }, [infoBusiness]);

  const cerraS = ()=> {

    dispatch(logout());
    cerrarSesion();
    setNavActive(!navActive);
  }
  return (
    <>
      <nav className="navbar navbar-expand-* navbar-ligth fixed-top">
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
                <div className="navbar-nav ulProfileContainer">
                  <div className="nav-item profileContainer">
                    <div className="nav-link imgContainer">
                      <img
                        className="profilePhoto"
                        src={url + img}
                        alt={name}
                      />
                    </div>
                  </div>
                  <div className="nav-item">
                    <p className="colorBlack">
                      {name}
                    </p>
                  </div>
                </div>
                <button
                  className="navbar-toggler"
                  onClick={handleChange}
                >
                  <span className="navbar-toggler-icon"></span>
                </button>
              </div>

              <div
                className={navActive? "collapse navbar-collapse divContainerUl":"collapse navbar-collapse divContainerUl show"}
                id="navbarNav"
              >
                <ul className="navbar-nav">
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
              <button
                className="navbar-toggler"
                onClick={handleChange}
              >
                <span className="navbar-toggler-icon"></span>
              </button>
              <div className={navActive? "collapse navbar-collapse divContainerUl":"collapse navbar-collapse divContainerUl show"} id="navbarNav">
                <ul className="navbar-nav">
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
