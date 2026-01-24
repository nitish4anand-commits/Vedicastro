import { NextRequest, NextResponse } from "next/server"
import { registerUser } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, name } = body

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 }
      )
    }

    const user = await registerUser(email, password, name)

    return NextResponse.json(
      { message: "User created successfully", user },
      { status: 201 }
    )
  } catch (error) {
    const message = error instanceof Error ? error.message : "Registration failed"
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
