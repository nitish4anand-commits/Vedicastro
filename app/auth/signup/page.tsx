"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { signIn } from "next-auth/react"
import { Mail, Lock, User, Eye, EyeOff, Sparkles, ArrowRight, Github, Chrome, Check, Loader2, AlertCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

type SignupFormData = z.infer<typeof signupSchema>

const benefits = [
  "Unlimited Kundli generations",
  "Save and access your charts anytime",
  "Personalized daily horoscopes",
  "Exclusive premium features access",
]

export default function SignupPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema) as any,
  })

  const onSubmit = async (data: SignupFormData) => {
    setIsLoading(true)
    setError(null)

    try {
      // Register the user
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Registration failed")
      }

      // Sign in the user after successful registration
      const signInResult = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      })

      if (signInResult?.error) {
        throw new Error(signInResult.error)
      }

      router.push("/kundli/dashboard")
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl: "/kundli/dashboard" })
  }

  const handleGitHubSignIn = () => {
    signIn("github", { callbackUrl: "/kundli/dashboard" })
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl relative"
      >
        <div className="grid gap-8 lg:grid-cols-2 items-center">
          {/* Left Side - Benefits */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="hidden lg:block"
          >
            <Link href="/" className="inline-flex items-center gap-2 mb-6">
              <Sparkles className="h-8 w-8 text-purple-500" />
              <span className="text-2xl font-bold gradient-text">VedicAstro</span>
            </Link>
            <h1 className="text-3xl font-bold mb-4">
              Start Your Cosmic Journey Today
            </h1>
            <p className="text-muted-foreground mb-8">
              Create a free account and unlock the secrets of Vedic astrology. 
              Get personalized insights based on your unique birth chart.
            </p>

            <div className="space-y-4">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={benefit}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
                    <Check className="h-4 w-4 text-green-500" />
                  </div>
                  <span>{benefit}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right Side - Form */}
          <div>
            <div className="text-center mb-6 lg:hidden">
              <Link href="/" className="inline-flex items-center gap-2 mb-4">
                <Sparkles className="h-8 w-8 text-purple-500" />
                <span className="text-2xl font-bold gradient-text">VedicAstro</span>
              </Link>
            </div>

            <Card className="glass-card">
              <CardContent className="pt-6">
                <div className="text-center mb-6">
                  <h2 className="text-xl font-bold">Create Your Account</h2>
                  <p className="text-sm text-muted-foreground">Join millions of astrology enthusiasts</p>
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm mb-4"
                  >
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    {error}
                  </motion.div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  {/* Name */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        {...register("name")}
                        placeholder="Your name"
                        className="pl-10 glass"
                      />
                    </div>
                    {errors.name && (
                      <p className="text-sm text-red-500">{errors.name.message}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        {...register("email")}
                        type="email"
                        placeholder="your@email.com"
                        className="pl-10 glass"
                      />
                    </div>
                    {errors.email && (
                      <p className="text-sm text-red-500">{errors.email.message}</p>
                    )}
                  </div>

                  {/* Password */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        {...register("password")}
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="pl-10 pr-10 glass"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-sm text-red-500">{errors.password.message}</p>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Confirm Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        {...register("confirmPassword")}
                        type="password"
                        placeholder="••••••••"
                        className="pl-10 glass"
                      />
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
                    )}
                  </div>

                  {/* Terms */}
                  <p className="text-xs text-muted-foreground">
                    By signing up, you agree to our{" "}
                    <Link href="/terms" className="text-purple-500 hover:underline">Terms of Service</Link>
                    {" "}and{" "}
                    <Link href="/privacy" className="text-purple-500 hover:underline">Privacy Policy</Link>.
                  </p>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-purple-600 hover:bg-purple-700"
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Creating account...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        Create Account
                        <ArrowRight className="h-4 w-4" />
                      </span>
                    )}
                  </Button>
                </form>

                {/* Divider */}
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">Or sign up with</span>
                  </div>
                </div>

                {/* Social Signup */}
                <div className="grid grid-cols-2 gap-4">
                  <Button variant="outline" className="glass" onClick={handleGoogleSignIn} disabled={isLoading}>
                    <Chrome className="h-4 w-4 mr-2" />
                    Google
                  </Button>
                  <Button variant="outline" className="glass" onClick={handleGitHubSignIn} disabled={isLoading}>
                    <Github className="h-4 w-4 mr-2" />
                    GitHub
                  </Button>
                </div>

                {/* Login Link */}
                <p className="text-center mt-6 text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <Link href="/auth/login" className="text-purple-500 hover:underline font-medium">
                    Sign in
                  </Link>
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
