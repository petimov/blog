"use client";

import Link from "next/link";
import styles from "./comments.module.css";
import Image from "next/image";
import useSWR from "swr";
import { useSession } from "next-auth/react";
import { useState } from "react";

const fetcher = async (url) => {
  const res = await fetch(url);

  const data = await res.json();

  if (!res.ok) {
    const error = new Error(data.message);
    throw error;
  }

  return data;
};

const Comments = ({ postSlug }) => {
  const { status } = useSession();

  const { data, mutate, isLoading } = useSWR(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/comments?postSlug=${postSlug}`,
    fetcher
  );

  const [desc, setDesc] = useState("");

  const handleSubmit = async () => {
    await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/comments`, {
      method: "POST",
      body: JSON.stringify({ desc, postSlug }),
    });
    mutate();
  };

const formatCommentDate = (isoString) => {
  const date = new Date(isoString);
  const now = new Date();

  const diffMs = now - date;
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  const pad = (num) => String(num).padStart(2, "0");
  const time = `${pad(date.getHours())}:${pad(date.getMinutes())}`;

  const minutesAgo = (minutes) => {
    if (minutes === 1) return "před jednou minutou";
    return `před ${minutes} minutami`;
  };

  const hoursAgo = (hours) => {
    if (hours === 1) return "před 1 hodinou";
    return `před ${hours} hodinami`;
  };

  if (diffDays === 0) {
    if (diffHours > 0) return hoursAgo(diffHours);
    if (diffMinutes > 0) return minutesAgo(diffMinutes);
    return "právě teď";
  }
  if (diffDays === 1) return `včera ${time}`;
  if (diffDays === 2) return `před 2 dny ${time}`;
  if (diffDays <= 7) return `před ${diffDays} dny ${time}`;

  // Older than a week: full date
  return `${pad(date.getDate())}.${pad(date.getMonth() + 1)}.${date.getFullYear()} ${time}`;
};



  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Komentáře</h1>
      {status === "authenticated" ? (
        <div className={styles.write}>
          <textarea
            placeholder="Napsat komentář..."
            className={styles.input}
            onChange={(e) => setDesc(e.target.value)}
          />
          <button className={styles.button} onClick={handleSubmit}>
            Poslat
          </button>
        </div>
      ) : (
        <Link href="/login">Přihlas se pro psaní komentářů</Link>
      )}
      <div className={styles.comments}>
        {isLoading
          ? "loading"
          : data?.map((item) => (
              <div className={styles.comment} key={item._id}>
                <div className={styles.user}>
                  {item?.user?.image && (
                    <Image
                      src={item.user.image}
                      alt=""
                      width={50}
                      height={50}
                      className={styles.image}
                    />
                  )}
                  <div className={styles.userInfo}>
                    <span className={styles.username}>{item.user.name}</span>
                    <span className={styles.date}>{formatCommentDate(item.createdAt).toLocaleString()}</span>
                  </div>
                </div>
                <p className={styles.desc}>{item.desc}</p>
              </div>
            ))}
      </div>
    </div>
  );
};

export default Comments;
