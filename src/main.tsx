import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { BrowserRouter } from "react-router";
import QueryProviderComponent from './providers/QueryProviderComponent.tsx';
createRoot(document.getElementById('root')!).render(
  <QueryProviderComponent>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </QueryProviderComponent>

)
