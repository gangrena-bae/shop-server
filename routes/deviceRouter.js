const Router = require("express");
const router = new Router();
const deviceController = require("../controllers/deviceController");

router.post("/", deviceController.create);
router.get("/", deviceController.getAll);
router.get("/:id", deviceController.getOne);
router.delete("/:id", deviceController.delete);
router.put("/updatePrice/:id", deviceController.updatePrice);
router.put("/updateInfo/:id", deviceController.updateInfo);
router.put("/updateDeviceName/:id", deviceController.updateDeviceName);
router.put(
  "/updateDeviceDescription/:id",
  deviceController.updateDeviceDescription
);
router.put("/updateImage/:id", deviceController.updateImage);
router.post(
  "/:id/updateAdditionalFiles",
  deviceController.updateAdditionalFiles
);
router.patch("/:id/brand", deviceController.updateDeviceBrand);
router.patch("/:id/type", deviceController.updateDeviceType);

module.exports = router;
