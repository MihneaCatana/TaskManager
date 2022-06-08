import "./styles/Page404.css";
import { ReactComponent as Logo } from "../images/ErrorDog.svg";

export default function Page404() {
  return (
    <div>
      <div className="page404">
        <h1> Oops! We could not find your page!</h1>
        <Logo className="imagine"></Logo>
      </div>
    </div>
  );
}
