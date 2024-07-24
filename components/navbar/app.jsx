// components/navbar/App.jsx

'use client'
import React, { useEffect, useState } from "react";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Input, Link } from "@nextui-org/react";
import { AcmeLogo } from "./AcmeLogo.jsx";
import { SearchIcon } from "./SearchIcon.jsx";
import { auth } from "../../firestore"; // firebase 설정 가져오기
import { onAuthStateChanged, signOut } from "firebase/auth";

export default function NavbarApp() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log(`현재 로그인 아이디: ${user.email}`);
        setUser(user);
      } else {
        console.log("로그인한 아이디가 없습니다.");
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log("로그아웃 되었습니다.");
    } catch (error) {
      console.error("로그아웃 실패:", error);
    }
  };

  return (
    <Navbar isBordered>
      <NavbarContent justify="start">
        <NavbarBrand className="mr-4">
          <Link href="/" color="foreground">
          <AcmeLogo />
          <p className="hidden sm:block font-bold text-inherit">AI 계산기</p>
          </Link>
        </NavbarBrand>
        <NavbarContent className="hidden sm:flex gap-3">
          {user ? (
            <>
              <NavbarItem>
                <Link href="#" color="foreground" onClick={handleLogout}>
                  로그아웃
                </Link>
              </NavbarItem>
              <NavbarItem>
                <Link href="/write" color="foreground">
                  글쓰기
                </Link>
              </NavbarItem>
            </>
          ) : (
            <NavbarItem isActive>
              <Link href="/login" aria-current="page" color="secondary">
                로그인
              </Link>
            </NavbarItem>
          )}
        </NavbarContent>
      </NavbarContent>

      <NavbarContent as="div" className="items-center" justify="end">
        <Input
          classNames={{
            base: "max-w-full sm:max-w-[10rem] h-10",
            mainWrapper: "h-full",
            input: "text-small",
            inputWrapper: "h-full font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20",
          }}
          placeholder="계산기 찾기"
          size="sm"
          startContent={<SearchIcon size={18} />}
          type="search"
        />
      </NavbarContent>
    </Navbar>
  );
}

