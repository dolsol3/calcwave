// components/navbar/App.jsx

'use client'
import React, { useEffect, useState } from "react";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Input, Link } from "@nextui-org/react";
import { AcmeLogo } from "./AcmeLogo.jsx";
import { SearchIcon } from "./SearchIcon.jsx";
import { auth } from "../../firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";

export default function NavbarApp() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("로그아웃 실패:", error);
    }
  };

  return (
    <Navbar isBordered className="bg-[#2E8B57] bg-opacity-90 backdrop-blur-sm">
      <NavbarBrand>
        <AcmeLogo />
        <p className="font-bold text-white hidden sm:block font-['Roboto Rounded']">CalcWave</p>
      </NavbarBrand>

      <NavbarContent justify="end" className="gap-4">
        <NavbarItem className="flex">
          <Input
            classNames={{
              base: "max-w-[140px] sm:max-w-[200px] h-10",
              mainWrapper: "h-full",
              input: "text-small",
              inputWrapper: "h-full font-normal text-[#2E8B57] bg-[#F0F8FF] bg-opacity-90",
            }}
            placeholder="계산기 찾기"
            size="sm"
            startContent={<SearchIcon size={18} />}
            type="search"
          />
        </NavbarItem>
        {user ? (
          <>
            <NavbarItem>
              <Link href="/write" className="text-white hover:text-[#40E0D0] transition-colors ripple-effect">
                글쓰기
              </Link>
            </NavbarItem>
            <NavbarItem>
              <span 
                onClick={handleLogout} 
                className="text-white hover:text-[#40E0D0] transition-colors cursor-pointer ripple-effect"
              >
                로그아웃
              </span>
            </NavbarItem>
          </>
        ) : (
          <NavbarItem>
            <Link href="/login" className="text-white hover:text-[#40E0D0] transition-colors ripple-effect">
              로그인
            </Link>
          </NavbarItem>
        )}
      </NavbarContent>
    </Navbar>
  );
}