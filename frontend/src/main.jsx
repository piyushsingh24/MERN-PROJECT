import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AppContextProvider } from "./context/AppContext.jsx";
import { Auth0Provider } from "@auth0/auth0-react";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Auth0Provider
      domain="dev-crrtq04v8yhxwkvj.us.auth0.com"
      clientId="0es38HBS7fWt0wrWQ0BZF8274aRENtno"
      authorizationParams={{
        redirect_uri: window.location.origin,
      }}
    >
      <AppContextProvider>
        <App />
      </AppContextProvider>
    </Auth0Provider>
  </StrictMode>
);
