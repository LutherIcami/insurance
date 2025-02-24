import { NextApiRequest, NextApiResponse } from "next";
import db from "../../lib/db"; // ✅ Corrected path

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === "GET") {
      const policies = await db.policy.findMany({
        select: {
          id: true,
          userId: true,
          policyName: true,
          coverageDetails: true,
          premium: true,
          status: true,
          createdAt: true,
        },
      });

      return res.status(200).json(policies);
    } else {
      return res.status(405).json({ message: "Method not allowed" });
    }
  } catch (error) {
    console.error("Error fetching policies:", error);

    return res.status(500).json({
      message: "Server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
