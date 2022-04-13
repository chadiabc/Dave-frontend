import { useState, useEffect } from "react";
import React from "react";
import './App.css';
import CytoscapeComponent from 'react-cytoscapejs';
import cytoscape from 'cytoscape';
import dagre from 'cytoscape-dagre';
import Graphbox from "./graphBox";
import { useRef } from "react";
import { expandCollapse,expandCollapseUtilities} from 'cytoscape-expand-collapse';
import { Button, Typography, AppBar, Toolbar } from "@mui/material";


//var expandCollapse = require("cytoscape-expand-collapse");
cytoscape.use(dagre);

var options = {
  layoutBy: null, // to rearrange after expand/collapse. It's just layout options or whole layout function. Choose your side!
  // recommended usage: use cose-bilkent layout with randomize: false to preserve mental map upon expand/collapse
  fisheye: true, // whether to perform fisheye view after expand/collapse you can specify a function too
  animate: true, // whether to animate on drawing changes you can specify a function too
  animationDuration: 1000, // when animate is true, the duration in milliseconds of the animation
  ready: function () { }, // callback when expand/collapse initialized
  undoable: true, // and if undoRedoExtension exists,

  cueEnabled: true, // Whether cues are enabled
  expandCollapseCuePosition: 'top-left', // default cue position is top left you can specify a function per node too
  expandCollapseCueSize: 12, // size of expand-collapse cue
  expandCollapseCueLineSize: 8, // size of lines used for drawing plus-minus icons
  expandCueImage: undefined, // image of expand icon if undefined draw regular expand cue
  collapseCueImage: undefined, // image of collapse icon if undefined draw regular collapse cue
  expandCollapseCueSensitivity: 1, // sensitivity of expand-collapse cues
  edgeTypeInfo: "edgeType", // the name of the field that has the edge type, retrieved from edge.data(), can be a function, if reading the field returns undefined the collapsed edge type will be "unknown"
  groupEdgesOfSameTypeOnCollapse : false, // if true, the edges to be collapsed will be grouped according to their types, and the created collapsed edges will have same type as their group. if false the collapased edge will have "unknown" type.
  allowNestedEdgeCollapse: true, // when you want to collapse a compound edge (edge which contains other edges) and normal edge, should it collapse without expanding the compound first
  zIndex: 999 // z-index value of the canvas in which cue ımages are drawn
};


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
      "line-style": 'straight',
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
  },
  
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
    // cytoRef.current.expandCollapse();
    // cytoRef.current.expandCollapseUtilities();
    // var api = cytoRef.current.expandCollapse('get');
    // api.collapseAll();
    
  }

  return (
    <div className="App">
      {/* <div className="header">
        <h1> DAVE</h1>
      </div> */}
      <AppBar position="static">
        <Toolbar classes={{ root: "nav" }}>
          <Typography variant="h5">DAVE</Typography>
        </Toolbar>
          </AppBar>
      <div className="graphBox">
        <div className="graphBoxLeft">
          <div className="wrapper">
            <Button className="Button" disabled={disableVisNow} color="error"  variant="contained" onClick={visualizeNowModefunction}>Visualize at the end</Button>&nbsp;
            <Button className="Button" disabled={!disableVisNow} color="error"  variant="contained" onClick={visualizeContinouslyModefunction}>Visualize Continously</Button>
            <hr />
            <div>
              <Typography variant="h5">Write your notes here</Typography>
              <textarea id="clincalNotesTextField" name="clincalNotesTextField" rows="15" cols="100"
                value={Notes} onChange={e => setNotes(e.target.value)} onKeyPress={(e) => checkKeyChanged(e)}>
              </textarea>
              <Button className="Button" disabled={!disableVisNow} color="error"  variant="contained" onClick={visualizeNow}>Visualize Now</Button>&nbsp;
              <Button className="Button" color="secondary"  variant="contained" onClick={FromEPIC} >From EPIC</Button>&nbsp;
              <Button className="test" color="success"  variant="contained" onClick={() => cytoRef.current.reset()}>Cytofunctionalities</Button>&nbsp;
              <div className="height">               
                <Button className="epic" color="secondary"  variant="contained" onClick={resetData} >Reset</Button>
                </div>

            </div>
          </div>
        </div>

        <div className="graphBoxRight">
          {graph != "null" &&
            <CytoscapeComponent minZoom={0.5} maxZoom={1.5}
             autoungrabify={true} className="cyto"
             cy={ref => cytoRef.current = ref}
              elements={CytoscapeComponent.normalizeElements(graph)} layout={{
              name: "dagre",
              // other options
              padding: 10,
              idealEdgeLength: 10,
              edgeElasticity: 0.1

            }}
            stylesheet={cytoscapeStylesheet} />
          }
        </div>
      </div>
    </div>


  );


}

export default App;








