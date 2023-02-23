const express = require("express");
const router = express.Router();

const categorie_controller = require("../controllers/categoriesController");
const item_controller = require("../controllers/itemController");

router.get("/", categorie_controller.index);

router.get("/categories", categorie_controller.categorie_list);

router.get("/categorie/create", categorie_controller.categorie_create_get);

router.post("/categorie/create", categorie_controller.categorie_create_post);

router.get("/categorie/:id", categorie_controller.item_list_by_categorie);

router.get("/items", item_controller.item_list);

router.get("/item/create", item_controller.item_create_get);

router.post("/item/create", item_controller.item_create_post);

module.exports = router;
