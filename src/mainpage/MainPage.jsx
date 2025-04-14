// src/mainpage/MainPage.jsx

import React, { useEffect, useState } from "react";
import { generateClient } from "aws-amplify/api";
import { listRoutes } from "../graphql/queries"; // Asegúrate de que la ruta sea correcta
import "../App.css"; // Si tienes estilos, inclúyelos aquí
import { createRoute } from "../graphql/mutations";

const client = generateClient();

const MainPage = () => {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newRoute, setNewRoute] = useState({ title: "", description: "" });

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

  const handleCreateRoute = async (e) => {
    e.preventDefault();
    try {
      const response = await client.graphql({
        query: createRoute,
        variables: {
          input: {
            title: newRoute.title,
            description: newRoute.description,
          },
        },
      });

      // Añadir nueva ruta a la lista sin necesidad de refetch
      setRoutes([...routes, response.data.createRoute]);
      setNewRoute({ title: "", description: "" });
    } catch (err) {
      console.error("Error creating route:", err);
    }
  };
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
      <form onSubmit={handleCreateRoute} className="form-crear-ruta">
        <input
          type="text"
          placeholder="Título"
          value={newRoute.title}
          onChange={(e) => setNewRoute({ ...newRoute, title: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Descripción"
          value={newRoute.description}
          onChange={(e) =>
            setNewRoute({ ...newRoute, description: e.target.value })
          }
        />
        <button type="submit">Crear Ruta</button>
      </form>
    </div>
  );
};

export default MainPage;
