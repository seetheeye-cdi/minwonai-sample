// 테스트 티켓 생성 스크립트
// 실행: node test-scripts/create-test-ticket.js

const testTickets = [
  {
    citizenName: "김민수",
    citizenPhone: "010-1234-5678",
    citizenEmail: "minsu@example.com",
    content: "우리 동네 공원에 쓰레기가 너무 많이 쌓여있어요. 청소를 좀 해주세요.",
    category: "환경/미화"
  },
  {
    citizenName: "이영희",
    citizenPhone: "010-9876-5432",
    citizenEmail: "younghee@example.com",
    content: "횡단보도 신호등이 고장났습니다. 매우 위험한 상황이니 빨리 수리해주세요!",
    category: "교통"
  },
  {
    citizenName: "박철수",
    citizenPhone: "010-5555-5555",
    citizenEmail: "chulsoo@example.com",
    content: "도로에 큰 구멍이 생겨서 차량 통행이 위험합니다. 긴급 보수가 필요합니다.",
    category: "건설/도로"
  },
  {
    citizenName: "정미라",
    citizenPhone: "010-3333-3333",
    citizenEmail: "mira@example.com",
    content: "주민등록등본 발급 절차에 대해 문의드립니다. 온라인으로도 가능한가요?",
    category: "행정"
  },
  {
    citizenName: "최준호",
    citizenPhone: "010-7777-7777",
    citizenEmail: "junho@example.com",
    content: "동네 체육관 이용 시간과 요금에 대해 알고 싶습니다.",
    category: "문화/체육"
  }
];

console.log("테스트 티켓 데이터:");
console.log(JSON.stringify(testTickets, null, 2));
console.log("\n이 데이터를 API를 통해 생성하거나 직접 DB에 입력하세요.");
console.log("\nPrisma Studio 실행:");
console.log("cd packages/prisma && pnpm studio");
