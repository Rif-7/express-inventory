const Item = require("../models/item");
const Categorie = require("../models/categorie");
const { body, validationResult } = require("express-validator");

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
      return res.render("item_form", {
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

exports.item_view = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.id);
    if (item === null) {
      const error = new Error("Item not found");
      error.status = 404;
      return next(err);
    }

    return res.render("item_view", { title: "Item", item: item });
  } catch (err) {
    return next(err);
  }
};

exports.item_update_get = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.id).exec();
    if (item == null) {
      const error = new Error("Item not found");
      error.status = 404;
      return next(err);
    }

    const categories_list = await Categorie.find().sort({ name: 1 }).exec();

    return res.render("item_form", {
      title: "Update Item",
      item: item,
      categories_list: categories_list,
      askPassword: true,
    });
  } catch (err) {
    return next(err);
  }
};

exports.item_update_post = [
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
  body("password")
    .trim()
    .custom((value) => {
      if (value !== "helloworld") {
        throw new Error("Invalid Password");
      }
      return true;
    }),
  async (req, res, next) => {
    const item = new Item({
      _id: req.params.id,
      name: req.body.name,
      description: req.body.description,
      stock: req.body.stock,
      price: req.body.price,
      categorie: req.body.categorie,
    });

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const categories_list = await Categorie.find().sort({ name: 1 }).exec();
      return res.render("item_form", {
        title: "Create Item",
        categories_list: categories_list,
        item: item,
        askPassword: true,
        errors: errors.array(),
      });
    }

    try {
      await Item.findByIdAndUpdate(req.params.id, item, {}).exec();
      return res.redirect(item.url);
    } catch (err) {
      return next(err);
    }
  },
];
