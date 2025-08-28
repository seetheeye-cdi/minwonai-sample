# 민원 AI 초 Lean MVP Design Guide

## 1. Overall Mood (전체적인 무드)

이 서비스는 **신뢰할 수 있는 전문성(Trustworthy & Professional)**을 핵심 콘셉트로 합니다. 국회의원 지역사무소라는 공적 업무 환경에서 사용되는 만큼, 안정감과 효율성을 동시에 제공해야 합니다. AI 기술의 혁신성을 강조하면서도 기존 업무 방식에 자연스럽게 스며드는 친숙함을 유지합니다.

주요 무드 키워드:
- **신뢰성**: 정확하고 안정적인 정보 전달
- **전문성**: 공적 업무에 적합한 격조 있는 디자인
- **효율성**: 빠른 업무 처리를 위한 직관적 인터페이스
- **안정감**: 민감한 민원 업무에 대한 심리적 안전감

## 2. Reference Service (참조 서비스)

- **Name**: Slack
- **Description**: 팀 협업 및 커뮤니케이션 플랫폼
- **Design Mood**: 전문적이면서도 친근한, 효율성 중심의 업무용 인터페이스
- **Primary Color**: #4A154B (Deep Purple)
- **Secondary Color**: #ECF3F9 (Light Blue Gray)

Slack의 깔끔하고 체계적인 정보 구조화 방식과 실시간 상태 표시 시스템을 참조하되, 보다 공적이고 안정감 있는 색상 팔레트를 적용합니다.

## 3. Color & Gradient (색상 & 그라데이션)

- **Primary Color**: #2563EB (Professional Blue)
- **Secondary Color**: #F8FAFC (Soft Gray White)
- **Accent Color**: #DC2626 (Alert Red) - 긴급 민원용
- **Success Color**: #059669 (Trust Green) - 완료 상태용
- **Warning Color**: #D97706 (Attention Orange) - 대기 상태용
- **Grayscale**: #1E293B (Dark), #64748B (Medium), #CBD5E1 (Light)

**Mood**: 차분하고 신뢰감 있는 Cool Tone, 중간 채도로 눈의 피로를 최소화

**Color Usage**:
1. **Primary Blue**: 주요 CTA 버튼, 네비게이션, 브랜딩 요소
2. **Secondary Gray**: 배경, 카드, 입력 필드
3. **Accent Red**: VIP 민원, 긴급 알림, 에러 상태
4. **Success Green**: 완료된 민원, 성공 메시지
5. **Warning Orange**: 대기 중인 민원, 주의 알림

## 4. Typography & Font (타이포그래피 & 폰트)

- **Primary Font**: Pretendard (Korean), Inter (English)
- **Heading 1**: Pretendard Bold, 28px, Letter-spacing: -0.02em
- **Heading 2**: Pretendard SemiBold, 24px, Letter-spacing: -0.01em
- **Heading 3**: Pretendard SemiBold, 20px, Letter-spacing: -0.01em
- **Body Large**: Pretendard Regular, 16px, Line-height: 1.6
- **Body**: Pretendard Regular, 14px, Line-height: 1.5
- **Caption**: Pretendard Medium, 12px, Line-height: 1.4
- **Button Text**: Pretendard SemiBold, 14px, Letter-spacing: 0.01em

가독성과 전문성을 동시에 고려하여 Pretendard를 주 폰트로 선택했습니다. 충분한 행간과 적절한 자간으로 장시간 업무에도 눈의 피로를 최소화합니다.

## 5. Layout & Structure (레이아웃 & 구조)

**Grid System**: 12-column grid, 24px gutter
**Container Max-width**: 1440px
**Breakpoints**: 
- Mobile: 375px~768px
- Tablet: 768px~1024px  
- Desktop: 1024px+

**Layout Principles**:
1. **좌측 네비게이션**: 고정형 사이드바 (240px)
2. **메인 콘텐츠**: 유연한 그리드 레이아웃
3. **우측 패널**: 상세 정보 슬라이드 패널 (400px)
4. **상단 헤더**: 고정형 헤더 (64px)

**Spacing System**: 4px 기준 (4, 8, 12, 16, 24, 32, 48, 64px)

## 6. Visual Style (비주얼 스타일)

**아이콘 스타일**:
- Lucide React 아이콘 라이브러리 사용
- 24px 기본 크기, 1.5px stroke-width
- 미니멀하고 일관된 라인 스타일

**카드 & 컨테이너**:
- Border-radius: 8px
- Shadow: 0 1px 3px rgba(0, 0, 0, 0.1)
- Border: 1px solid #E2E8F0

**이미지 & 일러스트레이션**:
- 실제 업무 상황을 반영한 사실적 스타일
- 중성적이고 전문적인 톤
- 불필요한 장식 요소 배제

## 7. UX Guide (UX 가이드)

**타겟 사용자**: 중급 수준의 디지털 리터러시를 가진 공무원/비서진

**핵심 UX 원칙**:

1. **즉시성**: 3초 내 핵심 정보 파악 가능
2. **예측가능성**: 일관된 인터랙션 패턴 유지
3. **실수 방지**: 중요한 액션에 대한 확인 단계 제공
4. **상태 투명성**: 모든 처리 과정의 실시간 피드백

**인터랙션 가이드**:
- **호버 상태**: 0.2s transition, 색상 변화 또는 shadow 추가
- **클릭 피드백**: 즉시 visual feedback + 로딩 상태 표시
- **에러 처리**: 친절한 안내 메시지와 해결 방법 제시
- **성공 피드백**: 명확한 완료 표시와 다음 단계 안내

## 8. UI Component Guide (UI 컴포넌트 가이드)

### 버튼 (Buttons)
**Primary Button**:
- Background: #2563EB
- Text: White, Pretendard SemiBold 14px
- Padding: 12px 24px
- Border-radius: 6px
- Hover: #1D4ED8

**Secondary Button**:
- Background: Transparent
- Border: 1px solid #CBD5E1
- Text: #374151, Pretendard SemiBold 14px
- Hover: Background #F8FAFC

**Danger Button**:
- Background: #DC2626
- Text: White
- 중요한 삭제/취소 액션에만 사용

### 입력 필드 (Input Fields)
- Border: 1px solid #D1D5DB
- Border-radius: 6px
- Padding: 12px 16px
- Font: Pretendard Regular 14px
- Focus: Border #2563EB, Box-shadow 추가
- Error: Border #DC2626, 하단 에러 메시지 표시

### 카드 (Cards)
- Background: White
- Border: 1px solid #E5E7EB
- Border-radius: 8px
- Padding: 24px
- Shadow: 0 1px 3px rgba(0, 0, 0, 0.1)

### 상태 배지 (Status Badges)
**접수 완료**: 
- Background: #DBEAFE, Text: #1E40AF
**처리 중**: 
- Background: #FEF3C7, Text: #92400E
**답변 완료**: 
- Background: #D1FAE5, Text: #065F46
**VIP**: 
- Background: #FEE2E2, Text: #991B1B

### 네비게이션 (Navigation)
**사이드바 메뉴**:
- 높이: 48px
- Padding: 12px 16px
- Active: Background #EFF6FF, Text #2563EB
- Hover: Background #F8FAFC

**알림/피드백 시스템**:
- Toast 메시지: 우측 상단, 4초 자동 숨김
- 로딩 스켈레톤: 콘텐츠 영역과 동일한 구조
- 프로그레스 바: Primary Blue, 높이 4px

이 디자인 가이드는 민원 처리의 효율성과 신뢰성을 높이는 동시에, 사용자가 스트레스 없이 업무에 집중할 수 있도록 설계되었습니다.