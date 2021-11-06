import { getFirestore, collection, getDocs, query, doc, onSnapshot } from 'firebase/firestore';
import { useState, useEffect } from 'react';
import { projectFirestore } from '../firebase';

const useFirestore = (col) => {
  const [arrangementPages, setArrangements] = useState([]);
  const [addons, setAddons] = useState([]);
  const itemsPerPage = 12;

  let setDocs = (documents, col) => {
    if(col === 'addons'){
      setAddons(documents);
    }else if(col === 'arrangements'){
      setArrangements(documents);
    }
  }

  useEffect(() => {
 
      const q = query(collection(projectFirestore, col));

      /* const unsub = onSnapshot(q, (snap) => {
          let documents = [];
          snap.forEach(doc => {
            documents.push({...doc.data(), id: doc.id});
          });
          setDocs(documents); */
      const unsub = onSnapshot(q, (snap) => {
        let documents = [];
        if(col === 'addons'){
          snap.forEach(doc => {
            documents.push({...doc.data(), id: doc.id});
          })

        }else if(col === 'arrangements'){
          let counter = 0;
          let page = [];
          snap.forEach(doc => {
            if(counter == itemsPerPage){
              documents.push(page);
              page = [];
              counter =0;
            }else{
              page.push({...doc.data(), id: doc.id});
              counter++
            }
          });

        }
        setDocs(documents, col);
    })

    return () => unsub();
    // this is a cleanup function that react will run when
    // a component using the hook unmounts
  }, [col]);

  return { arrangementPages, addons };
}

export default useFirestore;