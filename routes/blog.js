const express = require("express");

const db = require("../data/database");

const router = express.Router();

router.get("/", (req, res) => {
  res.redirect("/posts");
});

router.get("/posts", async (req, res) => {
  const [posts] = await db.query(
    "Select posts.*, authors.name from posts join authors on posts.authorId = authors.id order by date desc"
  );
  res.render("posts-list", { posts: posts });
});

router.get("/new-post", async (req, res) => {
  const authors = await getAuthors();
  res.render("create-post", { post: [], authors: authors });
});

router.post("/posts/:id/edit", async (req, res) => {
  const postid = req.params.id;
  await db.query("update posts set title=?, summary=?, body=? where id=?", [
    req.body.title,
    req.body.summary,
    req.body.content,
    postid,
  ]);
  res.redirect("/posts");
});

router.get("/posts/:id/edit", async (req, res) => {
  const id = req.params.id;
  const post = await getPost(id);
  const authors = await getAuthors();

  res.render("update-post", { post: post, authors: authors });
});

router.post("/posts", async (req, res) => {
  const data = [
    req.body.title,
    req.body.summary,
    req.body.content,
    req.body.author,
  ];
  await db.query(
    "Insert into posts (title, summary, body, authorId) values(?)",
    [data]
  );

  res.redirect("/posts");
});

router.get("/posts/:id", async (req, res) => {
  const id = req.params.id;
  const post = await getPost(id);
  if (!post) {
    res.status(404).render("404");
    return;
  }
  res.render("post-detail", { post: post });
});

router.post("/posts/:id/delete", async (req, res) => {
  const id = req.params.id;
  const sql = `Delete from posts where posts.id=?`;
  await db.query(sql, [id]);

  res.redirect("/posts");
});

async function getPost(id) {
  const sql = `Select posts.*, authors.name, authors.email from posts join authors on authors.id = posts.authorId where posts.id=?`;
  const [posts] = await db.query(sql, [id]);
  const postData = {
    ...posts[0],
    date: posts[0].date.toISOString(),
    hrDate: posts[0].date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
  };
  return postData;
}

async function getAuthors() {
  const [authors] = await db.query("Select  * from Authors");
  console.log(authors);
  return authors;
}

module.exports = router;
