"use strict";

const { checkAuthenticated } = require("../middlewares/middleware");
const Blog = require("../models/blogs");
const User = require("../models/user");
const keys = require("../config/keys");

module.exports = (app) => {
  app.post("/add/blog", checkAuthenticated, async (req, res) => {
    try {
      const { title, content } = req.body;
      if (!title.length && !content.length) throw new Error();
      await Blog.create({ title, content, userId: req.user.id });
      res.redirect("/get/blog");
    } catch (error) {
      res.status(400).send({ error: "you can't have empty title and content" });
    }
  });

  app.get("/add/blog", checkAuthenticated, (req, res) => {
    res.render("addBlog.ejs");
  });

  app.get("/get/blog", checkAuthenticated, async (req, res) => {
    // temprorary redis setup
    const redis = require("redis");
    const clientUrl = keys.redisUrl;
    const client = redis.createClient(clientUrl);
    const { promisify } = require("util");
    client.get = promisify(client.get);

    const cachedBlog = JSON.parse(await client.get(req.user.id));

    if (cachedBlog) {
      console.log('FORM REDIS !!');
      return res.render("showBlog.ejs", { data: cachedBlog.blogs });
    }
    const data = await User.findOne({
      where: {
        id: req.user.id,
      },
      include: { model: Blog },
    });
    console.log("FROM DB !!");
    res.render("showBlog.ejs", { data: data.dataValues.blogs });

    // setting up key vale in the redis
    client.set(req.user.id, JSON.stringify(data));

  });
};
