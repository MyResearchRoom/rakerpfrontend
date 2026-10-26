import { createSlice } from "@reduxjs/toolkit";

export const authSlice=createSlice({
    name:"auth",
    initialState:{
        user:null,
        token:null,
        role:null,
        companyId:null,
        accessRoute: [],
        authLoading: true,
    },
    reducers:{
        loginUser:(state,action)=>{
            state.token=action?.payload?.token;
            state.role=action?.payload?.role;
            state.user = action?.payload?.user;
            state.companyId=action?.payload?.companyId;
            state.accessRoute=action?.payload?.accessRoute||[];
            state.authLoading = false;
        },
        logoutUser:(state)=>{
            state.user=null;
            state.token=null;
            state.role=null;
            state.companyId=null;
            state.accessRoute=[];
            state.authLoading = false;
        },
        setToken: (state, action) => {
          state.token = action.payload;
          state.authLoading = false;
        },
        authFailed: (state) => {
            state.user = null;
            state.token = null;
            state.role = null;
            state.companyId=null;
            state.accessRoute=[];
            state.authLoading = false; 
        },

        updateUser: (state, action) => {
    state.user = {
        ...state.user,
        ...action.payload,
    };
},
    }
})


export const {loginUser,logoutUser,setToken,authFailed,updateUser,
}=authSlice.actions;

export default authSlice.reducer