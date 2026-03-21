import { TRPCError } from "@trpc/server";
import { db } from "@/lib/prisma";

type DatabaseClient = typeof db;

export async function requireOrganizationAccess(
  db: DatabaseClient,
  organizationSlug: string,
  userId: string,
) {
  const org = await db.organization.findUnique({
    where: {
      slug: organizationSlug,
    },
    select: {
      id: true,
    },
  });

  if (!org) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Organization not found.",
    });
  }

  const membership = await db.member.findFirst({
    where: {
      organizationId: org.id,
      userId,
    },
    select: {
      id: true,
      organizationId: true,
      role: true,
    },
  });

  if (!membership) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "You do not have access to this organization.",
    });
  }

  return membership;
}

export async function requireProjectAccess(
  database: DatabaseClient,
  projectId: string,
  userId: string,
) {
  const project = await database.project.findFirst({
    where: {
      id: projectId,
      organization: {
        members: {
          some: { userId },
        },
      },
    },
    select: {
      id: true,
      name: true,
      organizationId: true,
    },
  });

  if (!project) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "You do not have access to this project.",
    });
  }

  return project;
}

export async function requireApiKeyAccess(
  database: DatabaseClient,
  apiKeyId: string,
  userId: string,
) {
  const apiKey = await database.apiKey.findFirst({
    where: {
      id: apiKeyId,
      project: {
        organization: {
          members: {
            some: { userId },
          },
        },
      },
    },
    select: {
      id: true,
      projectId: true,
      keyPrefix: true,
      name: true,
    },
  });

  if (!apiKey) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "You do not have access to this API key.",
    });
  }

  return apiKey;
}
