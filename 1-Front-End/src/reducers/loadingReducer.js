// loadingReducer.js

const initialState = {
    loading: false
  };
  
  export default function loadingReducer(state = initialState, action) {
  
    if(action.type === 'SET_LOADING') {
      return {
        ...state,
        loading: action.payload
      }
    }
  
    // Không xử lý action
    return state; 
  }