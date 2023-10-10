import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  is_logged_in: false,
  id_user:'',
  username: '',
  name:'',
  type_user:'waiter',
  photo:'',
  url: 'http://localhost:80/gestion_restaurante/',
  id_business:'',
  name_business: '',
  logo: '',
  Description:'',
  office_hours:'',
  address:'',
  number_phone: ''
};



const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      const { username,id_user, is_logged_in, name, type_user, photo } = action.payload;
      state.is_logged_in = is_logged_in;
      state.id_user = id_user;
      state.username = username;
      state.name = name;
      state.type_user = type_user;
      state.photo = photo
    },
    logout: (state) => {
      state.is_logged_in = false;
      state.username = '';
      state.name = '';
      state.type_user = 'waiter';
      state.photo = '';
      state.id_user = '';
    },
    initial: (state, action) => {
      const {id, name_business, logo, Description, office_hours, address, number_phone  } = action.payload;
      state.id = id;
      state.name_business = name_business;
      state.logo = logo;
      state.Description = Description;
      state.office_hours = office_hours;
      state.address = address;
      state.number_phone = number_phone;
    },
    changeName:(state, action) => {
      const {name} = action.payload;
      state.name = name;
    },
  },
});



export const { login, logout, checkSession, initial, changeName } = authSlice.actions;




export const selectAuth = state => state.auth;
export const selectIsLoggedIn = state => state.auth.is_logged_in;
export const selectName = state => state.auth.username;
export const selectURL = state => state.auth.url;



export default authSlice.reducer;

