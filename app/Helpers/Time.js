const moment = require("moment");
const DATE_FORMAT = "YYYY-MM-DD HH:mm:ss";

const currentTime = () => {
  return moment(new Date()).format(DATE_FORMAT);
};

const TimeOnlyNumber = () => {
  return moment(new Date()).format("HHmmss");
}

module.exports = { currentTime, TimeOnlyNumber };
