import { connect } from "@/dbconfig/dbconfig";
import Admin from "@/models/AdminModel";
import { NextRequest, NextResponse } from "next/server";

import { z } from "zod";
//Connect DB
connect();

//Inpunt validation useing Zod
const EditupSchema = z.object({
  RestaurantName: z
    .string()
    .max(30, { message: "Restaurant Name must be less than 30 characters" }),
  RestaurantType: z.string().max(30, {
    message: "Restaurant Type Name must be less than 30 characters",
  }),
  Restaurantemail: z
    .string()
    .email()
    .max(50, { message: "Email must be less than 50 characters" }),
  Restaurantphone: z
    .string()
    .max(30, { message: "Restaurant Name must be less than 30 characters" }),
  Restaurantaddress: z
    .string()
    .max(100, { message: "address must be less than 100 characters" }),
  RestaurantImage: z
    .string()
    .max(300, { message: "Restaurant Image must be less than 300 characters" }),
});

//Edit profile Information
export async function POST(request: NextRequest) {
  try {
    //Input validation by zod
    const reqdata = await request.json();
    console.log(reqdata);
    const parsedlnput: any = EditupSchema.safeParse(reqdata);
    if (!parsedlnput.success) {
      const errormessages = parsedlnput.error.issues.map(
        (obj: { message: string }) => obj.message
      );
      return NextResponse.json({
        error: errormessages,
        success: false,
        status: 400,
      });
    }
    console.log(parsedlnput.data);
    const {
      RestaurantName,
      RestaurantType,
      Restaurantemail,
      Restaurantphone,
      Restaurantaddress,
      RestaurantImage,
    } = parsedlnput.data;

    // For example, if you want to fetch user data based on the email
    const admin = await Admin.findOne({ Restaurantemail });
    if (admin) {
      return NextResponse.json({
        error: "Restaurant already exists",
        success: false,
        status: 400,
      });
    }

    const newRestaurant = new Admin({
      RestaurantName: RestaurantName,
      RestaurantType: RestaurantType,
      Restaurantemail: Restaurantemail,
      Restaurantphone: Restaurantphone,
      Restaurantaddress: Restaurantaddress,
      RestaurantImage: RestaurantImage,
    });

    const savedRestaurant = await newRestaurant.save();
    console.log(savedRestaurant);

    return NextResponse.json({
      message: "Restaurant Profile created successfully",
      success: true,
      savedRestaurant,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
