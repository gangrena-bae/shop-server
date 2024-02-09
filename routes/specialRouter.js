const Router = require("express");
const router = new Router();
const specialController = require("../controllers/specialController");

router.post("/", specialController.create);

module.exports = router;
