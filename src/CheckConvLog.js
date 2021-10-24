import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {InputText} from "primereact/inputtext";
import {Button} from "primereact/button";
import {requestStatus} from "./utils";
import {Message} from "primereact/message";

const CheckConvLog = props => {
    const [valueOperator, setValueOperator] = useState("");
    const [valueNote, setValueNote] = useState("");

    return (
        <>
            {
                props.status === requestStatus.COMPLETED
                    ? <div className="p-d-flex p-justify-even">
                        <Message severity="success" text="Controllo inviato correttamente"/>
                    </div>
                    :
                    <>
                        {props.status === requestStatus.ERROR && <div className="p-d-flex p-justify-even">
                            <Message severity="error" text="Errore durante l'invio, dati NON salvati"/>
                        </div>}
                        <div
                            className={`p-d-flex p-justify-even ${props.status === requestStatus.IDLE || requestStatus.ERROR ? "" : "p-disabled"}`}>

                            <div className="p-inputgroup p-m-2" value={valueOperator}
                                 onChange={(e) => setValueOperator(e.target.value)}>
                            <span className="p-inputgroup-addon">
                                <i className="pi pi-user"/>
                            </span>
                                <InputText placeholder="Operatore"/>
                            </div>

                            <div className="p-inputgroup p-m-2" value={valueNote}
                                 onChange={(e) => setValueNote(e.target.value)}>
                            <span className="p-inputgroup-addon">
                                <i className="pi pi-list"/>
                            </span>
                                <InputText placeholder="Note"/>
                            </div>

                            <div className="p-inputgroup p-m-2">
                                <Button onClick={() => props.onSubmitLog(valueOperator, valueNote)}
                                        className="p-button-raised p-button-success"
                                        label="Controllo completato"
                                        icon="pi pi-envelope"/>
                            </div>

                        </div>
                    </>
            }
        </>
    );
};

CheckConvLog.propTypes = {
    status: PropTypes.string.isRequired,
    onSubmitLog: PropTypes.func.isRequired,
};

export default CheckConvLog;