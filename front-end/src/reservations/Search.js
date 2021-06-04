import React, { useState } from "react";
import ErrorAlert from "../layout/ErrorAlert";
import { listReservations } from "../utils/api";
import Reservation from "./Reservation";

function Search() {
  const [error, setError] = useState(null);
  const [mobile_number, setMobile] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [searched, setSearched] = useState(false);

  function loadResults() {
    const abortController = new AbortController();
    listReservations({ mobile_number }, abortController.signal)
      .then(setReservations)
      .then(setSearched(true))
      .catch(setError);
  }

  const reservationList = () =>
    reservations.map((reservation) => (
      <Reservation
        load={loadResults}
        reservation={reservation}
        key={reservation.reservation_id}
      />
    ));

  return (
    <div>
      <h2>Search for a reservation</h2>
      <form className="d-flex row justify-content-center">
        <ErrorAlert error={error} />
        <label className="col-3">Enter a phone number to search</label>
        <div className="w-100"></div>
        <input
          className="col-3 form-control"
          name="mobile_number"
          id="mobile_number"
          type="tel"
          onChange={(event) => {
            setMobile(event.target.value);
          }}
        ></input>
        <button
          className="btn btn-info mb-2"
          type="submit"
          onClick={(event) => {
            event.preventDefault();
            loadResults();
          }}
        >
          Search
        </button>
      </form>
      {searched && !reservations.length ? <p>No reservations found</p> : null}
      <div className="col-6">{reservationList()}</div>
    </div>
  );
}

export default Search;
