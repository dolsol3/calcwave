// app/write/page.tsx
'use client'
import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { auth } from '../../firestore';
import { onAuthStateChanged, User } from 'firebase/auth'; // User 타입 가져오기
import { CalculationProvider } from '../../components/write/useCalculationState';
import Title from '../../components/write/Title';

const CalculatorPad = dynamic(() => import('../../components/write/CalculatorPad'), { ssr: false });
const PreviewScreen = dynamic(() => import('../../components/write/PreviewScreen'), { ssr: false });

const CalculationPage: React.FC = () => {
 const [user, setUser] = useState<User | null>(null); // User 타입 또는 null 허용
 const router = useRouter();
 const [title, setTitle] = useState('');
 const [description, setDescription] = useState('');
 const [hashtag, setHashtag] = useState('');

 useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (user) => {
   if (user) {
    setUser(user);
   } else {
    router.push('/login');
   }
  });

  return () => unsubscribe();
 }, [router]);

 if (!user) {
  return <div>Loading...</div>;
 }

 return (
  <CalculationProvider>
   <div className="container mx-auto p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
    <Title setTitle={setTitle} setDescription={setDescription} setHashtag={setHashtag} />
    <CalculatorPad />
    <PreviewScreen title={title} description={description} hashtag={hashtag} />
   </div>
  </CalculationProvider>
 );
};

export default CalculationPage;