const Categorie = require("../models/categorie");
const Item = require("../models/item");
const { body, validationResult } = require("express-validator");

exports.index = async (req, res, next) => {
  try {
    const item_list = await Item.find()
      .populate("categorie")
      .sort({ name: 1, categorie: 1 })
      .exec();

    return res.render("index", { title: "Inventory", item_list: item_list });
  } catch (err) {
    return next(err);
  }
};

exports.categorie_list = async (req, res, next) => {
  try {
    const categorie_list = await Categorie.find().sort({ name: 1 }).exec();
    return res.render("categorie_list", {
      title: "Categories",
      categorie_list: categorie_list,
    });
  } catch (err) {
    return next(err);
  }
};

exports.item_list_by_categorie = async (req, res, next) => {
  try {
    const categorie = await Categorie.findById(req.params.id).exec();
    if (categorie == null) {
      const err = new Error("Categorie Not Found");
      err.status = 404;
      return next(err);
    }
    const item_list = await Item.find({ categorie: categorie })
      .populate("categorie")
      .sort({ name: 1 })
      .exec();
    return res.render("categorie_items", {
      title: categorie.name,
      item_list: item_list,
    });
  } catch (err) {
    return next(err);
  }
};

exports.categorie_create_get = (req, res, next) => {
  return res.render("categorie_form", { title: "Create Categorie" });
};

exports.categorie_create_post = [
  body("name")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Categorie name must be specified"),
  async (req, res, next) => {
    const categorie = new Categorie({
      name: req.body.name,
    });

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.render("categorie_form", {
        title: "Create Categorie",
        errors: errors.array(),
        categorie: categorie,
      });
    }

    const duplicate = await Categorie.findOne({ name: req.body.name }).exec();
    if (duplicate) {
      return res.redirect(duplicate.url);
    }

    categorie.save((err) => {
      if (err) {
        return next(err);
      }
      return res.redirect(categorie.url);
    });
  },
];
