import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import bcrypt from "bcryptjs"

// In-memory user store (replace with database in production)
const users: Array<{
  id: string
  email: string
  name: string
  password: string
  image?: string
}> = []

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required")
        }

        // Find user
        const user = users.find((u) => u.email === credentials.email)

        if (!user) {
          throw new Error("No user found with this email")
        }

        // Verify password
        const isValid = await bcrypt.compare(credentials.password, user.password)

        if (!isValid) {
          throw new Error("Invalid password")
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/auth/login",
    signOut: "/auth/login",
    error: "/auth/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
      }
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET || "your-secret-key-change-in-production",
}

// Helper function to register a new user
export async function registerUser(email: string, password: string, name: string) {
  // Check if user exists
  const existingUser = users.find((u) => u.email === email)
  if (existingUser) {
    throw new Error("User already exists")
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 12)

  // Create user
  const newUser = {
    id: crypto.randomUUID(),
    email,
    name,
    password: hashedPassword,
  }

  users.push(newUser)

  return {
    id: newUser.id,
    email: newUser.email,
    name: newUser.name,
  }
}
