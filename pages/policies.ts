import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const policies = await prisma.policy.findMany();
    return res.status(200).json(policies);
  } catch (error: unknown) { // ✅ Use `unknown` instead of `any`
    let errorMessage = "Something went wrong";
    
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return res.status(500).json({ message: "Internal Server Error", error: errorMessage });
  }
}
