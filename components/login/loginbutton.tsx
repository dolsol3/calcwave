// ./components/login/loginbutton.tsx

'use client';
import React from 'react';
import { signInWithPopup } from 'firebase/auth';
import { auth, provider, firestore } from '../../firestore';
import { Button } from "@nextui-org/react";
import { useRouter } from 'next/navigation';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

const LoginButton: React.FC = () => {
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const emailPrefix = user.email ? user.email.split('@')[0] : '';

      // 사용자 정보를 Firestore에 저장 또는 업데이트
      const userDocRef = doc(firestore, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        // 문서가 이미 존재하는 경우 업데이트
        await updateDoc(userDocRef, {
          userId: emailPrefix,
        });
      } else {
        // 문서가 존재하지 않는 경우 새로 생성
        await setDoc(userDocRef, {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          userId: emailPrefix,
        });
      }

      router.push('/');
    } catch (error) {
      console.error("Error requesting login:", error);
      alert('Login failed.');
    }
  };

  return (
    <Button 
      className="bg-[#2E8B57] text-white hover:bg-[#40E0D0] transition duration-300"
      onClick={handleLogin}
    >
      Login
    </Button>
  );
};

export default LoginButton;
