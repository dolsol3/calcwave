// ./app/login/page.tsx

import React from 'react';
import LoginButton from '@/components/login/loginbutton';
import { Card, CardBody, CardHeader } from "@nextui-org/react";

const LoginPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center bg-[#F0F8FF] px-4">
      <h1 className="text-4xl font-bold text-[#2E8B57] my-10 font-['Roboto Rounded']">로그인</h1>
      <Card className="max-w-md w-full shadow-md rounded-lg bg-white">
        <CardBody className="p-8 flex flex-col items-center">
          <p className="text-center text-[#333333] mb-6">Google 계정으로 로그인하세요</p>
          <LoginButton />
        </CardBody>
      </Card>
    </div>
  );
};

export default LoginPage;
