import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (req.method === "GET") {
    try {
      const claims = await prisma.claim.findMany({
        where: { userId:parseInt(session.user.id) },
        select: {
          id: true,
          policyId: true,
          description: true,
          status: true,
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
      });

      return res.status(200).json(claims);
    } catch (error) {
        console.error("Failed to fetch claims:", error); //  Use the error to avoid ESLint warning
        return res.status(500).json({ message: "Failed to fetch claims" });
      }
  } else if (req.method === "POST") {
    try {
      const { policyId, description } = req.body;

      if (!policyId || !description) {
        return res.status(400).json({ message: "Missing fields" });
      }

      const newClaim = await prisma.claim.create({
        data: {
          userId: Number(session.user.id),
          policyId,
          description,
          status: "PENDING",
        },
      });

      return res.status(201).json(newClaim);
    } catch (error) {
        console.error("Failed to submit claim:", error); //  Log error
        return res.status(500).json({ message: "Failed to submit claim" });
      }
  }

  res.status(405).json({ message: "Method Not Allowed" });
}
