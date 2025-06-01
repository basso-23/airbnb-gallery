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

  useEffect(() => {
    console.log(airbnbs);
  }, [airbnbs]);

  return (
    <div className="page-size">
      {loading && (
        <p className=" text-center pt-16 text-[15px]">Cargando airbnbs...</p>
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
