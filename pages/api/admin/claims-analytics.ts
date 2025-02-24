import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const claims: { month: number; count: number }[] = await prisma.$queryRawUnsafe(`
      SELECT MONTH(createdAt) AS month, COUNT(*) AS count
      FROM claim
      GROUP BY month
      ORDER BY month;
    `);

    console.log("API claims Data:", JSON.stringify(claims, null, 2)); // Debugging output

    res.setHeader("Content-Type", "application/json"); // ✅ Ensure JSON response
    res.status(200).json(claims);
  } catch (error: unknown) {
    console.error("Error fetching claims analytics:", error);

    let errorMessage = "Internal Server Error";
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    res.status(500).json({ message: errorMessage });
  }
}
