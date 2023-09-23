import mongoose from "mongoose";

const AdminSchema = new mongoose.Schema({
  RestaurantName: {
    type: String,
    required: true,
    unique: true,
  },
  RestaurantType: {
    type: String,
    required: true,
  },
  Restaurantemail: {
    type: String,
    required: true,
  },
  Restaurantphone: {
    type: Number,
    required: true,
  },
  Restaurantaddress: {
    type: String,
    required: true,
  },
  RestaurantImage: {
    type: String,
    required: true,
  },
});

const Admin = mongoose.models.admins || mongoose.model("admins", AdminSchema);

export default Admin;
