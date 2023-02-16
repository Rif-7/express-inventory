const Item = require("../models/item");
const Categorie = require("../models/categorie");

exports.item_list = (req, res, next) => {
  Item.find()
    .populate("categorie")
    .sort({ name: 1, categorie: 1 })
    .exec(function (err, item_list) {
      if (err) {
        return next(err);
      }
      res.render("item_list", { title: "Items", item_list: item_list });
    });
};

exports.item_create_get = async (req, res, next) => {
  try {
    const categories_list = await Categorie.find().sort({ name: 1 }).exec();
    return res.render("item_form", {
      title: "Create Item",
      categories_list: categories_list,
    });
  } catch (err) {
    return next(err);
  }
};

exports.item_create_post = async (req, res, next) => {};
