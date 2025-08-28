# 민원 AI 초 Lean MVP Information Architecture (IA)

## 1. 사이트맵 (Site Map)

```
민원 AI 시스템
├── 대시보드 (Dashboard) [/dashboard]
│   ├── 오늘의 민원 현황
│   ├── 처리 대기 건수
│   ├── 완료된 민원
│   └── 성과 지표 카드
├── 인박스 (Inbox) [/inbox]
│   ├── 전체 민원 목록
│   ├── 필터링 (상태별, 담당자별, 긴급도별)
│   └── 검색 기능
├── 새 민원 등록 [/ticket/new]
│   ├── 민원 접수 폼
│   └── 접수 완료 확인
├── 민원 상세 (Ticket Detail) [/ticket/:id]
│   ├── 민원 정보 조회
│   ├── AI 답변 초안 생성
│   ├── 답변 수정 및 발송
│   └── 처리 이력 타임라인
├── 연락처 관리 (Contacts) [/contacts]
│   ├── 시민 연락처 목록
│   ├── VIP 연락처 관리
│   └── 연락처 추가/수정
├── 알림 로그 (Notification Log) [/notifications]
│   ├── 발송된 알림 내역
│   ├── 읽음/미읽음 상태
│   └── 재발송 관리
├── 설정 (Settings) [/settings]
│   ├── 사용자 프로필
│   ├── 알림 설정
│   ├── AI 분류 카테고리 관리
│   └── 템플릿 관리
└── 인증 (Auth) [/auth]
    ├── 로그인 [/auth/login]
    ├── 회원가입 [/auth/signup]
    └── 비밀번호 재설정 [/auth/reset]
```

## 2. 사용자 흐름 (User Flow)

### **주요 작업 1: 전화 민원 접수 및 처리**
1. 비서가 전화 민원 수신
2. 대시보드에서 '새 민원' 버튼 클릭 (단축키 'N' 지원)
3. 민원 등록 폼으로 이동 (/ticket/new)
4. 발신자 정보, 민원 내용, 연락처 입력
5. '제출' 클릭 → AI 자동 분류 및 담당자 배정 (1-2초)
6. 시민에게 접수 완료 알림 자동 발송
7. 인박스에서 새 티켓 확인 (/inbox)
8. 담당자가 티켓 클릭 → 상세 패널 열림
9. AI 답변 초안 검토 및 수정
10. '발송' 버튼 클릭 → 시민에게 답변 알림 전송
11. 민원 상태 '답변 완료'로 변경

### **주요 작업 2: VIP 민원 우선 처리**
1. 인박스에서 VIP 태그가 붙은 민원 식별
2. 빨간색 테두리로 강조된 긴급 민원 클릭
3. 우측 슬라이드 패널에서 상세 정보 확인
4. '톤 수정' 드롭다운에서 정중한 톤 선택
5. AI 답변 초안 재생성
6. 내용 검토 후 즉시 발송
7. VIP 전용 알림 채널로 답변 전송

### **주요 작업 3: 일일 업무 마감 및 현황 확인**
1. 대시보드로 이동 (/dashboard)
2. 오늘 처리한 민원 건수 확인
3. 미완료 민원 목록 검토
4. 알림 로그에서 시민 읽음 확인 상태 점검
5. 필요시 미읽음 민원에 대한 재알림 설정
6. 일일 성과 지표 확인 후 업무 종료

## 3. 네비게이션 구조 (Navigation Structure)

### **좌측 고정 사이드바 (240px)**
- **대시보드**: 홈 아이콘, 오늘의 현황 요약
- **인박스**: 받은편지함 아이콘, 미처리 건수 배지
- **새 민원**: 플러스 아이콘, 빠른 접수 버튼
- **연락처**: 주소록 아이콘
- **알림 로그**: 벨 아이콘, 미확인 알림 배지
- **설정**: 톱니바퀴 아이콘

### **상단 헤더 (64px)**
- **로고 및 서비스명**: 좌측 상단
- **검색바**: 중앙 (전체 민원 통합 검색)
- **사용자 메뉴**: 우측 상단 (프로필, 로그아웃)
- **실시간 알림**: 우측 상단 벨 아이콘

### **우측 슬라이드 패널 (400px)**
- 민원 상세 정보 표시
- AI 답변 초안 편집기
- 처리 이력 타임라인
- 관련 연락처 정보

## 4. 페이지 계층 구조 (Page Hierarchy)

```
/ (Depth 1 - 루트)
├── /dashboard (Depth 2 - 대시보드)
├── /inbox (Depth 2 - 인박스)
│   └── /inbox?filter=vip (Depth 3 - VIP 필터링)
│   └── /inbox?filter=pending (Depth 3 - 대기중 필터링)
├── /ticket (Depth 2 - 민원 관리)
│   ├── /ticket/new (Depth 3 - 새 민원 등록)
│   └── /ticket/:id (Depth 3 - 민원 상세)
├── /contacts (Depth 2 - 연락처)
│   ├── /contacts/vip (Depth 3 - VIP 연락처)
│   └── /contacts/new (Depth 3 - 새 연락처)
├── /notifications (Depth 2 - 알림 로그)
├── /settings (Depth 2 - 설정)
│   ├── /settings/profile (Depth 3 - 프로필)
│   ├── /settings/notifications (Depth 3 - 알림 설정)
│   ├── /settings/categories (Depth 3 - 카테고리 관리)
│   └── /settings/templates (Depth 3 - 템플릿 관리)
└── /auth (Depth 2 - 인증)
    ├── /auth/login (Depth 3 - 로그인)
    ├── /auth/signup (Depth 3 - 회원가입)
    └── /auth/reset (Depth 3 - 비밀번호 재설정)
```

## 5. 콘텐츠 구성 (Content Organization)

| 페이지 | 주요 콘텐츠 요소 |
|---|---|
| 대시보드 | KPI 카드 4개, 최근 민원 리스트, 처리 현황 차트, 빠른 액션 버튼 |
| 인박스 | 민원 목록 테이블, 필터 드롭다운, 검색바, 상태별 탭, 페이지네이션 |
| 새 민원 등록 | 접수 폼 (발신자명, 연락처, 민원내용), 카테고리 선택, 긴급도 설정 |
| 민원 상세 | 민원 정보 카드, AI 답변 에디터, 발송 버튼, 처리 이력, 첨부파일 |
| 연락처 관리 | 연락처 목록, VIP 태그, 검색 필터, 연락 이력, 추가/편집 폼 |
| 알림 로그 | 발송 내역 테이블, 상태 배지, 읽음 확인, 재발송 버튼, 통계 요약 |
| 설정 | 탭 네비게이션, 설정 폼들, 저장 버튼, 미리보기 기능 |

## 6. 인터랙션 패턴 (Interaction Patterns)

### **모달 사용 패턴**
- **확인 모달**: 중요한 삭제/발송 액션 시
- **편집 모달**: 빠른 정보 수정 시
- **미리보기 모달**: 알림 내용 확인 시

### **토스트 알림 패턴**
- **성공**: 녹색, 체크 아이콘, 4초 자동 숨김
- **에러**: 빨간색, 경고 아이콘, 6초 또는 수동 닫기
- **정보**: 파란색, 정보 아이콘, 3초 자동 숨김

### **로딩 상태 패턴**
- **스켈레톤 로딩**: 목록 및 카드 콘텐츠
- **스피너**: 버튼 내부, API 호출 시
- **프로그레스 바**: AI 처리 진행률 표시

### **실시간 업데이트 패턴**
- **배지 카운터**: 미처리 민원 수, 미읽음 알림 수
- **상태 표시**: 실시간 처리 상태 변경
- **라이브 피드**: 새로운 민원 접수 알림

## 7. URL 구조 (URL Structure)

### **일반 규칙**
- **리소스명**: 복수형 사용 (`/tickets`, `/contacts`)
- **상세페이지**: `/resource/:id` 패턴
- **액션**: `/resource/action` 패턴
- **필터링**: Query parameter 사용

### **URL 예시**
```
/dashboard                    # 대시보드
/inbox                       # 인박스
/inbox?status=pending        # 대기중 민원 필터
/inbox?assignee=김비서       # 담당자별 필터
/ticket/new                  # 새 민원 등록
/ticket/123                  # 민원 상세 (ID: 123)
/ticket/123/edit            # 민원 수정
/contacts                   # 연락처 목록
/contacts/vip              # VIP 연락처
/contacts/456              # 연락처 상세
/notifications             # 알림 로그
/notifications?status=unread # 미읽음 알림
/settings/profile          # 프로필 설정
/auth/login               # 로그인
```

## 8. 컴포넌트 계층 구조 (Component Hierarchy)

### **전역 컴포넌트 (Global Components)**
- **AppLayout**: 전체 레이아웃 래퍼
- **Sidebar**: 좌측 네비게이션
- **Header**: 상단 헤더
- **Toast**: 알림 메시지
- **Modal**: 모달 다이얼로그
- **LoadingSpinner**: 로딩 표시
- **ErrorBoundary**: 에러 처리

### **페이지별 컴포넌트 (Page Components)**

#### **대시보드 컴포넌트**
- **KPICard**: 성과 지표 카드
- **RecentTickets**: 최근 민원 목록
- **StatusChart**: 처리 현황 차트
- **QuickActions**: 빠른 액션 버튼

#### **인박스 컴포넌트**
- **TicketList**: 민원 목록 테이블
- **FilterBar**: 필터링 도구모음
- **SearchInput**: 검색 입력창
- **StatusBadge**: 상태 배지
- **PriorityTag**: 우선순위 태그

#### **민원 상세 컴포넌트**
- **TicketInfo**: 민원 정보 카드
- **AIResponseEditor**: AI 답변 편집기
- **SendButton**: 발송 버튼
- **Timeline**: 처리 이력 타임라인
- **AttachmentList**: 첨부파일 목록

#### **공통 UI 컴포넌트**
- **Button**: 버튼 (Primary, Secondary, Danger)
- **Input**: 입력 필드
- **Select**: 드롭다운 선택
- **Card**: 카드 컨테이너
- **Badge**: 배지/태그
- **Avatar**: 사용자 아바타
- **Tooltip**: 도움말 툴팁

### **상태 관리 컴포넌트**
- **TicketProvider**: 민원 데이터 컨텍스트
- **AuthProvider**: 인증 상태 관리
- **NotificationProvider**: 알림 상태 관리
- **ThemeProvider**: 테마 설정 관리

이 정보 구조는 3일 MVP 개발에 최적화되어 있으며, 사용자의 주요 업무 흐름을 효율적으로 지원하도록 설계되었습니다. 각 컴포넌트는 재사용 가능하고 확장 가능한 구조로 구성되어 향후 기능 추가 시에도 유연하게 대응할 수 있습니다.