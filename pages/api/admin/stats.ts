import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const totalUsers = await prisma.user.count();
    const totalPolicies = await prisma.policy.count();
    const pendingClaims = await prisma.claim.count({
      where: { status: "PENDING" },
    });

    return res.status(200).json({ totalUsers, totalPolicies, pendingClaims });
  } catch (error: unknown) {
    console.error("Error fetching stats:", error);

    // Ensure error is an instance of Error before accessing `message`
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";

    return res.status(500).json({ message: "Internal Server Error", error: errorMessage });
  }
}
