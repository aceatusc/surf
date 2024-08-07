import Reader from "./components/Reader/Reader";
import ContextProvider from "./context/ContextProvider";
import styles from "./App.module.css";
import Socials from "./components/Socials/Socials";
import ZoomControl from "./components/Reader/ZoomControl";

export default function App() {
  return (
    <ContextProvider>
      <main className={styles.main_container}>
        <Reader />
        <ZoomControl />
      </main>
      <Socials />
    </ContextProvider>
  );
}
