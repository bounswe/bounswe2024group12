import style from "./Card.module.css";

export default function Card({ children, interactive = false}) {
  let cardClasses = style.Card;
  if (interactive) {
    cardClasses += ` ${style.Interactive}`;
  }

  return <div className={cardClasses}>{children}</div>;
}
