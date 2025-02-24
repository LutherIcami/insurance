import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../prisma/prismaClient'; // Adjust the path based on your structure

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      // Fetch all users from the database
      const users = await prisma.user.findMany();
      res.status(200).json(users); // Return users as a JSON response
    } catch {
      res.status(500).json({ error: 'Failed to fetch users' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' }); // Handle other methods like POST, PUT, etc.
  }
}
