import React, {useState, useEffect, useRef} from "react";
import axios from "axios";
import {ListBox} from "primereact/listbox";
import {Toast} from "primereact/toast";
import {Panel} from "primereact/panel";
import {Button} from "primereact/button";

// DocsFrequent component
const DocsFrequent = (props) => {
    const [frequentList, setfrequentList] = useState([]); // State for frequent docs list
    const [wsUpdate, setwsUpdate] = useState(null); // State for WS update

    const ws = useRef(null); // WS Ref

    // Data fetch effect
    useEffect(() => {
        fetchData()
    }, [wsUpdate])

    // WS init effect
    useEffect(() => {
        ws.current = new WebSocket(`${process.env.REACT_APP_WS}/api/v1/ws`) //
        ws.current.onopen = () => console.log("ws opened") // Log WS open;
        ws.current.close = () => console.log("ws closed"); //
    }, [])

    // TODO: WS Message received effect

    // Fetch data function
    const fetchData = async () => {
        const res = await axios.get(`${process.env.REACT_APP_BACKEND}/api/v1/favourites/own`)
        buildFrequentList(res.data.data)
    }

    // Extract frequent docs list from raw backend to a prime compatible format
    const buildFrequentList = (rawList) => {
        const frequentList = rawList.map((doc) => {
            return {
                label: doc.filename,
                count: doc.count,
                value: doc.filename,
            }
        })
        setfrequentList(frequentList)
    }

    // Show downloaded blob in a new browser tab
    const showInBrowser = (blob) => {
        const data = URL.createObjectURL(blob)
        window.open(data, '_blank')
    }

    // Require file from backend based on filename heuristic
    const requireFile = (filename) => {
        let url = `${process.env.REACT_APP_BACKEND}/api/v1/docs/serveByFilename/${filename}`
        return fetch(url, {
            method: 'GET',
        })
            .then(response => response.blob())
            .then(blob => showInBrowser(blob))
    }

    return (
        <>
            <Panel className="p-sm-12" header="Documenti frequenti">
                <div className="p-d-flex p-justify-even p-flex-wrap">
                    <div  className="card p-m-1 childelem">
                        <ListBox options={frequentList} optionLabel="label" optionValue="value" filter
                        onChange={e => requireFile(e.value)}/>
                    </div>
                </div>
            </Panel>
        </>
    )
}

export default DocsFrequent;