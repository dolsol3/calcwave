// ./app/login/page.tsx

import React from 'react';
import LoginButton from '@/components/login/loginbutton';
import { Card, CardBody } from "@nextui-org/react";

const LoginPage: React.FC = () => {
  return (
    <>
      <h1 className="text-4xl font-bold text-[#2E8B57] mb-8 font-['Roboto Rounded'] text-center">Login & Sign up</h1>
      <Card className="max-w-md w-full shadow-md rounded-lg bg-white mx-auto">
        <CardBody className="p-8 flex flex-col items-center">
          <p className="text-center text-[#333333] mb-6">Sign in with Google Account</p>
          <LoginButton />
        </CardBody>
      </Card>
    </>
  );
};

export default LoginPage;