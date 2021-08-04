const mongoose = require("mongoose");
const Website = require("./models/websites");

mongoose
  .connect(
    "mongodb+srv://admin:Qaz@234@Qaz@cluster0.utnhd.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    }
  )
  .then(() => console.log("Mongo Connection Successful"))
  .catch((err) => console.log(err.message));

const w1 = new Website({
  name: "test.com",
});

const seed = [
  {
    name: "alwayshealth.com.au",
  },
  {
    name: "vividsng.com.au",
  },
  {
    name: "theafghan.com.au",
  },
  {
    name: "unitedenergygroup.com.au (prev weltechelectrical.com.au)",
  },
  {
    name: "asnsystems.com",
  },
  {
    name: "secda.org",
  },
  {
    name: "vividsng.com.au",
  },
  {
    name: "aweilcommunitywa.com",
  },
  {
    name: "tradeit.lk",
  },
];

const seeding = async () => {
  const del = await Website.deleteMany({});

  const insert = await Website.insertMany(seed);
  console.log(insert);
};

seeding();
