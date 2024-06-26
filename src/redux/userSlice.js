import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  is_logged_in: false,
  id_user:'',
  username: '',
  name:'',
  type_user:'',
  photo:'',
  id_business:'',
  name_business: '',
  logo: '',
  Description:'',
  office_hours:'',
  address:'',
  number_phone: '',
};



const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      const { username,id_user, is_logged_in, name, type_user, photo, id_negocio } = action.payload;
      state.is_logged_in = is_logged_in;
      state.id_user = id_user;
      state.username = username;
      state.name = name;
      state.type_user = type_user;
      state.photo = photo;
      state.id_business = id_negocio;
    },
    logout: (state) => {
      state.is_logged_in = false;
      state.username = '';
      state.name = '';
      state.type_user = '';
      state.photo = '';
      state.id_user = '';
      state.id_business = ';'
    },
    initial: (state, action) => {
      const {id, nameBusiness, logo, description, officeHours, address, numberPhone  } = action.payload;
      state.id = id;
      state.nameBusiness = nameBusiness;
      state.logo = logo;
      state.description = description;
      state.office_hours = officeHours;
      state.address = address;
      state.number_phone = numberPhone;
    },
    changeName:(state, action) => {
      const {name} = action.payload;
      state.name = name;
    },
  },
});

export const { login, logout, initial, changeName } = authSlice.actions;
export const selectAuth = state => state.auth;
export const selectIsLoggedIn = state => state.auth.is_logged_in;
export const selectName = state => state.auth.username;
export const selectURL = state => state.auth.url;



export default authSlice.reducer;

