const service = require("./tables.service");
const reservationService = require("../reservations/reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function list(req, res){
    const data = await service.list();
    res.json({ data });
}

async function tableExists(req, res, next){
    const { table_id } = req.params;
    const table = await service.read(table_id);
    if(table){
        res.locals.table = table;
        if(table.reservation_id) res.locals.table.status = "occupied";
        return next();
    }
  return next({ status: 404, message: `table_id ${table_id} not found`});
}

async function isFree(req, res, next){
    if(res.locals.table.status === "occupied") return next({ status: 400, message: `table is already occupied`});
    return next();
}

async function reservationExists(req, res, next){
    const { reservation_id } = res.locals.table;
    if(!reservation_id) return next({status: 400, message: `this table is not occupied`});

    const reservation = await reservationService.read(reservation_id);
    
    if(reservation){
        res.locals.reservation = reservation;
        return next();
    }
    return next({ status: 404, message: `reservation not found`})
}

async function reservationIsValid(req, res, next){
    if(!req.body.data) return next({ status: 400, message: "request must have data"});
    
    const { reservation_id } = req.body.data;

    if(!reservation_id) return next({ status: 400, message: "reservation_id must be included in the body of the request"});

    const reservation = await reservationService.read(reservation_id);

    if(reservation){

        if(reservation.people > res.locals.table.capacity) return next({ status: 400, message: "reservation party size exceeds capacity"});
        
        if(reservation.status === "seated") return next({ status: 400, message: "reservation party is already seated"});

        res.locals.reservation = reservation;
        return next();
    }
    return next({ status: 404, message: `reservation_id ${reservation_id} not found`});
}

function isValidTable(req, res, next){
    const { data } = req.body;

    if(!data) next({ status: 400, message: `data must exist and be included in request.body` });

    const {table_name, capacity} = data;
    
    if(!table_name || table_name.length < 2)next({ status: 400, message: `table_name must exist and have at least 2 characters` });

    if(!capacity) next({status: 400, message: `capacity must exist and have a value`});

    if(typeof capacity !== "number") next({ status: 400, message: `capacity must be a number` });
    
    if(capacity < 1) next({status: 400, message: `capacity must be greater than 0`});
    
    next();
}

async function create(req, res){
    //console.log(req.body.data)
    const data = await service.create(req.body.data);
    //console.log(data)
    return res.status(201).json({ data });
}

async function update(req, res, next){
    const { reservation_id } = res.locals.reservation;
    const updatedTable = {...res.locals.table, status:"occupied", reservation_id};
    const data = await service.update(updatedTable);
    const updatedReservation = {...res.locals.reservation, status: "seated"};
    await reservationService.update(updatedReservation);
    return res.json({ data });
}

async function destroy(req, res, next){
    const updatedTable = {...res.locals.table, status:"free", reservation_id:null};
    const data = await service.update(updatedTable);
    const updatedReservation = {...res.locals.reservation, status: "finished"};
    await reservationService.update(updatedReservation);
    return res.json({data});
}

module.exports = {
    list: asyncErrorBoundary(list),
    create: [asyncErrorBoundary(isValidTable), asyncErrorBoundary(create)],
    update: [asyncErrorBoundary(tableExists), asyncErrorBoundary(reservationIsValid), asyncErrorBoundary(isFree), asyncErrorBoundary(update)],
    delete: [asyncErrorBoundary(tableExists), asyncErrorBoundary(reservationExists), asyncErrorBoundary(destroy)]
}