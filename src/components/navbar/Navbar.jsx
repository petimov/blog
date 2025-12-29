import React from "react";
import styles from "./navbar.module.css";
import Image from "next/image";
import Link from "next/link";
import AuthLinks from "../authLinks/AuthLinks";
import ThemeToggle from "../themeToggle/ThemeToggle";

const Navbar = () => {
  return (
    <div className={styles.container}>
      <div className={styles.social}>
        <Link href="https://www.facebook.com/petrmovsesjan1" target="_blank" className={styles.link}>
          <Image src="/facebook.png" alt="facebook" width={24} height={24} />
        </Link>
        <Link href="https://www.instagram.com/petrmovsesjan" target="_blank" className={styles.link}>
          <Image src="/instagram.png" alt="instagram" width={24} height={24} />
        </Link>
      </div>
      <div className={styles.logo}>blog</div>
      <div className={styles.links}>
        <ThemeToggle />
        <Link href="/" className={styles.link}>O mně</Link>
        <AuthLinks />
      </div>
    </div>
  );
};

export default Navbar;
