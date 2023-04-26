const {Router} = require("express");
const {getUsers,setJoined,setLastVisit,addNewUser,increaseCounter} = require("../database");

var router = Router();






/* GET home page. */
router.get('/', async function (req, res, next) {

  let user={
    loggedIn:false
  };

  res.render('index', {title: 'Express', user: user});
});



router.post('/login', async function (req, res, next) {

    let data;
    try {
        let add = await addNewUser(req.body.name);


        data = await getUsers();
    } catch (error) {
        res.render('index', {title: 'Express', error: true})
        return;
    }




  let user={
    loggedIn:true,
    name:req.body.name
  }
  res.render('index', {title: 'Express', data: data, user: user});


});

module.exports = router;
