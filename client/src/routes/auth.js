import React from 'react';
import Post from '../components/post';


const AuthRoutes = () => {

    console.log('here')

    return (
        <Route exact path="/post"><Post /></Route>
    );
}

export default AuthRoutes;