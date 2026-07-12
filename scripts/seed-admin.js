const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const email = "admin@cinevault.com";
  const password = "admin";
  
  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  console.log("Upserting admin user...");

  const admin = await prisma.user.upsert({
    where: { email },
    update: {
      password: hashedPassword,
      role: "ADMIN"
    },
    create: {
      email,
      name: "Admin User",
      password: hashedPassword,
      role: "ADMIN"
    }
  });

  console.log("Admin user created/updated successfully.");
  console.log(`Email: ${admin.email}`);
  console.log(`Password: ${password}`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
