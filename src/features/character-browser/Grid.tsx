import { Card } from "./Card";
import { SkeletonCard } from "./SkeletonCard";
import type { Result } from "./schema";
import styles from "./Grid.module.css";

const { grid } = styles;

type Props = {
  results: Result[];
  status: "loading" | "success";
  skeletonCount: number;
};

export function Grid({ results, status, skeletonCount }: Props) {
  return (
    <div className={grid}>
      {status === "loading"
        ? Array.from({ length: skeletonCount }, (_, i) => <SkeletonCard key={i} />)
        : results.map((result) => <Card key={result.id} result={result} />)}
    </div>
  );
}