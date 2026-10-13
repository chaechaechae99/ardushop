import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-gray-200 bg-white">
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-10 text-sm text-gray-500 md:grid-cols-3">
        <div>
          <p className="text-base font-bold text-brand-900">아두몰</p>
          <p className="mt-2">아두이노 부품 전문 쇼핑몰 (학습용 데모 사이트)</p>
        </div>
        <div>
          <p className="font-semibold text-gray-700">고객 안내</p>
          <p className="mt-2">3만원 이상 무료배송 · 기본 배송비 3,000원</p>
          <p>결제는 테스트 결제로 처리되며 실제 청구되지 않습니다.</p>
        </div>
        <div>
          <p className="font-semibold text-gray-700">정보</p>
          <p className="mt-2">가격 정보: 디바이스마트 판매가 참고</p>
          <Link href="/credits" className="underline hover:text-brand-700">
            이미지 출처 및 라이선스
          </Link>
        </div>
      </div>
    </footer>
  );
}
