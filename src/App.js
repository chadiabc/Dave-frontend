import { useState, useEffect } from "react";
import React from "react";
import './App.css';
import CytoscapeComponent from 'react-cytoscapejs';
import cytoscape from 'cytoscape';
import dagre from 'cytoscape-dagre';
import { useRef } from "react";
import { Button, Typography, AppBar, Toolbar, createTheme, ThemeProvider, FormGroup, Stack, Switch } from "@mui/material";
import ColorButton from "./styledButtons";
import StickyNote2OutlinedIcon from '@mui/icons-material/StickyNote2Outlined';

cytoscape.use(dagre);




const theme = createTheme({
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
        },
      },
    },
  },
});


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


  }

]

var SERVER_URL = "http://127.0.0.1:5000" //"http://192.168.1.110:5000"


function App() {
  let [Notes, setNotes] = useState("");
  let [showText, setShowText] = useState(true);
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





  function visualizeNowModefunction() {
    console.log("at the end");
    setDisable(true)
  }

  function visualizeContinouslyModefunction() {
    console.log("dynamic");
    setDisable(false)
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
    setGraph("null");
    const datar = await response.json();
    if (datar.elementss !== "Stall") {
      setGraph(datar.elementss);

      cytoRef.current.nodes(datar.topNode).style('background-color', '#00ffff');

      var myNode1 = cytoRef.current.nodes('[id="A3"]')[0];
      var myNode2 = cytoRef.current.nodes('[id="A12"]')[0];
      var level3Nodes = cytoRef.current.nodes('[type="3"]');
      myNode1.style('background-color', '#ffb6c1');
      myNode2.style('background-color', '#ffb6c1');
      myNode1.successors().addClass('collapsedchild');
      myNode2.successors().addClass('collapsedchild');
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

      myNode1.on('tap', function (evt) {
        myNode1.successors().toggleClass("collapsedchild");

      });
      myNode2.on('tap', function (evt) {
        myNode2.successors().toggleClass("collapsedchild");
      });
      cytoRef.current.on('click', 'node', function (evt) {
        var targetNode = cytoRef.current.nodes("[id = '" + evt.target.data().id + "']");
      })

    }
  }
  return (
    <div className="App">
      <AppBar position="static">
        <Toolbar classes={{ root: "nav" }}>
          <Button style={{ backgroundColor: '#800080' }} variant="contained" onClick={FromEPIC} >From EPIC</Button>
          <Typography style={{ textAlign: "center" }} variant="h5">DAVE</Typography>
          <div>
            {/* <ThemeProvider theme={theme}> */}
            <div>
              <Button className="test" style={{ backgroundColor: '#800080' }} variant="contained" onClick={() => cytoRef.current.reset()}>Reset Zoom</Button>
              &nbsp;&nbsp;<Button style={{ backgroundColor: '#800080' }} variant="contained" onClick={resetData} >Clear</Button>
            </div>
            {/* </ThemeProvider> */}
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
                    <Switch defaultChecked onChange={() => setDisable(!disableVisNow)} inputProps={{ 'aria-label': 'ant design' }} />
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
            <Button className="graph-box-right__open-note-button" style={{ backgroundColor: '#800080' }} variant="contained" onClick={() => setShowText(!showText)}>
              <StickyNote2OutlinedIcon></StickyNote2OutlinedIcon>
            </Button>
          </div>
          {graph != "null" &&
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