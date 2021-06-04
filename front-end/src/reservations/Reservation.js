import React from "react";
import { useRouteMatch } from "react-router";

function Reservation({ reservation }){
    const {first_name, last_name , mobile_number, status,
    reservation_date, reservation_time, people, reservation_id}
    = reservation;
    const {url} = useRouteMatch();
    return(
        <div>
            {status !== "finished"? 
            <div>
                <div data-reservation-id-status={reservation.reservation_id}>Status: {status}</div>
                <div>Name: {last_name}, {first_name} Mobile: {mobile_number} ID: {reservation_id}</div>
                <div>Date: {reservation_date} Time: {reservation_time} Seating: {people} </div>
                {status ==="booked" && url!=="/search"? 
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