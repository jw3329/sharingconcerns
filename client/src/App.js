import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Navbar from './components/navbar';
import { Container } from 'react-bootstrap';
import { Signin, Signup } from './components/sign';

import Home from './components/home';
function App() {
  return (
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
