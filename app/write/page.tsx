// app/write/page.tsx
'use client'
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '../../firestore';
import { onAuthStateChanged, User } from 'firebase/auth';
import Title from '../../components/write/Title';
import { Button } from "@nextui-org/react";

const WritePage: React.FC = () => {
 const [user, setUser] = useState<User | null>(null);
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

 const handlePublish = async () => {
   if (!user) {
     alert("로그인이 필요합니다.");
     return;
   }

   const docData = {
     uid: user.uid,
     userName: user.displayName,
     userPicture: user.photoURL,
     title,
     description,
     hashtag,
   };

   try {
     const response = await fetch('https://publish-hry6fdb6aa-du.a.run.app', {
       method: 'POST',
       headers: {
         'Content-Type': 'application/json',
         'Authorization': `Bearer ${await user.getIdToken()}`,
       },
       body: JSON.stringify(docData),
     });

     if (response.ok) {
       const responseData = await response.json();
       router.push(`/detail/${responseData.userId}/${responseData.slug}`);
     } else {
       const errorData = await response.json();
       alert(errorData.error);
     }
   } catch (error) {
     console.error("계산기 발행 중 오류가 발생했습니다:", error);
     alert('계산기 발행에 실패했습니다.');
   }
 };

 if (!user) {
  return <div>Loading...</div>;
 }

 return (
   <div className="container mx-auto p-4">
     <Title setTitle={setTitle} setDescription={setDescription} setHashtag={setHashtag} />
     <Button onClick={handlePublish} className="mt-4">계산기 발행하기</Button>
   </div>
 );
};

export default WritePage;