import { useState, useEffect } from "react";
import React from "react";
import('./App.css');

var SERVER_URL = "http://127.0.0.1:5000"

function App() {
  let [Notes, setNotes] = useState("");
  const [disableVisNow, setDisable] = React.useState(false);
  const [show, setShow] = useState(false);

  function getNote() {
    fetch(`${SERVER_URL}/getnote`)
    .then(response => response.json())
    .then(data => {
      console.log(data)                     
    });
   }
  // getNote();
  // useEffect(getNote, []);

   function checkKeyChanged(e){
     if(!disableVisNow)
     if(e.code === 'Space' || e.code === 'Enter') {
       console.log(Notes);
    postData(`${SERVER_URL}/Addnote`, {text: Notes});
     }

   }
   function visualizeNow() {
    console.log(Notes);
    postData(`${SERVER_URL}/Addnote`, {text: Notes});
    
   }

   function FromEPIC() {
    fetch(`${SERVER_URL}/getnoteepic`)
    .then(response => response.json())
    .then(data => {
      console.log(data) 
    
   });
  }

   function visualizeNowModefunction() {
    console.log("at the end");
    setShow(prev => !prev)
    setDisable(true)
    // setVisualizeNowMode(true);

  }
  
   function visualizeContinouslyModefunction() {
    console.log("dynamic");
    setDisable(false)
   }



async function postData(url='',data={}){
  const response = await fetch(url, {
   
method: 'POST',
headers: {
  'Content-Type': 'application/json'
},
body: JSON.stringify(data)
});
return response.json();
}     
  return (
    <div className="App">
        <div className="header">
            <h1> DAVE</h1>
        </div>
        <div className= "vertical"></div>
        <div className="wrapper">
        <button id="now-mode-button" disabled={disableVisNow} className="button" type="button" onClick={visualizeNowModefunction}>Visualize at the end</button> |
        <button id="continous-mode-button" disabled={!disableVisNow} className="button" type="button" onClick={visualizeContinouslyModefunction}>Visualize Continously</button>
        <hr />
            <div>
                <label htmlFor="clincalNotesTextField">Write your notes here</label>
                <textarea id="clincalNotesTextField" name="clincalNotesTextField" rows="15" cols="100" 
                value={Notes} onChange={e =>setNotes(e.target.value)} onKeyPress={(e) => checkKeyChanged(e)}>
  </textarea>
  <button id="visualize-button" disabled={!disableVisNow} className="button" type="button" onClick={visualizeNow}>Visualize Now</button>
  <button id="visualize-button" className="button" type="button" onClick={FromEPIC}>From EPIC</button>
               </div>
        </div>
    </div>
  
  );


}

export default App;
