//jshint esversion:6

const express = require("express");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");
require("dotenv").config();

const homeStartingContent = 'Welcome to your blog website, to write a post please add a "/compose" at the end of the website URL.';
const aboutContent = "Hi, im SageL a 21 year old web developer. I have experience with various technologies like JavaScript, C++, Python, C# and Java.";

const app = express();

app.set('view engine', 'ejs');

app.use(express.urlencoded({
  extended: true
}));
app.use(express.static("public"));

// Connection and authentication to your database, in my case to MongoDB Atlas.
mongoose.connect(process.env.DBCONNECT);

const postSchema = new mongoose.Schema({
  url: String,
  title: String,
  body: String, 
});

const Post = new mongoose.model("Post", postSchema);

defaultTitle1 = "Web programming";
defaultTitle2 = "The mitochondria: The powerhouse of the cell";

const defaultPost1 = new Post({
  url: _.kebabCase(defaultTitle1),
  title: defaultTitle1,
  body: "Profoundly useful and enjoyable, yet without the jargon. Web programming is closer to general programming than to traditional languages. It’s not well-defined or stable, but it’s like a good cup of tea",
});

const defaultPost2 = new Post({
  url: _.kebabCase(defaultTitle2),
  title: defaultTitle2,
  body: "In this study by Lisa Ellis, some of the biggest changes in metabolism occur in the mitochondria, tiny structures in cells that are the factories of the cell. \nWhen we sleep we are temporarily reprogrammed in many ways. While at rest we endogenise some of the nutrients in the blood and end up with a greater fuel stock to provide power when we need it. The glycogen in our liver and muscles"
});

const defaultPosts = [defaultPost1, defaultPost2];

app.get("/", function(req, res) {

  Post.find({}, function(err, posts){
    if(posts.length ===  0){

      Post.insertMany(defaultPosts, function(err){
        if(err){
          console.log(err);
        } else  {
          console.log("Default posts added successfully.");
        }
        res.redirect("/");
      });
    } else {
      res.render("home", {
        homeStartingContent: homeStartingContent,
        posts: posts,
      });
    }
  });
});

app.get("/about", function(req, res) {
  res.render("about", {
    aboutContent: aboutContent
  });
});

app.get("/contact", function(req, res) {
  res.render("contact");
});


app.get("/compose", function(req, res) {
  res.render("compose");
});

app.get("/posts/:postName", function(req, res) {

  const requestedTitle = _.kebabCase(req.params.postName);

  Post.findOne({url: requestedTitle}, function(err, foundPost){
    if(err){
      console.log(err);
    } else {
      if(foundPost){
        res.render("post",{
          post: foundPost,
        });
      } else {
        console.log("Didn't find a post with title: " + requestedTitle);
        res.redirect("/");
      }
    }
  });
});

app.post("/", function(req, res) {

  postTitle = req.body.postTitle,
  postBody = req.body.postBody

  newPost = new Post({
    url: _.kebabCase(postTitle),
    title: postTitle,
    body: postBody,
  });

  newPost.save(function(err, result){
    res.redirect("/");
  })


});





app.listen(process.env.PORT || 3000, function() {
  console.log("Server started on port 3000");
});
