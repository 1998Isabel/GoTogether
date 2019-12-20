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
const session = driver.session();

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
  session
    .run(
      'MATCH (a:Student) WHERE a.name = $name RETURN a',
      { name: req.params.name }
    ).then(result => {
      session.close();
      const singleRecord = result.records[0];
      const node = singleRecord.get(0);
      console.log("NOD", node)
      console.log(node.properties.name);
      res.json(node);
    });
});

app.get("/friends/:name", (req, res) => {
  session
    .run(
      'MATCH p=(a:Student)-[r1:HobbyFriends]->(b:Student)-[r2:HaveHobby]-(h:Hobby) WHERE a.name = $name RETURN DISTINCT b.name, collect(DISTINCT h.hobby) AS hobbies',
      { name: req.params.name }
    ).then(result => {
      session.close();
      console.log("RES",result)
      const Records = result.records;
      const nodes = Records.map(r => {
        return({
          name: r.get(0),
          hobbies: r.get(1)
        })
      });
      // console.log("NOD", nodes)
      // console.log(node.properties.name);
      res.json(nodes);
    });
});


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
