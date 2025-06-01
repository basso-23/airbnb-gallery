import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import { GoHeart } from "react-icons/go";
import { GoHeartFill } from "react-icons/go";
import { IoClose } from "react-icons/io5";
import { IoMdImages } from "react-icons/io";

const Card = ({ name, caption, price, images, link, id }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState();

  const [modalIsOpen, setIsOpen] = useState(false);

  // Obtener likes guardados en localstorage
  useEffect(() => {
    const likedItems = JSON.parse(localStorage.getItem("likedItems")) || [];
    setIsLiked(likedItems.includes(id));
  }, [id]);

  // Obtener cantidad de likes actual
  useEffect(() => {
    const fetchLikes = async () => {
      const res = await fetch(`http://167.88.36.120:1007/api/airbnbs/${id}`);
      const data = await res.json();
      const currentLikes = data.data.likes || 0;
      setLikes(currentLikes);
    };

    fetchLikes();
  }, []);

  // Enviar likes
  const sendLike = async (id) => {
    try {
      const storedLikes = JSON.parse(localStorage.getItem("likedItems")) || [];

      let newLikes;
      let updatedLikes;
      let likedNow;

      if (storedLikes.includes(id)) {
        // Si ya está en localStorage, restar 1 y quitar el ID
        updatedLikes = storedLikes.filter((itemId) => itemId !== id);
        likedNow = false;
        setLikes(likes - 1);
      } else {
        // Si no está, agregar el ID
        updatedLikes = [...storedLikes, id];
        likedNow = true;
        setLikes(likes + 1);
      }

      // ACTUALIZAR ESTADO VISUAL INMEDIATAMENTE
      setIsLiked(likedNow);

      // Obtener cantidad de likes actual
      const res = await fetch(`http://167.88.36.120:1007/api/airbnbs/${id}`);
      const data = await res.json();
      const currentLikes = data.data.likes || 0;

      // Calcular nuevo número de likes
      newLikes = likedNow ? currentLikes + 1 : Math.max(currentLikes - 1, 0); // evita negativos

      // Actualiza en Strapi
      await fetch(`http://167.88.36.120:1007/api/airbnbs/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: {
            likes: newLikes,
          },
        }),
      });

      // Guarda en localStorage
      localStorage.setItem("likedItems", JSON.stringify(updatedLikes));
    } catch (error) {
      console.error("Error al alternar el like:", error);
    }
  };

  return (
    <div className="card-container">
      <div className="image-container">
        <a className="tag-link font-semibold" href={link} target="_blank">
          Ir a Airbnb
        </a>

        <button
          onClick={() => sendLike(id)}
          className={`tag-like font-semibold ${
            isLiked ? "like-active" : "like-inactive"
          }`}
        >
          {isLiked ? (
            <div>
              <GoHeartFill />
            </div>
          ) : (
            <div>
              <GoHeart />
            </div>
          )}
          <span className="text-[14px]">{likes}</span>
        </button>

        <button onClick={() => setIsOpen(true)} className="show-image">
          <IoMdImages />
        </button>

        <Swiper
          pagination={{ dynamicBullets: true }}
          modules={[Pagination]}
          className="mySwiper h-full"
        >
          {images.map((item, index) => (
            <SwiperSlide key={index}>
              <div
                className="image"
                style={{
                  backgroundImage: `url("http://167.88.36.120:1007${item}")`,
                }}
              ></div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <div className="caption-container tracking-tight">
        <div className="font-semibold">{name}</div>
        <div className="ellipsis caption">{caption}</div>
        <div className="caption">
          <span className="font-semibold underline text-black">${price}</span>{" "}
          por 3 noches
        </div>
      </div>

      {modalIsOpen && (
        <div className="modal-container">
          <button onClick={() => setIsOpen(false)} className="close-modal">
            <IoClose />
          </button>
          <div className="w-full">
            <Swiper modules={[Pagination]} className="mySwiper">
              {images.map((item, index) => (
                <SwiperSlide key={index}>
                  <div
                    className="image-carrusel aspect-square"
                    style={{
                      backgroundImage: `url("http://167.88.36.120:1007${item}")`,
                    }}
                  ></div>
                </SwiperSlide>
              ))}
            </Swiper>

            <div className="thumb-container">
              {images.map((item, index) => (
                <div
                  key={index}
                  className="image-thumb aspect-square"
                  style={{
                    backgroundImage: `url("http://167.88.36.120:1007${item}")`,
                  }}
                ></div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Card;
