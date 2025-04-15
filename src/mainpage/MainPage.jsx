// src/mainpage/MainPage.jsx

import React, { useEffect, useState } from "react";
import { generateClient } from "aws-amplify/api";
import { createRoute } from "../graphql/mutations";
import { routesByOwner } from "../graphql/queries";
import { fetchAuthSession } from "aws-amplify/auth";
import "../App.css";

const client = generateClient();

const MainPage = () => {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formState, setFormState] = useState({ title: "", description: "" });

  const handleChange = (e) => {
    setFormState((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const fetchRoutes = async () => {
    try {
      const session = await fetchAuthSession();
      const userSub = session.tokens?.idToken?.payload["sub"];

      const response = await client.graphql({
        query: routesByOwner,
        variables: {
          owner: userSub,
          sortDirection: "DESC",
        },
      });
      console.log("Response completa:", JSON.stringify(response, null, 2));

      setRoutes(response.data.routesByOwner.items);
    } catch (error) {
      console.error("Error fetching routes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoutes();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { title, description } = formState;

    if (!title || !description) return alert("Rellena todos los campos");

    try {
      await client.graphql({
        query: createRoute,
        variables: {
          input: {
            title,
            description,
          },
        },
      });

      setFormState({ title: "", description: "" });
      fetchRoutes(); // refrescar la lista
    } catch (error) {
      console.error("Error creando ruta:", error);
    }
  };

  return (
    <div className="main-container">
      <h1>Lista de Rutas</h1>

      <form onSubmit={handleSubmit}>
        <input
          name="title"
          value={formState.title}
          onChange={handleChange}
          placeholder="Título"
        />
        <input
          name="description"
          value={formState.description}
          onChange={handleChange}
          placeholder="Descripción"
        />
        <button type="submit">Crear Ruta</button>
      </form>

      {loading ? (
        <p>Cargando rutas...</p>
      ) : (
        <ul>
          {routes.map((route) => (
            <li key={route.id}>
              <h3>{route.title}</h3>
              <p>{route.description}</p>
              <p><small>Creado: {new Date(route.createdAt).toLocaleString()}</small></p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MainPage;
