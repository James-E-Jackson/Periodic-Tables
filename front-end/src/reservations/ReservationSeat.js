import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import ErrorAlert from "../layout/ErrorAlert";
import { findReservation, listTables } from "../utils/api";

function ReservationSeat(){
    const {reservation_id} = useParams();
    const [error, setError] = useState(null)
    const [reservation, setReservation] = useState({})
    const [tables, setTables] = useState([])
    const [table_id, setTable_id] = useState(0);

    useEffect(loadReservation, [reservation_id]);
    
    function loadReservation(){
        findReservation(reservation_id)
            .then(setReservation)
            .catch(setError);
        listTables()
            .then(setTables)
            .catch(setError);
        
    //console.log(reservation)
    }
    const tableList = () => {
        return tables.map((table, index) => <option key={index} value={table.table_id}>{table.table_name} - {table.capacity}</option>)
    }
    return(
        <div>
            <ErrorAlert error={error} />
            <p>{reservation.last_name}, {reservation.first_name}</p>
            <p>Seating: {reservation.people}</p>
            <label>Select Table</label>
            <select
            name="table_id"
            id="table_id"
            value={table_id}
            onChange={event => setTable_id(event.target.value)}>
                <option value={0}>Select table</option>
                {tableList()}
            </select>
            <button>Submit</button>
        </div>
    )
}

export default ReservationSeat