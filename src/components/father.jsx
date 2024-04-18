import {React} from "react";
import { Outlet } from 'react-router-dom';
import NavBar from './navbar';
import Footer from './footer'
import "../stylesheets/normalize.css"
import "../stylesheets/generalStylesheets.css"
import { useDispatch } from "react-redux";
import { initial } from "../redux/userSlice";



function FatherComponent(){
    const dispatch = useDispatch();
    const url = process.env.REACT_APP_URL_HOST;
    const getDataBusiness = () =>{
            fetch(`${url}getInfoBusiness?linkTo=id&equalTo=${1}`,{
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