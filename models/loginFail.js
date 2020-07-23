const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const entryExpireTime = "1h";

const loginFailSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  Time: {
    type: Date,
    default: Date.now,
    index: { expires: entryExpireTime },
  },
});

module.exports = mongoose.model("LoginFail", loginFailSchema);
