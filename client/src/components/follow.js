import React from 'react';
import Utils from '../utils';
import { Link } from 'react-router-dom';

const Follow = ({ follows }) => {

    const generateCard = (follow, key) => (
        <div className="card my-3" key={key}>
            <div className="card-body">
                <div className="row">
                    <div className="col-sm-4">
                        {Utils.getImageElement(follow._id, follow.profileImage)}
                    </div>
                    <div className="col-sm-8">
                        <Link to={`/${follow.username}`}>{follow.username}</Link>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="follows">
            {follows.map((follow, key) => generateCard(follow, key))}
        </div>
    );
}

export default Follow;