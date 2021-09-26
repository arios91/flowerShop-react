import React from 'react'
import useFirestore from '../hooks/useFirestore';

const Test = () => {
    const {docs} = useFirestore('sampleData');
    console.log(docs);

    const postItems = docs.map(post => (
        <div key={post.id}>
            <h3>{post.title}</h3>
            <p>{post.body}</p>
        </div>
    ))

    return (
        <div>
            {postItems}
        </div>
    )
}


export default Test;