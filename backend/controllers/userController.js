const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const createUserToken = require("../helpers/create-user-token");
const getToken = require("../helpers/get-token");
const getUserByToken = require("../helpers/get-user-by-token");

module.exports = class userController {
  static async register(req, res) {
    const { name, email, phone, password, confirmpassword } = req.body;

    if (!name) {
      res.status(422).json({ message: "O campo nome é obrigatorio!" });
      return;
    }

    if (!email) {
      res.status(422).json({ message: "O campo email é obrigatorio!" });
      return;
    }

    if (!phone) {
      res.status(422).json({ message: "O campo telefone é obrigatorio!" });
      return;
    }

    if (!password) {
      res.status(422).json({ message: "O campo senha é obrigatorio!" });
      return;
    }
    if (!confirmpassword) {
      res
        .status(422)
        .json({ message: "O campo de confirmação de senha é obrigatorio!" });
      return;
    }

    if (password !== confirmpassword) {
      res.status(422).json({ message: "As senhas não coincidem!" });
      return;
    }

    const usercheck = await User.findOne({ email: email });

    if (usercheck) {
      res
        .status(422)
        .json({ message: "este email já esta em uso por outro usuario!" });
      return;
    }

    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = new User({
      name,
      email,
      phone,
      password: passwordHash,
    });

    try {
      const newUser = await user.save();
      await createUserToken(newUser, req, res);
    } catch (error) {
      res.status(500).json({ message: error });
    }
  }

  static async login(req, res) {
    const { email, password } = req.body;

    if (!email) {
      res.status(422).json({ message: "O campo email é obrigatorio!" });
      return;
    }

    if (!password) {
      res.status(422).json({ message: "O campo senha é obrigatorio!" });
      return;
    }

    const user = await User.findOne({ email: email });

    if (!user) {
      res.status(422).json({ message: "Não existe uma conta com esse email!" });
      return;
    }

    const checkpassword = await bcrypt.compare(password, user.password);

    if (!checkpassword) {
      res.status(422).json({ message: "A senha está incorreta!" });
      return;
    }

    await createUserToken(user, req, res);
  }

  static async checkUser(req, res) {
    let currentUser;

    if (req.headers.authorization) {
      const token = getToken(req);
      const decoded = jwt.verify(token, "secret");

      currentUser = await User.findById(decoded.id);

      currentUser.password = undefined;
    } else {
      currentUser = null;
    }

    res.status(200).json(currentUser);
  }

  static async getUserById(req, res) {
    const id = req.params.id;

    const user = await User.findById(id).select("-password");

    if (!user) {
      res.status(422).json({ message: "Usuario não existe !" });
      return;
    }

    res.status(200).json({ user });
  }

  static async editUser(req, res) {
    const id = req.params.id;

    const token = getToken(req);
    const user = await getUserByToken(token);

    const { name, email, phone, password, confirmpassword } = req.body;

    if (req.file) {
      user.img = req.file.filename;
    }

    if (!name) {
      res.status(422).json({ message: "O campo nome é obrigatorio!" });
      return;
    }

    user.name = name;

    if (!email) {
      res.status(422).json({ message: "O campo email é obrigatorio!" });
      return;
    }

    const userExist = await User.findOne({ email: email });

    if (user.email !== email && userExist) {
      res.status(422).json({ message: "Usuario não encontrado !" });
      return;
    }

    user.email = email;

    if (!phone) {
      res.status(422).json({ message: "O campo telefone é obrigatorio!" });
      return;
    }

    user.phone = phone;

    if (password != confirmpassword) {
      res.status(422).json({ message: "as senhas não coincidem" });
      return;
    } else if (password === confirmpassword && password != null) {
      const salt = await bcrypt.genSalt(12);
      const passwordHash = await bcrypt.hash(password, salt);

      user.password = passwordHash;
    }

    try {
      const updateUser = await User.findByIdAndUpdate(
        { _id: user._id },
        { $set: user },
        { new: true }
      );

      res.status(200).json({ message: "usuario atualizado com sucesso!" });
    } catch (err) {
      res.status(500).json({ message: err });
    }
  }
};
