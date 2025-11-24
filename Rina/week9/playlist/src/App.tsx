import { Provider } from "react-redux";
import { Footer } from "./components/Footer";
import { Navbar } from "./components/Navbar";
import store from "./store/store";
import CartList from "./components/CartList";

function App() {
  return (
    <Provider store={store}>
      <Navbar />
      <CartList />
      <Footer />
    </ Provider>
  );
}

export default App;
