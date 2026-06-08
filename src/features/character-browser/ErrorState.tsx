import { CircleAlert } from "lucide-react";
import errorSvg from "./error.svg";
import styles from "./ErrorState.module.css";

const { container, illustration, messageStyle } = styles;

type Props = {
  message: string;
};

export function ErrorState({ message }: Props) {
  return (
    <div className={container}>
      <img className={illustration} src={errorSvg} alt="" aria-hidden="true" />
      <p className={messageStyle}>
        <CircleAlert />
        {message}
      </p>
    </div>
  );
}
