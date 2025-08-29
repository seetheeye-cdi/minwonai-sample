# Vercel 배포 가이드 - CivicAid Dashboard

## 배포 URL
배포 후 접속 가능한 URL: https://[your-project-name].vercel.app

## 1. Vercel CLI 설치 (이미 설치되어 있다면 skip)
```bash
npm i -g vercel
```

## 2. 배포 명령어
프로젝트 루트 디렉토리에서 실행:

```bash
cd apps/app
vercel
```

## 3. Vercel 프로젝트 설정

첫 배포 시 다음과 같이 설정하세요:

- **Setup and deploy**: Y
- **Which scope**: 본인 계정 선택
- **Link to existing project?**: N (새 프로젝트 생성)
- **Project name**: civicaid-dashboard (또는 원하는 이름)
- **In which directory is your code located?**: ./ (현재 디렉토리)
- **Want to modify settings?**: N

## 4. 환경 변수 설정

Vercel 대시보드 (https://vercel.com/dashboard) 에서:

1. 프로젝트 선택
2. Settings → Environment Variables
3. 다음 변수들 추가:

### 필수 환경 변수 (데모 모드)
```
SKIP_AUTH=true
USE_MOCK_DATA=true
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://[your-project-name].vercel.app
```

### Clerk 관련 (placeholder 값 사용)
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_placeholder
CLERK_SECRET_KEY=sk_test_placeholder
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
```

### Database 관련 (mock data 사용시 placeholder)
```
DATABASE_URL=postgresql://placeholder
DATABASE_POOLING_URL=postgresql://placeholder
DIRECT_URL=postgresql://placeholder
```

### Supabase 관련 (placeholder)
```
NEXT_PUBLIC_SUPABASE_URL=https://placeholder.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=placeholder
SUPABASE_SERVICE_ROLE_KEY=placeholder
```

### AI & Notification (placeholder)
```
OPENAI_API_KEY=placeholder
ANTHROPIC_API_KEY=placeholder
SENDGRID_API_KEY=placeholder
SENDGRID_FROM_EMAIL=noreply@civicaid.kr
```

## 5. 재배포
환경 변수 설정 후:

```bash
vercel --prod
```

## 6. 배포 확인
- 배포 URL: https://[your-project-name].vercel.app
- 대시보드: https://vercel.com/dashboard

## 주의사항
- 현재는 데모 모드(SKIP_AUTH=true, USE_MOCK_DATA=true)로 설정되어 있어 실제 데이터베이스 연결 없이 작동합니다
- 프로덕션 환경에서는 실제 Clerk, Supabase, Database 인증 정보가 필요합니다
- 배포 후 CORS 이슈가 발생하면 API 설정을 확인하세요
