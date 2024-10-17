import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    name: string;
    first_name: string;
    phone_number: string;
    role: string;
  }
  interface Session {
    user: User & {
      name: string;
      first_name: string;
      phone_number: string;
      role: string;
    };
    token: {
      name: string;
      first_name: string;
      phone_number: string;
      role: string;
    };
  }
}
