import type { Result } from "./schema";
import styles from "./Card.module.css";

const { card, avatar, header, title, subtitle } = styles;

type Props = {
  result: Result;
};

export function Card({ result: { name, status, image } }: Props) {
  return (
    <article className={card}>
      <img className={avatar} src={image} alt="" />
      <div className={header}>
        <h2 className={title}>{name}</h2>
        <p className={subtitle} data-status={status}>
          {status}
        </p>
      </div>
    </article>
  );
}
