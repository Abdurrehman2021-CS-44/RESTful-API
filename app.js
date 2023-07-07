const express = require("express");
const mongoose = require("mongoose")
const ejs = require("ejs")
const bodyParser = require("body-parser");
const _ = require("lodash");

const app = new express();

app.use(bodyParser.urlencoded({extended: true}));

app.set('view engine', 'ejs');

app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/wikiDB")
.then(()=>{
    console.log("Database Connected");
});

const articleSchema = new mongoose.Schema({
    title: String,
    content: String
});

const Article = mongoose.model("Article", articleSchema);

///////////////////////////////////REQUEST TARGETING ALL ARTICLES///////////////////

app.route("/articles")
.get((req, res) => {
    Article.find({})
    .then((articles)=>{
        res.send(articles);
    })
    .catch((err)=>{
        res.send(err);
    });
})
.post((req, res) => {
    const title = req.body.title;
    const content = req.body.content;
    
    const article = new Article({
        title: title,
        content: content
    });

    article.save()
    .then(()=>{
        console.log("Article is successfully added.");
    })
    .catch((err)=>{
        res.send(err);
    });
})
.delete((req, res) => {
    Article.deleteMany({})
    .then(()=>{
        res.send("Successfully Deleted All.");
    })
    .catch((err)=>{
        res.send(err);
    });
});

///////////////////////////////////REQUEST TARGETING A SPECIFIC ARTICLES////////////////

app.route("/articles/:articleTitle")
.get((req, res) => {
    console.log();
    Article.findOne({title: req.params.articleTitle})
    .then((article) => {
        res.send(article)
    })
    .catch((err) => {
        res.send(err);
    })
})
.put((req, res) => {
    Article.replaceOne(
        {title: req.params.articleTitle},
        {title: req.body.title, content: req.body.content}
    )
    .then(() => {
        res.send("Successfully replaced the " + req.params.articleTitle + " article");
    })
    .catch((err) => {
        res.send(err);
    });
})
.patch((req, res) => {
    Article.updateOne(
        {title: req.params.articleTitle},
        {$set: req.body},
    )
    .then(() => {
        res.send("Successfully updated the " + req.params.articleTitle + " article");
    })
    .catch((err) => {
        res.send(err);
    });
})
.delete((req, res) => {
    Article.deleteOne({title: req.params.articleTitle})
    .then(() => {
        res.send("Successfully deleted the " + req.params.articleTitle + " article")
    })
});

app.listen(3000, function(req, res){
    console.log("Server is running on port 3000.");
});