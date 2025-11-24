import { Provider } from "react-redux";
import { Footer } from "./components/Footer";
import { Navbar } from "./components/Navbar";
import store from "./store/store";
import CartList from "./components/CartList";
import { Modal } from "./components/Modal";

function App() {
  return (
    <Provider store={store}>
      <Navbar />
      <CartList />
      <Footer />
      <Modal />
    </ Provider>
  );
}

export default App;
