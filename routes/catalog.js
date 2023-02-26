const express = require("express");
const router = express.Router();

const categorie_controller = require("../controllers/categoriesController");
const item_controller = require("../controllers/itemController");

router.get("/", categorie_controller.index);

router.get("/categories", categorie_controller.categorie_list);

router.get("/categorie/create", categorie_controller.categorie_create_get);

router.post("/categorie/create", categorie_controller.categorie_create_post);

router.get("/categorie/:id", categorie_controller.item_list_by_categorie);

router.get("/item/create", item_controller.item_create_get);

router.post("/item/create", item_controller.item_create_post);

router.get("/item/:id", item_controller.item_view);

router.get("/item/:id/update", item_controller.item_update_get);

router.post("/item/:id/update", item_controller.item_update_post);

module.exports = router;
