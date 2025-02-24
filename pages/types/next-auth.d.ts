import "NextAuth" ;

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      role: "admin" | "user";
    };
  }

  interface User {
    id: string;
    name: string;
    email: string;
    role: "admin" | "user";
  }
}