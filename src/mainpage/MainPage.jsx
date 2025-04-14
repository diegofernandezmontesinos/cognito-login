// src/mainpage/MainPage.jsx

import React, { useEffect, useState } from "react";
import { generateClient } from "aws-amplify/api";
import { listRoutes } from "../graphql/queries"; // Asegúrate de que la ruta sea correcta
import "../App.css"; // Si tienes estilos, inclúyelos aquí

const client = generateClient();

const MainPage = () => {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const response = await client.graphql({
          query: listRoutes,
        });

        setRoutes(response.data.listRoutes.items);
      } catch (error) {
        console.error("Error fetching routes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRoutes();
  }, []);

  return (
    <div className="main-container">
      <h1>Lista de Rutas</h1>
      {loading ? (
        <p>Cargando rutas...</p>
      ) : (
        <ul>
          {routes.map((route) => (
            <li key={route.id}>
              <h3>{route.title}</h3>
              <p>{route.description}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MainPage;
