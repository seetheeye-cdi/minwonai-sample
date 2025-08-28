# 환경변수 설정 가이드 (Clerk 제거 버전)

## 로컬 개발용 .env.local 생성

`.env.local` 파일을 프로젝트 루트에 생성하고 아래 내용을 복사하세요:

```bash
# Database URLs - Supabase 또는 다른 PostgreSQL 서비스 사용
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@db.XYZ.supabase.co:5432/postgres?sslmode=require&pgbouncer=true"
DIRECT_URL="postgresql://postgres:YOUR_PASSWORD@db.XYZ.supabase.co:5432/postgres?sslmode=require"

# Temporary: Skip authentication
SKIP_AUTH=true
NEXT_PUBLIC_SKIP_AUTH=true
NODE_ENV=development

# Supabase (필수)
NEXT_PUBLIC_SUPABASE_URL="https://YOUR_PROJECT.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="YOUR_ANON_KEY"
SUPABASE_SERVICE_ROLE_KEY="YOUR_SERVICE_KEY"

# AI Services (선택)
OPENAI_API_KEY="sk-YOUR_KEY"
ANTHROPIC_API_KEY="sk-ant-YOUR_KEY"

# Email Service (선택)
SENDGRID_API_KEY="SG.YOUR_KEY"
SENDGRID_FROM_EMAIL="noreply@civicaid.com"

# App URLs
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_WWW_URL="http://localhost:3001"

# Features Flags
NEXT_PUBLIC_ENABLE_REALTIME=false
NEXT_PUBLIC_ENABLE_AI=false
```

## Vercel 환경변수 설정

Vercel 대시보드에서 다음 환경변수를 설정하세요:

### 1. 제거할 환경변수 (Clerk 관련)
- `CLERK_PUBLISHABLE_KEY` ❌
- `CLERK_SECRET_KEY` ❌
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` ❌
- `CLERK_WEBHOOK_SECRET` ❌
- `NEXT_PUBLIC_CLERK_SIGN_IN_URL` ❌
- `NEXT_PUBLIC_CLERK_SIGN_UP_URL` ❌
- `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL` ❌
- `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL` ❌

### 2. 필수 환경변수
```bash
DATABASE_URL="postgresql://..." # 올바른 PostgreSQL URL
DIRECT_URL="postgresql://..." # 동일한 URL (pgbouncer 없이)
SKIP_AUTH="true" # 인증 우회
NEXT_PUBLIC_SKIP_AUTH="true" # 클라이언트 인증 우회
```

### 3. 선택 환경변수
- Supabase 관련 키들
- AI 서비스 키들 (OpenAI/Anthropic)
- 이메일/SMS 서비스 키들

## DB URL 형식

올바른 PostgreSQL URL 형식:
```
postgresql://[유저명]:[패스워드]@[호스트]:[포트]/[DB명]?sslmode=require
```

예시:
- Supabase: `postgresql://postgres:password@db.xxxxx.supabase.co:5432/postgres?sslmode=require`
- Neon: `postgresql://username:password@ep-xxxxx.us-east-1.aws.neon.tech/dbname?sslmode=require`
- Render: `postgresql://username:password@xxxx.render.com/dbname?sslmode=require`

## 적용 방법

1. `.env.local` 파일 생성 및 값 입력
2. Vercel 대시보드에서 환경변수 설정
3. 로컬 테스트:
   ```bash
   pnpm dev
   ```
4. 배포:
   ```bash
   git push origin main
   ```
