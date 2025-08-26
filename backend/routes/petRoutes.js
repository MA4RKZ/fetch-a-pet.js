const express = require("express");
const router = express.Router();
const petController = require("../controllers/petController");

const verifyToken = require("../helpers/verify-token");
const { imageUpload } = require("../helpers/image-upload");

router.post(
  "/create",
  verifyToken,
  imageUpload.array("img"),
  petController.create
);
router.get("/", petController.getAll);
router.get("/mypets", verifyToken, petController.getAllUserPets);
router.get("/myadoptions", verifyToken, petController.getAllUserAdoptions);

module.exports = router;
