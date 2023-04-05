import React, {useState} from 'react';
import "./NewIssue.css"
import {Panel} from "primereact/panel";
import {InputText} from "primereact/inputtext";
import {InputTextarea} from "primereact/inputtextarea";
import {SelectButton} from "primereact/selectbutton";
import {Button} from "primereact/button";
import {requestStatus} from "./utils";
import axios from "axios";
import {Message} from "primereact/message";

const NewIssue = props => {
    const priorityOptions = [
        {name: 'Bassa', value: 1},
        {name: 'Normale', value: 2},
        {name: 'Alta', value: 3}
    ];
    const [operator, setOperator] = useState(null)
    const [issueText, setIssueText] = useState(null)
    const [issueTitle, setIssueTitle] = useState(null)
    const [priority, setPriority] = useState(2)
    const [postRequestStatus, setPostRequestStatus] = useState(requestStatus.IDLE)

    // Post new update
    const submitIssue = async () => {
        setPostRequestStatus(requestStatus.INFLIGHT)
        // Axios post config
        const options = {
            header: {
                "Content-Type": "application/json"
            },
            method: 'post',
            url: `${process.env.REACT_APP_BACKEND}/api/v1/issue`,
            data: {
                operator: operator,
                priority: priority,
                title: issueTitle,
                note: issueText,
            }
        }

        // Check form validity
        if (!formOkStatus()) {
            setPostRequestStatus(requestStatus.IDLE)
            return
        }

        // Axios post call
        try {
            await axios(options)
            setPostRequestStatus(requestStatus.COMPLETED)
        } catch (err) {
            setPostRequestStatus(requestStatus.ERROR)
        }
    }

    const formOkStatus = () => (
        operator !== null && issueText !== null
    )

    const resetForm = () => {
        setOperator(null)
        setIssueText(null)
        setIssueTitle(null)
        setPriority(2)
        setPostRequestStatus(requestStatus.IDLE)
    }

    return (
        <>
            <Panel className="p-m-2 childelem" header="Nuova consegna">
                {
                    postRequestStatus === requestStatus.COMPLETED
                        ?
                        <>
                            <div className="p-d-flex p-justify-even">
                                <Message severity="success" text="Consegna aggiunta correttamente"/>
                            </div>
                            <br/>
                            <div className="p-d-flex p-justify-even">
                                <Button
                                    onClick={() => resetForm()}
                                    className="p-button-raised p-button-info"
                                    label="Nuova consegna"
                                />
                            </div>
                        </>
                        :
                        <>
                            {
                                postRequestStatus === requestStatus.ERROR &&
                                <>
                                    <div className="p-d-flex p-justify-even">
                                        <Message severity="error" text="Errore durante l'invio, dati NON salvati"/>
                                    </div>
                                    <br/>
                                </>
                            }

                            <div
                                className={`p-pb-2 ${props.status === requestStatus.IDLE || requestStatus.ERROR ? "" : "p-disabled"}`}>
                                <div className="col-6 md:col-4">
                                    <div className="p-inputgroup">
                                        <span className="p-inputgroup-addon">
                                            <i className="pi pi-user"></i>
                                        </span>
                                        <InputText
                                            value={operator}
                                            onChange={(e) => setOperator(e.target.value)}
                                            placeholder="Operatore"/>
                                    </div>
                                </div>
                                <br/>
                                <h4>Titolo Consegna</h4>
                                <div className="col-6 md:col-4">
                                    <div className="p-inputgroup">
                                        <span className="p-inputgroup-addon">
                                            <i className="pi pi-list"></i>
                                        </span>
                                        <InputTextarea
                                            value={issueTitle} onChange={(e) => setIssueTitle(e.target.value)} rows={1}
                                            cols={30}
                                            autoResize/>
                                    </div>
                                </div>
                                <br/>
                                <h4>Testo Consegna</h4>
                                <div className="col-6 md:col-4">
                                    <div className="p-inputgroup">
                                        <span className="p-inputgroup-addon">
                                            <i className="pi pi-list"></i>
                                        </span>
                                        <InputTextarea
                                            value={issueText} onChange={(e) => setIssueText(e.target.value)} rows={5}
                                            cols={30}
                                            autoResize/>
                                    </div>
                                </div>
                                <br/>
                                <div className="col-6 md:col-4">
                                    <h4>Priorita'</h4>
                                    <SelectButton
                                        value={priority} options={priorityOptions}
                                        onChange={(e) => setPriority(e.value)}
                                        optionLabel="name"/>
                                </div>
                                <br/>
                                <Button
                                    onClick={() => submitIssue()}
                                    className="p-button-raised p-button-success"
                                    label="Aggiungi"
                                    icon="pi pi-envelope"/>
                            </div>
                        </>
                }
            </Panel>
        </>
    )
}

export default NewIssue