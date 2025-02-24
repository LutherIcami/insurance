import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const policies = await prisma.policy.findMany({
      select: {
        id: true,
        policyName: true,
        coverageDetails: true,
        premium: true,
        status: true,
      },
    });

    return res.status(200).json(policies);
  } catch (error: unknown) {
    const err = error as Error;
    console.error("Error fetching policies:", err);
    return res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
}
