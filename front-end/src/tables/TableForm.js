import React, { useState } from "react";
import { useHistory } from "react-router";
import ErrorAlert from "../layout/ErrorAlert";
import { createTable } from "../utils/api";

function TableForm() {
  const defaultState = {
    table_name: "",
    capacity: 0,
    status: "free",
  };
  const [formData, setFormData] = useState(defaultState);
  const history = useHistory();
  const [error, setError] = useState(null);

  const handleSubmit = (event) => {
    const abortController = new AbortController();
    event.preventDefault();
    setError(null);
    if (valid()) {
      createTable(formData, abortController.signal)
        .then(() => history.push(`/dashboard`))
        .catch(setError);
      return () => abortController.abort();
    }
  };
  const valid = () => {
    if (formData.table_name === "" || formData.capacity === "") {
      setError({ message: "Missing fields" });
    } else if (formData.table_name.length < 2) {
      setError({ message: "Table name must be at least 2 characters long" });
    }
    return !error;
  };

  return (
    <div>
      <h2>Create Table</h2>
      <form noValidate>
        <ErrorAlert error={error} />
        <label>Table Name</label>
        <input
          required
          className="form-control"
          id="table_name"
          type="text"
          name="table_name"
          minLength={2}
          placeholder="Table Name"
          value={formData.table_name}
          onChange={(event) =>
            setFormData({
              ...formData,
              table_name: event.target.value,
            })
          }
        ></input>
        <label>Capacity</label>
        <input
          required
          className="form-control"
          id="capacity"
          type="number"
          name="capacity"
          min={1}
          value={formData.capacity}
          onChange={(event) =>
            setFormData({
              ...formData,
              capacity: Number(event.target.value),
            })
          }
        ></input>
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
      </form>
    </div>
  );
}

export default TableForm;
