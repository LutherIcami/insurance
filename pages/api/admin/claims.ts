import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const claims = await prisma.claim.findMany({
        select: {
          id: true,
          userId: true,
          policyId: true,
          claimReason: true,
          claimAmount: true,
          status: true,
          createdAt: true,
          user: {
            select: {
              name: true, // Ensure "name" exists in User model
              email: true, // Optional, remove if unnecessary
            },
          },
          policy: {
            select: {
              policyName: true, // 🔹 Change to actual field name in your Policy model
            },
          },
        },
      });
  
      res.status(200).json(claims);
    } catch (error) {
      console.error("Error fetching claims:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }