import SidebarFinal from "../Components/Sidebar/Sidebar";
import { ReactComponent as Management } from "../images/Management.svg";
import { ReactComponent as Employee } from "../images/MeetingDeadlines.svg";
import "./styles/Homepage.css";

export default function Homepage() {
  const Role = localStorage.getItem("role");
  return (
    <div className="Homepage">
      <div className="Navbar">
        <h3>Homepage</h3>

        <SidebarFinal></SidebarFinal>
      </div>
      <h2 style={{ textAlign: "center" }}> Bine ai venit! </h2>

      {Role == 2 || Role == 1 ? (
        <div className="Svg">
          <cite>
            A good objective of leadership is to help those who are doing poorly
            to do well and to help those who are doing well to do even better
            <br /> <b> -Jim Rohn</b>
          </cite>
          <Management className="image"></Management>
        </div>
      ) : (
        <></>
      )}

      {Role == 0 ? (
        <div className="Svg">
          <cite>
            A reliable employee is the best gift a leader can ask for. Thank you
            for being someone I can rely on.
          </cite>
          <Employee className="image"></Employee>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}
