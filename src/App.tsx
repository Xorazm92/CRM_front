import { Route, Routes } from "react-router-dom"
import { routes } from "./routes"

const App = () => {
  return (
    <Routes>
      {routes.map((element, index) => {
        return <Route key={index} path={element.path} element={element.element}>
          {element.children?.map((item, childIndex) => {
            return <Route key={childIndex} index={!item.path ? true : false} path={item.path} element={item.element} />
          })}
        </Route>
      })}
    </Routes>
  )
}

export default App