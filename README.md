# 조선실록톡 (Joseon Annals Talk)

> 조선왕조실록 속 역사 인물과 나누는 AI 대화 플랫폼

조선의 왕과 인물들이 살아 돌아온다면 어떤 이야기를 나눌 수 있을까요?
세종대왕에게 한글 창제의 비화를 묻고, 정조에게 개혁의 꿈을 들어보세요.

---

## 주요 기능

- **AI 위인 채팅** — 세종, 정조, 영조 등 조선 역사 인물과 실시간 대화
- **콘텐츠 추천** — 대화 맥락에 맞는 관련 영상(YouTube) · 도서(네이버) 자동 추천
- **역사 서재** — 관심 콘텐츠를 저장하고 언제든 다시 확인
- **일일 대화 한도** — 페르소나별 하루 대화 횟수 관리
- **온보딩** — 관심 시대 · 인물 · 대화 스타일 설정으로 맞춤 경험

---

## 기술 스택

| 분류 | 기술 |
|------|------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| UI | React 19, Tailwind CSS 4, shadcn/ui, Radix UI |
| 상태 관리 | Zustand (클라이언트), TanStack Query (서버) |
| 폼 검증 | React Hook Form + Zod |
| 배포 | Vercel |

---

## 시작하기

### 요구 사항

- Node.js 20+
- npm

### 설치

```bash
git clone https://github.com/your-org/joseon-annals-web.git
cd joseon-annals-web
npm install
```

### 환경 변수 설정

프로젝트 루트에 `.env.local` 파일을 생성합니다.

```env
# 백엔드 API URL (서버 사이드 프록시용)
API_URL=http://localhost:8080

# Google OAuth
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
```

> Vercel 배포 시에는 대시보드 → Environment Variables에 동일하게 설정합니다.

### 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 엽니다.

---

## 프로젝트 구조

```
src/
├── app/
│   ├── (auth)/          # 로그인, 회원가입, 비밀번호 찾기
│   ├── (main)/          # 메인 앱 (위인선택, 채팅, 서재, 설정)
│   ├── onboarding/      # 온보딩 wizard
│   └── api/             # Next.js Route Handlers
├── components/
│   ├── chat/            # 채팅 버블, 입력창
│   ├── content/         # 콘텐츠 카드, 바텀시트
│   ├── layout/          # 헤더, 하단 네비게이션
│   ├── onboarding/      # 온보딩 단계 컴포넌트
│   └── persona/         # 위인 카드
├── lib/
│   ├── api/             # API 클라이언트 및 엔드포인트별 함수
│   ├── store/           # Zustand 스토어 (인증)
│   └── validations/     # Zod 스키마
└── types/               # TypeScript 타입 정의
```

---

## API 연동

모든 `/api/*` 요청은 Next.js rewrites를 통해 백엔드로 프록시됩니다.

```
프론트 (Vercel) → /api/v1/* → 백엔드 서버
```

인증 방식: JWT Bearer Token (자동 갱신 포함)

---

## 환경별 배포

| 환경 | 방법 |
|------|------|
| 로컬 개발 | `npm run dev` |
| 프로덕션 빌드 확인 | `npm run build && npm run start` |
| Vercel 배포 | main 브랜치 push 시 자동 배포 |