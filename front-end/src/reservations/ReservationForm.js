import React, { useState } from "react";
import { useHistory } from "react-router";
import ErrorAlert from "../layout/ErrorAlert";
import { postReservation } from "../utils/api";

function ReservationForm(){
    const defaultState = {
        first_name: "",
        last_name: "",
        mobile_number: "",
        reservation_date: "",
        reservation_time: "",
        people: 1,
    };
    const [formData, setFormData] = useState(defaultState);
    const [error, setError] = useState("");
    const errors = [];
    const [errorArr, setErrorArr] = useState([]);
    const history = useHistory();
    
    

    const handleSubmit = () => {
        if(valid()) {
            postReservation(formData)
            .then(()=> history.push(`/dashboard?date=${formData.reservation_date}`))
            .catch((err) => setError(err));   
        }else{
            setErrorArr(errors)
        }
    }

    const valid = () => {
        const reservationDate = new Date(`${formData.reservation_date}T${formData.reservation_time}:00.000`);
        const today = new Date();
        const resTime = Number(formData.reservation_time.split(':').join(''));

        if(reservationDate < today){
            errors.push({message: "Cannot make reservations in the past"})
        }
        if(reservationDate.getDay() === 2){
            errors.push({message: "Closed on Tuesdays"})
        }
        //console.log(resTime)
        if(resTime > 2130 || resTime < 1030){
            errors.push({message: "Cannot make a reservation after 9:30 PM or before 10:30 AM"})
        }
        //console.log(errors)
        return errors.length === 0;
    }

    const errorList = () => errorArr.map((err, index) => <ErrorAlert key={index} error={err} />);
	

    return (
    <div className="form-group">
        {errorList()}
        {error ? <ErrorAlert error={error} />:null}
        <label>First Name</label>
        <input
        required
        className="form-control"
        id="first_name"
        type="text"
        name="first_name"
        placeholder="First"
        value={formData.first_name}
        onChange={(event=>
            setFormData({
                ...formData,
                first_name: event.target.value
            }))}>
        </input>
        <label>Last Name</label>
        <input
        required
        className="form-control"
        id="last_name"
        type="text"
        name="last_name"
        placeholder="Last"
        value={formData.last_name}
        onChange={(event=>
            setFormData({
                ...formData,
                last_name: event.target.value
            }))}>
        </input>
        <label>Mobile Number</label>
        <input
        required
        className="form-control"
        id="mobile_number"
        type="text"
        name="mobile_number"
        placeholder="123-123-1234"
        value={formData.mobile_number}
        onChange={(event=>
            setFormData({
                ...formData,
                mobile_number: event.target.value
            }))}>
        </input>
        <label>Reservation Date</label>
        <input
        required
        className="form-control"
        id="reservation_date"
        type="date"
        name="reservation_date"
        placeholder="YYYY-MM-DD"
        pattern="\d{4}-\d{2}-\d{2}"
        value={formData.reservation_date}
        onChange={(event=>
            setFormData({
                ...formData,
                reservation_date: event.target.value
            }))}>
        </input>
        <label>Reservation Time</label>
        <input
        required
        className="form-control"
        id="reservation_time"
        type="time"
        name="reservation_time"
        placeholder="HH:MM"
        pattern="[0-9]{2}:[0-9]{2}"
        value={formData.reservation_time}
        onChange={(event=>
            setFormData({
                ...formData,
                reservation_time: event.target.value
            }))}>
        </input>
        <input
        required
        className="form-control"
        id="people"
        type="number"
        name="people"
        min={1}
        value={formData.people}
        onChange={(event=>
            setFormData({
                ...formData,
                people: Number(event.target.value)
            }))}>
        </input>
        <button type="submit" onClick={handleSubmit}>Submit</button>
        <button onClick={() =>{history.goBack()}}>Cancel</button>
    </div>)
}

export default ReservationForm;