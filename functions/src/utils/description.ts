// ./functions/src/utils/description.ts

/**
 * 문자열을 주어진 길이에 맞게 자르고, 생략 부호(...)를 추가하는 함수
 * 한글 문자열의 경우 80자, 그 외 문자열의 경우 160자로 제한합니다.
 *
 * @param text 원본 문자열
 * @param maxLength 최대 길이 (기본값: 160자)
 * @param koreanMaxLength 한글 최대 길이 (기본값: 80자)
 * @returns 잘린 문자열
 */
export function truncateDescription(
    text: string, 
    maxLength: number = 160, 
    koreanMaxLength: number = 80
  ): string {
    // 한글 문자열인지 체크하는 정규 표현식
    const isKorean = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(text);
  
    // 한글 문자열의 경우 maxLength를 koreanMaxLength로 설정
    const finalMaxLength = isKorean ? koreanMaxLength : maxLength;
  
    if (text.length <= finalMaxLength) {
      return text;
    }
  
    // 최대 길이까지 자르고, 마지막 공백 이전의 위치에서 자르기
    const truncatedText = text.slice(0, finalMaxLength);
    const lastSpaceIndex = truncatedText.lastIndexOf(" ");
  
    // 마지막 공백 이전에서 자르고, 생략 부호 추가
    return lastSpaceIndex > 0 ? truncatedText.slice(0, lastSpaceIndex) + "..." : truncatedText + "...";
  }
  