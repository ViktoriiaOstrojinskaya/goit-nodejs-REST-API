const {isValidObjectId}=require("mongoose");
const {HttpError}=require("../helpers");

const isValidId = (req, res, next) => {
    const {contactId} = req.params;
    if(!isValidObjectId(contactId)) {
        next(HttpError(400, `The object with id=${contactId} is not in the database`))
    }
    next();
}

module.exports = isValidId;