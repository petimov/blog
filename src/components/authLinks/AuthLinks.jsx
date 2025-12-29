"use client";
import Link from "next/link";
import styles from "./authLinks.module.css";
import { useState } from "react";
import { signOut, useSession } from "next-auth/react";

const AuthLinks = () => {
  const [open, setOpen] = useState(false);

  const { status } = useSession();

  return (
    <>
      {status === "unauthenticated" ? (
        <Link href="/login" className={styles.link}>
          Přihlášení
        </Link>
      ) : (
        <>
          <Link href="/write" className={styles.link}>
            Write
          </Link>
          <span className={styles.link} onClick={signOut}>
            Odhlášení
          </span>
        </>
      )}
      <div className={styles.burger} onClick={() => setOpen(!open)}>
        <div className={styles.line}></div>
        <div className={styles.line}></div>
        <div className={styles.line}></div>
      </div>
      {open && (
        <div className={styles.responsiveMenu}>
          <Link href="/o-mne">O mně</Link>
          {status === "notauthenticated" ? (
            <Link href="/login">Přihlášení</Link>
          ) : (
            <>
              <Link href="/write">Napsat</Link>
              <span className={styles.link}>Odhlášení</span>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default AuthLinks;
