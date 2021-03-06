import React, { useEffect, useContext, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from './components/navbar';
import axios from 'axios';
import AuthContext from './contexts/auth';
import Routes from './routes';
import { BrowserRouter } from 'react-router-dom';

function App() {

  const { setAuth } = useContext(AuthContext);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    axios.get('/user')
      .then(res => res.data)
      .then(({ status, user }) => status && setAuth(user))
      .catch(err => console.log(err))
      .finally(() => setLoaded(true));
  }, [loaded, setAuth]);

  return loaded && (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <div className="container mt-3">
          <Routes />
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
