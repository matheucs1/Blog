const express = require("express");
const app = express();
const connection = require("./database/database")
const bodyParser = require("body-parser");
const session = require("express-session");

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

const categoriesController = require("./categories/CategoriesController");
const articlesController = require("./articles/articlesController");
const usersController = require("./users/UsersController");

//models
const Article = require("./articles/Article");
const Category = require("./categories/Category");
const User = require("./users/User");


// View engine = Pagina html com ejs
app.set("view engine", "ejs");

// Session
app.use(session({
    secret: "algumacoisaqualquer", cookie: {maxAge: 3000000}
}));


//Static = arquivos de imagens, css, javascript do frontend
app.use(express.static("public"));


//Database connection
connection.authenticate()
    .then(() => {
        console.log('Conexão feita com sucesso!')
    }).catch((error) => {
        console.log(error);
    });


// Controllers do app
app.use("/", categoriesController);
app.use("/", articlesController);
app.use("/", usersController);




app.get("/", (req, res) => {
    Article.findAll({
        order: [
            ["id", "DESC"]
        ],
        limit: 4
    }).then(articles => {
        Category.findAll().then(categories => {
            res.render("index", {articles: articles, categories: categories});
        });
    });
});

app.get("/:slug", (req, res) => {
    var slug = req.params.slug;
    Article.findOne({
        where: {
            slug: slug,
        }
    }).then(article => {
        if(article != undefined){
            Category.findAll().the(categories => {
                res.render("article", {article: article, categories: categories});
            });
        }else {
            res.redirect("/")
        }
    }).catch( err => {
        res.redirect("/");
    });
})

app.get("/category/:slug", (req, res)=> {
    var slug = req.params.slug;
    Category.findOne({
        where: {
            slug: slug
        },
        // join
        include: [{model: Article}]
    }).then( category => {
        if(category != undefined){

            Category.findAll().then(categories => {
                res.render("index", {articles: category.articles, categories: categories});
            })

        }else {
            res.redirect("/")
        }
    }).catch( err => {
        res. redirect("/")
    })
})

app.listen(8080, () => {
    console.log('Servidor iniciado');
    console.log("http://localhost:8080")
});