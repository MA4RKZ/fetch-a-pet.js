const Pet = require("../models/Pet");
const getToken = require("../helpers/get-token");
const getUserByToken = require("../helpers/get-user-by-token");

module.exports = class petController {
  static async create(req, res) {
    const { name, age, color, weight } = req.body;

    const img = req.files;

    const avaible = true;

    if (!name) {
      res.status(422).json({ message: "campo nome obrigatorio!" });
      return;
    }

    if (!age) {
      res.status(422).json({ message: "campo idade obrigatorio!" });
      return;
    }

    if (!color) {
      res.status(422).json({ message: "campo cor obrigatorio!" });
      return;
    }

    if (!weight) {
      res.status(422).json({ message: "campo peso obrigatorio!" });
      return;
    }

    if (img.length === 0) {
      res.status(422).json({ message: "campo imagens obrigatorio!" });
      return;
    }

    const token = getToken(req);
    const user = await getUserByToken(token);

    const pet = new Pet({
      name,
      age,
      weight,
      color,
      avaible,
      img: [],
      user: {
        _id: user._id,
        name: user.name,
        img: user.img,
        phone: user.phone,
      },
    });

    img.map((image) => {
      pet.img.push(image.filename);
    });

    try {
      const newPet = await pet.save();
      res
        .status(201)
        .json({ message: "O pet foi cadastrado com sucesso!", newPet });
    } catch (err) {
      res.status(500).json({ message: err });
    }
  }

  static async getAll(req, res) {
    const pets = await Pet.find().sort("-createdat");

    res.status(200).json({
      pets: pets,
    });
  }

  static async getAllUserPets(req, res) {
    const token = getToken(req);
    const user = await getUserByToken(token);

    const pets = await Pet.find({ "user._id": user._id }).sort("-createdat");

    res.status(200).json({ pets });
  }

  static async getAllUserAdoptions(req, res) {
    const token = getToken(req);
    const user = await getUserByToken(token);

    const pets = await Pet.find({ "adopter._id": user._id }).sort("-createdat");

    res.status(200).json({ pets });
  }
};
