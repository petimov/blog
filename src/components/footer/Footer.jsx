import React from "react";
import styles from "./footer.module.css";
import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  return (
    <div className={styles.container}>
      <div className={styles.info}>
        <div className={styles.logo}>
          <Image src="/logo.png" alt="lama blog" width={50} height={50} />
          <h1 className={styles.logoText}>Blog</h1>
        </div>
        <p className={styles.desc}>
          Chci zde sdílet své zážitky a poznatky ze života
        </p>
        <div className={styles.icons}>
          <Link href="/https://www.facebook.com/petrmovsesjan1" className={styles.link}>
          <Image src="/facebook.png" alt="facebook" width={18} height={18} />
        </Link>
        <Link href="/https://www.instagram.com/petrmovsesjan" className={styles.link}>
          <Image src="/instagram.png" alt="" width={18} height={18} />
        </Link>
        </div>
      </div>
      <div className={styles.links}>
        <div className={styles.list}>
          <span className={styles.listTitle}>Odkazy</span>
          <Link href="/">Blog</Link>
          <Link href="/">O mně</Link>
        </div>
        <div className={styles.list}>
          <span className={styles.listTitle}>Tagy</span>
          <Link href="/">Dvojplamen</Link>
        </div>
        <div className={styles.list}>
          <span className={styles.listTitle}>Socky</span>
          <Link href="https://www.facebook.com/petrmovsesjan1">Facebook</Link>
          <Link href="https://www.instagram.com/petrmovsesjan">Instagram</Link>
        </div>
      </div>
    </div>
  );
};

export default Footer;
