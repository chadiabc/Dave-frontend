import { useState, useEffect } from "react";
import React from "react";
import './App.css';
import ReactDOM from 'react-dom';
import CytoscapeComponent from 'react-cytoscapejs';
import cytoscape from 'cytoscape';
import coseBilkent from "cytoscape-cose-bilkent";
import dagre from 'cytoscape-dagre';

cytoscape.use( dagre );



const cytoscapeStylesheet = [
  {
    selector: "node",
    style: {
      "background-color": "#F5F5DC",
      width: "label",
      height: "label",
      padding: "20px",
      shape: "rectangle",
      'text-wrap': 'wrap',
      label: 'My multiline\nlabel',
    }
  },
  {
    selector: "node[label]",
    style: {
      label: "data(label)",
      "font-size": "12",
      color: "black",
      "text-halign": "center",
      "text-valign": "center"
    }
  },
  {
    selector: "edge",
    style: {
      "curve-style": "bezier",
      "target-arrow-shape": "triangle",
      "line-style":'straight',
      'width': 1.5
    }
  },
  {
    selector: "edge[label]",
    style: {
      label: "data(label)",
      "font-size": "12",

      "text-background-color": "white",
      "text-background-opacity": 1,
      "text-background-padding": "2px",

      "text-border-color": "black",
      "text-border-style": "solid",
      "text-border-width": 0.5,
      "text-border-opacity": 1

      // "text-rotation": "autorotate"
    }
  }
]

var SERVER_URL = "http://127.0.0.1:5000"
var graph = "null"
var graphh = [{ data: { id: 'one', label: 'Node 1' }, position: { x: 0, y: 0 } },
{ data: { id: 'two', label: 'Node 2' }, position: { x: 100, y: 0 } },
{ data: { source: 'one', target: 'two', label: 'Edge from Node1 to Node2' } }
];

// {"elementss":[{"data":{"id":"one","label":"Node 1"},"position":{"x":0,"y":0}},{"data":{"id":"two","label":"Node 2"},"position":{"x":100,"y":0}},{"data":{"label":"Edge from Node1 to Node2","source":"one","target":"two"}}]}


const elementss={
    nodes: [
      { data: { id: 'one', label: 'Node 1' }},
      { data: { id: 'two', label: 'Node 2' }},
      { data: { id: 'three', label: 'Node 3' }},
      { data: { id: 'four', label: 'Node 4' }}



    ],
    edges: [
      {data: { source: 'one', target: 'two', label: 'Edge' }},
      {data: { source: 'two', target: 'three', label: 'Edge' }},
      {data: { source: 'two', target: 'four', label: 'Edge' }},


    ]
  }





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
   function getgraph(){
    fetch(`${SERVER_URL}/getgraph`)
    .then(response => {
    
    response.json().then(data => {
      graph=data.elementss;
      console.log(graph)
      
  
  })
  
    

  });
}

console.log(graph)
  //  getNote();
  getgraph();
  useEffect(getgraph,[])
  

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
   

  


   function visualizeNowModefunction() {
    console.log("at the end");
    setShow(prev => !prev)
    setDisable(true)
    // setVisualizeNowMode(true);

  }
  function FromEPIC() {
    fetch(`${SERVER_URL}/getnoteepic`)
    .then(response => response.json())
    .then(data => {
      console.log(data) 
    
   });
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
      
        <div className="split right">
          <div className="centered">
            {graph != "null" &&
        
        
        <CytoscapeComponent cy={(cy) => {
        cy.on("select", (_x) => {
          console.log("something was selected here");
        });
      }} elements={CytoscapeComponent.normalizeElements(graph)} layout={{
     name: "dagre",
     // other options
     padding: 10,
     idealEdgeLength: 10,
     edgeElasticity: 0.1

   }} 
   style={ {  left:100, top: 0, bottom: 0, position: "absolute", width: "100%" } } stylesheet={cytoscapeStylesheet}/>
  }
  </div>
</div>
  
        <div className="wrapper">
        <div className="split left">
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
        </div>
   
  
  );


}

export default App;








