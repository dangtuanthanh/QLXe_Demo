// rootReducer.js

import { combineReducers } from 'redux';
import loadingReducer from './loadingReducer';
import isMobileReducer from './isMobileReducer';

const rootReducer = combineReducers({
  loading: loadingReducer,
  isMobile:isMobileReducer
})

export default rootReducer;