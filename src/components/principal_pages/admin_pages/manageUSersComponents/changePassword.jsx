import { useSelector,useDispatch } from 'react-redux';
import { logout } from '../../../../redux/userSlice';
import cerrarSesion from '../../../Scripts/cerrarSesion'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react';
import getCookie from '../../../Scripts/getCookies';
import Swal from 'sweetalert2';

function ChangePassword(props){
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [password,setPassword] = useState('');
    const [confirmPassword,setConfirmPassword] = useState('');
    const [isOkPassword,setIsOkPassword] = useState(true);
    const [isOkConfirmPassword,setIsOkConfirmPassword] = useState(true);
    const [isValidForm,setFormIsOk] = useState(false);

    const url = process.env.REACT_APP_URL_HOST;
    const username = useSelector((state) => state.auth.username);


    /*Validador contraseña*/
    const handleChangePassword = (e)=>{
        let passwordH = e.target.value;
        setPassword(passwordH);
        const specialCharsRegex = /[!@#$%^&*(),.?":{}|<>]/;
            if (passwordH.length>=4&&!specialCharsRegex.test(passwordH)){
                setIsOkPassword(true);
            }else{
                setIsOkPassword(false);
            }
    }

    /*Validador comfirmar contraseña*/
    const handleChangeConfirmPassword = (e)=>{
        let confirmPasswordH = e.target.value;
        setConfirmPassword(confirmPasswordH);
        const specialCharsRegex = /[!@#$%^&*(),.?":{}|<>]/;
            if (confirmPasswordH.length>=4&&!specialCharsRegex.test(confirmPasswordH)){
                setIsOkConfirmPassword(true);
            }else{
                setIsOkConfirmPassword(false);
            }
    }

    /*valida ambos datos antes de enviarlos*/
    useEffect (()=>{
        const specialCharsRegex = /[!@#$%^&*(),.?":{}|<>]/;
            if (confirmPassword.length>=4&&!specialCharsRegex.test(confirmPassword)
                && password.length>=4&&!specialCharsRegex.test(password)
                && password === confirmPassword){
                    setFormIsOk(true);
            }else{
                    setFormIsOk(false);
            }
    },[password,confirmPassword])

    /*Envío de formulario*/
    const sedForm = async (e)=>{
        e.preventDefault()
        if(isValidForm){
            try{
                const response = await fetch(url,{
                    method:'POST',
                    mode:'cors',
                    body:JSON.stringify({
                        'id':props.idUSer,
                        'password':password,
                        'confirmPassword':confirmPassword,
                        'changePasswordUser':true
                    }),
                    headers:{
                        'Authorization': 'Token ' + getCookie('token'),
                        'Module': 'user'
                    }
                });
                if(!response){
                    throw new Error('Error al enviar el formulario');
                }
                const data = await response.json();
                if(data.registered){
                    Swal.fire({
                        title: "Genial!",
                        text: "Cambio éxitoso",
                        icon: "success",
                        confirmButtonText: "Ok",
                        customClass: {
                        container: "notification-modal",
                        },
                        willClose: function() {
                            if(username === props.userNameEdited){
                                dispatch(logout())
                                cerrarSesion()
                                navigate('/Login')
                            }else{
                                props.closeModalEdit()
                            }
                            
                          }
                      });
                }
                console.log(data)

            }catch(error){
                console.log(error);
            }
        }
    }



    return(
        <>
            <div className="modal-dialog">              
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Cambiar la contraseña para:</h5>
                        <button className="btn-close" onClick={()=>{props.closeModalEdit()}} aria-label="Close"></button>
                    </div>
                    <div className="imgEditUserContainer">
                        <picture className="imgContainer  imgContainerEdit">
                            <img className="profilePhoto imgEditUser" src={url + props.photo} alt="" />
                        </picture>
                        <p>{props.nameUSer}</p>
                    </div>
                    <form className="modal-body" onSubmit={(e)=>{sedForm(e)}}>
                        <div className="mb-3">
                            <label htmlFor="exampleInputPassword1" className="form-label label_createUser">Contraseña</label>
                            <input value={password} onChange={(e)=>{handleChangePassword(e)}} type="password" className={isOkPassword? "form-control": 'is-invalid form-control'} id="exampleInputPassword1" placeholder='Contraseña'/>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="confirmPassword" className="form-label label_createUser">Comfirme la contraseña</label>
                            <input value={confirmPassword} onChange={(e)=>{handleChangeConfirmPassword(e)}} type="password" className={isOkConfirmPassword? "form-control": 'is-invalid form-control'} id="confirmPassword" placeholder='Comfirmar contraseña'/>
                        </div>
                        {isValidForm? <></>:<div className="form-text">La contraseña no puede contener caracteres especiales, debe contener más de 4 caracteres y deben coincidir</div>}
                        <div className="modal-footer">
                            <button className="btn btn-secondary" onClick={()=>{props.closeModalEdit()}}>Close</button>
                            <button className={isValidForm ? 'btn btn-primary' : 'btn btn-dark'}>Save changes</button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}
export default ChangePassword