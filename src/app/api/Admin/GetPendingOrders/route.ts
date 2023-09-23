import { connect } from "@/dbconfig/dbconfig";
import Food from "@/models/Food";
import order from "@/models/OrderModel";
import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import Admin from "@/models/AdminModel";

//Connect DB
connect();
export async function GET(request: NextRequest) {
  try {
    const headersList = headers();
    const Email = headersList.get("Email");
    console.log(Email);
    const Restaurant: any = await Admin.find({ Restaurantemail: Email });
    if (!Restaurant) {
      return NextResponse.json({
        error: "No recent orders found",
        status: 400,
        success: false,
      });
    }

    const Orders = await order.find({ Restaurant: Restaurant[0]._id });
    console.log(Orders);
    return NextResponse.json({
      message: "Orders found ",
      success: true,
      status: 200,
      Orders,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const orderId = body?.id;
    const Status = body?.Status;
    console.log("Response:", orderId, Status);
    const response = await order.findByIdAndUpdate(
      orderId,
      {
        status: Status,
      },
      { new: true }
    );

    console.log("Response:", response);

    if (!response) {
      return NextResponse.json({
        message: "Order not found",
        success: false,
        status: 404,
      });
    }

    return NextResponse.json({
      message: "Status updated",
      success: true,
      status: 200,
      response,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
