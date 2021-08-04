const fetch = require("node-fetch");
const dotenv = require("dotenv");
dotenv.config();
const sl = `https://api.ipgeolocation.io/timezone?apiKey=${process.env.TIME_API}&tz=Asia/Colombo`;
const au = `https://api.ipgeolocation.io/timezone?apiKey=${process.env.TIME_API}&tz=Australia/Perth`;

module.exports = async (req, res, next) => {
  try {
    const slresponse = await fetch(sl);
    const sldata = await slresponse.json();
    req.datesl = sldata.date_time;
    //   console.log(req.datesl);
    const auresponse = await fetch(au);
    const audata = await auresponse.json();
    req.dateau = audata.date_time;
    //   console.log(req.dateau);
    next();
  } catch (error) {
    next(error);
  }
};
