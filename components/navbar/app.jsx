// ./components/navbar/app.jsx

'use client';
import React, { useEffect, useState } from "react";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Input, Link } from "@nextui-org/react";
import Logo from "./logo.jsx";
import { SearchIcon } from "./SearchIcon.jsx";
import { auth } from "../../firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";

export default function NavbarApp() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("User state changed:", user); // 상태 변경 확인을 위한 로그
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log("User logged out"); // 로그아웃 확인을 위한 로그
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  };

  return (
    <Navbar isBordered className="bg-[#2E8B57] bg-opacity-90 backdrop-blur-sm">
      <NavbarBrand>
        <Logo />
        <p className="font-bold text-white hidden sm:block font-['Roboto Rounded']">CalcWave</p>
      </NavbarBrand>

      <NavbarContent justify="end" className="gap-4">
        {/* 검색 부분은 추후 개발하기 */}
        {/* <NavbarItem className="flex">
          <Input
            classNames={{
              base: "max-w-[140px] sm:max-w-[200px] h-10",
              mainWrapper: "h-full",
              input: "text-small",
              inputWrapper: "h-full font-normal text-[#2E8B57] bg-[#F0F8FF] bg-opacity-90",
            }}
            placeholder="Search"
            size="sm"
            startContent={<SearchIcon size={18} />}
            type="search"
          />
        </NavbarItem> */}
        {user ? (
          <>
            <NavbarItem>
              <Link href="/write" className="text-white hover:text-[#40E0D0] transition-colors ripple-effect">
                Write
              </Link>
            </NavbarItem>
            <NavbarItem>
              <span 
                onClick={handleLogout} 
                className="text-white hover:text-[#40E0D0] transition-colors cursor-pointer ripple-effect">
                Logout
              </span>
            </NavbarItem>
          </>
        ) : (
          <NavbarItem>
            <Link href="/login" className="text-white hover:text-[#40E0D0] transition-colors ripple-effect">
              Login
            </Link>
          </NavbarItem>
        )}
      </NavbarContent>
    </Navbar>
  );
}
