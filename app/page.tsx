// ./app/page.tsx

'use client';

import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { firestore } from '../firestore';
import Link from 'next/link';
import { Card, CardBody, CardHeader, Chip } from "@nextui-org/react";

interface Detail {
  id: string;
  계산기이름: string;
  해시태그: string[];
  방문자수: string;
  계산횟수: string;
  userId: string;
  slug: string;
}

export default function Home() {
  const [details, setDetails] = useState<Detail[]>([]);
  const [hydrated, setHydrated] = useState(false); // Hydration 상태

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const querySnapshot = await getDocs(collection(firestore, "detail"));
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Detail[];
        setDetails(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchDetails();
    setHydrated(true); // 클라이언트에서 데이터가 로드되었음을 설정
  }, []);

  if (!hydrated) {
    return null; // 클라이언트가 준비되기 전에 아무것도 렌더링하지 않음
  }

  return (
    <div className="w-full max-w-7xl mx-auto py-8">
      <h1 className="text-4xl font-bold text-center mb-10 text-[#2E8B57] font-['Roboto Rounded']">AI Wave Calculator</h1>
      <div className="relative">
        <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-[#87CEEB] transform -translate-x-1/2"></div>
        {details.map((detail, index) => (
          <div key={detail.id} className="relative mb-8">
            <div className={`w-full md:w-[45%] lg:w-[48%] ${index % 2 === 0 ? 'md:ml-auto' : 'md:mr-auto'}`}>
              <Card 
                as={Link}
                href={`/detail/${detail.userId}/${encodeURIComponent(detail.slug)}`}
                className="hover:shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-1 overflow-hidden ripple-effect"
                style={{
                  background: 'linear-gradient(135deg, #ffffff 0%, #f0f8ff 100%)'
                }}
              >
                <CardHeader className="pb-0 pt-2 px-4">
                  <h3 className="text-xl font-semibold text-[#333333] font-['Noto Serif']">{detail.계산기이름}</h3>
                </CardHeader>
                <CardBody className="py-2 px-4">
                  <div className="flex flex-wrap gap-1 mb-2">
                    {detail.해시태그.slice(0, 3).map((tag, tagIndex) => (
                      <Chip 
                        key={tagIndex} 
                        size="sm" 
                        variant="flat" 
                        className="bg-[#87CEEB] bg-opacity-20 text-[#2E8B57]"
                      >
                        {tag}
                      </Chip>
                    ))}
                  </div>
                  <div className="flex justify-end text-xs text-[#666666] mt-2">
                    <span className="mr-2">Views {detail.방문자수}</span>
                    <span>Calculations {detail.계산횟수}</span>
                  </div>
                </CardBody>
              </Card>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
