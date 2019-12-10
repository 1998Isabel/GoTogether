const users = [
  {
    addr: "xxxx",
    name: "test"
  }
];

const categories = [
  "News",
  "International",
  "Sports",
  "Entertainment",
  "Economics"
];

const posts = [
  {
    id: "1",
    category: "Economics",
    title: "Post1",
    content: "This is the first post!",
    date: Date.now(),
    user: "0xE195c59BCF26fD36c82d1C720860127A5c1c4040",
  },
  // {
  //   id: "2",
  //   category: "Sports",
  //   title: "Post2",
  //   content: "This is the 2nd post!",
  //   date: Date.now()
  // },
  // {
  //   id: "3",
  //   category: "News",
  //   title: "Post3",
  //   content: "This is the 3rd post!",
  //   date: Date.now()
  // }
];

const db = {
  users,
  categories,
  posts
};

module.exports = db;
