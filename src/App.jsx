import React from "react";
import { Amplify } from "aws-amplify";
import awsConfig from "./aws-exports"; // Asegúrate de tener este archivo
import { Authenticator } from "@aws-amplify/ui-react";
import MainPage from "./mainpage/MainPage";
import "@aws-amplify/ui-react/styles.css";

// Configura Amplify con las credenciales de tu archivo aws-exports.js
Amplify.configure(awsConfig);

function App() {
  return (
    <Authenticator>
    {({ signOut, user }) => (
      <main>
        <h1>Hello, {user.username}</h1>
        <button onClick={signOut}>Sign out</button>
        <MainPage />
      </main>
    )}
  </Authenticator>
  );
}

export default App;