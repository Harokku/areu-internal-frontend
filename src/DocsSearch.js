import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {AutoComplete} from "primereact/autocomplete";
import {Button} from "primereact/button";

const DocsSearch = (props) => {
    const [selectedDoc, setSelectedDoc] = useState(null)
    const [filteredDoc, setFilteredDoc] = useState(null)

    // Filter passed in docs
    const searchDoc = (e) => {
        let filteredDoc
        if (!e.query.trim().length) {
            filteredDoc = [...props.searchList]
        } else {
            filteredDoc = props.searchList.filter((item) => item.label.toLowerCase().indexOf(e.query.toLowerCase()) !== -1)
        }

        setFilteredDoc(filteredDoc)
    }

    // Clear searchbox
    const clearSeachBox = () => {
        setSelectedDoc(null)
    }

    const openDocument = (e)=> {
        // onSelect={(e) => props.selectedCallback(e.value.value)}/>
        setFilteredDoc(null)
        props.selectedCallback(e.value.value)
    }

    return (
        <>
            <div className="p-inputgroup">
                <AutoComplete forceSelection value={selectedDoc} suggestions={filteredDoc} completeMethod={searchDoc}
                              placeholder="Digita per cercare"
                              field="label"
                              onChange={(e) => setSelectedDoc(e.value)}
                              onSelect={openDocument}/>
                <Button icon="pi pi-times" className="p-button-danger" onClick={clearSeachBox}/>
            </div>
        </>
    )
};

DocsSearch.propTypes = {
    searchList: PropTypes.array.isRequired,
    selectedCallback: PropTypes.func,
};

export default DocsSearch;