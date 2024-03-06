const Router = require("express");
const router = new Router();
const brandController = require("../controllers/brandCntroller");
const checkRole = require("../middleware/checkRoleMiddleware");

router.post("/", brandController.create);
router.get("/", brandController.getAll);
router.delete("/:id", checkRole("ADMIN"), brandController.delete);

module.exports = router;
