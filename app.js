const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');

const app = express()

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
    extended: true
}))

app.use(express.static('public'))

mongoose.connect('mongodb://localhost:27017/wikiDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const articleSchema = {
    title: String,
    content: String
}

const Article = mongoose.model('Articles', articleSchema)

app.route('/articles').get((req, res) => {
    Article.find((err, foundArticles) => {
        if (!err) {
            res.send(foundArticles)

        } else {
            res.send(err)
        }

    })
}).post((req, res) => {

    const newArticle = new Article({ //menangkap submit data dari ejs atau html
        title: req.body.title,
        content: req.body.content
    });

    newArticle.save(err => { //callback jika berhasil / gagal
        if (!err) {
            res.send('sukses')
        } else {
            res.send(err)
        }
    })
}).delete((req, res) => {
    Article.deleteMany(err => {
        if (!err) {
            res.send('berhasil dihapus');

        } else {
            res.send(err)
        }
    })
})


///////////////////////////////// Request Targetting A Specific Article////////////////////////////////

app.route('/articles/:articleTitle')

    .get((req, res) => {
        Article.findOne({
            title: req.params.articleTitle
        }, (err, foundArticle) => {
            if (foundArticle) {
                res.send(foundArticle)
            } else {
                res.send('artikel tidak ditemukan')
            }
        });
    })
    .put((req, res) => {
        Article.update({
            title: req.params.articleTitle
        }, {
            title: req.body.title,
            content: req.body.content
        }, {
            overwrite: true
        }, function (err) {
            if (!err) {
                res.send('berhasil di update');

            }
        })
    })






app.listen(3000, function () {
    console.log("Server started on port 3000");
});