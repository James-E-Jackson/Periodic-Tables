import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import ErrorAlert from "../layout/ErrorAlert";
import { createReservation, editReservation, findReservation } from "../utils/api";

function ReservationForm(){
    const defaultState = {
        first_name: "",
        last_name: "",
        mobile_number: "",
        reservation_date: "",
        reservation_time: "",
        people: 1,
    };
    const {reservation_id=null} = useParams();
    const [formData, setFormData] = useState(defaultState);
    const [error, setError] = useState(null);
    const errors = [];
    const [errorArr, setErrorArr] = useState([]);
    const history = useHistory();
    
    useEffect(() => {
        const abortController = new AbortController();
        if(reservation_id){
            findReservation(reservation_id, abortController.signal)
                .then((response) => setFormData({...response, 
                    reservation_date: response.reservation_date.substr(0,10),
                    reservation_time: response.reservation_time.substr(0,5)
                }))
                .catch(setError)
        }
    }, [reservation_id])

    const handleSubmit = (event) => {
        event.preventDefault();
        const abortController = new AbortController();
        setErrorArr([]);

        if(valid() && !reservation_id) {
            createReservation(formData, abortController.signal)
            .then(()=> history.push(`/dashboard?date=${formData.reservation_date}`))
            .catch(setError);   
        }else if(reservation_id){
            editReservation(formData, abortController.signal)
            .then(() => history.push(`/dashboard?date=${formData.reservation_date}`))
            .catch(setError);
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
        return !errors.length;
    }

    const errorList = () => errorArr.map((err, index) => <ErrorAlert key={index} error={err} />);
	

    return (
    <div className="form-group">
        {errorList()}
        <ErrorAlert error={error} />
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
        min="09:30"
        max="21:30"
        pattern="[0-9]{2}:[0-9]{2}"
        value={formData.reservation_time}
        onChange={(event=>
            setFormData({
                ...formData,
                reservation_time: event.target.value
            }))}>
        </input>
        <label>Party Size</label>
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
        <button 
        className="btn btn-primary"
        type="submit" 
        onClick={handleSubmit}
        >Submit</button>
        <button 
        className="btn btn-danger"
        type="cancel" 
        onClick={(event) =>{
        event.preventDefault()
        history.goBack()
        }}>Cancel</button>
    </div>)
}

export default ReservationForm;