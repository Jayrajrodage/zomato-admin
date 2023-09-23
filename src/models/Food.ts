import mongoose from "mongoose";

const FoodSchema = new mongoose.Schema(
  {
    vegorNonveg: {
      type: String,
      required: true,
      unique: false,
    },
    FoodType: {
      type: String,
      required: true,
      unique: false,
    },
    FoodName: {
      type: String,
      required: true,
      unique: false,
    },
    FoodPrice: {
      type: Number,
      required: true,
      unique: false,
    },
    FoodImage: {
      type: String,
      required: true,
    },
    Restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "admins", // This should match the model name in mongoose.model
    },
  },
  { timestamps: true }
);

const Food = mongoose.models.foods || mongoose.model("foods", FoodSchema);

export default Food;
