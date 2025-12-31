import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import { User } from "@/lib/db/models";

export async function GET() {
  try {
    await connectDB();
    const userCount = await User.countDocuments();
    
    return NextResponse.json({
      success: true,
      message: "Database connected",
      userCount,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

