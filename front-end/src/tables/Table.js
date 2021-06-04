import React, { useState } from "react";
import ErrorAlert from "../layout/ErrorAlert";
import { finishTable, updateReservationStatus } from "../utils/api";

function Table({ table, loadPage }) {
  if (table.reservation_id) table.status = "occupied";
  const { table_name, capacity, status, reservation_id, table_id } = table;
  const [finishError, setFinishError] = useState(null);
  const [updateError, setUpdateError] = useState(null);

  const handleFinish = () => {
    if (window.confirm("Is this table ready to seat new guests?")) {
      const abortController = new AbortController();
      finishTable(table_id, abortController.signal)
        .catch(setFinishError)
        .then(loadPage);
      updateReservationStatus(
        reservation_id,
        "finished",
        abortController.signal
      )
        .then(loadPage)
        .catch(setUpdateError);
    }
  };

  return (
    <div className="d-flex text-center">
      <ErrorAlert error={updateError} />
      <ErrorAlert error={finishError} />
      <div className="col mb-0 alert alert-primary">{table_name}</div>
      <div className="col mb-0 alert alert-info">{capacity}</div>
      {status === "free" ? (
        <div
          className="col mb-0 alert alert-success"
          data-table-id-status={table_id}
        >
          {status}
        </div>
      ) : (
        <div
          className="col mb-0 alert alert-danger"
          data-table-id-status={table_id}
        >
          {status}
        </div>
      )}
      {status === "occupied" ? (
        <button
          className="col btn btn-secondary"
          onClick={handleFinish}
          data-table-id-finish={table_id}
        >
          Finish
        </button>
      ) : (
        <div className="col btn"></div>
      )}
    </div>
  );
}

export default Table;
