import {React} from "react";
import { Outlet } from 'react-router-dom';
import NavBar from './navbar';
import Footer from './footer'
import "../stylesheets/normalize.css"
import "../stylesheets/generalStylesheets.css"
import { useSelector , useDispatch } from "react-redux";
import { initial } from "../redux/userSlice";
// import { useNavigate } from 'react-router-dom';


function FatherComponent(){
    // const navigate = useNavigate()
    const dispatch = useDispatch();
    const url = useSelector((state) => state.auth.url);

    
    const getDataBusiness = () =>{
        fetch(`${url}business/`,{
            method:'GET',
            mode:'cors',
            headers:{
                'Module': 'business'
            }
        })
        .then(response => response.json())
        .then(data=>{
            if(data.status === 200){
                dispatch(initial(data['results'][0]));

            }
            
        })
        .catch(error => {
            console.error(error);
            // dispatch(logout())
            // navigate('/Login')
        })
    }
    getDataBusiness();



    
    return(
        <>
            <div className="app-container">
            <NavBar />
            <div className="content">
                <Outlet />
            </div>
            <Footer />
            </div>

        </>
    )
}

export default FatherComponent