import s from "./HideScroll.module.css";

type Props = {
  children: React.ReactNode;
  className?: string;
  paddingX?: number;
  paddingY?: number;
};

export default function HideScroll({
  children,
  className,
  paddingX,
  paddingY,
  ...props
}: Props) {
  return (
    <div className={`${s.parent} ${className || s.parent_default}`}>
      <div
        className={s.child}
        style={{
          top: `${paddingY || 0}px`,
          bottom: `${paddingY || 0}px`,
        }}
      >
        <div
          {...props}
          style={{
            paddingLeft: `${paddingX || 0}px`,
            paddingRight: `${paddingX || 0}px`,
            overflowY: "auto",
            height: "100%",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
