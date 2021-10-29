import { getFirestore, collection, getDocs, query, doc, onSnapshot } from 'firebase/firestore';
import { useState, useEffect } from 'react';
import { projectFirestore } from '../firebase';

const useFirestore = (col) => {
  const [arrangements, setDocs] = useState([]);

  useEffect(() => {
    /* const unsub = projectFirestore.collection(collection)
      .orderBy('title', 'desc')
      .onSnapshot(snap => {
        let documents = [];
        snap.forEach(doc => {
          documents.push({...doc.data(), id: doc.id});
        });
        setDocs(documents);
      }); */

      const q = query(collection(projectFirestore, col));
      const unsub = onSnapshot(q, (snap) => {
          let documents = [];
          snap.forEach(doc => {
            documents.push({...doc.data(), id: doc.id});
          });
          setDocs(documents);
    })

    return () => unsub();
    // this is a cleanup function that react will run when
    // a component using the hook unmounts
  }, [col]);

  return { arrangements };
}

export default useFirestore;

/* 
const unsub = onSnapshot(q, (snapshot) => {
    snapshot.docChanges().forEach(change  =>  {
        if (change.type === "added") {
            console.log("New: ", change.doc.data());
        }
        if (change.type === "modified") {
            console.log("Modified: ", change.doc.data());

        }
        if (change.type === "removed") {
            console.log("Removed: ", change.doc.data());
        }
    })
}) */