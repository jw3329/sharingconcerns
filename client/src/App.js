import React, { useEffect, useContext, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Navbar from './components/navbar';
import { Container } from 'react-bootstrap';
import { Signin, Signup } from './components/sign';
import Home from './components/home';
import axios from 'axios';
import AuthContext from './contexts/auth';

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
          <Switch>
            <Route exact path="/"><Home /></Route>
            <Route exact path="/signup"><Signup /></Route>
            <Route exact path="/signin"><Signin /></Route>
          </Switch>
        </Container>
      </BrowserRouter>
    </div>
  );
}

export default App;
