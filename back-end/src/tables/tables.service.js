const knex = require("../db/connection");

function list() {
	return knex("tables")
		.select("*")
        .orderBy("table_name", "asc");
}

function read(table_id){
    return knex("tables")
        .select("*")
        .where({ table_id })
        .first();
}

function create(table){
    return knex("tables")
        .insert(table)
        .returning("*")
        .then((arr) => arr[0]);
}

function update(updatedTable){
    const table_id = updatedTable.table_id;
    //console.log(updatedTable)
    return knex("tables")
        .select("*")
        .where({ table_id })
        .update(updatedTable);
}

function findReservation(reservation_id){
    return knex("reservations")
        .select("*")
        .where({ reservation_id })
        .first();
}
module.exports = {
    list,
    create,
    update,
    read,
    findReservation,
}