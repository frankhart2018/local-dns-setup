import { Route, Routes } from "react-router";
import "./App.css";
import ListZones from "./components/pages/ListZones/ListZones";
import { configureStore } from "@reduxjs/toolkit";
import dnsReducer from "./reducers/dns-reducer";
import { VERSION } from "./utils/version";
import { Provider } from "react-redux";
import ListANames from "./components/pages/ListANames/ListANames";
import CreateZone from "./components/pages/CreateZone/CreateZone";

const store = configureStore({
  reducer: {
    dns: dnsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

const App = () => {
  document.title = `Local DNS Setup: v${VERSION}`;

  return (
    <Provider store={store}>
      <Routes>
        <Route path="/" element={<ListZones />} />
        <Route path="/a-names/:zoneName" element={<ListANames />} />
        <Route path="/create-zone" element={<CreateZone />} />
      </Routes>
    </Provider>
  );
};

export default App;
