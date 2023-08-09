import React, { useEffect, useState } from "react";
import styles from "@/styles/Uploads.module.css";
import Image from "next/image";

const uploads = () => {
  const [images, setImages] = useState([]);

  useEffect(() => {
    fetch("/api/v1/images", { method: "GET" })
      .then((res) => res.json())
      .then((data) => setImages(data))
      .catch((e) => {
        if (e instanceof Error) {
          console.log(e.message);
        }
      });
  }, []);

  return (
    <section className={styles.container}>
      {images.length > 0 &&
        images.map((img: any) => (
          <article key={img._id} className={styles.article}>
            <Image
              className={styles.image}
              src={
                img.image
              }
              alt="image"
              width={150}
              height={150}
            />
          </article>
        ))}
    </section>
  );
};

export default uploads;
