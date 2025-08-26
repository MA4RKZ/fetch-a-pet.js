const chalk = require("chalk");
const Mongoose = require("mongoose");

async function main() {
  await Mongoose.connect("mongodb://localhost:27017/findafriend");
  console.log(chalk.greenBright("Conectou mongodb com Mongoose"));
}

main().catch((error) => {
  console.log(error);
});

module.exports = Mongoose;
