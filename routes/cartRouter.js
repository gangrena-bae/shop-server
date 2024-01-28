const Router = require("express");
const router = new Router();
const cartController = require("../controllers/cartController");

router.post('/', cartController.create)

module.exports = router;