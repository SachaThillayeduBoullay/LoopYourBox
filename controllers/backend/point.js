const Point = require("../../models/point");

exports.getOneUserPoint = (req, res, next) => {
    Point.findOne({ userId: req.params.id })
    .then((point) => res.status(200).json(point))
    .catch((error) => res.status(404).render('pages/error',{ error: `Points introuvables`}));
};

exports.updateOneUserPoint = (req, res, next) => {
    Point.findOne({ userId: req.params.userId })
    .then((point) => {
        let {credit, loyaltyPoint, environmentalImpact} = point;
        
        //credit calculations
        req.body.credit != "" &&  (credit += parseInt(req.body.credit));
        req.body.loyaltyPoint != "" &&  (loyaltyPoint += parseInt(req.body.loyaltyPoint));
        req.body.environmentalImpact != "" &&  (environmentalImpact = parseFloat(environmentalImpact) + parseFloat(req.body.environmentalImpact));

        Point.updateOne({ userId: req.params.userId },{credit, loyaltyPoint, environmentalImpact})
        .then(() => {
          res.status(200).redirect(`/point`);
        })
        .catch(() => res.status(404).render('pages/error',{ error: `Les points n'ont pas pu être modifiés`}));
    })
    .catch(() => res.status(400).render('pages/error',{ error: `Les points n'ont pas pu être trouvés`} ));
  };