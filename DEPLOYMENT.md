# Vercel 배포 가이드

## 필수 환경 변수 설정

Vercel 대시보드에서 다음 환경 변수들을 설정해야 합니다:

### 1. Database Configuration (필수)
```
DATABASE_URL=postgresql://user:password@host:port/database
```
- Supabase, Neon, 또는 다른 PostgreSQL 데이터베이스 URL을 입력하세요.

### 2. Clerk Authentication (필수)
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
CLERK_WEBHOOK_SECRET=whsec_...
```
- [Clerk Dashboard](https://dashboard.clerk.com)에서 키를 복사하세요.

### 3. Clerk Redirect URLs (필수)
```
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/ko
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/ko
```

### 4. Application URL (필수)
```
NEXT_PUBLIC_APP_URL=https://your-app-domain.vercel.app
```
- 실제 배포 URL로 변경하세요.

### 5. LemonSqueezy Payment (선택)
```
LEMONSQUEEZY_API_KEY=...
LEMONSQUEEZY_WEBHOOK_SECRET=...
LEMONSQUEEZY_STORE_ID=...
```

### 6. Analytics (선택)
```
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-...
NEXT_PUBLIC_CLARITY_PROJECT_ID=...
```

### 7. Email Service (선택)
```
SENDGRID_API_KEY=...
SENDGRID_FROM_EMAIL=noreply@your-domain.com
```

## Vercel에서 환경 변수 설정하는 방법

1. [Vercel Dashboard](https://vercel.com/dashboard)에 로그인
2. 프로젝트 선택
3. Settings 탭 클릭
4. Environment Variables 섹션으로 이동
5. 위의 환경 변수들을 하나씩 추가
6. 모든 환경(Production, Preview, Development)에 적용
7. 저장 후 재배포

## 무료 PostgreSQL 데이터베이스 옵션

### Option 1: Supabase (추천)
1. [Supabase](https://supabase.com)에서 무료 프로젝트 생성
2. Settings > Database에서 Connection String 복사
3. DATABASE_URL에 붙여넣기

### Option 2: Neon
1. [Neon](https://neon.tech)에서 무료 프로젝트 생성
2. Dashboard에서 Connection String 복사
3. DATABASE_URL에 붙여넣기

### Option 3: Vercel Postgres
1. Vercel Dashboard > Storage 탭
2. Create Database 클릭
3. Postgres 선택
4. 자동으로 DATABASE_URL이 설정됨

## 데이터베이스 마이그레이션

환경 변수 설정 후:

```bash
# 로컬에서 마이그레이션 실행
cd packages/prisma
pnpm db:migrate:deploy
```

## 문제 해결

### "Invalid prisma.user.findUnique() invocation" 오류
- DATABASE_URL이 설정되지 않았거나 잘못된 형식입니다.
- postgresql:// 또는 postgres://로 시작하는지 확인하세요.

### Clerk 개발 키 경고
- Production 환경에서는 Clerk Dashboard에서 Production 키를 생성하여 사용하세요.
- 개발 키는 사용량 제한이 있습니다.

### Clarity 오류
- NEXT_PUBLIC_CLARITY_PROJECT_ID가 설정되지 않았거나 "undefined"입니다.
- 선택사항이므로 사용하지 않는다면 환경 변수를 제거하세요.
