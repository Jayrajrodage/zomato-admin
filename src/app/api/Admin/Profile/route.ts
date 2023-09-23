import { connect } from "@/dbconfig/dbconfig";
import Admin from "@/models/AdminModel";
import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
//connect db
connect();

export async function GET(request: NextRequest) {
  try {
    const headersList = headers();
    const Restaurantemail = headersList.get("Email");
    console.log(Restaurantemail);
    const admin = await Admin.findOne({ Restaurantemail });
    if (!admin) {
      // Handle the case where admin is not found
      return NextResponse.json({
        error: "Please Create Profile",
        success: false,
      });
    }
    console.log(admin.RestaurantName);
    // You can now use the 'admin' object to create your response
    return NextResponse.json({
      message: "User data retrieved successfully",
      user: {
        RestaurantName: admin.RestaurantName,
        RestaurantType: admin.RestaurantType,
        Restaurantemail: admin.Restaurantemail,
        Restaurantphone: admin.Restaurantphone,
        Restaurantaddress: admin.Restaurantaddress,
        RestaurantImage: admin.RestaurantImage,
        // Add other user data here if needed
      },
      success: true,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
