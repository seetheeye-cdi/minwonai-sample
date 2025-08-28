import { PrismaClient } from "../packages/prisma/generated/prisma";
import dotenv from "dotenv";
import path from "path";

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

const prisma = new PrismaClient();

async function createDefaultOrganization() {
  try {
    // Check if default organization exists
    const existingOrg = await prisma.organization.findUnique({
      where: { id: "org_default_community" },
    });

    if (existingOrg) {
      console.log("Default organization already exists");
      return;
    }

    // Create default organization for community
    const org = await prisma.organization.create({
      data: {
        id: "org_default_community",
        clerkOrgId: "org_default_community", // Dummy value since we're not using Clerk
        name: "Community Organization",
        slug: "community",
        description: "Default organization for community submissions",
        settings: {
          allowPublicSubmissions: true,
          defaultCategory: "general",
        },
      },
    });

    console.log("Default organization created:", org);
  } catch (error) {
    console.error("Error creating default organization:", error);
  } finally {
    await prisma.$disconnect();
  }
}

createDefaultOrganization();
