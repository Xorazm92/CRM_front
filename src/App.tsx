
import { Routes, Route } from 'react-router-dom';
import { routes } from './routes';
import MainLayout from './components/MainLayout';

function App() {
  return (
    <Routes>
      {routes.map((route) => (
        <Route
          key={route.path}
          path={route.path}
          element={
            route.path === '/login' ? (
              route.element
            ) : (
              <MainLayout>{route.element}</MainLayout>
            )
          }
        >
          {route.children?.map((child) => (
            <Route
              key={child.path || 'index'}
              index={child.index}
              path={child.path}
              element={child.element}
            />
          ))}
        </Route>
      ))}
    </Routes>
  );
}

export default App;
