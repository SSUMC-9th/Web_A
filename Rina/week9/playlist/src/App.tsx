import { Footer } from "./components/Footer";
import { Navbar } from "./components/Navbar";
import CartList from "./components/CartList";
import { Modal } from "./components/Modal";

function App() {
  return (
    <>
      <Navbar />
      <CartList />
      <Footer />
      <Modal />
    </>
  );
}

export default App;
