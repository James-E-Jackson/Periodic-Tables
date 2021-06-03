import React from "react";

function Reservation({reservation}){
    const {first_name, last_name , mobile_number, status,
    reservation_date, reservation_time, people, reservation_id}
    = reservation;

    
    return(
        <div>
            <div>Name: {last_name}, {first_name} Mobile: {mobile_number} ID: {reservation_id}</div>
            <div>Date: {reservation_date} Time: {reservation_time} Seating: {people} Status: {status}</div>
            <a className="btn btn-primary" href={`/reservations/${reservation_id}/seat`}>Seat</a>
        </div>
    )
}

export default Reservation