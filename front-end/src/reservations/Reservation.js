import React from "react";

function Reservation({reservation}){
    const {first_name, last_name , mobile_number, status,
    reservation_date, reservation_time, people}
    = reservation;
    return(
        <div>
            <div>Name: {last_name}, {first_name} Mobile: {mobile_number}</div>
            <div>Date: {reservation_date} Time: {reservation_time} Seating: {people} Status: {status}</div>
        </div>
    )
}

export default Reservation