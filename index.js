const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const Tickets = require("./models/cs-tickets");
const Websites = require("./models/websites");
const upload = require("./utils/multer");
const sendmail = require("./utils/sendmail");
const uploadimage = require("./utils/uploadimage");
const dateNow = require("./utils/currentDate");
const AppError = require("./utils/AppError");
const dotenv = require("dotenv");
dotenv.config();

app.engine("ejs", ejsMate);

app.use(express.urlencoded({ extended: true }));

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("Server started on port: ", port);
});

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => console.log("Mongo Connection Successful"))
  .catch((err) => console.log(err.message));

app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "ejs");

app.get("/", async (req, res) => {
  let sites = await Websites.find({});
  // console.log(sites);
  res.render("index", { sites });
});

app.post(
  "/",
  upload.single("img"),
  dateNow,
  uploadimage,
  sendmail,
  async (req, res, next) => {
    try {
      const { cs } = req.body;
      // console.log(cs);
      const ticket = new Tickets(cs);
      ticket.datesl = req.datesl;
      ticket.dateau = req.dateau;
      // console.log(ticket);
      await ticket.save();
      // console.log(ticket._id);
      let { website } = req.body;
      // console.log(website);
      let site = await Websites.findById(website);
      // console.log(site);
      let newTicket = await Tickets.findById(ticket._id);
      // console.log(newTicket);
      newTicket.website = site;
      newTicket.img = req.body.image;
      let result = await newTicket.save();
      // console.log(newTicket);
      // console.log(result);
      // let pop = await Tickets.findById(result._id).populate("website");
      // console.log(pop);
      res.render("feedback", { cs });
    } catch (error) {
      next(error);
    }
  }
);

app.get("/tickets", async (req, res, next) => {
  try {
    const tickets = await Tickets.find({}).populate("website");
    const websites = await Websites.find({});
    // console.log(tickets);
    res.render("tickets", { tickets, websites });
  } catch (error) {
    next(error);
  }
});

app.get("/tickets/sort", async (req, res, next) => {
  try {
    const { id } = req.query;
    const current = await Websites.findById(id);
    const tickets = await Tickets.find({ website: id }).populate("website");
    const websites = await Websites.find({});
    // console.log(tickets);
    res.render("sort", { tickets, websites, current });
  } catch (error) {
    next(error);
  }
});

app.get("*", (req, res, next) => next(new AppError("Not Found", 404)));
app.post("*", (req, res, next) => next(new AppError("Not Found", 400)));

app.use((err, req, res, next) => {
  const { status = 500, message = "Internal Server Error" } = err;
  console.log(status, message);
  res.status(status).render("error", { err });
});
