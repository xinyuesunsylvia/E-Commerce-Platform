import React, { Fragment } from "react";

import Header from "./components/header/header";
import Home from "./components/home";
import Footer from "./components/footer";

import "./App.css";
import ErrorBoundary from "./components/errorBoundary";

function App() {
  return (
    <Fragment>
      <Header />
      <main>
        <ErrorBoundary>
          <Home />
        </ErrorBoundary>
      </main>
      <Footer />
    </Fragment>
  );
}

export default App;
