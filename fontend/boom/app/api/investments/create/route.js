import { NextResponse } from "next/server";

// POST /api/investments/create
export async function POST(request) {
  try {
    const body = await request.json();
    // TODO: Save to DB or call backend service
    // Example response:
    return NextResponse.json({ success: true, data: body });
  } catch (err) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}
