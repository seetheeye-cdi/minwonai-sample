# 🚀 CivicAid Dashboard Vercel 배포 가이드

## 📋 사전 준비 사항
- Node.js 18+ 설치
- pnpm 설치
- Vercel 계정 (https://vercel.com/signup)

## 🔧 배포 단계

### 1단계: Vercel CLI 로그인
```bash
vercel login
```
이메일을 입력하고 인증 메일의 링크를 클릭하세요.

### 2단계: 프로젝트 배포
```bash
# 프로젝트 루트에서
cd apps/app
vercel
```

### 3단계: 프로젝트 설정 프롬프트
다음과 같이 답변하세요:
- **Set up and deploy "~/Desktop/민원AI/apps/app"?** → `Y`
- **Which scope do you want to deploy to?** → 본인 계정 선택
- **Link to existing project?** → `N` (첫 배포시)
- **What's your project's name?** → `civicaid-dashboard`
- **In which directory is your code located?** → `./` (Enter)
- **Want to modify these settings?** → `N`

### 4단계: 환경 변수 설정 (Vercel 대시보드에서)

1. https://vercel.com/dashboard 접속
2. `civicaid-dashboard` 프로젝트 클릭
3. **Settings** → **Environment Variables** 이동
4. 다음 변수들을 추가:

#### 필수 환경 변수 (복사해서 사용)
```env
# 데모 모드 설정
SKIP_AUTH=true
USE_MOCK_DATA=true
NODE_ENV=production

# Clerk (placeholder)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_demo_civicaid
CLERK_SECRET_KEY=sk_test_demo_civicaid
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

# Database (placeholder)
DATABASE_URL=postgresql://demo:demo@localhost/civicaid
DATABASE_POOLING_URL=postgresql://demo:demo@localhost/civicaid
DIRECT_URL=postgresql://demo:demo@localhost/civicaid

# Supabase (placeholder)
NEXT_PUBLIC_SUPABASE_URL=https://demo.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=demo_anon_key
SUPABASE_SERVICE_ROLE_KEY=demo_service_key

# AI & Notification (placeholder)
OPENAI_API_KEY=sk-demo-civicaid
ANTHROPIC_API_KEY=sk-ant-demo-civicaid
SENDGRID_API_KEY=SG.demo-civicaid
SENDGRID_FROM_EMAIL=noreply@civicaid.kr
```

### 5단계: 프로덕션 배포
환경 변수 설정 후:
```bash
vercel --prod
```

## ✅ 배포 완료!

배포가 완료되면:
- **대시보드 URL**: https://civicaid-dashboard.vercel.app
- **Vercel 대시보드**: https://vercel.com/dashboard

## 🎯 빠른 배포 (원클릭)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/civicaid&env=SKIP_AUTH,USE_MOCK_DATA,NODE_ENV&envDescription=Environment%20variables%20for%20CivicAid%20Dashboard&envLink=https://github.com/yourusername/civicaid/blob/main/DEPLOY_TO_VERCEL.md&project-name=civicaid-dashboard&repository-name=civicaid)

## 🔍 배포 상태 확인

```bash
# 배포 로그 확인
vercel logs civicaid-dashboard

# 배포 목록 확인
vercel ls

# 특정 배포 상세 정보
vercel inspect [deployment-url]
```

## ⚠️ 주의사항

1. **데모 모드**: 현재 설정은 `SKIP_AUTH=true`와 `USE_MOCK_DATA=true`로 데모 모드입니다
2. **프로덕션 전환**: 실제 서비스를 위해서는 실제 데이터베이스와 인증 정보가 필요합니다
3. **도메인 설정**: 커스텀 도메인은 Vercel 대시보드에서 설정 가능합니다

## 🛠 문제 해결

### 빌드 실패시
```bash
# 로컬에서 빌드 테스트
pnpm build --filter=@myapp/app

# 캐시 삭제 후 재시도
rm -rf .next
vercel --force
```

### 환경 변수 문제
- Vercel 대시보드에서 환경 변수가 제대로 설정되었는지 확인
- 배포 후 변경사항은 재배포가 필요함

### CORS 오류
API 엔드포인트에서 CORS 헤더 설정 확인

## 📞 지원

문제가 있으시면:
- GitHub Issues: https://github.com/yourusername/civicaid
- 이메일: support@civicaid.kr
