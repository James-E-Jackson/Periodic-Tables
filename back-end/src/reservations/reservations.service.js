const knex = require("../db/connection");

function listReservationsByDate(reservation_date){
    //console.log(reservation_date)
    return knex("reservations")
        .select("*")
        .where({reservation_date})
        .orderBy("reservation_time", "asc")
}
function create(data){
    //console.log(data)
    return knex("reservations")
        .insert(data)
        .returning(["first_name", "last_name", "mobile_number", 
        "people", "reservation_date", "reservation_time"])
        .then((arr) => arr[0])
}
module.exports = {
    listReservationsByDate,
    create,
}