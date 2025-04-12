import React from "react";
import { Amplify } from "aws-amplify";
import awsConfig from "./aws-exports"; // Asegúrate de tener este archivo
import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";

// Configura Amplify con las credenciales de tu archivo aws-exports.js
Amplify.configure(awsConfig);

function App() {
  return (
    <Authenticator>
      {({ signOut, user }) => (
        <div>
          <h1>Welcome, {user.username}</h1>
          <button onClick={signOut}>Sign out</button>
        </div>
      )}
    </Authenticator>
  );
}

export default App;
