import { React, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "../Hoocks/userForm";

import { useDispatch } from "react-redux";
import { login } from "../../redux/userSlice";
import { useSelector } from "react-redux";
import Cookies from 'js-cookie';
import Swal from "sweetalert2";

import '../../stylesheets/principal_pages/login.css'


function Login() {
  const navigate = useNavigate();
  const isLoggedIn = useSelector((state) => state.auth.is_logged_in);
  const url = process.env.REACT_APP_URL_HOST;
  const companyName = useSelector((state) => state.auth.name_business);
  const [isLoading, setIsLoading] = useState(false);
  const [company,setCompany] = useState('Food Ease');


  useEffect(()=>{
    if(companyName){
      setCompany(companyName);
    }
  },[companyName]);


  const executedSwalFire=(title, text,icon)=>{
    Swal.fire({
      title: icon,
      text: text,
      icon: icon,
      confirmButtonText: "Ok",
      willClose: function () {},
      customClass: {
        container: "notification-modal",
      },
    });
  }

  const { name, password, onInputChange, onResetForm } = useForm({
    name: "",
    password: "",
  });
  const dispatch = useDispatch();
  const onLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    await fetch(url, {
      method: "POST",
      mode: "cors",
      body: JSON.stringify({
        "username": name,
        "password": password,
        "login_request":true,
      }),
      headers: {
        'Content-Type': 'application/json',
        'Module': 'user'
      },
    })
      .then((response) => {
        if (response.ok) {
        } else {
          console.error();
        }
        setIsLoading(false);
        return response.json();
      })
      .then(function (data) {
        if (data.status === 200) {
          dispatch(login(data.results));
          const token = data.results.token;
          Cookies.set('token', token, { sameSite: 'None', secure: true });
          navigate("/Dashboard", {
            replace: true,
            state: {
              logged: true,
              name,
            },
          });
          onResetForm();
        } else {
          executedSwalFire("Error","Usuario o contraseña invalidos","error");
        }
      });
    setIsLoading(false);
  };
  useEffect(() => {
    if (isLoggedIn) {
      navigate("/", { replace: true });
    }
  }, [isLoggedIn, navigate]);

  return (
    <>


    <section className="section_login">
        <div className="section_logind_div1"></div>
        <div className="section_logind_div2 card card_login">
            <form onSubmit={onLogin} className="card-body card-body_login needs-validation" >
                <h5 className="card-title">Bienvenido a {company}</h5>
                <div className="mb-3 div_login">
                <label className="form-label" htmlFor="name">Nombre</label>
                <input
                    className="form-control"
                    type="text"
                    name="name"
                    id="name"
                    value={name}
                    onChange={onInputChange}
                    autoComplete="off"
                    placeholder="Ingrese el usuario"
                />
                </div>
                <div className="mb-3 div_login ">
                <label className="form-label" htmlFor="password" >
                    Contraseña
                </label>
                <input
                    className="form-control"
                    type="password"
                    name="password"
                    id="password"
                    value={password}
                    onChange={onInputChange}
                    autoComplete="off"
                    placeholder="Ingrese la contraseña"
                />
                </div>

                {isLoading ? (
                <p className="cargando_formLogin">Cargando...</p>
                ) : (
                <button className="btn btn-dark">Entrar</button>
                )}
            </form>
        </div>
    </section>
    </>
  );
}

export default Login;
