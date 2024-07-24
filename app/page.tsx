// ./app/page.tsx

'use client';

import React, { useEffect, useState } from 'react';
import { Avatar, Card, CardHeader, CardBody, CardFooter } from '@nextui-org/react';
import { collection, getDocs } from 'firebase/firestore';
import { firestore } from '../firestore';
import Link from 'next/link';

// Firestore의 실제 데이터 구조와 일치하도록 Detail 인터페이스 수정
interface Detail {
  id: string;
  작성자이름: string;
  계산기이름: string;
  해시태그: string[];
  방문자수: string; // Firestore에서는 숫자를 문자열로 저장하므로 타입 변경
  계산횟수: string; // Firestore에서는 숫자를 문자열로 저장하므로 타입 변경
  찜: string;       // Firestore에서는 숫자를 문자열로 저장하므로 타입 변경
  프로필사진: string;
  userId: string;
  slug: string;
}

export default function Home() {
  const [details, setDetails] = useState<Detail[]>([]);

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
  }, []);

  return (
    <div className="container grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-5">
      {details.map((detail) => (
        <Link key={detail.id} href={`/detail/${detail.userId}/${encodeURIComponent(detail.slug)}`}>
          <Card className="h-80 w-80 cursor-pointer">
            <CardHeader className="justify-between">
              <div className="flex gap-5">
                <Avatar isBordered radius="full" size="md" src={detail.프로필사진} />
                <div className="flex flex-col gap-1 items-start justify-center">
                  <h4 className="text-small font-semibold leading-none text-default-600">
                    {detail.작성자이름}
                  </h4>
                </div>
              </div>
            </CardHeader>
            <CardBody className="px-3 py-0 text-default-400">
              <p className="text-bold text-3xl">{detail.계산기이름}</p>
              <span className="pt-2">
                {detail.해시태그 ? detail.해시태그.map((tag: string) => `#${tag}`).join(' ') : ""}
              </span>
            </CardBody>
            <CardFooter className="gap-3">
              <div className="flex gap-1">
                <p className="font-semibold text-default-400 text-small">{detail.방문자수}</p>
                <p className="text-default-400 text-small">방문자</p>
              </div>
              <div className="flex gap-1">
                <p className="font-semibold text-default-400 text-small">{detail.계산횟수}</p>
                <p className="text-default-400 text-small">계산</p>
              </div>
              <div className="flex gap-1">
                <p className="font-semibold text-default-400 text-small">{detail.찜}</p>
                <p className="text-default-400 text-small">찜</p>
              </div>
            </CardFooter>
          </Card>
        </Link>
      ))}
    </div>
  );
}
