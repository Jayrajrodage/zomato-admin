import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
  buyername: {
    type: String,
    required: true,
  },
  Phone: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  Restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "admins", // This should match the model name in mongoose.model
  },
  Food: {
    type: Array,
  },
  Total: {
    type: String,
  },
  status: {
    type: String,
    default: "Processing",
    enum: ["Processing", "Shipped", "delivered", "cancel"],
  },
  CreatedAt: {
    type: Date,
    default: Date.now,
  },
});

const order = mongoose.models.orders || mongoose.model("orders", OrderSchema);

export default order;
