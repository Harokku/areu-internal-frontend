import React, {useState, useEffect, useRef} from 'react';
import "./DocsRecent.css"
import axios from "axios";
import {ListBox} from "primereact/listbox";
import {Toast} from "primereact/toast";
import {Panel} from "primereact/panel";

const DocsRecent = (props) => {
    const [recentList, setrecentList] = useState([]);
    const [wsUpdate, setwsUpdate] = useState(null);

    const toast = useRef(null);
    const ws = useRef(null); // WS Ref

    // Data fetch effect
    useEffect(() => {
        fetchData()
    }, [wsUpdate])

    // WS init effect
    useEffect(() => {
        ws.current = new WebSocket(`${process.env.REACT_APP_WS}/api/v1/ws`)
        ws.current.onopen = () => console.log("ws opened");
        ws.current.onclose = () => console.log("ws closed");

        return () => {
            ws.current.close();
        };
    }, [])

    //WS Message received effect
    useEffect(() => {
        if (!ws.current) return;

        ws.current.onmessage = e => {
            const parsedMessage = JSON.parse(e.data)
            setwsUpdate(parsedMessage)
            // If event if od type CREATE > shoe info toast
            if (parsedMessage.operation === "CREATE") showToast("info", "Nuovo documento caricato", parsedMessage.filename)
        }
    })

    // Fetch data from backend (url from env)
    const fetchData = async () => {
        const res = await axios(
            `${process.env.REACT_APP_BACKEND}/api/v1/docs/recent/10`
        )
        buildRecentList(res.data.data)
    }

    // Extract recent list from raw backend to a prime compatible format
    const buildRecentList = (rawData) => {
        const data = rawData.map(item => (
            {
                label: item.display_name,
                value: item.id,
            }
        ))
        setrecentList(data)
    }

    // Show downloaded blob in a new browser tab
    const showInBrowser = (blob) => {
        //let newBlob = new Blob([blob], {type: "application/pdf"})
        const data = URL.createObjectURL(blob)
        window.open(data, '_blank')
    }

    // Request file from server based on id
    const requireFile = (id) => {
        let url = `${process.env.REACT_APP_BACKEND}/api/v1/docs/serveById/${id}`
        return fetch(url, {
            method: 'GET',
        })
            .then(r => r.blob())
            .then(showInBrowser)
    }

    // Show toast
    const showToast = (severity, sum, detail) => {
        toast.current.show({severity: severity, summary: sum, detail: detail, life: 5000});
    }

    return (
        <>
            <Panel className="p-m-2 childelem" header="Documenti recenti">
                <div className="card">
                    <Toast ref={toast}/>
                    <ListBox options={recentList} onChange={(e) => requireFile(e.value)} filter/>
                </div>
            </Panel>
        </>
    )
};

export default DocsRecent;