const ensureAuthenticated = require('../middleware/Auth');

const router = require('express').Router();

router.get('/',ensureAuthenticated,(req,res)=>{
    console.log('----loogrd in user details ----',req.user)
    res.status(200).json([
        {name:'Mobile',
            price:567577
        },
        {
            name:'smartphone',
            price:766688,
        }
    ])
});

module.exports= router;