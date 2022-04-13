import { useState, useEffect } from "react";
import React from "react";
import './App.css';
import CytoscapeComponent from 'react-cytoscapejs';
import cytoscape from 'cytoscape';
import dagre from 'cytoscape-dagre';
import Graphbox from "./graphBox";
import { useRef } from "react";


//var expandCollapse = require("cytoscape-expand-collapse");
cytoscape.use(dagre);


const collapsed = [
  {
    selector: "node",
    style: {
      display: "none"
      
    }
  }
]

const layoutdagre={
  name: "dagre",
  // other options
  padding: 5,
  idealEdgeLength: 10,
  edgeElasticity: 0.1,
  spacingFactor: 1,
  fit: true,
  rankDir: "TB",
  animate: true,
  animationDuration: 1000,
  ranker: 'network-simplex',
  animateFilter: function( node, i ){ return true; },

}

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
      "curve-style": "taxi",
      "taxi-direction": "auto", 

      "target-arrow-shape": "triangle",
      "line-style": 'straight',
      'width': 2
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

  },
  {
  selector: ".collapsedchild",
  css: {
    'display': "none",
    
  },
  
  
}
  
]

var SERVER_URL = "http://127.0.0.1:5000"
// var graph = "null"

function App() {
  let [Notes, setNotes] = useState("");
  const [disableVisNow, setDisable] = React.useState(false);
  const [show, setShow] = useState(false);
  const [graph,setGraph] = useState("null");
  const cytoRef = useRef(null)


  function getgraph() {
    fetch(`${SERVER_URL}/getgraph`)
      .then(response => {
        response.json().then(data => {
          setGraph(data.elementss);
          // graph = data.elementss;
          console.log(graph)
        })
      });
  }

  // console.log(graph)


  function checkKeyChanged(e) {
    if (!disableVisNow)
      if (e.code === 'Space' || e.code === 'Enter') {
        console.log(Notes);
        postData(`${SERVER_URL}/Addnote`, { text: Notes })
        
     
        

          
        
        // getgraph();
      }
  }
  function visualizeNow() {
    console.log(Notes);
    postData(`${SERVER_URL}/AddnoteNow`, { text: Notes });
  }
  




  function visualizeNowModefunction() {
    console.log("at the end");
    // setShow(prev => !prev);
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

  function resetData(){
    reset(`${SERVER_URL}/reset`);
    setNotes("");
    console.log("reset")
  }

  async function reset(url = '') {
    const response = await fetch(url, {

      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify("RESET")
    })
    const datar = await response.json();
    setGraph("null");
  }



  async function postData(url = '', data = {}) {
    const response = await fetch(url, {

      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    setGraph("null");
    const datar = await response.json();
    setGraph(datar.elementss);
    
    cytoRef.current.nodes(datar.topNode).style('background-color', '#00ffff');
    var myNode1 = cytoRef.current.nodes('[id="A3"]')[0];
    var myNode2 = cytoRef.current.nodes('[id="A12"]')[0];
    var level3Nodes = cytoRef.current.nodes('[type="3"]');
    myNode1.style('background-color', '#ffb6c1');
    myNode2.style('background-color', '#ffb6c1');
    myNode1.successors().addClass('collapsedchild');
    myNode2.successors().addClass('collapsedchild');
    cytoRef.current.zoomingEnabled( true );

    cytoRef.current.on('click','node', function(evt){
      var targetNode = cytoRef.current.nodes("[id = '" + evt.target.data().id + "']");
      console.log(evt.target.data().id)
      cytoRef.current.animate({
        fit:{
          eles: targetNode,
          padding: 20
        }
      },
      {

        duration: 500
      });
    });

    myNode1.on('tap', function(evt){
    myNode1.successors().toggleClass("collapsedchild");
   
    });
    myNode2.on('tap', function(evt){
      myNode2.successors().toggleClass("collapsedchild");
    });
    //   cytoRef.current.animate({
    //     fit: {
    //       eles: myNode2,
    //       padding: 20
    //     }
    //   }, {
    //     duration: 1000
    //   });

    // });
    // level3Nodes.style('background-color', '#ffb6c1');
    // level3Nodes.successors().addClass('collapsedchild')
    // level3Nodes.on('tap', function(evt){
    //     level3Nodes.successors().toggleClass("collapsedchild");
    //   });
    
    

    // cytoRef.current.zoom({
    //   level: 1/0,
    //   position: myNode.position()
    // });
    


    // cytoRef.current.expandCollapse(options);
    // var api = cytoRef.current.expandCollapse('get');
    // api.collapseAll(options);
    
  }

  return (
    <div className="App">
      <div className="header">
        <h1> DAVE</h1>
      </div>
      <div className="graphBox">
        <div className="graphBoxLeft">
          <div className="wrapper">
            <button id="now-mode-button" disabled={!disableVisNow} className="button" type="button" onClick={visualizeNowModefunction}>Visualize at the end</button> |
            <button id="continous-mode-button" disabled={disableVisNow} className="button" type="button" onClick={visualizeContinouslyModefunction}>Visualize Continously</button>
            <hr />
            <div>
              <label htmlFor="clincalNotesTextField">Write your notes here</label>
              <textarea id="clincalNotesTextField" name="clincalNotesTextField" rows="15" cols="100"
                value={Notes} onChange={e => setNotes(e.target.value)} onKeyPress={(e) => checkKeyChanged(e)}>
              </textarea>
              <button id="visualize-button" disabled={!disableVisNow} className="button" type="button" onClick={visualizeNow}>Visualize Now</button>
              <button id="visualize-button" className="button epic" type="button" onClick={FromEPIC}>From EPIC</button>
              <button id="visualize-button" className="button test" type="button" onClick={() => cytoRef.current.reset()}>Cytofunctionalities</button>
              <button id="visualize-button" className="button epic" type="button" onClick={resetData}>Reset</button>
            </div>
          </div>
        </div>

        <div className="graphBoxRight">
          {graph != "null" &&
            <CytoscapeComponent minZoom={0.5} maxZoom={1.5}
             autoungrabify={true} userPanningEnabled={false} className="cyto"
             cy={ref => cytoRef.current = ref}
              elements={CytoscapeComponent.normalizeElements(graph)} layout={layoutdagre}
            stylesheet={cytoscapeStylesheet} />
          }
        </div>
      </div>
    </div>


  );


}

export default App;








