import React, { useEffect, useContext, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter } from 'react-router-dom';
import Navbar from './components/navbar';
import { Container } from 'react-bootstrap';
import axios from 'axios';
import AuthContext from './contexts/auth';
import Routes from './routes';

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
        <Container className="mt-3">
          {/* <Route exact path="/"><Home /></Route>
            <Route exact path="/signup"><Signup /></Route>
            <Route exact path="/signin"><Signin /></Route>
            <Route exact path="/post"><Post /></Route> */}
          <Routes />
        </Container>
      </BrowserRouter>
    </div>
  );
}

export default App;
