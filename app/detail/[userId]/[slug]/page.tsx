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
  계산기설명: string[];
  해시태그: string[];
  작성날짜: Date;
  방문자수: number;
  계산횟수: number;
  이메일: string;
}

async function fetchCalculatorData(userId: string, slug: string): Promise<CalculatorData> {
  const response = await fetch(`https://detail-hry6fdb6aa-du.a.run.app?userId=${userId}&slug=${encodeURIComponent(slug)}`);
  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }
  const data = await response.json();

  // Parse date correctly
  data.작성날짜 = new Date(data.작성날짜._seconds * 1000);

  // Ensure `계산기설명` is an array
  if (typeof data.계산기설명 === 'string') {
    data.계산기설명 = data.계산기설명.split('\n').map((paragraph: string) => paragraph || "<br>");
  }

  return data;
}

export async function generateMetadata({ params }: DetailPageProps): Promise<Metadata> {
  const calculator = await fetchCalculatorData(params.userId, params.slug);
  return {
    title: calculator.계산기이름,
    description: calculator.계산기설명.join(' '),
    keywords: calculator.해시태그 ? calculator.해시태그.join(', ') : 'AiCalculator, calcwave, calculator, calculation',
    authors: [
      { name: calculator.이메일 }
    ],
    openGraph: {
      title: calculator.계산기이름,
      description: calculator.계산기설명.join(' '),
      type: 'article', // 추가된 속성
      images: [
        {
          url: 'https://firebasestorage.googleapis.com/v0/b/calc-sky4.appspot.com/o/metaImgae_calcwave.jpg?alt=media&token=72b0ca2c-47a5-4b16-b2f4-d42b2418ee55',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: calculator.계산기이름,
      description: calculator.계산기설명.join(' '),
      images: ['https://firebasestorage.googleapis.com/v0/b/calc-sky4.appspot.com/o/metaImgae_calcwave.jpg?alt=media&token=72b0ca2c-47a5-4b16-b2f4-d42b2418ee55'],
    },
  };
}

const DetailPage: React.FC<DetailPageProps> = async ({ params }) => {
  const { userId, slug } = params;
  const calculator = await fetchCalculatorData(userId, slug);

  return <ClientComponent calculator={calculator} userId={userId} slug={slug} />;
};

export default DetailPage;
