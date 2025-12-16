
// Validation schemas
const createShowSchema = Joi.object({
    movieid: Joi.string().required(),
    venueid: Joi.string().required(),   
    showDateTime: Joi.date().iso().required(),
    showPrice: Joi.number().min(0).required(),
    totalSeats: Joi.number().min(1).required(),
});
const updateShowSchema = Joi.object({
    movieid: Joi.string(),
    venueid: Joi.string(),
    showDateTime: Joi.date().iso(),
    showPrice: Joi.number().min(0),
    totalSeats: Joi.number().min(1),
    availableSeats: Joi.number().min(0),
    status: Joi.string().valid("scheduled", "cancelled", "completed"),
});
const notificationSchema = Joi.object({
    title: Joi.string().required(),
    message: Joi.string().required(),
});

