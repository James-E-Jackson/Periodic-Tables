import React, { useEffect, useState } from "react";
import { listReservations, listTables } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import Reservation from "../reservations/Reservation";
import Table from "../tables/Table";
import { useHistory } from "react-router";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date }) {
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [tables, setTables] = useState([]);
  const [tablesError, setTablesError] = useState(null);
  const history = useHistory();

  useEffect(loadDashboard, [date]);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    setTablesError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    listTables({ date }, abortController.signal)
      .then(setTables)
      .catch(setTablesError);
    return () => abortController.abort();
  }
  const reservationList = () =>
    reservations.map((reservation) => (
      <Reservation
        loadPage={loadDashboard}
        reservation={reservation}
        key={reservation.reservation_id}
      />
    ));
  const tableList = () =>
    tables.map((table) => (
      <Table loadPage={loadDashboard} table={table} key={table.table_id} />
    ));
  return (
    <main>
      <h1>Dashboard</h1>
      <div>
        <button
          name="next"
          className="btn btn-info"
          onClick={() => {
            let tomorrow = new Date(date);
            tomorrow.setDate(tomorrow.getDate() + 1);
            tomorrow = tomorrow.toISOString().substr(0, 10);
            history.push(`/dashboard?date=${tomorrow}`);
          }}
        >
          Next
        </button>
        <button
          name="today"
          className="btn btn-info"
          onClick={() => {
            let today = new Date().toISOString().substr(0, 10);
            history.push(`/dashboard?date=${today}`);
          }}
        >
          Today
        </button>
        <button
          name="previous"
          className="btn btn-info"
          onClick={() => {
            let yesterday = new Date(date);
            yesterday.setDate(yesterday.getDate() - 1);
            yesterday = yesterday.toISOString().substr(0, 10);
            history.push(`/dashboard?date=${yesterday}`);
          }}
        >
          Previous
        </button>
      </div>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for {date}</h4>
      </div>
      <ErrorAlert error={reservationsError} />
      <ErrorAlert error={tablesError} />
      <div className="row">
        <div className="d-flex flex-column col">{reservationList()}</div>
        <div className="d-flex flex-column col-5 text-center">
          <h4 className="">Tables</h4>
          <div className="d-flex flex-row">
            <div className="col">Name</div>
            <div className="col">Seats</div>
            <div className="col">Status</div>
            <div className="col"></div>
          </div>
          {tableList()}
        </div>
      </div>
    </main>
  );
}

export default Dashboard;
