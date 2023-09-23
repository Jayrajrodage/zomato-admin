import { connect } from "@/dbconfig/dbconfig";
import Food from "@/models/Food";
import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { z } from "zod";
import Admin from "@/models/AdminModel";
//Connect DB
connect();

//Inpunt validation useing Zod
const EditupSchema = z.object({
  vegorNonveg: z
    .string()
    .max(30, { message: "veg or Nonveg  must be less than 30 characters" }),
  FoodType: z.string().max(30, {
    message: "Food Type Type  must be less than 30 characters",
  }),
  FoodName: z
    .string()
    .max(30, { message: "Food Name must be less than 30 characters" }),
  FoodPrice: z
    .string()
    .max(30, { message: "Food Price  must be less than 30 characters" }),
  FoodImage: z
    .string()
    .max(300, { message: "Food Image url must be less than 30 characters" }),
});

//Create Food Information
export async function POST(request: NextRequest) {
  try {
    const headersList = headers();
    const Restaurantemail = headersList.get("Email");
    const admin = await Admin.findOne({ Restaurantemail });
    const id = admin._id;

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

    const { vegorNonveg, FoodType, FoodName, FoodPrice, FoodImage } =
      parsedlnput.data;
    const food = await Food.find({ Restaurant: id, FoodName: FoodName });

    if (food.length > 0) {
      return NextResponse.json({
        error: "Food already exists",
        success: false,
        status: 400,
      });
    }
    const newFood = new Food({
      vegorNonveg: vegorNonveg,
      FoodType: FoodType,
      FoodName: FoodName,
      FoodPrice: FoodPrice,
      FoodImage: FoodImage,
      Restaurant: id,
    });

    const savedFood = await newFood.save();
    console.log(savedFood);

    return NextResponse.json({
      message: "Food Item created successfully",
      success: true,
      newFood,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const headersList = headers();
    const Restaurantemail = headersList.get("Email");
    // Find the admin based on the provided email
    const admin = await Admin.findOne({ Restaurantemail });

    if (!admin) {
      return NextResponse.json({
        error: "Restaurant not found",
        status: 400,
        success: false,
      });
    }
    // Find food items associated with the admin's ObjectId
    const id = admin._id;
    console.log(id);
    const foodItems = await Food.find({ Restaurant: id }).lean();
    console.log(foodItems);
    if (!foodItems) {
      return NextResponse.json({
        error: "Not found any Food",
        success: false,
        status: 400,
      });
    }
    return NextResponse.json({
      message: "found Food",
      success: true,
      status: 200,
      foodItems,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
