"use client";

import Link from "next/link";
import Image from "next/image";
import useSWR from "swr";
import { useSession } from "next-auth/react";
import styles from "./comments.module.css";
import Picker from "emoji-picker-react";
import { useState, useRef, useEffect } from "react";


const fetcher = async (url) => {
  const res = await fetch(url);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch");
  return data;
};

const Comments = ({ postSlug }) => {
  const { status, data: session } = useSession();
  const { data, mutate, isLoading } = useSWR(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/comments?postSlug=${postSlug}`,
    fetcher
  );

  const [desc, setDesc] = useState("");

  const [showEmojis, setShowEmojis] = useState(false);
const textareaRef = useRef(null);
const emojiWrapperRef = useRef(null);

const onEmojiClick = (emojiData) => {
  setDesc((prev) => prev + emojiData.emoji);
};

useEffect(() => {
  const handleClickOutside = (e) => {
    if (
      showEmojis &&
      emojiWrapperRef.current &&
      !emojiWrapperRef.current.contains(e.target)
    ) {
      setShowEmojis(false);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);
  return () => document.removeEventListener("mousedown", handleClickOutside);
}, [showEmojis]);


  // Add comment
  const handleSubmit = async () => {
    if (!desc.trim()) return;
    await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ desc, postSlug }),
    });
    setDesc("");
    mutate();
  };

  // Delete comment
  const handleDelete = async (id) => {
    if (!confirm("Opravdu chcete smazat komentář?")) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/comments?id=${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Nepodařilo se smazat komentář");
      mutate();
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  const formatCommentDate = (isoString) => {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now - date;
    const diffMinutes = Math.floor(diffMs / 1000 / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);
    const pad = (num) => String(num).padStart(2, "0");
    const time = `${pad(date.getHours())}:${pad(date.getMinutes())}`;

    if (diffDays === 0) {
      if (diffHours === 1) return `před hodinou`;
      if (diffHours > 0) return `před ${diffHours} hodinami`;
      if (diffMinutes > 0) return `před ${diffMinutes} minutami`;
      return "právě teď";
    }
    if (diffDays === 1) return `včera ${time}`;
    if (diffDays <= 7) return `před ${diffDays} dny ${time}`;
    return `${pad(date.getDate())}.${pad(date.getMonth() + 1)}.${date.getFullYear()} ${time}`;
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Komentáře</h1>

      {status === "authenticated" ? (
        <div className={styles.write}>
          <div className={styles.textareaWrapper} ref={emojiWrapperRef}>
            <textarea
              ref={textareaRef}
              placeholder="Napsat komentář..."
              className={styles.input}
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
            />

            <button
              type="button"
              className={styles.emojiBtn}
              onClick={() => setShowEmojis((prev) => !prev)}
            >
              😀
            </button>

            {showEmojis && (
              <div className={styles.emojiPicker}>
                <Picker onEmojiClick={onEmojiClick} />
              </div>
            )}
          </div>

          <button className={styles.button} onClick={handleSubmit}>
            Poslat
          </button>
        </div>
      ) : (
        <Link href="/login">Přihlas se pro psaní komentářů</Link>
      )}

      <div className={styles.comments}>
        {isLoading
          ? "Loading..."
          : data?.map((item) => (
              <div className={styles.comment} key={item.id}>
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
                    <span className={styles.username}>{item.user.name || item.userEmail}</span>
                    <span className={styles.date}>{formatCommentDate(item.createdAt)}</span>
                  </div>

                  {session &&
                    (session.user.email === item.userEmail ||
                      session.user.email === item.post.userEmail) && (
                      <button className={styles.deleteBtn}
                        onClick={() => handleDelete(item.id)}
                      >
                        <svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3 6H21M5 6V20C5 21.1046 5.89543 22 7 22H17C18.1046 22 19 21.1046 19 20V6M8 6V4C8 2.89543 8.89543 2 10 2H14C15.1046 2 16 2.89543 16 4V6" stroke="#e35454" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M14 11V17" stroke="#e35454" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M10 11V17" stroke="#e35454" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                      </button>
                    )}
                </div>

                <p className={styles.desc}>{item.desc}</p>
              </div>
            ))}
      </div>
    </div>
  );
};

export default Comments;
