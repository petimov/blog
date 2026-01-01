"use client";

import Image from "next/image";
import styles from "./card.module.css";
import Link from "next/link";
import { useEffect, useState } from "react";
import { auth } from "@/utils/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";

const Card = ({ key, item }) => {
  const [user, setUser] = useState(null);
   const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const isAuthor =
  user?.email?.trim().toLowerCase() === item.user?.email?.trim().toLowerCase();

  const goToEdit = () => {
    router.push(`/api/posts/${item.slug}/edit`);
  };

  return (
    <Link href={`/posts/${item.slug}`} className={styles.link}>
    <div className={styles.container} key={key}>
      {isAuthor && (
        <Link
          href={`/api/posts/${item.slug}/edit`}
          onClick={goToEdit}
          className={styles.editButton}
        >
          ✏️ Edit
        </Link>
      )}

      {item.img && (
        <div className={styles.imageContainer}>
          <Image src={item.img} alt="" fill className={styles.image} />
        </div>
      )}

      <div className={styles.textContainer}>
        <div className={styles.detail}>
          <span className={styles.date}>{item.createdAt.substring(0, 10)} - </span>
          <span className={styles.category}>{item.catSlug}</span>
        </div>
        <Link href={`/posts/${item.slug}`}>
          <h1>{item.title}</h1>
        </Link>
        <div
          className={styles.desc}
          dangerouslySetInnerHTML={{ __html: item?.desc.substring(0, 60) }}
        />
      </div>
    </div>
    </Link>
  );
};

export default Card;
