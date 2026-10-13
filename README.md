# 아두몰 — 아두이노 부품 쇼핑몰 (교육용 데모)

배포: https://ardushop.vercel.app — 실제 판매·결제·배송 없음, 회원가입 없음.

📚 **강의노트: [docs/lecture](docs/lecture/README.md)** — 기획부터 배포까지 10장

Next.js 15 (App Router) + Supabase(Postgres·Auth·RLS) + Tailwind CSS v4 + Zustand.

## 실행
```bash
cp .env.example .env.local   # Supabase URL / anon key 입력
npm install
npm run dev                  # http://localhost:3000
```

## DB
- `supabase/migrations/` — 테이블, RLS, 주문 함수(`place_order`, `cancel_order`)
- `supabase/seed/products.json` — 상품 원본 데이터 (디바이스마트 판매가 기준)
- `node scripts/build-seed.mjs` → `supabase/seed/seed.sql` 재생성

### 관리자
회원가입은 없습니다. 관리자 계정은 Supabase에서 직접 만들고 `profiles.role = 'admin'`으로 지정합니다. 로그인은 푸터의 "관리자" 링크(`/login`).

## 기능
- 상품 목록/카테고리/검색/정렬, 상세(사양표)
- 장바구니(로컬 저장), 3만원 이상 무료배송
- 체험 주문: 로그인·개인정보 없이 주문 기록만 남김 (`place_demo_order`, 가격·재고 검증만 하고 재고는 차감 안 함)
- 관리자: 대시보드, 상품 등록/가격·재고·노출 수정, 재고 부족 목록, 주문 상태 변경

## 이미지
`public/images/` 의 사진은 Wikimedia Commons 자유 라이선스 이미지입니다. 출처는 `/credits` 페이지와 `public/images/credits.json` 참고.

## 로컬 테스트 계정
`.env.local` 하단 주석에 관리자 테스트 계정(admin@example.com)이 있습니다. (git 제외 파일)
