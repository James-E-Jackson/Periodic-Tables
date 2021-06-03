const service = require("./tables.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function list(req, res){
    const data = await service.list();
    res.json({ data })
}

function isValidTable(req, res, next){
    const { data } = req.body;
    if(!data){
        next({
            status: 400,
            message: `Data must exist and be included in request.body`
        })
    }
    const {table_name, capacity} = data;
    
    if(!table_name || table_name.length < 2){
        next({
            status: 400,
            message: `table_name must exist and have at least 2 characters`
        })
    }

    if(!capacity){
        next({
            status: 400,
            message: `capacity must exist and have a value`
        })
    }

    if(typeof capacity !== "number"){
        next({
            status: 400,
            message: `capacity must be a number`
        })
    }

    if(capacity < 1){
        next({
            status: 400,
            message: `capacity must be greater than 0`
        })
    }
}

async function create(req, res){
    res.status(200)
}

async function update(req, res){
    res.status(200)
}

async function destroy(req, res){
    res.status(200)
}

module.exports = {
    list: asyncErrorBoundary(list),
    create: [isValidTable, asyncErrorBoundary(create)],
    update: [isValidTable, asyncErrorBoundary(create)],
    delete: [isValidTable, asyncErrorBoundary(destroy)]
}