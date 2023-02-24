const Item = require("../models/item");
const Categorie = require("../models/categorie");
const { body, validationResult } = require("express-validator");

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

exports.item_create_post = [
  body("name")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Item name must be specified")
    .escape(),
  body("description")
    .trim()
    .isLength({ min: 3, max: 250 })
    .withMessage(
      "Item description is required and should have 3-250 characters"
    )
    .escape(),
  body("price", "Price must be specified").toInt(),
  body("stock", "Invalid stock").optional({ checkFalsy: true }).toInt(),
  async (req, res, next) => {
    const errors = validationResult(req);

    const item = new Item({
      name: req.body.name,
      price: req.body.price,
      stock: req.body.stock,
      description: req.body.description,
      categorie: req.body.categorie,
    });

    if (!errors.isEmpty()) {
      const categories_list = await Categorie.find().sort({ name: 1 }).exec();
      res.render("item_form", {
        title: "Create Item",
        categories_list: categories_list,
        item: item,
        errors: errors.array(),
      });
    }

    try {
      await item.save();
      return res.redirect("/catalog");
    } catch (err) {
      return next(err);
    }
  },
];
