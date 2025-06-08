import { NextRequest, NextResponse } from 'next/server';
import { hash } from 'bcrypt';

// In a real application, this would connect to your database
export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json();

    // Basic validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { message: 'Password must be at least 8 characters long' },
        { status: 400 }
      );
    }

    // Here you would check if the user already exists in your database
    // For this mock example, we'll pretend it doesn't exist

    // Hash the password
    const hashedPassword = await hash(password, 10);

    // In a real application, you would store the user in your database here
    // const user = await db.user.create({
    //   data: {
    //     name,
    //     email,
    //     password: hashedPassword,
    //   },
    // });

    return NextResponse.json(
      { message: 'User created successfully!' },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { message: error.message || 'An error occurred during registration' },
      { status: 500 }
    );
  }
}
