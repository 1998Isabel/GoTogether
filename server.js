const express = require("express");
const app = express();
app.use(express.json());
var nodemailer = require('nodemailer');

var mailTransport = nodemailer.createTransport('SMTP', {
  service: 'Gmail',
  auth: {
    user: credentials.gmail.user,
    pass: credentials.gmail.password,
  },
});

//mysql
var mysql = require('mysql');
var conn = mysql.createConnection({
  host: '127.0.0.1',
  user: 'newuser',
  password: '1234',
  database: 'DBfinal'
});

// 建立連線後不論是否成功都會呼叫
conn.connect(function (err) {
  if (err) throw err;
  console.log('connect success!');
});

//neo4j
var neo4j = require('neo4j-driver');
const uri = "bolt://localhost:7687";
const user = "neo4j";
const password = "1234";
const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));

// People METHODS
app.get("/people/:name", (req, res) => {
  const session = driver.session();
  session
    .run(
      `
      MATCH (ui: usersInfo {name: $name})-[:hobby]->(h1: AllUsersHobbies)
      RETURN ui.name AS name, ui.city AS city, ui.district AS district, collect(DISTINCT h1.name) AS hobbies
      `,
      { name: req.params.name }
    ).then(result => {
      session.close();
      const singleRecord = result.records[0];
      const node = {
        name: singleRecord.get(0),
        hobbies: singleRecord.get(3),
        location: [singleRecord.get(1), singleRecord.get(2)],
        latlng: [0, 0],
      }
      res.json(node);
    });
});

app.get("/friends/:name", (req, res) => {
  const session = driver.session();
  session
    .run(
      `
      MATCH (ui: usersInfo {name: $name})-[:hobby]->(h1: AllUsersHobbies)<-[:hobby]-(us: usersInfo)
      WITH DISTINCT us
      MATCH (us)-[:hobby]->(h2: AllUsersHobbies)
      RETURN us.name AS name, us.city AS city, us.district AS district, collect(DISTINCT h2.name) AS hobbies
    `,
      { name: req.params.name }
    ).then(result => {
      session.close();
      const Records = result.records;
      const nodes = Records.map(r => {
        return ({
          name: r.get(0),
          hobbies: r.get(3),
          location: [r.get(1), r.get(2)],
        })
      });
      console.log("FRIENDS NUM", nodes.length)
      res.json(nodes);
    });
});

// Places METHODS
app.get("/places", (req, res) => {
  console.log("PARAM", req.query)
  const { location, latlng, hobbies } = req.query;
  let query = //`SELECT * FROM allspots WHERE city = "${location}"`;
    `
    SELECT *, 
    ROUND(ST_distance_sphere(POINT(${latlng[1]}, ${latlng[0]}), 
    POINT(longitude, latitude))/1000, 2) as distance, 
    description
    FROM allspots
    WHERE 
  `
  hobbies.forEach((h, idx) => {
    if (idx !== 0)
      query = query + " OR"

    query = query + ` label_search = "${h}"`
  });
  query = query + " HAVING distance < 10 ORDER BY distance ASC LIMIT 15;"
  console.log("QUERY", query)
  conn.query(query, (err, result, fields) => {
    if (err) console.log(err);
    console.log(result[0]);
    res.json(result);
  });
})

// Places METHODS
app.get("/weather/:location", (req, res) => {
  const { location } = req.params;
  conn.query(`SELECT * FROM weather_df WHERE city = "${location}"`, (err, result, fields) => {
    if (err) console.log(err);
    res.json(result);
  });
})

const port = process.env.PORT || 7000;

app.listen(port, () => console.log(`Server started on port ${port}`));
