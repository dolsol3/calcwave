// components/navbar/logo.jsx

import React from "react";
import Link from "next/link";
import Image from "next/image";
import logo from "../../app/logo.png";

const Logo = () => (
  <Link href="/">
    <Image src={logo} alt="CalcWave Logo" height="36" width="36" />
  </Link>
);

export default Logo;
