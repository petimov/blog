"use client";

import Image from "next/image";
import styles from '../../../../write/writePage.module.css'
import { useEffect, useState, useRef } from "react";
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
  const quillRef = useRef(null);

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

    const imageHandler = () => {
  const input = document.createElement("input");
  input.setAttribute("type", "file");
  input.setAttribute("accept", "image/*");
  input.click();

  input.onchange = async () => {
    const file = input.files[0];
    if (!file) return;

    const storage = getStorage(app);
    const name = new Date().getTime() + file.name;
    const storageRef = ref(storage, name);

    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      null,
      console.error,
      async () => {
        const url = await getDownloadURL(uploadTask.snapshot.ref);
        const quill = quillRef.current.getEditor();
        const range = quill.getSelection(true);
        quill.insertEmbed(range.index, "image", url);
        quill.setSelection(range.index + 1);
      }
    );
  };
};

  const slugify = (str) =>
    str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");


        const modules = {
    toolbar: {
      container: [
        ["bold", "italic", "underline"],
        [{ header: [1, 2, 3, false] }],
        [{ list: "ordered" }, { list: "bullet" }],
        ["image"],
        ["clean"],
      ],
      handlers: {
        image: imageHandler,
      },
    },
  };

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
      {/* DELETE BTN */}
      <button
          className={styles.delete}
          onClick={async () => {
            if (!confirm("Are you sure you want to delete this post?")) return;

            try {
              const res = await fetch(`/api/posts/${slug}`, {
                method: "DELETE",
              });

              if (!res.ok) throw new Error("Delete failed");

              alert("Post deleted!");
              router.push("/");
            } catch (err) {
              console.error(err);
              alert("Failed to delete post");
            }
          }}
        >
          Delete Post
        </button>
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
        {media && (
  <div style={{ marginBottom: "20px" }}>
    <Image
      src={media}
      alt="Post image"
      width={800}
      height={400}
      style={{ objectFit: "cover", borderRadius: "8px" }}
    />
  </div>
)}


        <ReactQuill
          className={styles.textArea}
          ref={quillRef}
          modules={modules}
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
