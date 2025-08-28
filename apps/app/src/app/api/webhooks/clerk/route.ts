import { Webhook } from "svix";
import { WebhookEvent } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import { prisma } from "@myapp/prisma";
import { assert, cuid2, isEmptyStringOrNil } from "@myapp/utils";

export async function POST(req: Request) {
  const secret = process.env.CLERK_WEBHOOK_SIGNING_SECRET;
  if (isEmptyStringOrNil(secret)) {
    return new Response("Missing secret", { status: 500 });
  }

  const wh = new Webhook(secret);
  const body = await req.text();
  const headerPayload = await headers();

  const event = wh.verify(body, {
    "svix-id": headerPayload.get("svix-id")!,
    "svix-timestamp": headerPayload.get("svix-timestamp")!,
    "svix-signature": headerPayload.get("svix-signature")!,
  }) as WebhookEvent;

  if (event.type === "user.created") {
    const { id: clerkId, username, email_addresses, organization_memberships } = event.data;
    const firstEmailAddress = email_addresses[0]?.email_address;

    assert(!isEmptyStringOrNil(username), "username is required");
    assert(!isEmptyStringOrNil(firstEmailAddress), "email is required");

    if (await prisma.user.findUnique({ where: { clerkId } })) {
      return new Response("User already exists", { status: 200 });
    }

    // Check if user belongs to an organization
    const firstOrgMembership = organization_memberships?.[0];
    let organizationId: string | null = null;
    
    if (firstOrgMembership) {
      // Find or create organization
      const org = await prisma.organization.findUnique({
        where: { clerkOrgId: firstOrgMembership.organization.id },
      });
      
      if (org) {
        organizationId = org.id;
      }
    }

    const user = await prisma.user.create({
      data: {
        id: `usr_${cuid2()}`,
        clerkId,
        username,
        email: firstEmailAddress,
        organizationId,
        role: organizationId ? "MEMBER" : "VIEWER", // Default role
      },
    });
  } else if (event.type === "user.deleted") {
    const { id } = event.data;
    // TODO: soft delete
    await prisma.user.delete({ where: { clerkId: id } });
  } else if (event.type === "organizationMembership.created") {
    const { organization, public_user_data } = event.data;
    
    // Find the user
    const user = await prisma.user.findUnique({
      where: { clerkId: public_user_data.user_id },
    });
    
    if (user) {
      // Find or create organization
      let org = await prisma.organization.findUnique({
        where: { clerkOrgId: organization.id },
      });
      
      if (!org) {
        org = await prisma.organization.create({
          data: {
            id: `org_${cuid2()}`,
            clerkOrgId: organization.id,
            name: organization.name,
            slug: organization.slug,
          },
        });
      }
      
      // Update user's organization
      await prisma.user.update({
        where: { id: user.id },
        data: {
          organizationId: org.id,
          role: user.organizationId ? "MEMBER" : "ADMIN", // First member becomes admin
        },
      });
    }
  } else if (event.type === "organization.created") {
    const { id: clerkOrgId, name, slug } = event.data;
    
    // Create organization in database
    const existing = await prisma.organization.findUnique({
      where: { clerkOrgId },
    });
    
    if (!existing) {
      await prisma.organization.create({
        data: {
          id: `org_${cuid2()}`,
          clerkOrgId,
          name,
          slug,
        },
      });
    }
  } else if (event.type === "organization.updated") {
    const { id: clerkOrgId, name, slug } = event.data;
    
    // Update organization in database
    await prisma.organization.update({
      where: { clerkOrgId },
      data: { name, slug },
    });
  } else if (event.type === "organization.deleted") {
    const { id: clerkOrgId } = event.data;
    
    // Delete organization and remove users' association
    const org = await prisma.organization.findUnique({
      where: { clerkOrgId },
    });
    
    if (org) {
      // Remove organization from users
      await prisma.user.updateMany({
        where: { organizationId: org.id },
        data: { organizationId: null, role: "VIEWER" },
      });
      
      // Delete organization
      await prisma.organization.delete({
        where: { id: org.id },
      });
    }
  }

  return new Response("OK");
}
