import { connect } from "@/dbconfig/dbconfig";
import Food from "@/models/Food";
import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { z } from "zod";
import Admin from "@/models/AdminModel";
import { NextApiRequest } from "next";
//Connect DB
connect();
export async function GET(request: NextRequest) {
  try {
    const headersList = headers();
    const Restaurantemail = headersList.get("Email");
    const foodType = headersList.get("foodType");
    const foodSearch = headersList.get("Search");
    if (!foodSearch) {
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

      const foodItems = await Food.find({
        Restaurant: id,
        FoodType: foodType,
      }).lean();

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
    }
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

    const foodItems = await Food.find({
      Restaurant: id,
      FoodType: foodType,
      $text: { $search: foodSearch },
    }).lean();

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
    // Find the admin based on the provided email
  } catch (error: any) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const headersList = headers();
    const Foodid = headersList.get("Foodid");
    const food = await Food.findByIdAndDelete({ _id: Foodid });
    return NextResponse.json({
      message: "deleted",
      success: true,
      status: 200,
      food,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}

//Inpunt validation useing Zod
const EditupSchema = z.object({
  id: z.string().max(50, { message: "id must be less than 50 characters" }),
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
    .max(30, { message: "Food Price must be less than 30 characters" }),
  FoodImage: z
    .string()
    .max(300, { message: "Food Image url must be less than 30 characters" }),
});

//Create Food Information
export async function PUT(request: NextRequest) {
  try {
    const headersList = headers();
    const Restaurantemail = headersList.get("Email");
    const admin = await Admin.findOne({ Restaurantemail });
    const restoid = admin._id;

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

    const { vegorNonveg, FoodType, FoodName, FoodPrice, FoodImage, id } =
      parsedlnput.data;

    const res = await Food.findByIdAndUpdate(id, {
      vegorNonveg: vegorNonveg,
      FoodType: FoodType,
      FoodName: FoodName,
      FoodPrice: FoodPrice,
      FoodImage: FoodImage,
      Restaurant: restoid,
    });

    return NextResponse.json({
      message: "Food Item updated successfully",
      success: true,
      res,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
