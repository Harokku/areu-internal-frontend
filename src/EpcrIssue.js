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
        } catch (e) {
            setPostRequestStatus(requestStatus.ERROR)
        }
    }

    return (
        <>
            <Panel className="p-m-2 childelem" header="Notifica carenza ePCR">

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