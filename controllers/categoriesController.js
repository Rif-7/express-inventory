const Categorie = require("../models/categorie");
const Item = require("../models/item");
const { body, validationResult } = require("express-validator");

exports.categorie_list = (req, res, next) => {
  Categorie.find()
    .sort({ name: 1 })
    .exec(function (err, categorie_list) {
      if (err) {
        return next(err);
      }
      res.render("categorie_list", {
        title: "Categories",
        categorie_list: categorie_list,
      });
    });
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
  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.render("categorie_form", {
        title: "Create Categorie",
        errors: errors.array(),
        categorie: req.body,
      });
    }

    const categorie = new Categorie({
      name: req.body.name,
    });

    categorie.save((err) => {
      if (err) {
        return next(err);
      }
      return res.redirect(categorie.url);
    });
  },
];
