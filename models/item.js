const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ItemSchema = new Schema({
  name: { type: String, minLength: 1, maxLength: 100, required: true },
  price: { type: Number, min: 1, required: true },
  stock: { type: Number, default: 0 },
  description: { type: String, minLength: 3, maxLength: 250, required: true },
  categorie: { type: Schema.Types.ObjectId, ref: "Categorie", required: true },
});

ItemSchema.virtual("url").get(function () {
  return `/catalog/item/${this._id}`;
});

module.exports = mongoose.model("Item", ItemSchema);
