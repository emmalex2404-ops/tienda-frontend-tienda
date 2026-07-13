import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import Catalogo from "./pages/Catalogo";
import Carrito from "./pages/Carrito";
import MisPedidos from "./pages/MisPedidos";
import Login from "./pages/Login";

const paypalOptions = {
  clientId: "AcZhvhzWTzdT7mI_e9ybVLzCehF0_HWvFoORuh4stEgSQEwyBGqRWe9m3WpEALRA0MsEuhLW3SeVuTBS",
  currency: "MXN",
};

function App() {
  return (
    <PayPalScriptProvider options={paypalOptions}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Catalogo />} />
          <Route path="/carrito" element={<Carrito />} />
          <Route path="/mis-pedidos" element={<MisPedidos />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </PayPalScriptProvider>
  );
}

export default App;
