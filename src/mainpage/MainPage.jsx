import React, { useEffect, useState } from "react";
import { generateClient } from "aws-amplify/api";
import * as mutations from "../graphql/mutations";
import { listTodos } from "../graphql/queries"; // Cambié "listRoutes" a "listTodos"
// import { Auth } from "aws-amplify";

const client = generateClient();

// Función para obtener el ID Token de Cognito
const getAuthToken = async () => {
  try {
    //const session = await Auth.currentSession(); // Obtiene la sesión activa
    //return session.getIdToken().getJwtToken(); // Obtiene el ID Token
  } catch (error) {
    console.error("Error fetching auth token:", error);
    throw error;
  }
};

const MainPage = () => {
  const [todos, setTodos] = useState([]); // Cambié "routes" a "todos"
  const [loading, setLoading] = useState(true);
  const [formState, setFormState] = useState({ name: "", description: "" }); // Cambié "title" a "name"
  const [editingTodoId, setEditingTodoId] = useState(null); // Cambié "editingRouteId" a "editingTodoId"

  const handleChange = ({ target: { name, value } }) => {
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormState({ name: "", description: "" });
    setEditingTodoId(null);
  };

  const fetchTodos = async () => {
    setLoading(true);
    try {
      const authToken = await getAuthToken(); // Obtener el token de autenticación

      const response = await client.graphql({
        query: listTodos,
        headers: {
          Authorization: authToken, // Incluir el token en los headers
        },
      });

      setTodos(response.data.listTodos.items); // Cambié "listRoutes" a "listTodos"
    } catch (error) {
      console.error("Error fetching todos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, description } = formState;

    if (!name || !description) {
      alert("Rellena todos los campos");
      return;
    }

    const input = {
      name, // Cambié "title" a "name"
      description,
      ...(editingTodoId && { id: editingTodoId }), // Cambié "editingRouteId" a "editingTodoId"
    };

    const mutation = editingTodoId
      ? mutations.updateTodo // Cambié "updateRoute" a "updateTodo"
      : mutations.createTodo; // Cambié "createRoute" a "createTodo"

    try {
      const authToken = await getAuthToken(); // Obtener el token de autenticación

      await client.graphql({
        query: mutation,
        variables: { input },
        headers: {
          Authorization: authToken, // Incluir el token en los headers
        },
      });

      resetForm();
      fetchTodos(); // Cambié "fetchRoutes" a "fetchTodos"
    } catch (error) {
      console.error("Error al guardar el todo:", error);
    }
  };

  const handleEdit = (todo) => {
    // Cambié "route" a "todo"
    setFormState({ name: todo.name, description: todo.description });
    setEditingTodoId(todo.id); // Cambié "route.id" a "todo.id"
  };

  const handleDelete = async (id) => {
    try {
      const authToken = await getAuthToken(); // Obtener el token de autenticación

      await client.graphql({
        query: mutations.deleteTodo, // Cambié "deleteRoute" a "deleteTodo"
        variables: { input: { id } },
        headers: {
          Authorization: authToken, // Incluir el token en los headers
        },
      });

      fetchTodos(); // Cambié "fetchRoutes" a "fetchTodos"
    } catch (error) {
      console.error("Error al eliminar el todo:", error);
    }
  };

  useEffect(() => {
    fetchTodos(); // Cambié "fetchRoutes" a "fetchTodos"
  }, []);

  return (
    <div className="main-container">
      <h1>Lista de Tareas</h1> {/* Cambié "Rutas" a "Tareas" */}
      <form onSubmit={handleSubmit}>
        <input
          name="name" // Cambié "title" a "name"
          value={formState.name}
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
          {editingTodoId ? "Actualizar Tarea" : "Crear Tarea"}
        </button>
      </form>
      {loading ? (
        <p>Cargando tareas...</p>
      ) : (
        <ul>
          {todos.map(
            (
              todo // Cambié "routes" a "todos"
            ) => (
              <li key={todo.id}>
                <h3>{todo.name}</h3> {/* Cambié "route.title" a "todo.name" */}
                <p>{todo.description}</p>
                <button onClick={() => handleEdit(todo)}>Editar</button>{" "}
                {/* Cambié "route" a "todo" */}
                <button onClick={() => handleDelete(todo.id)}>
                  Eliminar
                </button>{" "}
                {/* Cambié "route.id" a "todo.id" */}
              </li>
            )
          )}
        </ul>
      )}
    </div>
  );
};

export default MainPage;
