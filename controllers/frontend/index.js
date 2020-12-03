exports.indexPage = (req, res) => { 
        if(req.cookies["token"]) {
                res.redirect("/partner");
        } else {
                res.render('pages/index');
        }
}

exports.homePage = (req, res) => { res.render("pages/home");}