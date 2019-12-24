import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import axios from 'axios';
import { AuthProvider } from './contexts/auth';

axios.defaults.baseURL = "http://localhost:8000/api";
ReactDOM.render(<AuthProvider ><App /></AuthProvider>, document.getElementById('root'));