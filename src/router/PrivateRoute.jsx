import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import ValidarSesion from '../components/Scripts/validarSesion';
import { login } from '../redux/userSlice';


function PrivateRoute({ children, typeUser }) {
  const isLoggedIn = useSelector(state => state.auth.is_logged_in);

  // const type_user = useSelector(state => state.auth.type_user);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    ValidarSesion()
      .then(data => {
        if (data.is_logged_in) {
          dispatch(login(data));
        } else {
          dispatch(login({ username: 'login', is_logged_in: data.is_logged_in }));
        }
      })
      .catch(error => {
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [dispatch]);

  return isLoading ? (
    <div>Loading...</div>
  ) : isLoggedIn ? (
    <>

      {children}

    </>
  ) : (
    <Navigate to="/" />
  );

}

export default PrivateRoute;
