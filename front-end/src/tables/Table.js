import React from "react";

function Table({ table }){
    const {table_name, capacity, status} = table;
    return (
        <div>
            <p>{table_name}, Capacity: {capacity}</p>
            <p data-table-id-status={table.table_id}>Status: {status}</p>
        </div>
    )
}

export default Table;