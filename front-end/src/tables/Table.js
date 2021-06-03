import React, { useState } from "react";
import ErrorAlert from "../layout/ErrorAlert";
import { finishTable, listTables } from "../utils/api";

function Table({ table, loadDashboard}){
    if(table.reservation_id) table.status = "occupied"
    const {table_name, capacity, status} = table;
    const [error, setError] = useState(null);

    const handleFinish = () => {
        if(window.confirm("Is this table ready to seat new guests?")){
            const abortController = new AbortController();
            finishTable(table.table_id, abortController.signal)
                .then(loadDashboard)
                .catch(setError)
        }
    }

    return (
        <div>
            <ErrorAlert error={error}/>
            <p>{table_name}, Capacity: {capacity}</p>
            <p data-table-id-status={table.table_id}>Status: {status}</p>
            {status === "occupied" ? 
            <button 
            onClick={handleFinish}
            data-table-id-finish={table.table_id}
            >Finish</button>:
            null}
        </div>
    )
}

export default Table;