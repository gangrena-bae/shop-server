const { Router } = require("express");
const router = Router();
const searchController = require("../controllers/SearchController");

router.get("/", searchController.searchByName);

module.exports = router;
