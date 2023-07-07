const express = require("express");
const mongoose = require("mongoose")
const ejs = require("ejs")
const bodyParser = require("body-parser");

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

const article = new Article({
    title: "title",
    content: "content"
});

// article.save()
// .then(()=>{
//     console.log("Article is successfully added");
// });

app.get("/articles", function(req, res){
    Article.find({})
    .then((articles)=>{
        res.send(articles);
    })
    .catch((err)=>{
        res.send("Not found");
    });
});


app.listen(3000, function(req, res){
    console.log("Server is running on port 3000.");
});