const express = require("express");
const router = express.Router();

const categorie_controller = require("../controllers/categoriesController");
const item_controller = require("../controllers/itemController");

router.get("/catalog", categorie_controller.index);

router.get("/catalog/categories", categorie_controller.categorie_list);

router.get(
  "/catalog/categorie/create",
  categorie_controller.categorie_create_get
);

router.post(
  "/catalog/categorie/create",
  categorie_controller.categorie_create_post
);

router.get(
  "/catalog/categorie/:id",
  categorie_controller.item_list_by_categorie
);

router.get("/catalog/items", item_controller.item_list);

router.get("/catalog/item/create", item_controller.item_create_get);

router.post("/catalog/item/create", item_controller.item_create_post);

module.exports = router;
