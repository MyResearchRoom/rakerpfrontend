import {
    FETCH_MATERIALS_SUCCESS,
    FETCH_MATERIALS_FAILURE,
    FETCH_MATERIALS_REQUEST
} from "../actionTypes";

const initialState = {
  materials: [],
  error: null,
  totalPages: 1,
  loading:false,
};


export const materialReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_MATERIALS_REQUEST:
      return {
         ...state,
        loading:true,
        error:null,
     };

    case FETCH_MATERIALS_SUCCESS:
      return {
         ...state,
        materials: action.payload.materials,
        totalPages:action.payload.totalPages,
        loading:false,
     };

    case FETCH_MATERIALS_FAILURE:
      return { 
        ...state,
        error: action.payload,
        totalPages: 1,
        loading:false,
    };

    default:
      return state;
  }
};
