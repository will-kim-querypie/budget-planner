/**
 * 부동소수점 연산 오류 방지를 위한 덧셈 함수
 */
export default function safetyAdd(a: number, b: number, precision = 2): number {
  const multiplier = Math.pow(10, precision);

  return Math.round((a + b) * multiplier) / multiplier;
}
