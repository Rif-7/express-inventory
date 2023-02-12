const Item = require("../models/item");

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
