// 테스트용 티켓 생성 및 publicToken 출력
const { PrismaClient } = require('../packages/prisma/generated/prisma');
const prisma = new PrismaClient();

async function createTestTicket() {
  try {
    // 테스트 조직 확인 또는 생성
    const org = await prisma.organization.upsert({
      where: { clerkOrgId: 'test_clerk_org_id' },
      update: {},
      create: {
        id: 'org_test_001',
        clerkOrgId: 'test_clerk_org_id',
        name: '테스트 조직',
        slug: 'test-org',
        description: 'CivicAid 테스트용 조직',
      },
    });

    // 테스트 티켓 생성
    const ticket = await prisma.ticket.create({
      data: {
        id: `tkt_test_${Date.now()}`,
        organizationId: org.id,
        citizenName: '김민수',
        citizenPhone: '010-1234-5678',
        citizenEmail: 'test@example.com',
        citizenAddress: '서울시 강남구',
        content: '공원 놀이터 주변에 쓰레기가 많이 방치되어 있습니다. 아이들이 놀기에 위생적으로 좋지 않아 보입니다. 빠른 청소 부탁드립니다.',
        category: '환경/미화',
        status: 'REPLIED',
        priority: 'HIGH',
        sentiment: 'NEGATIVE',
        aiSummary: '놀이터 주변 쓰레기 문제로 인한 위생 우려',
        aiDraftAnswer: '김민수님, 공원 환경 개선에 관심을 가져주셔서 감사합니다. 놀이터 주변 쓰레기 문제에 대해 즉시 담당 부서에 전달하여 신속하게 처리하겠습니다.',
        repliedAt: new Date(),
        isPublic: true,
        source: 'community',
        publicExcerpt: '공원 놀이터 주변 쓰레기 문제',
        nickname: '시민K',
      },
    });

    // 티켓 업데이트 이력 추가
    await prisma.ticketUpdate.createMany({
      data: [
        {
          ticketId: ticket.id,
          updateType: 'STATUS_CHANGE',
          content: { from: null, to: 'NEW' },
          createdAt: new Date(Date.now() - 3600000 * 3), // 3시간 전
        },
        {
          ticketId: ticket.id,
          updateType: 'STATUS_CHANGE',
          content: { from: 'NEW', to: 'CLASSIFIED', message: 'AI 분류 완료: 환경/미화' },
          createdAt: new Date(Date.now() - 3600000 * 2.5), // 2.5시간 전
        },
        {
          ticketId: ticket.id,
          updateType: 'ASSIGNMENT_CHANGE',
          content: { assignee: '환경미화팀' },
          createdAt: new Date(Date.now() - 3600000 * 2), // 2시간 전
        },
        {
          ticketId: ticket.id,
          updateType: 'STATUS_CHANGE',
          content: { from: 'CLASSIFIED', to: 'IN_PROGRESS' },
          createdAt: new Date(Date.now() - 3600000 * 1.5), // 1.5시간 전
        },
        {
          ticketId: ticket.id,
          updateType: 'REPLY_SENT',
          replyText: `안녕하세요 김민수님,

민원 접수번호 ${ticket.id}에 대한 답변입니다.

말씀하신 공원 놀이터 주변 쓰레기 문제를 확인하였습니다. 
환경미화팀에서 오늘 오후에 현장을 방문하여 즉시 청소 작업을 진행할 예정입니다.

앞으로도 정기적인 순찰과 청소를 통해 깨끗한 공원 환경을 유지하도록 노력하겠습니다.
추가로 쓰레기통을 증설하여 재발 방지에도 힘쓰겠습니다.

빠른 조치를 위해 민원을 접수해 주셔서 감사합니다.

환경미화팀 드림`,
          content: { reply: '답변이 발송되었습니다' },
          createdAt: new Date(Date.now() - 3600000), // 1시간 전
        },
        {
          ticketId: ticket.id,
          updateType: 'STATUS_CHANGE',
          content: { from: 'IN_PROGRESS', to: 'REPLIED' },
          createdAt: new Date(Date.now() - 3600000), // 1시간 전
        },
      ],
    });

    console.log('✅ 테스트 티켓이 생성되었습니다!\n');
    console.log('📋 티켓 정보:');
    console.log(`  - 티켓 ID: ${ticket.id}`);
    console.log(`  - 민원인: ${ticket.citizenName}`);
    console.log(`  - 상태: ${ticket.status}`);
    console.log(`  - Public Token: ${ticket.publicToken}`);
    console.log('\n🔗 타임라인 페이지 URL:');
    console.log(`  http://localhost:3001/timeline/${ticket.publicToken}`);
    console.log('\n📱 이 URL을 브라우저에서 열어 시민용 타임라인 페이지를 확인하세요!');
    
    return ticket;
  } catch (error) {
    console.error('Error creating test ticket:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestTicket();
