// app/logIn/page.tsx
import dynamic from 'next/dynamic';
import { Card, CardHeader, CardBody, CardFooter, Avatar, Button } from "@nextui-org/react";

const LoginButton = dynamic(() => import('../../components/login/loginbutton'), { ssr: false });

function LoginPage() {
  return (
    // Tailwind CSS를 사용한 전체 화면 크기의 Flexbox 컨테이너 생성
    <div className="grid justify-center items-center min-h-screen">
      <Card className="h-80 w-80">
        <CardHeader className="justify-center">
          <div className="grid gap-5">
            <div className="grid grid-col gap-1 justify-center">
              <h1 className="mt-3 text-3xl font-semibold leading-none text-default-640">로그인</h1>
            </div>
          </div>
        </CardHeader>
        <CardBody className="flex justify-center items-center px-3 py-0 text-default-400">
          <p className="text-bold text-sm">구글 이메일로 회원가입 및 로그인을 합니다.</p>

        </CardBody>
        <CardFooter className="justify-center py-10">
          <LoginButton />
        </CardFooter>
      </Card>
    </div>
  );
}

export default LoginPage;
