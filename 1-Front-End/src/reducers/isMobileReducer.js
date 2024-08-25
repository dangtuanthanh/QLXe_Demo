// isMobileReducer.js

const initialState = {
    isMobile: window.innerWidth < 1250
  };
  
  export default function isMobileReducer(state = initialState, action) {
  
    if(action.type === 'SET_ISMOBILE') {
      return {
        ...state,
        isMobile: action.payload
      }
    }
  
    // Không xử lý action
    return state; 
  }