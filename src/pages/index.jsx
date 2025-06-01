import { useEffect, useState } from "react";
import Card from "@/components/Card";

const Home = () => {
  const [airbnbs, setAirbnbs] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchAirbnbs() {
      setLoading(true);
      try {
        // Obtener data
        const res = await fetch("http://167.88.36.120:1007/api/airbnbs");
        if (!res.ok) throw new Error(`HTTP error: ${res.status}`);

        const json = await res.json();
        const filtered = json.data.map((item) => ({
          name: item.name,
          caption: item.caption,
          price: item.price,
          link: item.link,
          documentId: item.documentId,
        }));

        // Obtener imagenes
        const airbnbsWithImages = await Promise.all(
          filtered.map(async (airbnb) => {
            try {
              const res = await fetch(
                `http://167.88.36.120:1007/api/airbnbs?filters[documentId][$eq]=${airbnb.documentId}&populate[image][fields][0]=url`
              );
              const json = await res.json();
              const images = json.data[0]?.image?.map((img) => img.url) || [];

              return { ...airbnb, images };
            } catch {
              return { ...airbnb, images: [] }; // fallback si falla la imagen
            }
          })
        );

        setAirbnbs(airbnbsWithImages);
      } catch (error) {
        console.error("Error al obtener airbnbs:", error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchAirbnbs();
  }, []);

  return (
    <div className="page-size">
      {loading && (
        <div className="fixedCenterXnY absolute">
          <div class="loader">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
              <path d="M64 32C28.7 32 0 60.7 0 96v64c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64zm280 72a24 24 0 1 1 0 48 24 24 0 1 1 0-48zm48 24a24 24 0 1 1 48 0 24 24 0 1 1 -48 0zM64 288c-35.3 0-64 28.7-64 64v64c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V352c0-35.3-28.7-64-64-64H64zm280 72a24 24 0 1 1 0 48 24 24 0 1 1 0-48zm56 24a24 24 0 1 1 48 0 24 24 0 1 1 -48 0z"></path>
            </svg>
            <span></span>
          </div>
        </div>
      )}

      {!loading && (
        <div className="content-container">
          {airbnbs.map((item, index) => (
            <Card
              key={item.documentId}
              name={item.name}
              caption={item.caption}
              price={item.price}
              images={item.images}
              link={item.link}
              id={item.documentId}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
