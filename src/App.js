import { useState, useEffect } from "react";
import React from "react";
import './App.css';
import CytoscapeComponent from 'react-cytoscapejs';
import cytoscape from 'cytoscape';
import dagre from 'cytoscape-dagre';
import { useRef } from "react";
import { Button, Typography, AppBar, Toolbar, createTheme, ThemeProvider, FormGroup, Stack, Switch } from "@mui/material";
import ColorButton from "./styledButtons";
import SideButton from "./sideButtonStyle";
import GraphButton from "./graphButtonStyle";
import StyledSwitch from "./StyledSwitch";
import StickyNote2OutlinedIcon from '@mui/icons-material/StickyNote2Outlined';
import LooksOneOutlinedIcon from '@mui/icons-material/LooksOneOutlined';
import LooksTwoOutlinedIcon from '@mui/icons-material/LooksTwoOutlined';
import Looks3OutlinedIcon from '@mui/icons-material/Looks3Outlined';

cytoscape.use(dagre);


const layoutdagre = {
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
  animateFilter: function (node, i) { return true; },

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
  },
  {
    selector: ".hide",
    css: {
      'display': "none",

    },
  }

]


var SERVER_URL = "http://127.0.0.1:5000" 


function App() {
  let [Notes, setNotes] = useState("");
  let [showText, setShowText] = useState(true);
  let [showGraph1, setShowGraph1] = useState(false);
  let [showGraph2, setShowGraph2] = useState(true);
  let [showGraph3, setShowGraph3] = useState(true);
  let [graph1Name, setGraph1Name] = useState("algo 1 name");
  let [graph2Name, setGraph2Name] = useState("algo 2 name");
  let [graph3Name, setGraph3Name] = useState("algo 3 name");
  let [graphNames, setGraphNames] = useState("");

  let [datar,setDatar] = useState("null");
  const [disableVisNow, setDisable] = React.useState(false);
  const [show, setShow] = useState(false);
  const [graph, setGraph] = useState("null");
  const cytoRef = useRef(null)

  function getgraph() {
    fetch(`${SERVER_URL}/getgraph`)
      .then(response => {
        response.json().then(data => {
          setGraph(data.elementss);
          console.log(graph)
        })
      });
  }

  function displayGraph1() {
    setShowGraph1(false);
    setShowGraph2(true);
    setShowGraph3(true);
    var targetNodes = cytoRef.current.nodes("[group='A']")
    targetNodes.removeClass('hide');
    cytoRef.current.fit(targetNodes,20);
    CytoEvent("A","B","C");
    ExpandCollapse("A");

    //show graph 1
  }
  function displayGraph2() {
    setShowGraph1(true);
    setShowGraph2(false);
    setShowGraph3(true);
    //show graph 2
    var targetNodes = cytoRef.current.nodes("[group='B']")
    targetNodes.removeClass('hide');
    cytoRef.current.fit(targetNodes,20);
    CytoEvent("B","A","C");
    ExpandCollapse("B");
  


  }
  function displayGraph3() {
    setShowGraph1(true);
    setShowGraph2(true);
    setShowGraph3(false);
    var targetNodes = cytoRef.current.nodes("[group='C']")
    targetNodes.removeClass('hide');
    cytoRef.current.fit(targetNodes,20);
    CytoEvent("C","A","B");
    ExpandCollapse("C");

  

    //show graph 3
  }


  function checkKeyChanged(e) {
    if (!disableVisNow)
      if (e.code === 'Space' || e.code === 'Enter') {
        console.log(Notes);
        postData(`${SERVER_URL}/Addnote`, { text: Notes })

      }
  }

  function visualizeNow() {
    console.log(Notes);
    postData(`${SERVER_URL}/AddnoteNow`, { text: Notes });
  }
  function CytoEvent(Show,Hide1,Hide2){
    
    cytoRef.current.removeListener("click")

    cytoRef.current.nodes("[group='"+Hide1+"']").addClass('hide');
    cytoRef.current.nodes("[group='"+Hide2+"']").addClass('hide');

    //cytoRef.current.nodes(topNode).style('background-color', '#00ffff');

    var myNode1 = cytoRef.current.nodes("[id='"+Show+"3']");
    var myNode2 = cytoRef.current.nodes("[id='"+Show+"4']");
    var level3Nodes = cytoRef.current.nodes('[type="3"]');

    myNode1.style('background-color', '#ffb6c1');
    myNode2.style('background-color', '#ffb6c1');
    // myNode1.successors().addClass('collapsedchild');
    // myNode2.successors().addClass('collapsedchild');
    cytoRef.current.zoomingEnabled(true);
    
    cytoRef.current.on('click', 'node', function (evt) {
      var targetNode = cytoRef.current.nodes("[id = '" + evt.target.data().id + "']");
      console.log(evt.target.data().id)
      cytoRef.current.animate({
        fit: {
          eles: targetNode,
          padding: 20
        }
      },
        {
          duration: 350
        });
    });



  }

  function ExpandCollapse(Show){
    var myNode1 = cytoRef.current.nodes("[id='"+Show+"3']");
    var myNode2 = cytoRef.current.nodes("[id='"+Show+"4']");


    myNode1.on('tap', function (evt) {
      myNode1.successors().toggleClass('collapsedchild');
    });
    myNode2.on('tap', function (evt) {
      myNode2.successors().toggleClass('collapsedchild');
    });



  }
  

  function FromEPIC() {
    fetch(`${SERVER_URL}/getnoteepic`)
      .then(response => response.json())
      .then(data => {
        console.log(data)

      });
  }

  function resetData() {
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

    const datarTemp = await response.json();

    if (datarTemp.elementss !== "Stall") {
      if (datarTemp.Names !== graphNames){
          setGraphNames(datarTemp.Names)
          setGraph("null");
          setGraph(datarTemp.elementss);
          setGraph1Name(datarTemp.Name);
          setGraph2Name(datarTemp.Name1);
          setGraph3Name(datarTemp.Name2);
          displayGraph1();
          ExpandCollapse();

      }

  }
}
  return (
    <div className="App">
      <AppBar position="static">
        <Toolbar classes={{ root: "nav" }}>
          <Button style={{ backgroundColor: '#c4a35a' }} variant="contained" onClick={FromEPIC} >From EPIC</Button>
          <Typography style={{ textAlign: "center" }} variant="h5">DAVE</Typography>
          <div>
            <div>
              <Button className="test" style={{ backgroundColor: '#c4a35a' }} variant="contained" onClick={() => cytoRef.current.reset()}>Reset Zoom</Button>
              &nbsp;&nbsp;<Button style={{ backgroundColor: ' #c4a35a' }} variant="contained" onClick={resetData} >Clear</Button>
            </div>
          </div>
        </Toolbar>
      </AppBar>
      <div className="graphBox">
        {showText &&
          <div className="graphBoxLeft">
            <div className="wrapper">
              <div className="graphBox-wrapper__clinical-notes__header">
                <Typography variant="h5">Write your notes here</Typography>
              </div>
              <textarea id="clincalNotesTextField" name="clincalNotesTextField" rows="15" cols="100"
                value={Notes} onChange={e => setNotes(e.target.value)} onKeyPress={(e) => checkKeyChanged(e)}>
              </textarea>
              <div className="graphBox-wrapper__clinical-notes__action-fields">
                <FormGroup>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Switch style={{ color: '#c4a35a' }} defaultChecked onChange={() => setDisable(!disableVisNow)} inputProps={{ 'aria-label': 'ant design' }} />
                    <Typography>Visualize Continously</Typography>
                  </Stack>
                </FormGroup>
                <ColorButton disabled={!disableVisNow} variant="contained" onClick={visualizeNow}>Visualize</ColorButton>
              </div>
            </div>
          </div>
        }
        <div className="graphBoxRight">
          <div className="graph-box-right__open-note-button-container">
            <SideButton className="graph-box-right__open-note-button" variant="contained" onClick={() => setShowText(!showText)}>
              <StickyNote2OutlinedIcon></StickyNote2OutlinedIcon>
            </SideButton>
            <div className="graph-box-right__button-container">
              <GraphButton className={`base-class ${showGraph1 ? 'graph-box-right__graph-buttons' : 'graph-box-right__graph-buttons--disabled'}`}
                disabled={!showGraph1} variant="contained" onClick={() => displayGraph1()}>
                <LooksOneOutlinedIcon></LooksOneOutlinedIcon>
              </GraphButton>
              <label className={`base-class ${!showGraph1 ? 'graph-box-right__button-container__label' : 'graph-box-right__button-container__label--disabled'}`}
              >{graph1Name}</label>
            </div>
            <div className="graph-box-right__button-container">
              <GraphButton className={`base-class ${showGraph2 ? 'graph-box-right__graph-buttons' : 'graph-box-right__graph-buttons--disabled'}`}
                disabled={!showGraph2} variant="contained" onClick={() => displayGraph2()}>
                <LooksTwoOutlinedIcon></LooksTwoOutlinedIcon>
              </GraphButton>
              <label className={`base-class ${!showGraph2 ? 'graph-box-right__button-container__label' : 'graph-box-right__button-container__label--disabled'}`}
              >{graph2Name}</label>
            </div>
            <div className="graph-box-right__button-container">
              <GraphButton className={`base-class ${showGraph3 ? 'graph-box-right__graph-buttons' : 'graph-box-right__graph-buttons--disabled'}`} disabled={!showGraph3} variant="contained" onClick={() => displayGraph3()}>
                <Looks3OutlinedIcon></Looks3OutlinedIcon>
              </GraphButton>
              <label className={`base-class ${!showGraph3 ? 'graph-box-right__button-container__label' : 'graph-box-right__button-container__label--disabled'}`}
              >{graph3Name}</label>
            </div>
          </div>
          {graph != "null"
          &&
            <CytoscapeComponent minZoom={0.5} maxZoom={1.5}
              autoungrabify={true} userPanningEnabled={true} className="cyto"
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