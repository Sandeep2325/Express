const express = require("Express");
const bodyparser = require("body-parser");
const ejs = require("ejs");
const model = require("./model.js");
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const app = express();
app.use(cookieParser('NotSoSecret'));
app.use(session({
    secret: 'something',
    cookie: { maxAge: 60000 },
    resave: true,
    saveUninitialized: true
}));
app.use(flash());

const items = []
app.set("view engine", 'ejs');
app.use(bodyparser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.listen(3000, function () {
    console.log("server is started")
});

app.get("/", function (req, res) {
    model.blogs.find(function (err, blog) {
        if (err) {
            console.log(err)
            res.render("index.ejs", { items: items, day: [1, 2, 3, 4, 5, 6], number: 1 })
        }
        else {
            res.render("index.ejs", { items: blog, day: [1, 2, 3, 4, 5, 6], number: 1 })
        }
    })
});

app.post("/", function (req, res) {
    namee = req.body.post;
    id = req.body.id;
    desc = req.body.postdesc
    const blog1 = new model.blogs({
        blogname: namee,
        description: desc,
        author: "63afd45c77f9f45849cec42c"
    })
    blog1.save()
    res.redirect("/")
});

app.get("/about-us", function (req, res) {
    res.render("about.ejs")
})

app.get("/contact-us", function (req, res) {
    console.log('Cookies: ', req.cookies)
    console.log('Signed Cookies: ', req.signedCookies)
    res.render("contact.ejs")
})

app.post("/contact-us", function (req, res) {
    console.log(req.body)
    const contactdata = new model.contactus({
        fullname: req.body.fullname,
        phone: req.body.phone,
        email: req.body.email,
        message: req.body.message
    })
    contactdata.save()
    // const success = req.flash('Thank You, Your query is submitted');
    res.redirect("/contact-us")
});

app.get("/posts/:id", function (req, res) {
    // const object = items.find(obj => obj.id === req.params.id)
    // console.log(object)
    // console.log(req.params.id)
    // var a=  model.blogs.findOne({ _id: req.params.id }).populate('author')
    model.blogs.findOne({ _id: req.params.id }).populate('author').
        exec(function (err, blogs) {
            if (err) {
                console.log(err)
            }
            else {
                console.log(blogs.author.name);
            }
        });

    model.blogs.findOne({ _id: req.params.id }, function (err, docs) {
        if (err) {
            res.render("post.ejs")
        }
        else {
            res.render("post.ejs", { obj: docs })
        }
    });

})

app.post("/posts/:id", function (req, res) {
    model.blogs.findByIdAndUpdate(req.params.id, { blogname: req.body.post, description: req.body.postdesc }, function (err, docs) {
        if (err) {
            res.redirect("/posts/" + req.params.id)
        }
        else {
            res.redirect("/posts/" + req.params.id)
        }
    });
})

app.get("/post/delete/:id", function (req, res) {
    model.blogs.findByIdAndRemove({ _id: req.params.id }, function (err, docs) {
        if (err) {
            console.log(err);
            res.redirect("/")
        }
        else {
            console.log("Successfully Deleted")
            res.redirect("/")
        }
    });
})

app.get("/add-author", function (req, res) {
    res.render("author.ejs")
})

app.post("/add-author", function (req, res) {
    console.log(req.body)
    const authors = new model.author({
        name: req.body.name,
        posted: req.body.date
    })
    authors.save()
    res.redirect("/add-author")
}) 