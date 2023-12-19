import React from "react";
import {HashRouter, Route, Routes, Navigate } from "react-router-dom";
import { useSelector } from 'react-redux';

import FatherComponent from '../components/father';
import Error404 from '../components/error404'
import Index from '../components/principal_pages/index';
import Login from '../components/principal_pages/Login';
import AdminPage from '../components/principal_pages/admin_pages/admin';
import WaiterPage from '../components/principal_pages/waiterPage';
import ChefPage from '../components/principal_pages/chefPage';
import ManageUser from "../components/principal_pages/admin_pages/manageUsers";
import Inventory from "../components/principal_pages/admin_pages/Inventory/buys";
import ManageMenu from "../components/principal_pages/admin_pages/manageMenu";
import Config from "../components/principal_pages/admin_pages/configApp"

function AppRouter(){
    const type_user = useSelector(state => state.auth.type_user )
    return(
        <>
            <HashRouter>
                <Routes>
                    <Route path="/" element={<FatherComponent />}>
                        <Route index element={<Index/>}/>
                        <Route path="/Login" element={<Login />}/>
                        <Route path="*" element={<Error404 />}/>
                        <Route path="/Error404" element={<Error404 />}/>
                        {type_user === 1 ? (
                            <>
                                <Route path="/AdminPage" element={ <AdminPage />}/>
                                <Route path="/ManageUser" element={<ManageUser />}/>
                                <Route path="/Inventory" element={<Inventory />}/>
                                <Route path="/ManageMenu" element={<ManageMenu />}/>
                                <Route path="/Config" element={<Config />}/>
                            </>
                            ) : (
                            <Route path='*' element={<Navigate to='/Error404' replace />} />
                        )}
                        {type_user === 2 || type_user === 1 ? (
                            <Route path="/WaiterPage" element={<WaiterPage />}/>
                            ) : (
                            <Route path='*' element={<Navigate to='/Error404' replace />} />
                        )}
                        {type_user === 3 || type_user === 1 ? (
                            <Route path="/ChefPage" element={<ChefPage />}/>
                            ) : (
                            <Route path='*' element={<Navigate to='/Error404' replace />} />
                        )}
                    </Route>
                </Routes>
            </HashRouter>
        </>
    )
}
export default AppRouter
