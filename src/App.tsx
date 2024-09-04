import "~/configs/i18n";
import { Fragment } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import AuthProtect from "./components/AuthProtect";
import { privateRoutes, publicRoutes } from "./routes";

const App = () => {
  return (
    <div className="scroll-smooth">
      <Router>
        <Routes>
          {privateRoutes.map((route, index) => {
            const Page = route.component;
            let Layout = null;

            if (route.layout) {
              Layout = route.layout;
            } else {
              Layout = Fragment;
            }
            return (
              <Route
                key={index}
                path={route.path}
                element={
                  <AuthProtect>
                    <Layout>
                      <Page />
                    </Layout>
                  </AuthProtect>
                }
              />
            );
          })}
          {publicRoutes.map((route, index) => {
            const Page = route.component;
            let Layout = null;

            if (route.layout) {
              Layout = route.layout;
            } else {
              Layout = Fragment;
            }
            return (
              <Route
                key={index}
                path={route.path}
                element={
                  <Layout>
                    <Page />
                  </Layout>
                }
              />
            );
          })}
        </Routes>
      </Router>
      <ToastContainer />
    </div>
  );
};

export default App;
