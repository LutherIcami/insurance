import { NextApiRequest, NextApiResponse } from "next";
import db from "../../lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method === "PUT") {
    const { role } = req.body;
    await db.user.update({
      where: { id: Number(id) },
      data: { role },
    });
    return res.json({ message: "Role updated successfully" });
  }

  if (req.method === "DELETE") {
    await db.user.delete({ where: { id: Number(id) } });
    return res.json({ message: "User deleted successfully" });
  }
}
