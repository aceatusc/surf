import styles from "./Pill.module.css";

type PillProps = {
  children: React.ReactNode;
  className?: string;
};

export default function Pill({ children, className, ...props }: PillProps) {
  return (
    <div className={`${styles.pill_container} ${className}`} {...props}>
      {children}
    </div>
  );
}
