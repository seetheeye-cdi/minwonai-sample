// Test data seeding script for CivicAid
import { prisma } from "@myapp/prisma";
import { cuid2 } from "@myapp/utils";

async function seedTestData() {
  console.log("🌱 Starting test data seeding...");

  try {
    // 1. Create test organization if not exists
    const org = await prisma.organization.upsert({
      where: { id: "org_test_001" },
      update: {},
      create: {
        id: "org_test_001",
        clerkOrgId: "test_clerk_org_id",
        name: "테스트 시청",
        slug: "test-city",
        description: "CivicAid 테스트용 시청",
      },
    });
    console.log("✅ Organization created:", org.name);

    // 2. Create test user if not exists
    const user = await prisma.user.upsert({
      where: { id: "usr_test_001" },
      update: {},
      create: {
        id: "usr_test_001",
        clerkId: "test_clerk_id",
        email: "admin@test-city.gov",
        username: "테스트관리자",
        organizationId: org.id,
        role: "ADMIN",
      },
    });
    console.log("✅ User created:", user.email);

    // 3. Create sample tickets
    const tickets = [
      {
        id: `tkt_${cuid2()}`,
        organizationId: org.id,
        citizenName: "김민수",
        citizenPhone: "010-1234-5678",
        citizenEmail: "minsu@example.com",
        citizenAddress: "서울시 강남구 테헤란로 123",
        content: "우리 동네 공원에 쓰레기가 너무 많이 쌓여있어요. 청소를 좀 해주세요. 특히 놀이터 주변이 심각합니다.",
        category: "환경/미화",
        sentiment: "NEGATIVE" as const,
        status: "NEW" as const,
        priority: "HIGH" as const,
        slaDueAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
        aiSummary: "공원 청소 요청 - 놀이터 주변 쓰레기 문제",
        aiDraftAnswer: "안녕하세요 김민수님, 공원 청소 관련 민원을 접수했습니다. 담당 부서에서 확인 후 조치하겠습니다.",
      },
      {
        id: `tkt_${cuid2()}`,
        organizationId: org.id,
        citizenName: "이영희",
        citizenPhone: "010-9876-5432",
        citizenEmail: "younghee@example.com",
        citizenAddress: "서울시 서초구 반포대로 456",
        content: "횡단보도 신호등이 고장났습니다. 매우 위험한 상황이니 빨리 수리해주세요! 어제부터 작동하지 않고 있어요.",
        category: "교통/도로",
        sentiment: "NEGATIVE" as const,
        status: "CLASSIFIED" as const,
        priority: "URGENT" as const,
        assignedToId: user.id,
        slaDueAt: new Date(Date.now() + 4 * 60 * 60 * 1000), // 4 hours from now
        aiSummary: "긴급 - 횡단보도 신호등 고장",
        aiDraftAnswer: "안녕하세요 이영희님, 신호등 고장 신고 감사합니다. 즉시 현장 점검팀을 파견하겠습니다.",
      },
      {
        id: `tkt_${cuid2()}`,
        organizationId: org.id,
        citizenName: "박철수",
        citizenPhone: "010-5555-5555",
        citizenEmail: "chulsoo@example.com",
        content: "도로에 큰 구멍이 생겨서 차량 통행이 위험합니다. 위치는 중앙로 123번지 앞입니다.",
        category: "건설/도로",
        sentiment: "NEGATIVE" as const,
        status: "IN_PROGRESS" as const,
        priority: "HIGH" as const,
        assignedToId: user.id,
        slaDueAt: new Date(Date.now() + 12 * 60 * 60 * 1000), // 12 hours from now
        aiSummary: "도로 포트홀 보수 요청",
        aiDraftAnswer: "박철수님, 도로 보수 요청을 접수했습니다. 안전을 위해 신속히 처리하겠습니다.",
      },
      {
        id: `tkt_${cuid2()}`,
        organizationId: org.id,
        citizenName: "정미라",
        citizenPhone: "010-3333-3333",
        citizenEmail: "mira@example.com",
        content: "주민등록등본 발급 절차에 대해 문의드립니다. 온라인으로도 가능한가요? 필요한 서류가 무엇인지 알려주세요.",
        category: "행정/민원",
        sentiment: "NEUTRAL" as const,
        status: "REPLIED" as const,
        priority: "NORMAL" as const,
        slaDueAt: new Date(Date.now() + 48 * 60 * 60 * 1000), // 48 hours from now
        repliedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        aiSummary: "주민등록등본 발급 문의",
        aiDraftAnswer: "정미라님, 주민등록등본은 정부24 홈페이지에서 온라인 발급 가능합니다. 공인인증서가 필요합니다.",
      },
      {
        id: `tkt_${cuid2()}`,
        organizationId: org.id,
        citizenName: "최준호",
        citizenPhone: "010-7777-7777",
        citizenEmail: "junho@example.com",
        content: "시청 직원분들의 친절한 응대에 감사드립니다. 특히 민원실 김과장님께서 정말 도움을 많이 주셨습니다.",
        category: "칭찬/감사",
        sentiment: "POSITIVE" as const,
        status: "CLOSED" as const,
        priority: "LOW" as const,
        closedAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        aiSummary: "직원 칭찬 - 민원실 김과장",
        aiDraftAnswer: "최준호님, 따뜻한 말씀 감사합니다. 앞으로도 최선을 다하겠습니다.",
      },
    ];

    // Insert tickets
    for (const ticket of tickets) {
      const created = await prisma.ticket.create({
        data: ticket,
      });
      console.log(`✅ Ticket created: ${created.id} - ${ticket.aiSummary}`);

      // Add some updates for each ticket
      if (ticket.status !== "NEW") {
        await prisma.ticketUpdate.create({
          data: {
            ticketId: created.id,
            userId: user.id,
            updateType: "STATUS_CHANGE",
            content: { from: "NEW", to: ticket.status },
          },
        });
      }

      if (ticket.status === "REPLIED") {
        await prisma.ticketUpdate.create({
          data: {
            ticketId: created.id,
            userId: user.id,
            updateType: "REPLY_SENT",
            replyText: ticket.aiDraftAnswer,
            content: { reply: ticket.aiDraftAnswer },
          },
        });
      }
    }

    console.log("\n✨ Test data seeding completed successfully!");
    console.log("\n📊 Summary:");
    console.log(`- Organization: ${org.name}`);
    console.log(`- User: ${user.email}`);
    console.log(`- Tickets: ${tickets.length}`);
    console.log("\n🚀 You can now test the application at http://localhost:3001/ko");
    console.log("   Login is bypassed with SKIP_AUTH=true");
    
  } catch (error) {
    console.error("❌ Error seeding test data:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seed function
seedTestData();
