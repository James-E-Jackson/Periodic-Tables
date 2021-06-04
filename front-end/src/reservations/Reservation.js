import React, { useState } from "react";
import ErrorAlert from "../layout/ErrorAlert";

function Reservation({ reservation, loadDashboard }){
    const [error, setError] = useState(null)
    const {first_name, last_name , mobile_number, status,
    reservation_date, reservation_time, people, reservation_id}
    = reservation;
    
    return(
        <div>
            <ErrorAlert error={error} />
            {status !== "finished"? 
            <div>
                <div data-reservation-id-status={reservation.reservation_id}>Status: {status}</div>
                <div>Name: {last_name}, {first_name} Mobile: {mobile_number} ID: {reservation_id}</div>
                <div>Date: {reservation_date} Time: {reservation_time} Seating: {people} </div>
                {status ==="booked" ? 
                <a 
                className="btn btn-primary" 
                href={`/reservations/${reservation_id}/seat`}
                >Seat</a>:
                null}
            </div>: 
            null}
        </div>
    )
}

export default Reservation