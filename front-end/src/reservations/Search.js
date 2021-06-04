import React, { useState } from "react";
import ErrorAlert from "../layout/ErrorAlert";
import { listReservations } from "../utils/api";
import Reservation from "./Reservation";

function Search(){
    const [error, setError] = useState(null);
    const [mobile_number, setMobile] = useState(null);
    const [reservations, setReservations] = useState([]);
    const [searched, setSearched] = useState(false)

    const handleSearch = (event) => {
        event.preventDefault();
        const abortController = new AbortController();

        listReservations({mobile_number}, abortController.signal)
            .then(setReservations)
            .then(setSearched(true))
            .catch(setError)
    }

    const reservationList = () => reservations.map((reservation)=><Reservation reservation={reservation} key={reservation.reservation_id}/>);
    

    return (
        <div>
            <form>
                <ErrorAlert error={error} />
                <label>Enter a phone number to search</label>
                <input
                    name="mobile_number"
                    id="mobile_number"
                    type="tel"
                    onChange={(event) =>{
                        setMobile(event.target.value)
                    }}></input>
                <button 
                type="submit"
                onClick={handleSearch}
                >Search</button>
            </form>
            {searched && !reservations.length ? <p>No reservations found</p>:null}
            {reservationList()}
        </div>)
}

export default Search;