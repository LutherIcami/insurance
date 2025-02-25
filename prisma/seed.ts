import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create multiple users
  const users = [];
  for (let i = 0; i < 5; i++) {
    const user = await prisma.user.create({
      data: {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: faker.internet.password(), // In production, store hashed passwords
      },
    });
    users.push(user);
  }

  console.log("✅ Users created!");

  // Create policies linked to users
  const policies = [];
  for (const user of users) {
    const policy = await prisma.policy.create({
      data: {
        policyName: faker.helpers.arrayElement([
          "Health Insurance",
          "Car Insurance",
          "Home Insurance",
          "Travel Insurance",
        ]),
        coverageDetails: faker.lorem.words(3),
        premium: faker.finance.amount(100, 500, 2),
        status: faker.helpers.arrayElement(["ACTIVE", "EXPIRED", "PENDING"]),
        userId: user.id, // Link to user
      },
    });
    policies.push(policy);
  }

  console.log("✅ Policies created!");

  // Create claims for some policies
  for (const policy of policies) {
    await prisma.claim.create({
      data: {
        // claimNumber: faker.string.alphanumeric(10),
        description: faker.lorem.sentence(),
        amount: faker.finance.amount(500, 5000, 2),
        status: faker.helpers.arrayElement(["APPROVED", "PENDING", "DENIED"]),
        policyId: policy.id,
        claimReason: faker.lorem.words(3),
        userId: policy.userId,
      },
    });
  }

  console.log("✅ Claims added!");

  // Create payments for policies
  for (const policy of policies) {
    await prisma.payment.create({
      data: {
        amount: parseFloat(faker.finance.amount(100, 500, 2)),
        paymentDate: faker.date.past(),
        paymentMethod: faker.helpers.arrayElement(["Credit Card", "Bank Transfer", "PayPal"]),
        policyId: policy.id,
      },
    });
  }

  console.log("✅ Payments recorded!");

  // Add notifications for users
  for (const user of users) {
    await prisma.notification.create({
      data: {
        message: faker.lorem.sentence(),
        read: faker.datatype.boolean(),
        userId: user.id,
      },
    });
  }

  console.log("✅ Notifications sent!");

  console.log("🎉 Seeding completed!");
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
