import NextAuth from "next-auth";

import { authOptions } from "@/features/useAuth";

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
