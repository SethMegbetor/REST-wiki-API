const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
var _ = require("lodash");

const app = express();
const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://0.0.0.0:27017/wikiDB");

// creating a schema
const articleSchema = {
  title: String,
  content: String,
};

// creating a model
const Article = mongoose.model("Article", articleSchema);

/******* creating a chain method to target all articles **********/
app
  .route("/articles")
  .get(function (req, res) {
    Article.find(function (err, foundArticles) {
      if (!err) {
        res.send(foundArticles);
      } else {
        res.send(err);
      }
    });
  })
  .post(function (req, res) {
    console.log();
    console.log();

    // save data to our database
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content,
    });
    newArticle.save(function (err) {
      if (!err) {
        res.send("Successfully added a new article");
      } else {
        res.send(err);
      }
    });
  })
  .delete(function (req, res) {
    Article.deleteMany(function (err) {
      if (!err) {
        res.send("Successfully deleted all articles");
      } else {
        res.send(err);
      }
    });
  });

/******* creating a chain method to target a specific article **********/
app
  .route("/articles/:articleTitle")
  .get(function (req, res) {
    Article.findOne(
      { title: req.params.articleTitle },
      function (err, foundArticle) {
        if (foundArticle) {
          res.send(foundArticle);
        } else {
          res.send("No articles matching that title was found ");
        }
      }
    );
  })
  .put(function (req, res) {
    Article.findOneAndUpdate(
      { title: req.params.articleTitle },
      { title: req.body.title, content: req.body.content },
      { new: true },
      function (err) {
        if (!err) {
          res.send("Successfully updated article");
        }
      }
    );
  })
  .patch(function (req, res) {
    Article.findOneAndUpdate(
      { title: req.params.articleTitle },
      { $set: req.body },
      function (err) {
        if (!err) {
          res.send("Successfully updated article.");
        } else {
          res.send(err);
        }
      }
    );
  })
  .delete(function (req, res) {
    Article.findOneAndDelete(
      { title: req.params.articleTitle },
      function (err) {
        if (!err) {
          res.send("Successfully deleted the article");
        } else {
          res.send(err)
        }
      }
    );
  });

app.listen(PORT, () => {
  console.log(`Server started. Listening on ${PORT}`);
});
