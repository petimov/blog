import React from "react";
import styles from "./menu.module.css";
import Link from "next/link";
import Image from "next/image";
import MenuPosts from "../menuPosts/MenuPosts";
import MenuCategories from "../menuCategories/MenuCategories";

const Menu = () => {
  return (
    <div className={styles.container}>
      <h2 className={styles.subtitle}>{"co je populární"}</h2>
      <h1 className={styles.title}>Nejpopulárnější</h1>
      <MenuPosts withImage={false} />
      <h2 className={styles.subtitle}>Objev podle témata</h2>
      <h1 className={styles.title}>Kategorie</h1>
      <MenuCategories />
      <h2 className={styles.subtitle}>Vybráno autorem</h2>
      <h1 className={styles.title}>Autorův výběr</h1>
      <MenuPosts withImage={true} />
    </div>
  );
};

export default Menu;
