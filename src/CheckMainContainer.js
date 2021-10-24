import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import axios from "axios";
import "./CheckConvention.css"
import {requestStatus} from "./utils";
import CheckGroupedTable from "./CheckGroupedTable";
import {Panel} from "primereact/panel";
import {Button} from "primereact/button";
import CheckConvLog from "./CheckConvLog";

const CheckMainContainer = props => {
    const [tableContent, setTableContent] = useState([]);
    const [checkedContent, setCheckedContent] = useState([]);
    // Post request status
    const [postRequestStatus, setPostRequestStatus] = useState(requestStatus.IDLE);

    useEffect(() => {
            fetchData()
        }, []
    )
    const fetchData = async () => {
        const res = await axios(
            `${process.env.REACT_APP_BACKEND}/api/v1/fleet/actual`
        )
        setTableContent(res.data.data)
    }

    // moveItem search for passed item in original array (most probable situation) and move to checked array
    // if not found search in the opposite and move it back
    const moveItem = (e) => {
        console.log(`Passed up event: ${e.data.id}`)
        // Copy original array to not mess with state
        let temp = [...tableContent]
        // Search if passed item is present in original allray and store index
        const found = temp.findIndex(item => item.id === e.data.id)
        // If found remove it from original, add to checked array and update state
        if (found !== -1) {
            const removed = temp.splice(found, 1)
            setTableContent(temp)
            setCheckedContent(prev => [...prev, ...removed])

        } else { // Otherwise do the opposite
            temp = [...checkedContent]
            const removed = temp.splice(temp.findIndex(item => item.id === e.data.id), 1)
            setTableContent(prev => [...prev, ...removed])
            setCheckedContent(temp)
        }
    }

    const checkAllItems = () => {
        const temp = [...tableContent, ...checkedContent]
        setTableContent([])
        setCheckedContent(temp)
    }

    const submitLog = async (operator, note) => {
        setPostRequestStatus(requestStatus.INFLIGHT)
        const checkStatus = tableContent.length === 0
        // Axios post config
        const options = {
            header: {
                "Content-Type": "application/json"
            },
            method: "post",
            url: `${process.env.REACT_APP_BACKEND}/api/v1/fleet/logcheck`,
            data: {
                operator: operator,
                status: checkStatus ? "OK" : "KO",
                note: note,
            }
        }
        // Axios post call
        try {
            await axios(options)
            setPostRequestStatus(requestStatus.COMPLETED)
        } catch (err) {
            setPostRequestStatus(requestStatus.ERROR)
        }
    }

    return (
        <>
            <Panel className="p-m-2 childelem" header="Check convenzioni">
                <div className="p-d-flex p-justify-between">
                    <h1>Totale convenzioni: {tableContent.length + checkedContent.length}</h1>
                    <Button className="p-as-center" label="Segna tutte come ok" icon="pi pi-check"
                            onClick={() => checkAllItems()}/>
                </div>

                <div className="p-d-flex p-justify-even">
                    <CheckGroupedTable title="Mezzi da controllare" content={tableContent} position="left"
                                       onMoveItem={moveItem}/>
                    <CheckGroupedTable title="Mezzi controllati" content={checkedContent} position="right"
                                       onMoveItem={moveItem}/>
                </div>

                <CheckConvLog status={postRequestStatus} onSubmitLog={submitLog}/>
            </Panel>
        </>
    );
};

CheckMainContainer.propTypes = {};

export default CheckMainContainer;