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
        .returning("*")
        .then((arr) => arr[0])
}
function read(reservation_id){
    //console.log("read method", reservation_id)
    return knex("reservations")
        .select("*")
        .where({reservation_id})
        .first();
}
module.exports = {
    listReservationsByDate,
    create,
    read,
}