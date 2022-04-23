import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import React, { useState } from "react";
import "./UserCredentialsDialog.css";
// Component that presents a dialog to collect credentials from the user
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
        <div className="img-left-pop-up">
        <img  src={require('./symptomToDiagnosis.jpg')} 
              onClick={() => setBookSelected("1")} />
              </div>
              <div className="img-left-pop-up">
        <img src={require('./patientHistory.jpg')} 
              onClick={() => setBookSelected("2")} />
        </div>
        </div>
                <Button
                    color="primary"
                    variant="contained"
                    onClick={() => onSubmit(bookselected)}
                >
                    {submitText}
                </Button>
            </div>
        </Dialog>
    );
}