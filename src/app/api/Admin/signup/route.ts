import { connect } from "@/dbconfig/dbconfig";
import Admin from "@/models/AdminModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import { z } from "zod";

//Connect to database
connect();

//Inpunt validation useing Zod
const SignupSchema = z.object({
  RestaurantName: z
    .string()
    .max(30, { message: "Restaurant Name must be less than 30 characters" }),
  RestaurantType: z.string().max(30, {
    message: "Restaurant Type Name must be less than 30 characters",
  }),
  email: z
    .string()
    .email()
    .max(30, { message: "Email must be less than 30 characters" }),
  password: z
    .string()
    .min(6, { message: "Password must be Greater than 6 characters" })
    .max(20, { message: "Password must be less than 20 characters" }),
  phone: z
    .string()
    .max(16, { message: "Phone number must be less than 16 characters" }),
  address: z
    .string()
    .max(100, { message: "address must be less than 100 characters" }),
  answer: z
    .string()
    .max(100, { message: "Answer must be less than 20 characters" }),
});
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    console.log(data);
    const parsedlnput: any = SignupSchema.safeParse(data);
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
    console.log(parsedlnput);
    const {
      RestaurantName,
      RestaurantType,
      email,
      password,
      phone,
      address,
      answer,
    } = parsedlnput.data;

    //check if admin already exists
    const admin = await Admin.findOne({ email });

    if (admin) {
      return NextResponse.json({
        error: "Admin already exists",
        success: false,
        status: 400,
      });
    }

    //hash password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const newAdmin = new Admin({
      RestaurantName,
      RestaurantType,
      email,
      password: hashedPassword,
      phone,
      address,
      answer,
    });

    const savedAdmin = await newAdmin.save();
    console.log(savedAdmin);

    return NextResponse.json({
      message: "Admin created successfully",
      success: true,
      savedAdmin,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
