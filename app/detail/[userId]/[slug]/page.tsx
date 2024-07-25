// ./app/detail/[userId]/[slug]/page.tsx

import React from 'react';
import { Metadata } from 'next';
import ClientComponent from '@/components/detail/useClientState';

interface DetailPageProps {
  params: {
    userId: string;
    slug: string;
  };
}

interface CalculatorData {
  계산기이름: string;
  계산기설명: string;
  해시태그: string[];
  사용자입력변수: Array<{ 입력변수아이디: string, 변수단위이름: string, 변수단위: string }>;
  계산수식: string;
  계산결과: { 결과이름: string, 단위: string };
  입력요소: Array<{ id: string, value: string, type: string }>;
  이메일: string;
}

async function fetchCalculatorData(userId: string, slug: string): Promise<CalculatorData> {
  const response = await fetch(`https://detail-hry6fdb6aa-du.a.run.app?userId=${userId}&slug=${encodeURIComponent(slug)}`);
  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }
  return await response.json();
}

export async function generateMetadata({ params }: DetailPageProps): Promise<Metadata> {
  const calculator = await fetchCalculatorData(params.userId, params.slug);
  return {
    title: calculator.계산기이름,
    description: calculator.계산기설명,
    keywords: calculator.해시태그 ? calculator.해시태그.join(', ') : 'AiCalculator, calcwave, calculator, calculation',
    authors: [
      { name: calculator.이메일 }
    ],
    openGraph: {
      title: calculator.계산기이름,
      description: calculator.계산기설명,
      images: [
        {
          url: 'https://firebasestorage.googleapis.com/v0/b/calc-sky4.appspot.com/o/metaImgae_calcwave.jpg?alt=media&token=72b0ca2c-47a5-4b16-b2f4-d42b2418ee55',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: calculator.계산기이름,
      description: calculator.계산기설명,
      images: ['https://firebasestorage.googleapis.com/v0/b/calc-sky4.appspot.com/o/metaImgae_calcwave.jpg?alt=media&token=72b0ca2c-47a5-4b16-b2f4-d42b2418ee55'],
    },
  };
}

const DetailPage: React.FC<DetailPageProps> = async ({ params }) => {
  const { userId, slug } = params;
  const calculator = await fetchCalculatorData(userId, slug);
  
  const initialInputs: Record<string, number> = {};
  calculator.사용자입력변수.forEach((variable: any) => {
    initialInputs[variable.입력변수아이디] = 0;
  });

  return <ClientComponent calculator={calculator} initialInputs={initialInputs} />;
};

export default DetailPage;