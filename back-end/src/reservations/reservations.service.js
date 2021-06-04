const knex = require("../db/connection");

function listReservationsByDate(reservation_date){
    //console.log(reservation_date)
    return knex("reservations")
        .select("*")
        .where({reservation_date})
        .whereNot({"reservations.status": "finished"})
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

function update(updatedReservation){
    const reservation_id = updatedReservation.reservation_id;
    //console.log(updatedReservation)
    return knex("reservations")
        .where({ reservation_id })
        .update(updatedReservation)
        .returning("*")
        .then((arr)=> arr[0]);
}

function search(mobile_number) {
    return knex("reservations")
      .whereRaw(
        "translate(mobile_number, '() -', '') like ?",
        `%${mobile_number.replace(/\D/g, "")}%`
      )
      .orderBy("reservation_date");
  }

module.exports = {
    listReservationsByDate,
    create,
    read,
    update,
    search,
}