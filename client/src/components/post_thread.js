import React from 'react';

const PostThread = props => {

    const { id } = props.match.params;

    return (
        <div>This is postthread: {id}</div>
    );
}

export default PostThread;