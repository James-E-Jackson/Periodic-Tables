import React, { useEffect, useState } from "react";
import { useRouteMatch } from "react-router";
import ErrorAlert from "../layout/ErrorAlert";
import { updateReservationStatus } from "../utils/api";

function Reservation({ reservation, loadPage }){
    const { first_name, last_name , mobile_number, status,
    reservation_date, reservation_time, people, reservation_id}
    = reservation;
    const {url} = useRouteMatch();
    const [error, setError] = useState(null);
    const [alert, setAlert] = useState("");

    const handleCancel = () => {
        const abortController = new AbortController();
        if(window.confirm("Do you want to cancel this reservation? This cannot be undone.")){
            updateReservationStatus(reservation_id, "cancelled", abortController.signal)
                .then(loadPage)
                .catch(setError)
        }
    }

    useEffect(() =>{
        let result;
        switch(status){
            case "cancelled": result = "alert alert-danger"
            break;
            case "booked": result = "alert alert-primary"
            break;
            case "seated": result = "alert alert-success"
            break;
            default: result = "d-lg-none";
            break;
        }
        setAlert(result);
    }, [status])

    return(
        <div className={alert}>
            <div>
                <ErrorAlert error={error} />
                <div className="d-flex">
                    <div className="col text-left pl-0">{last_name}, {first_name}</div>
                    <div className="col text-right pr-0">Seating: {people}</div>
                </div>
                <div className="d-flex">
                    <div className="col text-left pl-0" 
                    data-reservation-id-status={reservation.reservation_id}>Status: {status}
                    </div>
                    <div className="col text-right pr-0">Date: {reservation_date}</div>
                </div>
                <div className="d-flex"> 
                    <div className="col text-left pl-0">Mobile: {mobile_number}</div>
                    <div className="col text-right pr-0">Time: {reservation_time}</div>
                </div>
                {status !== "cancelled" && url !== `/reservations/${reservation_id}/seat` ? 
                <div>
                    {status ==="booked" && url!=="/search"? 
                    <a 
                    name="seat"
                    id="seat"
                    className="btn btn-primary" 
                    href={`/reservations/${reservation_id}/seat`}
                    >Seat</a>:
                    null}
                    <a 
                    name="edit"
                    id="edit"
                    className="btn btn-secondary" 
                    href={`/reservations/${reservation_id}/edit`}
                    >Edit</a>
                    <button 
                    name="cancel"
                    id="cancel"
                    className="btn btn-danger" 
                    onClick={handleCancel}
                    data-reservation-id-cancel={reservation_id}
                    >Cancel</button>
                </div>
                :null}
            </div>
        </div>
    )
}

export default Reservation