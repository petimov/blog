"use client";

import Image from "next/image";
import styles from '../../../../write/writePage.module.css'
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { app } from "@/utils/firebase";

// ReactQuill dynamically imported
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.bubble.css";

const EditPage = ({ params }) => {
  const { slug } = params;
  const { status } = useSession();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [media, setMedia] = useState("");
  const [value, setValue] = useState("");
  const [title, setTitle] = useState("");
  const [catSlug, setCatSlug] = useState("");
  const [isClient, setIsClient] = useState(false);

  // Client render
  useEffect(() => setIsClient(true), []);

  // File upload
  useEffect(() => {
    if (!file || !isClient) return;

    const storage = getStorage(app);
    const name = new Date().getTime() + file.name;
    const storageRef = ref(storage, name);

    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
      },
      (error) => console.error(error),
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setMedia(downloadURL);
        });
      }
    );
  }, [file, isClient]);

  // Redirect if not logged in
  useEffect(() => {
    if (status === "unauthenticated") router.push("/");
  }, [status]);

  // Fetch existing post
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/posts/${slug}`);
        const post = await res.json();

        setTitle(post.title || "");
        setValue(post.desc || "");
        setMedia(post.img || "");
        setCatSlug(post.catSlug || "style");
      } catch (err) {
        console.error(err);
      }
    };
    fetchPost();
  }, [slug]);

  if (status === "loading" || !isClient) return <div>Loading...</div>;

  // Slug helper
  const slugify = (str) =>
    str
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");

  const handleSubmit = async () => {
    try {
      const res = await fetch(`/api/posts/${slug}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          desc: value,
          img: media,
          catSlug: catSlug || "style",
        }),
      });

      if (!res.ok) throw new Error("Update failed");

      const data = await res.json();
      router.push(`/posts/${data.slug}`);
    } catch (err) {
      console.error(err);
      alert("Failed to update post");
    }
  };

  return (
    <div className={styles.container}>
      <input
        type="text"
        placeholder="Název"
        className={styles.input}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <select
        className={styles.select}
        value={catSlug}
        onChange={(e) => setCatSlug(e.target.value)}
      >
        <option value="style">style</option>
        <option value="dvojplamen">dvojplamen</option>
        <option value="hokej">hokej</option>
      </select>

      <div className={styles.editor}>
        <button className={styles.button} onClick={() => setOpen(!open)}>
          <Image src="/plus.png" alt="" width={16} height={16} />
        </button>

        {open && (
          <div className={styles.add}>
            <input
              type="file"
              id="image"
              onChange={(e) => setFile(e.target.files[0])}
              style={{ display: "none" }}
            />
            <button className={styles.addButton}>
              <label htmlFor="image">
                <Image src="/image.png" alt="" width={16} height={16} />
              </label>
            </button>
            <button className={styles.addButton}>
              <Image src="/external.png" alt="" width={16} height={16} />
            </button>
            <button className={styles.addButton}>
              <Image src="/video.png" alt="" width={16} height={16} />
            </button>
          </div>
        )}

        <ReactQuill
          className={styles.textArea}
          theme="bubble"
          value={value}
          onChange={setValue}
          placeholder="Text..."
        />
      </div>

      <button className={styles.publish} onClick={handleSubmit}>
        Uložit změny
      </button>
    </div>
  );
};

export default EditPage;
