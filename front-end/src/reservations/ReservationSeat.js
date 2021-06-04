import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import ErrorAlert from "../layout/ErrorAlert";
import { occupyTable, findReservation, listTables } from "../utils/api";
import Reservation from "./Reservation";

function ReservationSeat() {
  const { reservation_id } = useParams();
  const [error, setError] = useState(null);
  const [reservation, setReservation] = useState({});
  const [tables, setTables] = useState([]);
  const [table_id, setTable_id] = useState(0);
  const history = useHistory();
  const errors = [];

  useEffect(loadReservation, [reservation_id]);

  function loadReservation() {
    const abortController = new AbortController();
    findReservation(reservation_id, abortController.signal)
      .then(setReservation)
      .catch(setError);
    listTables().then(setTables).catch(setError);
    return () => abortController.abort();
    //console.log(reservation)
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    const abortController = new AbortController();

    if (valid()) {
      occupyTable(table_id, reservation_id, abortController.signal)
        .then(() => history.push(`/dashboard`))
        .catch(setError);
      return () => abortController.abort();
    }
  };

  const valid = () => {
    if (!table_id) {
      setError({ message: "Please choose a table" });
      return false;
    }
    const { capacity, status } = tables.find(
      (table) => table_id === table.table_id
    );

    if (reservation.people > capacity)
      setError({ message: "Number of people cannot exceed capacity" });

    if (status === "occupied")
      setError({ message: "That table is currently occupied" });

    return !errors.length;
  };

  const tableList = () => {
    return tables.map((table) => (
      <option key={table.table_id} value={table.table_id}>
        {table.table_name} - {table.capacity}
      </option>
    ));
  };

  return (
    <div>
      <h2>Seat Reservation</h2>
      <div className="d-flex">
        <ErrorAlert error={error} />
        <div className="col-9">
          <Reservation
            reservation={reservation}
            key={reservation.reservation_id}
          />
        </div>
        <div className="col-3">
          <label className="mb-0">Select Table</label>
          <select
            className="form-control form-select form-select-lg"
            name="table_id"
            id="table_id"
            value={table_id}
            onChange={(event) => setTable_id(Number(event.target.value))}
          >
            <option value={0}>Select table</option>
            {tableList()}
          </select>
          <div>
            <button
              className="btn btn-primary"
              type="submit"
              onClick={handleSubmit}
            >
              Submit
            </button>
            <button
              className="btn btn-danger"
              onClick={(event) => {
                event.preventDefault();
                history.goBack();
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReservationSeat;
