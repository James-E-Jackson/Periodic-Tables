import React, { useState } from "react";
import { useHistory } from "react-router";
import { postTable } from "../utils/api";

function TableForm(){
    const defaultState = {
        table_name: "",
        capacity: 1,
    };
    const [formData, setFormData] = useState(defaultState);
    const history = useHistory();
    const [error, setError] = useState("")

    const handleSubmit = () => {
        if(valid()) {
        postTable(formData)
            .then(()=> history.push(`/dashboard`))
            .catch((err) => setError(err));
        }
    }
    const valid = () => {
        if(formData.table_name === "" || formData.capacity === ""){
            setError({message: "Missing fields"})
        }else if(formData.table_name.length < 2){
            setError({message: "Table name must be at least 2 characters long"})
        }
        return error === "";
    }

    return(
        <form>
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
            onChange={(event=>
                setFormData({
                    ...formData,
                    table_name: event.target.value
                }))}>
            </input>
            <label>Capacity</label>
            <input
            required
            className="form-control"
            id="capacity"
            type="number"
            name="capacity"
            min={1}
            value={formData.capacity}
            onChange={(event=>
                setFormData({
                    ...formData,
                    capacity: Number(event.target.value)
                }))}>
            </input>
            <button type="submit" onClick={handleSubmit}>Submit</button>
            <button onClick={() =>{history.goBack()}}>Cancel</button>
        </form>
    )
}

export default TableForm;