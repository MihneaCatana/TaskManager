import { useState, useEffect } from "react";
import SidebarFinal from "../Components/Sidebar/Sidebar";
import { Chart } from "primereact/chart";
import { Card } from "primereact/card";
import Axios from "axios";
import "./styles/Admin.css";
import { useNavigate } from "react-router";

export default function Admin() {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    Axios.get("http://localhost:7000/taskuri/finalizate").then((response) => {
      Axios.get("http://localhost:7000/taskuri/total").then((response1) => {
        setChartData({
          labels: ["Done", "Total number of tasks"],
          datasets: [
            {
              data: [response.data[0][0], response1.data[0][0]],
              backgroundColor: ["green", "red"],
              hoverBackgroundColor: ["green", "red"],
            },
          ],
        });
      });
    });
  }, []);

  const Role = localStorage.getItem("role");

  let navigate = useNavigate();

  function redirectAddUser() {
    navigate("/addUser");
  }

  function redirectAddDepartment() {
    navigate("/addDepartment");
  }

  function redirectEditUser() {
    navigate("/editUser");
  }

  function redirectEditDepartment() {
    navigate("/editDepartment");
  }

  return (
    <div>
      {Role == 2 ? (
        <div>
          <div className="Navbar">
            <h3>Admin Page</h3>
            <SidebarFinal></SidebarFinal>
          </div>
          <div className="Statistics">
            <h2 className="title">Status of Tasks</h2>
            <div className="card flex justify-content-center">
              <Chart
                type="doughnut"
                data={chartData}
                style={{ position: "relative", width: "20em" }}
              />
            </div>
          </div>
          <div className="cards">
            <Card
              title="Add Employee"
              header={
                <i
                  style={{
                    width: "10rem",
                    fontSize: "10rem",
                    marginLeft: "0.1em",
                  }}
                  className="pi pi-user-plus"
                ></i>
              }
              className="Card-Class"
              style={{ width: "20rem", marginBottom: "2em", marginLeft: "1em" }}
              onClick={redirectAddUser}
            ></Card>
            <Card
              title="Update/Delete Employee"
              header={
                <i
                  style={{
                    width: "10rem",
                    fontSize: "10rem",
                    marginLeft: "0.1em",
                  }}
                  className="pi pi-user-edit"
                ></i>
              }
              className="Card-Class"
              style={{ width: "20rem", marginBottom: "2em", marginLeft: "1em" }}
              onClick={redirectEditUser}
            ></Card>
          </div>
          <div className="cards">
            <Card
              title="Add Department"
              header={
                <i
                  style={{
                    width: "10rem",
                    fontSize: "10rem",
                    marginLeft: "0.1em",
                  }}
                  className="pi pi-users"
                ></i>
              }
              className="Card-Class"
              style={{ width: "20rem", marginBottom: "2em", marginLeft: "1em" }}
              onClick={redirectAddDepartment}
            ></Card>
            <Card
              title="Update/Delete Department"
              header={
                <i
                  style={{
                    width: "10rem",
                    fontSize: "10rem",
                    marginLeft: "0.1em",
                  }}
                  className="pi pi-pencil"
                ></i>
              }
              className="Card-Class"
              style={{ width: "20rem", marginBottom: "2em", marginLeft: "1em" }}
              onClick={redirectEditDepartment}
            ></Card>
          </div>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}
