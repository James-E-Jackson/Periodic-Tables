const service = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

/**
 * List handler for reservation resources
 */
async function list(req, res) {
  const data = await service.listReservationsByDate(req.query.date);
  res.json({ data });
}


async function create(req, res) {
  //console.log(req.body.data)
  //console.log(typeof req.body.data.people)
  const data = await service.create(req.body.data);
  //console.log(data)
  res.status(201).json({ data })
}
async function isValidReservation(req, res, next){
  const reservation = req.body.data;
  if(!req.body.data){
    return next({
      status: 400,
      message: "Data must exist and be contained in request.body.data"
    })
  }
  const {first_name ="", last_name ="", mobile_number="", status="",
        reservation_date="", reservation_time="", people=""} = reservation;
  
  const today = new Date();
  const reservationDate = new Date(`${reservation_date}T${reservation_time}:00.000`);
  const resTime = Number(reservation_time.split(':').join(''));

  if(status !== "booked"){
    if(!status) req.body.data.status = "booked";
    else{
      return next({
        status: 400,
        message: `${status} is not a valid status`
      })
    }
  }
  //console.log(typeof people)
  if(typeof people !== "number"){
    return next({
      status: 400,
      message: `people must be a number`
    })
  }
  if(people < 1){
    return next({
      status: 400,
      message: `people must be greater than 0`
    })
  }

  if(!first_name){
    return next({
      status: 400,
      message: `first_name must be provided`
    })
  }

  if(!last_name){
    return next({
      status: 400,
      message: `last_name must be provided`
    })
  }

  // for(let [key, value] of Object.entries(reservation)){
  //   if(!value){
  //     return next({
  //       status: 400,
  //       message: `Each field must have an entry. Missing: ${key}`
  //     })
  //   }
  // }
  if(!mobile_number.match(/^\(?([0-9]{3})\)?-?([0-9]{3})-?([0-9]{4})$/) && !mobile_number.match(/^\(?([0-9]{3})-?([0-9]{4})$/)){
    return next({
      status: 400,
      message: `${mobile_number} mobile_number formatted incorrectly must be XXX-XXX-XXXX or XXX-XXXX`
    })
  }
  // if(!mobile_number){
  //   return next({
  //          status: 400,
  //          message: `${mobile_number} mobile_number must be present`
  //         })
  // }
  if(!reservation_date.match(/^(19|20)\d{2}\-(0[1-9]|1[0-2])\-(0[1-9]|1\d|2\d|3[01])$/)){
    return next({
      status: 400,
      message: `${reservation_date} reservation_date formatted incorrectly must be YYYY-MM-DD`
    })
  }
  
  if(reservationDate < today){
    return next({
      status: 400,
      message: `reservation_date must be in the future`
    })
  }
  if(resTime > 2130 || resTime < 1030){
    return next({
      status: 400,
      message: "Cannot make a reservation after 9:30 PM or before 10:30 AM"
    })
}
  if(reservationDate.getDay() === 2){
    return next({
      status: 400,
      message: `reservation_date cannot be on Tuesdays: closed`
    })
  }

  if(!reservation_time.match(/^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/)){
    return next({
      status: 400,
      message: `${reservation_time} reservation_time formatted incorrectly must be HH:MM`
    })
  }

  return next();
}

module.exports = {
  list: asyncErrorBoundary(list),
  create: [asyncErrorBoundary(isValidReservation), asyncErrorBoundary(create)],
};
