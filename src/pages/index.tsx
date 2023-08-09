import FormUploader from "@/Components/FormUploader";
import styles from "@/styles/Home.module.css";
import Link from "next/link";

export default function Home() {

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>Image Uploader</h1>
        <p className={styles.description}>Upload your image to Cloudinary!</p>
        <FormUploader uploadPreset="00-start" />
        <Link href={"/uploads"}>Ver imagenes</Link>
      </main>
    </div>
  );
}
