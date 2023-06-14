const express = require("express");
const router = express.Router();
const Category = require("./Category")
const slugify = require("slugify");

router.get("/admin/categories/new", (req, res) => {
    res.render("admin/categories/new")
});

// Create a new Category
router.post("/categories/save", (req, res) => {
    var title = req.body.title;
    if (title != undefined) {

        Category.create({
            title: title,
            slug: slugify(title)
        }).then(() => {
            res.redirect("/admin/categories");
        })

    } else {
        res.redirect("/admin/categories/new");
    }
});


// Ler a Category
router.get("/admin/categories", (req, res) => {

    Category.findAll().then((categories) => {
        res.render("admin/categories/index", { categories: categories });
    });
})


// Deletar Category
router.post("/categories/delete", (req, res) => {
    var id = req.body.id;
    if (id != undefined) {
        if (!isNaN(id)) {

            Category.destroy({
                where: {
                    id: id
                }
            }).then(() => {
                res.redirect("/admin/categories");
            });
        } else {// NÃO FOR UM NÚMERO
            res.redirect("/admin/categories");
        }
    } else { // NULL
        res.redirect("/admin/categories");
    }
});


// Editar Category
router.get("/admin/categories/edit/:id", (req, res) => {
    var id = req.params.id;

    Category.findByPk(id).then(category => {
        if(category != undefined){
            res.render("admin/categories/edit",{category: category});
        }else{
            res.redirect("/admin/categories");
        }
    }).catch(erro => {
        res.redirect("/admin/categories");
    })
});


// Atualizar Category
router.post("/categories/update", (req, res) => {
    var id = req.body.id;
    var title = req.body.title;

    Category.update({title: title, slug: slugify(title)},{
        where: {
            id: id
        }
    }).then(()=> {
        res.redirect("/admin/categories");
    })
})


module.exports = router;