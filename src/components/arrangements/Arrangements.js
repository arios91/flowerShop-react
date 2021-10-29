import React from 'react'
import useFirestore from '../../hooks/useFirestore';
import ReactPaginate from 'react-paginate';

const Arrangements = () => {
    const itemsPerPage = 10;
    let arrangements = [];
    const {docs} = useFirestore('arrangements');
    console.log(docs);

    
    let pageCounter = 0;
    let itemCounter = 0;
    docs.forEach(doc => {
        if(itemCounter == itemsPerPage){
            pageCounter++;
            itemCounter = 0;
        }
        if(itemCounter == 0){
            let tmpArr = [];
            arrangements.push(tmpArr);
        }
        
        arrangements[pageCounter].push(doc);
        itemCounter++;
    })

    console.log(arrangements)


    return (
        <div>
            Test
        </div>
    )
}


export default Arrangements;
