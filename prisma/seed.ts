import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Create a user first
  const user = await prisma.user.create({
    data: {
      name: "John Doe",
      email: "johndoe@example.com",
      password: "hashedpassword123", // Ensure this is hashed in production
    },
  });

  // Now create policies referencing the created user
  await prisma.policy.createMany({
    data: [
      {
        policyName: "Health Insurance",
        coverageDetails: "Full Coverage",
        premium: 120.5,
        status: "ACTIVE",
        userId: user.id, // Link to the created user
      },
      {
        policyName: "Car Insurance",
        coverageDetails: "Collision & Liability",
        premium: 95,
        status: "ACTIVE",
        userId: user.id, // Link to the same user
      },
      {
        policyName: "Home Insurance",
        coverageDetails: "Fire & Theft",
        premium: 200,
        status: "EXPIRED",
        userId: user.id, // Link to the same user
      },
    ],
  });

  console.log("Seeding completed!");
}

// Run the seeding function
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
