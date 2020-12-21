const UserContainer = require('../../models/userContainer');
const mongoose = require('mongoose');

exports.getOneUserContainer = (req, res, next) => {
    UserContainer.findOne({userId:req.params.id, containerId:req.params.containerId})
    .then(container => res.status(200).json(container))
    .catch(error => res.status(404).render('pages/error',{ error: `Contenant introuvable`}));
};

exports.getAllUserContainer = (req, res, next) => {
    UserContainer.aggregate(
    [
        {
            '$match': { // get userContainer where userId = req.params.id
            'userId': mongoose.Types.ObjectId(req.params.id)
            }
        }, {
            '$lookup': { //to get the info of container with the containerId same as JOIN in SQL
            'from': 'containers', 
            'localField': 'containerId', 
            'foreignField': '_id', 
            'as': 'containerInfo'
            }
        }, {
            '$project': {
            'containerInfo': 1
            }
        }, {
            '$unwind': {
            'path': '$containerInfo'
            }
        }, 
        {
            $replaceRoot:{newRoot:"$containerInfo"}}
    ]
    )

    .then(container => res.status(200).json(container))
    .catch(error => res.status(404).render('pages/error',{ error: `Contenants introuvables`}));
};


