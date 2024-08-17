import Reader from "./components/Reader/Reader";
import ContextProvider from "./context/ContextProvider";
import styles from "./App.module.css";
import Socials from "./components/Socials/Socials";
import ZoomControl from "./components/Reader/ZoomControl";
import HideScroll from "./components/UI/HideScroll";

export default function App() {
  return (
    <ContextProvider>
      <HideScroll className={styles.main_container}>
        <main className={styles.reader_container}>
          <Reader />
          <ZoomControl />
        </main>
      </HideScroll>
      <Socials />
    </ContextProvider>
  );
}
