import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Game from "./Game";
import Navbar from "./Navbar";
import Ranking from "./Ranking";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Switch>
        <Route path="/ranking">
          <Ranking />
        </Route>
        <Route path="/">
          <Game />
        </Route>
      </Switch>
    </BrowserRouter>
  );
}
