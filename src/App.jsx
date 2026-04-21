import React, { useEffect, useState } from 'react';
import { getDatabase, onValue, push, ref, remove, set } from "firebase/database";
import { database } from '../dbConfig.js'
import { MdDelete } from 'react-icons/md';
import './App.css';


function App() {
  const [itemName, setItemName] = useState('');
  const [itemList, setItemList] = useState([]);
  const db = getDatabase();

const handelsubmit = (e) => {
  e.preventDefault();
  if (!itemName) {
    alert("Please input item name");
    return;
  }
  set(push(ref(db, 'toDoList/')), {
    itemName: itemName,
  });
  setItemName("");
}

const handeldelete = (item) => {
  remove(ref(db, 'toDoList/' + item.id))
}
useEffect(()=>{
onValue(ref(db, 'toDoList'), (snapshot) => {
  let data = [];
  snapshot.forEach((item) => {
    data.push({...item.val(), id: item.key });    
  })
  setItemList(data)
});
},[])



  return (
    <>
      <form>
        <h1>WBienvenue sur la liste des courses à faire</h1>
        <div className='maListe'>
          <label>Nom:</label>
          <input 
         className='zone' value={itemName} onChange={(e)=> setItemName(e.target.value)} type="text" name="itemName" id="itemName" />
          <button className='ajouter' onClick={handelsubmit}>Ajouter</button>
        </div>
        <div>
          <h2>Listes des courses à faire:</h2>
          {itemList.map((item) => (
            <ul key={item.id}>
              <li>{item.itemName}<button className='supprimer' onClick={() => handeldelete(item)}><MdDelete /></button>
              </li>
            </ul> 
          ))}
        </div>
        
      </form>
    </>
  )
}

export default App
