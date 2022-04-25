import { useState, useEffect } from "react";
import React from "react";
import './App.css';
import CytoscapeComponent from 'react-cytoscapejs';
import cytoscape from 'cytoscape';
import dagre from 'cytoscape-dagre';
import { useRef } from "react";
import CloseIcon from '@mui/icons-material/Close';
import { Button, Typography, AppBar, Toolbar, createTheme, ThemeProvider, FormGroup, Stack, Switch,
           Card, CardActionArea, CardMedia,CardContent, Slide, Dialog, IconButton} from "@mui/material";
import img from "./symptomToDiagnosis.jpg";
import img1 from "./patientHistory.jpg";
import ColorButton from "./styledButtons";
import SideButton from "./sideButtonStyle";
import GraphButton from "./graphButtonStyle";
import UserCredentialsDialog from "./UserCredentialsDialog";
import StyledSwitch from "./StyledSwitch";
import StickyNote2OutlinedIcon from '@mui/icons-material/StickyNote2Outlined';
import LooksOneOutlinedIcon from '@mui/icons-material/LooksOneOutlined';
import LooksTwoOutlinedIcon from '@mui/icons-material/LooksTwoOutlined';
import Looks3OutlinedIcon from '@mui/icons-material/Looks3Outlined';
import Looks4OutlinedIcon from '@mui/icons-material/Looks4Outlined';
import Looks5OutlinedIcon from '@mui/icons-material/Looks5Outlined';
import Looks6OutlinedIcon from '@mui/icons-material/Looks6Outlined';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import { saveAs } from 'file-saver'
import ToPNG from './topng';
import {layoutdagre} from './cytostyle';
import {cytoscapeStylesheet} from './cytostyle';

cytoscape.use(dagre);


var SERVER_URL = "http://127.0.0.1:5000"


function App() {
  let [Notes, setNotes] = useState("");
  let [showText, setShowText] = useState(true);
  let [more, setMore] = useState(false);
  let [openPNG, setOpenPNG] = useState(false)
  let [book, setBook] = useState("showChooseBook");
  let [bookChoice,setBookChoice] = useState("null");
  let [showGraph1, setShowGraph1] = useState(false);
  let [showGraph2, setShowGraph2] = useState(false);
  let [showGraph3, setShowGraph3] = useState(false);
  let [showGraph4, setShowGraph4] = useState(false);
  let [showGraph5, setShowGraph5] = useState(false);
  let [showGraph6, setShowGraph6] = useState(false);
  let [graph1Name, setGraph1Name] = useState("");
  let [graph2Name, setGraph2Name] = useState("");
  let [graph3Name, setGraph3Name] = useState("");
  let [graph4Name, setGraph4Name] = useState("");
  let [graph5Name, setGraph5Name] = useState("");
  let [graph6Name, setGraph6Name] = useState("");
  let [graph1, setGraph1] = useState("null");
  let [graph2, setGraph2] = useState("null");
  let [graph3, setGraph3] = useState("null");
  let [graph4, setGraph4] = useState("null");
  let [graph5, setGraph5] = useState("null");
  let [graph6, setGraph6] = useState("null");
  let [datar, setDatar] = useState("null");
  let [datarRest, setDatarRest] = useState("null");
  const [disableVisNow, setDisable] = React.useState(false);
  const [show, setShow] = useState(false);
  let [graph, setGraph] = useState("1");
  const cytoRef = useRef(null)
  

  function displayGraph1() {
    setShowGraph1(false);
    setShowGraph2(true);
    setShowGraph3(true);
    setShowGraph4(true);
    setShowGraph5(true);
    setShowGraph6(true);
    setGraph("1");
    // CytoEvent();

  }
  function displayGraph2() {
    setShowGraph1(true);
    setShowGraph2(false);
    setShowGraph3(true);
    setShowGraph4(true);
    setShowGraph5(true);
    setShowGraph6(true);
    setGraph("2");
    // CytoEvent();
  }
  function displayGraph3() {
    setShowGraph1(true);
    setShowGraph2(true);
    setShowGraph3(false);
    setShowGraph4(true);
    setShowGraph5(true);
    setShowGraph6(true);
    setGraph("3");
    // CytoEvent();
  }
  function displayGraph4() {
    setShowGraph1(true);
    setShowGraph2(true);
    setShowGraph3(true);
    setShowGraph4(false);
    setShowGraph5(true);
    setShowGraph6(true);
    setGraph("4");
    // CytoEvent();
  }
  function displayGraph5() {
    setShowGraph1(true);
    setShowGraph2(true);
    setShowGraph3(true);
    setShowGraph4(true);
    setShowGraph5(false);
    setShowGraph6(true);
    setGraph("5");
    // CytoEvent();
  }
  function displayGraph6() {
    setShowGraph1(true);
    setShowGraph2(true);
    setShowGraph3(true);
    setShowGraph4(true);
    setShowGraph5(true);
    setShowGraph6(false);
    setGraph("6");
    // CytoEvent();
  }

  function ResetNames(){
    setGraph1Name("");
    setGraph2Name("");
    setGraph3Name("");
    setGraph4Name("");
    setGraph5Name("");
    setGraph6Name("");

  }

  function GetGraphName(){
    if(showGraph1==false)
      return graph1Name
    if(showGraph2==false)
      return graph2Name
    if(showGraph3==false)
      return graph3Name
    if(showGraph4==false)
      return graph4Name
    if(showGraph5==false)
      return graph5Name
    if(showGraph6==false)
      return graph6Name
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

  function getRestGraphs() {
    postDataRest(`${SERVER_URL}/RestOfNotes`);
  }

  function visualizeNow() {
    console.log(Notes);
    postData(`${SERVER_URL}/AddnoteNow`, { text: Notes });
  }
  function CytoEvent() {

    // cytoRef.current.removeListener('click');
    // cytoRef.current.nodes(topNode).style('background-color', '#00ffff');
    // var myNode1 = cytoRef.current.nodes('[id="A3"]')[0];
    // var myNode2 = cytoRef.current.nodes('[id="A7"]')[0];
    // var level3Nodes = cytoRef.current.nodes('[type="3"]');
    // myNode1.style('background-color', '#ffb6c1');
    // myNode2.style('background-color', '#ffb6c1');
    var AllNodes = cytoRef.current.nodes();
    if (AllNodes.length>=3){
    for(var nId=3; nId<AllNodes.length; nId=nId+3){
      var RankedNodes = cytoRef.current.nodes("[rank='"+nId+"']");
      var order = nId/3
      RankedNodes.successors().addClass("collapsedchild"+order)
      RankedNodes.addClass('expandable');
    }
  }
    cytoRef.current.nodes().forEach(function(ele){
        if(ele.hasClass('expandable')){
          ele.on('tap', function (evt) {
            var collapsed = ele.data('rank');
            ele.successors().toggleClass("collapsedchild"+collapsed/3);
            })
        }

    })
  

    // myNode1.successors().addClass('collapsedchild');
    // myNode2.successors().addClass('collapsedchild');
    cytoRef.current.zoomingEnabled(true);


    cytoRef.current.on('click', 'node', function (evt) {
      var targetNode = cytoRef.current.nodes("[id = '" + evt.target.data().id + "']");
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



    // });
    // myNode2.on('tap', function (evt) {
    //   myNode2.successors().toggleClass("collapsedchild");
    // });
    // cytoRef.current.on('click', 'node', function (evt) {
    //   var targetNode = cytoRef.current.nodes("[id = '" + evt.target.data().id + "']");
    // })
  }


  function FromEPIC() {
    fetch(`${SERVER_URL}/getnoteepic`)
      .then(response => response.json())
      .then(data => {
        console.log(data)

      });
  }

  function resetData() {
    setGraph("1");
    setGraph1("null");
    setGraph2("null");
    setGraph3("null");
    setGraph4("null");
    setGraph5("null");
    setGraph6("null");
    setShowGraph1(false);
    setShowGraph2(false);
    setShowGraph3(false);
    setShowGraph4(false);
    setShowGraph5(false);
    setShowGraph6(false);
    setShowText(true);
    setNotes("");
    ResetNames();
    setMore(false);
    reset(`${SERVER_URL}/reset`);
    console.log("reset")
  }

  function changeBook(bookselected) {
    console.log(bookselected);
    postBook(`${SERVER_URL}/ChangeBook` , { Book: bookselected });
    setBook("hideChooseBook");
    setBookChoice("Book"+bookselected);
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

  async function postDataRest(url = '') {
    const response = await fetch(url, {

      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      // body: JSON.stringify(data)
    })

    const datarTemp = await response.json();
    setDatarRest(datarTemp);
    if (datarTemp.elementss !== "Stall") {
      setGraph4Name(datarTemp.Name);
      if (datarTemp.Name !== graph4Name) {
        setGraph5Name(datarTemp.Name1);
        setGraph6Name(datarTemp.Name2);
        setShowGraph4(true);
        setShowGraph5(true);
        setShowGraph6(true);
        setGraph4(datarTemp.elementss);
        setGraph5(datarTemp.elementss1);
        setGraph6(datarTemp.elementss2);
      }
    }
  }
  const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });

  return (
    <div className="App">
      <AppBar position="static">
        <Toolbar classes={{ root: "nav" }}>
          <div>
            <Button className="btn-class" variant="outlined" onClick={FromEPIC} >From EPIC</Button>&nbsp;&nbsp;
            <Button className="btn-class" variant="outlined" onClick={() => setBook("showChooseBook")} >Change Book</Button>
          </div>
          <Typography style={{ textAlign: "center" }} variant="h5">DAVE</Typography>
          <div>
            <div>
              <Button className="btn-class" variant="outlined" onClick={() => cytoRef.current.reset()}>Reset Zoom</Button>
              &nbsp;&nbsp;<Button className="btn-class" variant="outlined" onClick={resetData} >Clear</Button>
            </div>
          </div>
        </Toolbar>
      </AppBar>
      <UserCredentialsDialog open={book ==="showChooseBook"} onSubmit={(bookselected) => changeBook(bookselected)}
        onClose={() => setBook("hideChooseBook")}
        title={'Choose Book'} submitText={'submit'}></UserCredentialsDialog>
  {  openPNG &&
        <Dialog 
        fullScreen
        open={openPNG}
        onClose={() => setOpenPNG(false)}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: 'relative' }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={() => setOpenPNG(false)}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Button autoFocus color="inherit" onClick={() => saveAs("./PNGs/"+bookChoice+"/"+GetGraphName()+'.png',GetGraphName()+'.png')}>
              Save
            </Button>
          </Toolbar>
        </AppBar>
        <div className="to-png-pop-up">
        <img src={require("../public/PNGs/"+bookChoice+"/"+GetGraphName()+'.png')}/>
        </div>
      </Dialog>
      }
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
                  <GraphButton className={`base-class ${showGraph4 ? 'graph-box-right__graph-buttons' : 'graph-box-right__graph-buttons--disabled'}`} disabled={!showGraph4} variant="contained" onClick={() => displayGraph4()}>
                    <Looks4OutlinedIcon></Looks4OutlinedIcon>
                  </GraphButton>
                  <label className={`base-class ${!showGraph4 ? 'graph-box-right__button-container__label' : 'graph-box-right__button-container__label--disabled'}`}
                  >{graph4Name}</label>
                </div>
                <div className="graph-box-right__button-container">
                  <GraphButton className={`base-class ${showGraph5 ? 'graph-box-right__graph-buttons' : 'graph-box-right__graph-buttons--disabled'}`} disabled={!showGraph5} variant="contained" onClick={() => displayGraph5()}>
                    <Looks5OutlinedIcon></Looks5OutlinedIcon>
                  </GraphButton>
                  <label className={`base-class ${!showGraph5 ? 'graph-box-right__button-container__label' : 'graph-box-right__button-container__label--disabled'}`}
                  >{graph5Name}</label>
                </div>
                <div className="graph-box-right__button-container">
                  <GraphButton className={`base-class ${showGraph6 ? 'graph-box-right__graph-buttons' : 'graph-box-right__graph-buttons--disabled'}`} disabled={!showGraph6} variant="contained" onClick={() => displayGraph6()}>
                    <Looks6OutlinedIcon></Looks6OutlinedIcon>
                  </GraphButton>
                  <label className={`base-class ${!showGraph6 ? 'graph-box-right__button-container__label' : 'graph-box-right__button-container__label--disabled'}`}
                  >{graph6Name}</label>
                </div>

              </div>

            }
            <GraphButton className={`base-class ${graph1 != "null" ? 'graph-box-right__graph-buttons' : 'graph-box-right__graph-buttons--disabled'}`}
              disabled={graph1 === "null"} variant="contained" onClick={() => {setMore(!more);getRestGraphs()}}>
              {!more &&
                <MoreHorizIcon></MoreHorizIcon>
              }
              {more &&
                <KeyboardArrowUpIcon></KeyboardArrowUpIcon>
              }
            </GraphButton>
          </div>
          <div className="graph-box-right__to-png-container">
          <GraphButton className={`base-class ${graph1 != "null"  ? 'graph-box-right__to-png-buttons' : 'graph-box-right__to-png-buttons--disabled'}`}
           disabled={graph1 === "null"} variant="contained" onClick={() => setOpenPNG(!openPNG)}>
          <ImageOutlinedIcon></ImageOutlinedIcon>
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
          {graph === "4"
            &&
            <CytoscapeComponent minZoom={0.5} maxZoom={1.5}
              autoungrabify={true} userPanningEnabled={true} className="cyto"
              cy={ref => cytoRef.current = ref}
              elements={CytoscapeComponent.normalizeElements(graph4)} layout={layoutdagre}
              stylesheet={cytoscapeStylesheet} />
          }
          {graph === "5"
            &&
            <CytoscapeComponent minZoom={0.5} maxZoom={1.5}
              autoungrabify={true} userPanningEnabled={true} className="cyto"
              cy={ref => cytoRef.current = ref}
              elements={CytoscapeComponent.normalizeElements(graph5)} layout={layoutdagre}
              stylesheet={cytoscapeStylesheet} />
          }
          {graph === "6"
            &&
            <CytoscapeComponent minZoom={0.5} maxZoom={1.5}
              autoungrabify={true} userPanningEnabled={true} className="cyto"
              cy={ref => cytoRef.current = ref}
              elements={CytoscapeComponent.normalizeElements(graph6)} layout={layoutdagre}
              stylesheet={cytoscapeStylesheet} />
          }
        </div>
      </div>
    </div>


  );


}

export default App;
