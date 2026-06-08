import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import styles from "./Card.module.css";

const { card, header } = styles;

export function SkeletonCard() {
  return (
    <article className={card}>
      <Skeleton style={{ aspectRatio: "1/1", borderRadius: "var(--radius-md)", lineHeight: "normal" }} />
      <div className={header}>
        <Skeleton width="75%" height="1.25rem" />
        <Skeleton width="45%" />
      </div>
    </article>
  );
}
