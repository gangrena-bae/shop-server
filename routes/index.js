const Router = require("express");
const router = new Router();
const deviceRouter = require("./deviceRouter");
const userRouter = require("./userRouter");
const brandRouter = require("./brandRouter");
const typeRouter = require("./typeRouter");
const cartRouter = require("./cartRouter");
const specialRouter = require("./specialRouter");
// const searchRouter = require("./searchRouter");

router.use("/user", userRouter);
router.use("/type", typeRouter);
router.use("/brand", brandRouter);
router.use("/device", deviceRouter);
router.use("/cart", cartRouter);
router.use("/special", specialRouter);
// router.use("/search", searchRouter);

module.exports = router;
