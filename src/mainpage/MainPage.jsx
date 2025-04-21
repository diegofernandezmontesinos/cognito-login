import React, { useEffect, useState } from "react";
import { generateClient } from "aws-amplify/api";
import * as mutations from "../graphql/mutations";
import { routesByOwner } from "../graphql/queries";
import { fetchAuthSession } from "aws-amplify/auth";

const session = await fetchAuthSession();
const sourceName = "amplifyTest";
const userSub = session.tokens?.idToken?.payload["sub"];

const client = generateClient();
const MainPage = () => {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formState, setFormState] = useState({ title: "", description: "" });
  const [editingRouteId, setEditingRouteId] = useState(null);

  const handleChange = (e) => {
    setFormState((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const fetchRoutes = async () => {
    try {
      let session2 = await fetchAuthSession();
      let userSub = session2.tokens?.idToken?.payload["sub"];
;
      const response = await client.graphql({
        query: routesByOwner,
        variables: {
          owner: userSub,
          sortDirection: "DESC",
        },
      });

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
      if (editingRouteId) {
        await client.graphql({
          query: mutations.updateRoute,
          variables: {
            input: {
              id: editingRouteId,
              title,
              description,
            },
          },
        });
        setEditingRouteId(null);
      } else {
        await client.graphql({
          query: mutations.createRoute,
          variables: {
            input: {
              title: formState.title,
              description: formState.description,
              createdAt: new Date().toISOString(),
              owner: userSub,
              sourceName: sourceName,
            },
          },
        });
      }

      setFormState({ title: "", description: "" });
      fetchRoutes();
    } catch (error) {
      console.error("Error al guardar la ruta:", error);
    }
  };

  const handleEdit = (route) => {
    setFormState({ title: route.title, description: route.description });
    setEditingRouteId(route.id);
  };

  const handleDelete = async (id) => {
    try {
      await client.graphql({
        query: mutations.deleteRoute,
        variables: {
          input: {
            id,
          },
        },
      });
      fetchRoutes();
    } catch (error) {
      console.error("Error al eliminar la ruta:", error);
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
        <button type="submit">
          {editingRouteId ? "Actualizar Ruta" : "Crear Ruta"}
        </button>
      </form>

      {loading ? (
        <p>Cargando rutas...</p>
      ) : (
        <ul>
          {routes.map((route) => (
            <li key={route.id}>
              <h3>{route.title}</h3>
              <p>{route.description}</p>
              <p>
                <small>
                  Creado: {new Date(route.createdAt).toLocaleString()}
                </small>
              </p>
              <button onClick={() => handleEdit(route)}>Editar</button>
              <button onClick={() => handleDelete(route.id)}>Eliminar</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MainPage;
