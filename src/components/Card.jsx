import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";

const Card = ({ name, caption, price, images, id }) => {
  return (
    <div className="card-container">
      <div className="image-container">
        <Swiper
          pagination={{ dynamicBullets: true }}
          modules={[Pagination]}
          className="mySwiper h-full"
        >
          {images.map((item, index) => (
            <div key={id + index}>
              <SwiperSlide>
                <div
                  className="image"
                  style={{
                    backgroundImage: `url("http://167.88.36.120:1007${item}")`,
                  }}
                ></div>
              </SwiperSlide>
            </div>
          ))}
        </Swiper>
      </div>
      <div className="caption-container tracking-tight">
        <div className=" font-semibold"> {name}</div>
        <div className="ellipsis caption">{caption}</div>
        <div className="caption">
          <span className=" font-semibold underline text-black">${price}</span>{" "}
          por 3 noches
        </div>
      </div>
    </div>
  );
};

export default Card;
