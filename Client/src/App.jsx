import React from "react";
import { Footer, Navbar, Services, Transactions, Welcome } from "./components";

export default function App() {
  return (
    <div class="main-h-screen">
      <div className="gradient-bg-welcome">
        <Navbar />
        <Welcome />
      </div>
      <Services />
      <Transactions />
      <Footer />
    </div>
  );
}
