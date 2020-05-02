import { combineReducers } from 'redux';
import dashboardReducer from './dashboardReducer';

export default combineReducers({
    dashboard: dashboardReducer
});