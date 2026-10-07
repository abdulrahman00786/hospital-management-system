const express = require("express");

const router = express.Router();


const {

addBilling,

getBillings,

deleteBilling


}=require("../controllers/billingController");




router.post("/",addBilling);


router.get("/",getBillings);


router.delete("/:id",deleteBilling);



module.exports = router;