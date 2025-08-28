// Mock auth for testing without Clerk
export const MOCK_USER = {
  id: "usr_test_001",
  clerkId: "test_clerk_id",
  email: "test@civicaid.com",
  username: "testuser",
  organizationId: "org_test_001",
  role: "ADMIN" as const,
};

export const MOCK_ORGANIZATION = {
  id: "org_test_001",
  clerkOrgId: "test_clerk_org_id",
  name: "테스트 조직",
  slug: "test-org",
  description: "CivicAid 테스트용 조직",
};
