import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import "./CheckConvention.css"
import {Panel} from "primereact/panel";
import axios from "axios";
import {PickList} from "primereact/picklist";

const CheckConvention = props => {
    const [source, setSource] = useState([]);
    const [target, setTarget] = useState([]);
    const [tableContent, setTableContent] = useState([]);

    useEffect(() => {
            fetchData()
        }, []
    )
    const fetchData = async () => {
        const res = await axios(
            `${process.env.REACT_APP_BACKEND}/api/v1/fleet/actual`
        )
        setTableContent(res.data.data)
        setSource(res.data.data)
    }

    const onChange = (event) => {
        setSource(event.source);
        setTarget(event.target);
    }

    const itemTemplate = (item) => {
        return (
            <div>
                <span>{item.conv_type}</span> - <span>{item.name}</span>
            </div>
        );
    }


    return (
        <>
            <Panel className="p-m-2 childelem" header='Check Convenzioni'>
                <div className="card">
                    <PickList source={source} target={target} itemTemplate={itemTemplate}
                              sourceHeader="Convenzioni previste" targetHeader="Controllate presenti"
                              sourceStyle={{height: '342px'}} targetStyle={{height: '342px'}}
                              onChange={onChange}/>
                </div>
            </Panel>
        </>
    );
};

CheckConvention.propTypes = {};

export default CheckConvention;