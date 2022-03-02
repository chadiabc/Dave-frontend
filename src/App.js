import { useState, useEffect } from "react";
import('./App.css');

var SERVER_URL = "http://127.0.0.1:5000"

function App() {
  let [Notes, setNotes] = useState("");

  // function fetchRates() {
  //   fetch(`${SERVER_URL}/algorithms`)
  //   .then(response => response.json())
  //   .then(data => {
  //     console.log(data)                     
  //   });
  //  }
  //  fetchRates();
  //  useEffect(fetchRates, []);

   function checkKeyChanged(e){
     if(e.code === 'Space') {
       console.log(Notes);
    // postData(`${SERVER_URL}/dave`, {Notes: Notes});
     }

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
        <hr />
            <div>
                <label htmlFor="clincalNotesTextField">Write your notes here</label>
                <textarea id="clincalNotesTextField" name="clincalNotesTextField" rows="15" cols="100" 
                value={Notes} onChange={e =>setNotes(e.target.value)} onKeyPress={(e) => checkKeyChanged(e)}>
  </textarea>
               </div>
        </div>
    </div>
  
  );


}

export default App;
