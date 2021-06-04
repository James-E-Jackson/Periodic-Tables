import React, { useState } from "react";
import ErrorAlert from "../layout/ErrorAlert";
import { finishTable, updateReservationStatus } from "../utils/api";

function Table({ table, loadDashboard}){
    if(table.reservation_id) table.status = "occupied"
    const {table_name, capacity, status, reservation_id, table_id} = table;
    const [finishError, setFinishError] = useState(null);
    const [updateError, setUpdateError] = useState(null);

    const handleFinish = () => {
        if(window.confirm("Is this table ready to seat new guests?")){
            const abortController = new AbortController();
            finishTable(table_id, abortController.signal)
                .catch(setFinishError)
            updateReservationStatus(reservation_id, "finished", abortController.signal)
                .then(loadDashboard)
                .catch(setUpdateError)
        }
    }

    return (
        <div>
            <ErrorAlert error={updateError} />
            <ErrorAlert error={finishError} />
            <p>{table_name}, Capacity: {capacity}</p>
            <p data-table-id-status={table_id}>Status: {status}</p>
            {status === "occupied" ? 
            <button 
            onClick={handleFinish}
            data-table-id-finish={table_id}
            >Finish</button>:
            null}
        </div>
    )
}

export default Table;