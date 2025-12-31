import "server-only";
import bcrypt from "bcryptjs";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export async function authorizeUser(credentials: unknown) {
  try {
    const parsedCredentials = loginSchema.safeParse(credentials);

    if (!parsedCredentials.success) {
      console.log("❌ Credential validation failed:", parsedCredentials.error);
      return null;
    }

    const { email, password } = parsedCredentials.data;
    console.log("🔐 Attempting login for:", email);

    // Lazy import to avoid Edge Runtime issues
    const { default: connectDB } = await import("@/lib/db/mongodb");
    await connectDB();
    console.log("✅ Database connected");
    
    // Lazy import User model to avoid Edge Runtime issues
    const { default: User } = await import("@/lib/db/models/User");
    
    // Use case-insensitive email search
    const user = await User.findOne({ 
      email: { $regex: new RegExp(`^${email}$`, "i") } 
    }).lean();

    if (!user) {
      console.log("❌ User not found for email:", email);
      return null;
    }

    console.log("✅ User found:", user.email);
    const passwordsMatch = await bcrypt.compare(password, user.password);

    if (!passwordsMatch) {
      console.log("❌ Password mismatch for user:", user.email);
      return null;
    }

    console.log("✅ Password verified for user:", user.email);

    // Return user object (without password)
    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
    };
  } catch (error) {
    console.error("❌ Authorization error:", error);
    return null;
  }
}

