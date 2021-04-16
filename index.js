const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');
require('dotenv').config();
const apiPort = process.env.PORT || 8000;
const mongoUrl = process.env.MONGO_URI;

// middleware
const app = express();
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// db
mongoose
  .connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('> Successfully connected to the database');
  })
  .catch((err) => {
    console.log(err.message);
  });

const conn = mongoose.connection;

conn.on('error', () => {
  console.log('error occued from database');
});

conn.once('open', () => {
  console.log('db success');
  conn.db.listCollections().toArray(function (err, collectionNames) {
    if (err) {
      console.log(err);
      return;
    }
    console.log(collectionNames);
    // conn.close();
  });
});

const myDb = conn.useDb('1minData');
// const test1 = conn.useDb('test');

const emptySchema = mongoose.Schema({});

const stocks = myDb.model('abc', emptySchema, 'main');
// const test = test1.model('abc', emptySchema, 'news');
// // const a = db.collection('2021-04-13');
// const b = conn.collection('news');
app.get('/api', async (req, res) => {
  res.json('HELLO');
});
app.get('/api/all', async (req, res) => {
  try {
    //   console.log('1');
    // const data200 = await data200Plus.find().lean();
    //   console.log('1');
    // const data10200 = await data10200B.find().lean();
    //   console.log('2');
    const allstocks = await stocks.find().limit(500).sort({ bar: -1 }).lean();

    // const s = [];
    // const cursor = await b.find();
    // cursor.on('data', function (d) {
    //   s.push(d);
    //   console.log(d);
    // });
    // cursor.on('end', function () {
    //   console.log(s.length);
    //   res.json(s);
    // });
    res.json(allstocks);
    // console.time('groupData');
    // const b = stocks.map((s) => {
    //   let a = data10200.find((d) => Object.keys(d)[1] === s.ticker);
    //   let c = data200.find((d2) => Object.keys(d2)[1] === s.ticker);
    //   console.timeEnd('groupData');

    //   return { ...s, data10200: a, data200Plus: c };
    // });
    // res.json(b);
    // console.log('num stocks ' + s.length);
  } catch (err) {
    console.log(err);
  }
});

app.listen(apiPort, () => console.log(`Server running on port ${apiPort}`));
