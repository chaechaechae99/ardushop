# 아두몰 — 아두이노 부품 쇼핑몰

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

### 관리자 지정
가입 후 SQL 에디터에서:
```sql
update public.profiles set role = 'admin'
where id = (select id from auth.users where email = '내이메일@example.com');
```

## 기능
- 상품 목록/카테고리/검색/정렬, 상세(사양표)
- 장바구니(로컬 저장), 3만원 이상 무료배송
- 회원가입/로그인, 마이페이지(주문내역·취소, 회원정보)
- 주문: DB 함수에서 가격·재고 검증 후 원자적으로 재고 차감 (테스트 결제)
- 관리자: 대시보드, 상품 등록/가격·재고·노출 수정, 재고 부족 목록, 주문 상태 변경

## 이미지
`public/images/` 의 사진은 Wikimedia Commons 자유 라이선스 이미지입니다. 출처는 `/credits` 페이지와 `public/images/credits.json` 참고.

## 로컬 테스트 계정
`.env.local` 하단 주석에 관리자 테스트 계정(admin@example.com)이 있습니다. (git 제외 파일)
