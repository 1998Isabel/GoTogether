const express = require("express");
const app = express();
app.use(express.json());

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

// // 其他的資料庫操作，位置預留
// conn.query('SELECT * FROM `weather_df` LIMIT 10', function (err, result, fields) {
//   if (err) console.log(err);
//   console.log(result);
// });
// conn.query('SELECT * FROM `tourism_df` LIMIT 1', function (err, result, fields) {
//   if (err) console.log(err);
//   console.log(result);
// });

// const personName = '賴沂謙';

// session
//   .run(
//     // 'MATCH (n:Student) RETURN n LIMIT 25',
//     'MATCH (a:Student) WHERE a.name = $name RETURN a',
//     { name: personName }
//   ).then(result => {
//     session.close();
//     // console.log("RES", result)
//     const singleRecord = result.records[0];
//     const node = singleRecord.get(0);
//     // console.log("NOD", node)
//     console.log(node.properties.name);

//     // on application exit:
//     // driver.close();
//   });

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

    // remember to delete
    h = "music"
    query = query + ` label_search = "${h}"`
  });
  query = query + " HAVING distance < 10 ORDER BY distance ASC LIMIT 10;"
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

// //close neo4j driver
// driver.close();

// // 關閉mysql連線時呼叫
// conn.end(function (err) {
//   if (err) throw err;
//   console.log('connect end');
// })

// // Users METHODS
// app.get("/user/:addr", (req, res) => {
//   const user = db.users.filter(user => user.addr === req.params.addr);
//   res.json(user);
// });

// // Posts METHODS
// app.get("/posts", (req, res) => {
//   res.json(db.posts);
// });

// app.post("/posts", (req, res) => {
//   const newPost = {
//     id: req.body.id,
//     category: req.body.category,
//     title: req.body.title,
//     content: req.body.content
//   };

//   db.posts.unshift(newPost);
//   res.json(newPost);
// });

// app.delete("/posts/:id", (req, res) => {
//   db.posts = db.posts.filter(post => post.id !== req.params.id);
//   res.json(db.posts);
// });

// // Categories METHODS
// app.get("/categories", (req, res) => {
//   res.json(db.categories);
// });

// app.post("/categories", (req, res) => {
//   const newCategory = {
//     id: req.body.id,
//     name: req.body.name
//   };

//   db.categories.push(newCategory);
//   res.json(newCategory);
// });

// app.delete("/categories/:id", (req, res) => {
//   db.categories = db.categories.filter(
//     category => category.id !== req.params.id
//   );
//   res.json(db.categories);
// });



const port = process.env.PORT || 7000;

app.listen(port, () => console.log(`Server started on port ${port}`));
