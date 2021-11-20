import { getFirestore, collection, getDocs, query, doc, onSnapshot, where } from 'firebase/firestore';
import { useState, useEffect } from 'react';
import { projectFirestore } from '../firebase';

const useFirestore = (col) => {
  const [arrangementPages, setArrangements] = useState([]);
  const [addons, setAddons] = useState([]);
  const [settings, setSettings] = useState(new Map());
  const itemsPerPage = 12;

  let setDocs = (documents, col) => {
    if(col === 'addons'){
      setAddons(documents);
    }else if(col === 'arrangements'){
      setArrangements(documents);
    }else if(col === 'settings'){
      let tmpMap = new Map();
      documents.forEach(doc => {
        return tmpMap.set(doc.name, doc.value);
      })
      setSettings(tmpMap);
    }
  }

  useEffect(() => {
 
      let collectionRef = collection(projectFirestore, col);

      let q = query(collectionRef)
      if(col === 'arrangements'){
        q = query(collectionRef, where("active", "==", true));
      }

      /* const unsub = onSnapshot(q, (snap) => {
          let documents = [];
          snap.forEach(doc => {
            documents.push({...doc.data(), id: doc.id});
          });
          setDocs(documents); */
      const unsub = onSnapshot(q, (snap) => {
        let documents = [];
        if(col === 'addons' || col === 'settings'){
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

  return { arrangementPages, addons, settings };
}

export default useFirestore;