import React, {useState, useEffect, useRef} from 'react';
import "./DocsRecent.css"
import axios from "axios";
import {ListBox} from "primereact/listbox";
import {Toast} from "primereact/toast";
import {Panel} from "primereact/panel";
import moment from "moment";

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
            // If event if of type CREATE > show info toast
            //TODO: HackFilter for unwanted temporary file exclusion (sync.ffs_lock)
            if (parsedMessage.operation === "CREATE" && parsedMessage.filename !== "sync.ffs_lock")  showToast("info", "Nuovo documento caricato", parsedMessage.filename)
        }
    })

    // Fetch data from backend (url from env)
    const fetchData = async () => {
        const res = await axios(
            `${process.env.REACT_APP_BACKEND}/api/v1/docs/recent/10?mode=split`
        )
        buildRecentList(res.data.data)
    }

    // Extract recent list from raw backend to a prime compatible format
    const buildRecentList = (rawData) => {
        //TODO: Path separator to os agnostic
        /*const data = rawData.map(item => (
            {
                label: item.display_name,
                value: item.id,
            }
        ))
        setrecentList(data)*/
        const data = rawData.reduce((acc, item) => {
            //Extract category splitting at / using only 1st item
            const category = item.category.split("/", 1)
            //Check if acc contain category as key and add it if not
            if (!(category in acc)) {
                let newitem = {[item.category.split("/", 1)]: []}
                acc = {...acc, ...newitem}
            }
            //Push actual item data in category key
            acc[category].push({
                label: item.display_name,
                timestamp: item.creation_date,
                value: item.hash,
            })
            return acc
        }, {})

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
        toast.current.show({severity: severity, summary: sum, detail: detail, sticky: true});
    }

    // Item template to incorporate filename and creationdate
    const itemTemplate = (option) => {
        return (
            <div className="recentelem">
                <strong>{option.label}</strong> <span><small>{moment(option.timestamp).format('DD/MM/YYYY')}</small></span>
            </div>
        )
    }

    return (
        <>
            <Panel className="p-sm-12" header="Documenti recenti">
                <div className="p-d-flex p-justify-even p-flex-wrap">
                    <Toast ref={toast}/>
                    {Object.keys(recentList).map(key => (
                        <div key={key} className="card p-m-1 childelem">
                            <h4 className="title">{key.replaceAll('_', ' ')}</h4>
                            <ListBox options={recentList[key]} itemTemplate={itemTemplate} onChange={(e) => requireFile(e.value)} filter/>
                        </div>
                    ))}
                    {/*<ListBox options={recentList} onChange={(e) => requireFile(e.value)} filter/>*/}
                </div>
            </Panel>
        </>
    )
};

export default DocsRecent;