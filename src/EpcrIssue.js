import {Panel} from "primereact/panel";
import {InputText} from "primereact/inputtext";
import {Button} from "primereact/button";
import {useState} from "react";
import {requestStatus} from "./utils";
import axios from "axios";
import {Message} from "primereact/message";

const EpcrIssue = props => {
    const [postRequestStatus, setPostRequestStatus] = useState(requestStatus.IDLE);
    const [formData, setFormData] = useState(
        {
            vehicleId: "",
            issue: ""
        }
    )

    /**
     * Resets the IDLE status after a specified time interval.
     * @function resetIDLEStatusafterT
     * @description Resets the request status to IDLE after a specified time interval of 3000 milliseconds.
     */
    const resetIDLEStatusafterT = () => {
        setTimeout(() => {
            setPostRequestStatus(requestStatus.IDLE)
        }, 3000)
    }

    /**
     * Sends a post request to the backend API with the given data.
     * Save the new issue in db
     *
     * @async
     * @function postData
     * @returns {void}
     */
    const postData = async () => {
        setPostRequestStatus(requestStatus.INFLIGHT)
        // Axios post config
        const options = {
            header: {
                "Content-Type": "application/json"
            },
            method: "post",
            url: `${process.env.REACT_APP_BACKEND}/api/v1/epcrissue`,
            data: {
                vehicleid: formData.vehicleId,
                text: formData.issue,
            }
        }
        // Axios post call
        try {
            await axios(options)
            setPostRequestStatus(requestStatus.COMPLETED)
            resetIDLEStatusafterT()
        } catch (e) {
            resetIDLEStatusafterT()
            setPostRequestStatus(requestStatus.ERROR)
        }
    }

    return (
        <>
            <Panel className="p-m-2 childelem" header="Notifica carenze formative ePCR">
                <p><Message severity={"success"} text={"Inviare SOLO"}/> carenze formative/errori da parte del personale
                    operante su MSB/MSA</p>
                <p><Message severity={"error"} text={"NON inviare"}/> problemi tecnici dell'applicativo, ne suggerimenti
                    migliorativi</p>

                {
                    postRequestStatus === requestStatus.COMPLETED
                        ? <div className="p-d-flex p-justify-even">
                            <Message severity="success" text="Controllo inviato correttamente"/>
                        </div>
                        : <>
                            {postRequestStatus === requestStatus.ERROR && <div className="p-d-flex p-justify-even">
                                <Message severity="error" text="Errore durante l'invio, dati NON salvati"/>
                            </div>}

                            <div
                                className={`p-d-flex p-justify-even ${postRequestStatus === requestStatus.IDLE || requestStatus.ERROR ? "" : "p-disabled"}`}>

                                <div className="p-inputgroup p-m-2" value={formData.vehicleId}
                                     onChange={(e) => setFormData({...formData, vehicleId: e.target.value})}>
                            <span className="p-inputgroup-addon">
                                <i className="pi pi-user"/>
                            </span>
                                    <InputText placeholder="Acronimo mezzo"/>
                                </div>

                                <div className="p-inputgroup p-m-2" value={formData.issue}
                                     onChange={(e) => setFormData({...formData, issue: e.target.value})}>
                            <span className="p-inputgroup-addon">
                                <i className="pi pi-list"/>
                            </span>
                                    <InputText placeholder="Problema riscontrato"/>
                                </div>

                                <div className="p-inputgroup p-m-2">
                                    <Button onClick={() => postData()}
                                            className="p-button-raised p-button-success"
                                            label="Invia report"
                                            icon="pi pi-envelope"/>
                                </div>
                            </div>
                        </>
                }
            </Panel>
        </>
    )
}

export default EpcrIssue