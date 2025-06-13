import { PrismaClient } from "@/prisma/generated";

const globalForPrisma = global as unknown as {
    prisma: PrismaClient;
};

const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.APP_ENVIRONMENT !== "production")
    globalForPrisma.prisma = prisma;

export default prisma;
