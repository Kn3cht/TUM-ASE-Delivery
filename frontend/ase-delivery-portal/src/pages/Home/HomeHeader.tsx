import React, { FC } from "react";
import { Carousel } from "antd";
import styles from "./home.module.scss";

export const HomeHeader: FC = () => {
  const images = ["/header.jpg", "/header2.jpg", "header3.jpg"];

  return (
    <div className={styles.header}>
      <Carousel dotPosition={"top"} autoplay>
        {images.map((image) => (
          <img
            key={image}
            alt={"Ase Delivery"}
            className={styles.carouselImage}
            src={image}
          />
        ))}
      </Carousel>
      <div className={styles.title}>ASE Delivery</div>
    </div>
  );
};
