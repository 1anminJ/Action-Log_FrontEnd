# 🎙️ Action-Log Frontend

> **"기록을 넘어 행동으로"** — AI 기반 회의록 자동 요약 및 Action Item 추출 서비스의 프론트엔드

<p align="center">
  <a href="https://action-log-front-end.vercel.app">🚀 서비스 바로가기</a> ·
  <a href="https://github.com/1anminJ/Action-Log_BackEnd">⚙️ Backend Repo</a> ·
  <a href="https://github.com/1anminJ/Action-Log">📄 프로젝트 소개 페이지</a>
</p>

<p align="center">
  <a href="https://www.youtube.com/watch?v=pxMV_wATEFg">
    <img src="https://img.youtube.com/vi/pxMV_wATEFg/maxresdefault.jpg" alt="Action-Log Demo Video" width="600">
  </a>
  <br>
  <em>▲ 클릭하면 데모 영상을 볼 수 있습니다</em>
</p>

---

## 📖 프로젝트 소개

Action-Log는 회의/강의 녹음 파일을 업로드하면 **AI가 핵심 요약 + 주요 결정사항 + Action Item(할 일 목록)** 을 자동으로 추출해주는 서비스입니다.

이 레포지토리는 Action-Log 서비스의 **React 프론트엔드** 애플리케이션입니다.

---

## 🎯 기획 의도 및 목표

### Archiving → Productivity
기존 ClovaNote 등의 서비스가 **"정확한 기록(Archiving)"** 에 집중하는 것과 달리, Action-Log는 **"빠른 요약 및 행동 유도(Productivity)"** 를 핵심 가치로 삼고 있습니다.

### Actionable Insight
단순한 텍스트 변환을 넘어, 회의 직후 즉시 행동으로 옮길 수 있는 **Action Item(할 일 목록)** 을 제공하는 것을 핵심 목표로 삼았습니다.

---

## 👥 타겟 사용자 및 타서비스 비교 분석

**🎯 Target Audience**: `시간이 부족한 개발자` · `효율을 중시하는 기획자(PM)` · `회의/강의 요약이 필요한 학생`

| Features | Existing Services (ClovaNote 등) | **Action-Log (본 서비스)** |
|:--------:|:--------------------------------:|:------------------------:|
| **핵심 가치** | 정확한 기록 및 검색 (Archiving) | **빠른 요약 및 행동 유도 (Productivity)** |
| **결과물** | 긴 줄글 형태의 스크립트 | **3줄 요약 + Action Item 체크리스트** |
| **사용자 경험** | 다시 읽고 정리해야 함 (비효율) | **정리된 결론만 확인하면 됨 (효율)** |

---

## 🛠️ 기술 스택

| 구분 | 기술 |
|:----:|:----:|
| **Framework** | React 19 |
| **Build Tool** | Vite 7 |
| **Routing** | React Router DOM v7 |
| **HTTP Client** | Axios |
| **UI 컴포넌트** | React Slick (캐러셀) |
| **상태 관리** | Context API (AuthContext) |
| **배포** | Vercel |

---

## 🏗️ 시스템 아키텍처

```
React(SPA) + Spring Boot (WebFlux) + OpenAI API
```

```
┌─────────────┐     음성 파일      ┌──────────────────┐
│   React     │  ──────────────▶ │  Spring Boot     │
│  (Frontend) │                  │  (Backend API)   │
│             │  ◀────────────── │                  │
└─────────────┘   JSON 응답       └────────┬─────────┘
                                           │
                          ┌────────────────┼────────────────┐
                          ▼                ▼                ▼
                  ┌──────────────┐ ┌──────────────┐ ┌──────────┐
                  │ OpenAI       │ │ OpenAI       │ │  MySQL   │
                  │ Whisper API  │ │ GPT API      │ │  DB      │
                  │ (STT)        │ │ (요약/추출)    │ │          │
                  └──────────────┘ └──────────────┘ └──────────┘
```

---

## 📁 프로젝트 구조

```
src/
├── main.jsx                    # 엔트리포인트 (라우팅 정의)
├── App.jsx                     # 공통 레이아웃 (네비게이션바 + 푸터)
├── App.css                     # 공통 스타일
├── index.css                   # 글로벌 스타일
│
├── pages/
│   ├── HomePage.jsx            # 랜딩 페이지 (서비스 소개 + 핵심 기능)
│   ├── ToolPage.jsx            # 핵심 기능 - 음성 파일 업로드 & 요약 결과
│   ├── HistoryPage.jsx         # 요약 히스토리 목록 (로그인 필요)
│   ├── LoginPage.jsx           # 로그인 페이지
│   └── SignupPage.jsx          # 회원가입 페이지
│
├── components/
│   └── ProtectedRoute.jsx      # 인증 필요 라우트 가드
│
├── context/
│   └── AuthContext.jsx          # 인증 상태 관리 (JWT 토큰, 로그인/로그아웃)
│
└── assets/                     # 이미지 등 정적 리소스
```

---

## 🗺️ 페이지 라우팅

| 경로 | 페이지 | 설명 | 인증 |
|:----:|:------:|:----:|:----:|
| `/` | HomePage | 서비스 소개 (Hero + 핵심 기능) | ❌ |
| `/tool` | ToolPage | 음성 파일 업로드 & AI 요약 | ❌ |
| `/history` | HistoryPage | 내 요약 히스토리 조회/삭제 | 🔒 |
| `/login` | LoginPage | 로그인 | ❌ |
| `/signup` | SignupPage | 회원가입 | ❌ |

> 🔒 표시된 페이지는 `ProtectedRoute`에 의해 미로그인 시 `/login`으로 리다이렉트됩니다.

---

## ✨ 주요 기능

### 1. 🎤 음성 파일 업로드 & AI 요약 (`ToolPage`)
- **드래그 앤 드롭** 또는 파일 선택으로 오디오 파일 업로드
- 요약본 제목 입력 (파일명 기반 자동 생성)
- 결과: **핵심 요약** / **주요 결정 사항** / **Action Items (할 일)**
- 로딩 상태 표시 및 상세 에러 핸들링

### 2. 📋 요약 히스토리 (`HistoryPage`)
- 과거 요약 결과를 **최신순/오래된순** 정렬
- **제목 검색** 필터링
- 개별 요약 **삭제** 기능 (확인 다이얼로그 포함)

### 3. 🔐 인증 시스템
- JWT 기반 로그인/회원가입
- `AuthContext`로 전역 인증 상태 관리
- `ProtectedRoute`로 미인증 사용자 접근 차단
- **자동 로그인(Remember Me)** 지원

### 4. 🏠 랜딩 페이지 (`HomePage`)
- 서비스 소개 Hero 섹션 + CTA 버튼
- 핵심 기능 3가지 소개 카드 (🚀 빠른 음성 인식 / 🎯 핵심 요약 / 📋 할 일 추출)
- **React Slick** 캐러셀로 기능 미리보기

### 5. 📱 반응형 디자인
- 모바일/데스크탑 대응 레이아웃
- **햄버거 메뉴** 네비게이션 (768px 이하)

---

## 📊 성과 지표 (KPI)

| 지표 | 수치 | 설명 |
|:----:|:----:|:----:|
| ⏱️ 시간 효율성 향상 | **95%** | 1시간 분량 회의 처리: **60분 → 3분**으로 단축 |
| 🔒 데이터 정합성 확보 | **99%** | JSON Mode 도입으로 구조화 데이터 변환 오류 해결 |
| 🎯 핵심 정보 재현율 | **92%** | Prompt Engineering으로 정보 누락 방지 및 환각 최소화 |

---

## 🚀 시작하기

### 사전 요구사항
- Node.js 18 이상
- npm 또는 yarn

### 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

### 환경 변수

프로젝트 루트에 `.env` 파일을 생성합니다:

```env
VITE_API_URL=http://localhost:8080
```

### 빌드

```bash
npm run build
```

---

## 🌐 배포

Vercel을 통해 자동 배포되고 있습니다.

- **Production URL**: [https://action-log-front-end.vercel.app](https://action-log-front-end.vercel.app)

---

## 💡 회고 (Retrospective)

### 🙆‍♂️ 배운 점 (Learned)
- 프롬프트 엔지니어링이 서비스 품질을 결정하는 핵심 기술임을 체감했습니다.
- AI 모델 성능만큼이나 AI와의 '소통 방식(JSON 강제 등)'이 중요함을 깨달았습니다.
- 비동기 처리(WebFlux)를 통해 대용량 요청을 효율적으로 관리하는 법을 익혔습니다.

### 🚀 향후 계획 (Future Plan)
- **화자 분리(Speaker Diarization)**: '누가' 말했는지 식별하여 업무 자동 할당
- **외부 협업 툴 연동**: Jira 티켓 생성, Slack 알림 등 파이프라인 확장
- **RAG 기반 회의 지식소**: 축적된 회의록 벡터 DB 구축 및 Q&A 챗봇 구현
- **WebSocket 스트리밍**: 실시간 음성-텍스트 변환 파이프라인 구축

---

## 👤 개발자

**한민정** — 기획, 설계, 프론트엔드/백엔드 개발, 배포

[![GitHub](https://img.shields.io/badge/GitHub-1anminJ-181717?style=flat-square&logo=github)](https://github.com/1anminJ)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-1anminJ-0A66C2?style=flat-square&logo=linkedin)](https://linkedin.com/in/1anminJ)
[![Email](https://img.shields.io/badge/Email-mjeoung413@gmail.com-EA4335?style=flat-square&logo=gmail)](mailto:mjeoung413@gmail.com)

---

## 📄 Related Repositories

| Repository | Description |
|:----------:|:-----------:|
| [Action-Log_BackEnd](https://github.com/1anminJ/Action-Log_BackEnd) | Spring Boot 백엔드 API 서버 |
| [Action-Log](https://github.com/1anminJ/Action-Log) | 프로젝트 소개 페이지 |
