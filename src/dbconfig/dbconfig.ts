import mongoose from "mongoose";

let isConnected = false; // Track if the connection is established

export async function connect() {
  if (isConnected) {
    console.log("Using existing MongoDB connection");
    return;
  }
  try {
    mongoose.connect(process.env.MONGODB_URI!);
    const connection = mongoose.connection;

    connection.on("connected", () => {
      console.log("MongoDB connected successfully");
    });
    isConnected = true;

    connection.on("error", (err) => {
      console.log(
        "MongoDB connection error. Please make sure MongoDB is running. " + err
      );
      process.exit();
    });
  } catch (error) {
    console.log("Something goes wrong!");
    console.log(error);
  }
}
