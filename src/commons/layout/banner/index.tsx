'use client';

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import Image from 'next/image';
import styles from './Banner.module.css';

import 'swiper/css';
import 'swiper/css/pagination';

export default function Banner() {
  return (
    <Swiper
      pagination={true}
      modules={[Pagination, Autoplay]}
      autoplay={{
        delay: 3000,
        disableOnInteraction: false,
      }}
      loop={true}
      className={styles.mySwiper}
    >
      <SwiperSlide>
        <Image
          src="/images/banner1.png"
          alt="배너사진"
          width={1920}
          height={516}
          quality={100}
          priority
        />
      </SwiperSlide>
      <SwiperSlide>
        <Image
          src="/images/banner2.png"
          alt="배너사진"
          width={1920}
          height={516}
          quality={100}
        />
      </SwiperSlide>
      <SwiperSlide>
        <Image
          src="/images/banner3.png"
          alt="배너사진"
          width={1920}
          height={516}
          quality={100}
        />
      </SwiperSlide>
    </Swiper>
  );
}
