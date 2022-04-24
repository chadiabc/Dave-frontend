import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import React, { useState } from "react";
import "./UserCredentialsDialog.css";
import { Card, CardMedia, CardActionArea, CardContent, Typography } from '@mui/material';
import img from "./symptomToDiagnosis.jpg";
import img1 from "./patientHistory.jpg";

export default function UserCredentialsDialog({
    open,
    onSubmit,
    onClose,
    title,
    submitText,
}) {
    let [bookselected, setBookSelected] = useState("");
    return (
        <Dialog open={open} onClose={onClose} fullWidth>
            <div className="dialog-container">
                <DialogTitle>{title}</DialogTitle>
                <div className="img-box-pop-up">
                <Card className={`base-class ${bookselected ==="1" ? 'img-left-pop-up-selected' : 'img-left-pop-up'}`}
                         sx={{ maxWidth: 250 }}>
                    <CardActionArea onClick={()=> setBookSelected("1")}>
                        <CardMedia
                            component="img"
                            height="300"
                            image={img}
                            alt="Symptom To Diagnosis"
                        />
                        <CardContent style={{ backgroundColor: '#c4a35a' }}>
                            <Typography gutterBottom variant="h6" component="div">
                                Book 1
                            </Typography>
                        </CardContent>
                    </CardActionArea>
                </Card>
                <Card className={`base-class ${bookselected ==="2" ? 'img-left-pop-up-selected' : 'img-left-pop-up'}`}
                 sx={{ maxWidth: 250 }}>
                    <CardActionArea onClick={() => setBookSelected("2")}>
                        <CardMedia
                            component="img"
                            height="300"
                            image={img1}
                            alt="Symptom To Diagnosis"
                        />
                        <CardContent height={"50px"} style={{ backgroundColor: '#c4a35a' }}>
                            <Typography gutterBottom variant="h6" component="div">
                               Book 2
                            </Typography>
                        </CardContent>
                    </CardActionArea>
                </Card>
                </div>
                <Button
                    color="primary"
                    variant="contained"
                    onClick={() => {onSubmit(bookselected);setBookSelected("")}}
                >
                    {submitText}
                </Button>
            </div>
        </Dialog>
    );
}