import React, { Component, useState } from 'react'
import {connect} from 'react-redux';
import {fetchPosts} from '../actions/postActions'
import PropTypes from 'prop-types';
import projectFirestore from '../firebase';
import { getFirestore, collection, getDocs, query, doc, onSnapshot } from 'firebase/firestore';

class Posts extends Component {
    constructor(props){
        super(props);
        this.state = {
            posts: []
        }
    }

    testFunc =  () => {
        /* const q = query(collection(db, 'sampleData'));
        const unsub = onSnapshot(q, (snapshot) => {
            snapshot.docChanges().forEach(change  =>  {
                if (change.type === "added") {
                    console.log("New: ", change.doc.data());
                    this.setState({posts: [...this.state.posts, change.doc.data()]})
                }
                if (change.type === "modified") {
                    console.log("Modified: ", change.doc.data());
                    let tmpDoc = change.doc.data();
                    let tmpArr = this.state.posts;
                    console.log(tmpDoc);
                    console.log(tmpArr);

                    let index = tmpArr.findIndex((post) => post.title === tmpDoc.title)
                    if(index > 0){
                        tmpArr[index] = tmpDoc;
                    }

                    this.setState({posts: tmpArr});
                }
                if (change.type === "removed") {
                    console.log("Removed: ", change.doc.data());
                }
            })
        }) */
       /*  const unsub = onSnapshot(doc(db, 'sampleData', '1GgTUqs2ItOu9AmApHvN'), (doc) => {
            console.log(doc.data());
        }) */
        /* let arrangements = collection(db, 'sampleData');
        let snapshot = await getDocs(arrangements);
        let data = snapshot.docs.map(doc => doc.data());
        this.setState({posts: data}) 
        */
    }

    componentDidMount(){
        console.log('posts mounted')
        //this.testFunc();

    }


    componentWillReceiveProps(nextProps){
        if(nextProps.newPost){
            this.props.posts.unshift(nextProps.newPost);
        }
    }

    render() {
        const postItems = this.state.posts.map(post => (
            <div key={post.id}>
                <h3>{post.title}</h3>
                <p>{post.body}</p>
            </div>
        ))
        return (
            <div>
                <h1>Posts</h1>
                {postItems}
            </div>
        )
    }
}

export default Posts
/* 
Posts.propTypes = {
    fetchPosts: PropTypes.func.isRequired,
    posts: PropTypes.array.isRequired,
    newPost: PropTypes.object
    
}

const mapStateToProps = state => ({
    posts: state.posts.items,
    newPost: state.posts.item
})
export default connect(mapStateToProps, {fetchPosts})(Posts); */