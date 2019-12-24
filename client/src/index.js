import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import axios from 'axios';
import { AuthProvider } from './contexts/auth';
import { CookiesProvider } from 'react-cookie';

axios.defaults.baseURL = "http://localhost:8000/api";
axios.defaults.withCredentials = true;

ReactDOM.render(<CookiesProvider><AuthProvider ><App /></AuthProvider></CookiesProvider>, document.getElementById('root'));