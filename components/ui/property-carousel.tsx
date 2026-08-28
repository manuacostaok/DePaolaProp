"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { PropertyCard, type PropertyCardProps } from "@/components/ui/property-card";

export function PropertyCarousel({ properties }: { properties: (PropertyCardProps & { id: string })[] }) {
  return (
    <Swiper
      modules={[Pagination]}
      spaceBetween={24}
      slidesPerView={1.15}
      pagination={{ clickable: true }}
      breakpoints={{
        640: { slidesPerView: 2, spaceBetween: 24 },
        1024: { slidesPerView: 3, spaceBetween: 24 },
      }}
      className="!pb-11"
      style={
        {
          "--swiper-pagination-color": "#00385c",
          "--swiper-pagination-bullet-inactive-color": "#ded7c6",
          "--swiper-pagination-bullet-inactive-opacity": "1",
        } as React.CSSProperties
      }
    >
      {properties.map(({ id, ...card }) => (
        <SwiperSlide key={id}>
          <PropertyCard {...card} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
