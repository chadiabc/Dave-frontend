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
import UserCredentialsDialog from "./UserCredentialsDialog";
import StyledSwitch from "./StyledSwitch";
import StickyNote2OutlinedIcon from '@mui/icons-material/StickyNote2Outlined';
import LooksOneOutlinedIcon from '@mui/icons-material/LooksOneOutlined';
import LooksTwoOutlinedIcon from '@mui/icons-material/LooksTwoOutlined';
import Looks3OutlinedIcon from '@mui/icons-material/Looks3Outlined';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

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
      shape: "round-rectangle",
      'text-wrap': 'wrap',
      label: 'My multiline\nlabel',
      "border-width":1,
      "border-opacity":2

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
    selector: "node[prefcolor]",
    css: {
      'background-color':'data(prefcolor)'

    },
  },
  {
    selector: "node[prefshape]",
    css: {
      width: "label",
      height: "label",
      padding: "20px",
      shape: 'data(prefshape)',

    },
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
  let [more, setMore] = useState(false);
  let [book, setBook] = useState("null");
  let [showGraph1, setShowGraph1] = useState(false);
  let [showGraph2, setShowGraph2] = useState(false);
  let [showGraph3, setShowGraph3] = useState(false);
  let [graph1Name, setGraph1Name] = useState("");
  let [graph2Name, setGraph2Name] = useState("");
  let [graph3Name, setGraph3Name] = useState("");
  let [datar, setDatar] = useState("null");
  let [graph1, setGraph1] = useState("null");
  let [graph2, setGraph2] = useState("null");
  let [graph3, setGraph3] = useState("null");
  const [disableVisNow, setDisable] = React.useState(false);
  const [show, setShow] = useState(false);
  let [graph, setGraph] = useState("1");
  const cytoRef = useRef(null)
  

  function displayGraph1() {
    setShowGraph1(false);
    setShowGraph2(true);
    setShowGraph3(true);
    setGraph("1");
    // CytoEvent();

  }
  function displayGraph2() {
    setShowGraph1(true);
    setShowGraph2(false);
    setShowGraph3(true);
    setGraph("2");
    // CytoEvent();
  }
  function displayGraph3() {
    setShowGraph1(true);
    setShowGraph2(true);
    setShowGraph3(false);
    setGraph("3");
    // CytoEvent();
  }

  useEffect(() => {
    if (cytoRef.current) {
      cytoRef.current.resize()
    }

  }, [showText])

  useEffect(() => {
    if (cytoRef.current) {
      CytoEvent();
    }

  }, [graph])


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
  function CytoEvent() {


    // cytoRef.current.removeListener('click');
    // cytoRef.current.nodes(topNode).style('background-color', '#00ffff');
    var myNode1 = cytoRef.current.nodes('[id="A3"]')[0];
    var myNode2 = cytoRef.current.nodes('[id="A7"]')[0];
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

  function changeBook(bookselected) {
    console.log(bookselected);
    postBook(`${SERVER_URL}/ChangeBook` , { Book: bookselected });
    setBook("hideChooseBook");
    resetData();
  }

  async function postBook(url = '', data = {}) {
    const response = await fetch(url, {

      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    // const datar = await response.json();
    // setBook(datar.Book);
  }

  async function reset(url = '') {
    const response = await fetch(url, {

      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      // body: JSON.stringify("RESET")
    })
    setGraph("1");
    setGraph1("null");
    setGraph2("null");
    setGraph3("null");
    setShowGraph1(false);
    setShowGraph2(false);
    setShowGraph3(false);
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
    setDatar(datarTemp);
    if (datarTemp.elementss !== "Stall") {
      setGraph1Name(datarTemp.Name);
      if (datarTemp.Name !== graph1Name) {
        console.log(datarTemp.elementss)
        setGraph2Name(datarTemp.Name1);
        setGraph3Name(datarTemp.Name2);
        setShowGraph2(true);
        setShowGraph3(true);
        setGraph1("null");
        setGraph1(datarTemp.elementss);
        setGraph2(datarTemp.elementss1);
        setGraph3(datarTemp.elementss2);
        setGraph("1");
        CytoEvent();

      }
    }
  }
  return (
    <div className="App">
      { book === "null" &&
      <div className="img-box">
        <div className="img-left">
        <img src={require('C:/Users/User/dave-repository/new/Dave-frontend/src/symptomToDiagnosis.jpg')} 
              onClick={() => changeBook("1")} />
              </div>
              <div className="img-right">
        <img src={require('C:/Users/User/dave-repository/new/Dave-frontend/src/patientHistory.jpg')} 
              onClick={() => changeBook("2")} />
        </div>
        </div>
      }
      {book != "null" &&
      <div>
      <AppBar position="static">
        <Toolbar classes={{ root: "nav" }}>
          <div>
            <Button style={{ backgroundColor: '#c4a35a' }} variant="contained" onClick={FromEPIC} >From EPIC</Button>
            {/* <Button style={{ backgroundColor: '#c4a35a' }} disabled={book !="2"} variant="contained" onClick={changeBook} >Book1</Button>
            <Button style={{ backgroundColor: '#c4a35a' }} disabled={book !="1"} variant="contained" onClick={changeBook} >Book2</Button> */}
            <Button style={{ backgroundColor: '#c4a35a' }}  variant="contained" onClick={() => setBook("showChooseBook")} >Change Book</Button>
          </div>
          <Typography style={{ textAlign: "center" }} variant="h5">DAVE</Typography>
          <div>
            <div>
              <Button style={{ backgroundColor: '#c4a35a' }} variant="contained" onClick={() => cytoRef.current.reset()}>Reset Zoom</Button>
              &nbsp;&nbsp;<Button style={{ backgroundColor: ' #c4a35a' }} variant="contained" onClick={resetData} >Clear</Button>
            </div>
          </div>
        </Toolbar>
      </AppBar>
      <UserCredentialsDialog open={book ==="showChooseBook"} onSubmit={(bookselected) => changeBook(bookselected)}
        onClose={() => setBook("hideChooseBook")}
        title={'Choose Book'} submitText={'submit'}></UserCredentialsDialog>
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
                disabled={!showGraph2} variant="contained" onClick={() => { displayGraph2() }}>
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
            {more &&
              <div>
                <div className="graph-box-right__button-container">
                  <GraphButton className={`base-class ${showGraph3 ? 'graph-box-right__graph-buttons' : 'graph-box-right__graph-buttons--disabled'}`} disabled={!showGraph3} variant="contained" onClick={() => displayGraph3()}>
                    <Looks3OutlinedIcon></Looks3OutlinedIcon>
                  </GraphButton>
                  <label className={`base-class ${!showGraph3 ? 'graph-box-right__button-container__label' : 'graph-box-right__button-container__label--disabled'}`}
                  >{graph3Name}</label>
                </div>
                <div className="graph-box-right__button-container">
                  <GraphButton className={`base-class ${showGraph3 ? 'graph-box-right__graph-buttons' : 'graph-box-right__graph-buttons--disabled'}`} disabled={!showGraph3} variant="contained" onClick={() => displayGraph3()}>
                    <Looks3OutlinedIcon></Looks3OutlinedIcon>
                  </GraphButton>
                  <label className={`base-class ${!showGraph3 ? 'graph-box-right__button-container__label' : 'graph-box-right__button-container__label--disabled'}`}
                  >{graph3Name}</label>
                </div>
                <div className="graph-box-right__button-container">
                  <GraphButton className={`base-class ${showGraph3 ? 'graph-box-right__graph-buttons' : 'graph-box-right__graph-buttons--disabled'}`} disabled={!showGraph3} variant="contained" onClick={() => displayGraph3()}>
                    <Looks3OutlinedIcon></Looks3OutlinedIcon>
                  </GraphButton>
                  <label className={`base-class ${!showGraph3 ? 'graph-box-right__button-container__label' : 'graph-box-right__button-container__label--disabled'}`}
                  >{graph3Name}</label>
                </div>

              </div>

            }
            <GraphButton className={`base-class ${graph != "null" ? 'graph-box-right__graph-buttons' : 'graph-box-right__graph-buttons--disabled'}`}
              disabled={graph === "null"} variant="contained" onClick={() => setMore(!more)}>
              {!more &&
                <MoreHorizIcon></MoreHorizIcon>
              }
              {more &&
                <KeyboardArrowUpIcon></KeyboardArrowUpIcon>
              }
            </GraphButton>
          </div>
          {graph === "1" && graph1 != "null"
            &&
            <CytoscapeComponent minZoom={0.5} maxZoom={1.5}
              autoungrabify={true} userPanningEnabled={true} className="cyto"
              cy={ref => cytoRef.current = ref}
              elements={CytoscapeComponent.normalizeElements(graph1)} layout={layoutdagre}
              stylesheet={cytoscapeStylesheet} />
          }
          {graph === "2"
            &&
            <CytoscapeComponent minZoom={0.5} maxZoom={1.5}
              autoungrabify={true} userPanningEnabled={true} className="cyto"
              cy={ref => cytoRef.current = ref}
              elements={CytoscapeComponent.normalizeElements(graph2)} layout={layoutdagre}
              stylesheet={cytoscapeStylesheet} />
          }
          {graph === "3"
            &&
            <CytoscapeComponent minZoom={0.5} maxZoom={1.5}
              autoungrabify={true} userPanningEnabled={true} className="cyto"
              cy={ref => cytoRef.current = ref}
              elements={CytoscapeComponent.normalizeElements(graph3)} layout={layoutdagre}
              stylesheet={cytoscapeStylesheet} />
          }
        </div>
      </div>
      </div>
  }
    </div>


  );


}

export default App;