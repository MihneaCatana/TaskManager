import { useState, useEffect } from "react";
import SidebarFinal from "../Components/Sidebar/Sidebar";
import { Card } from "primereact/card";
import { Chart } from "primereact/chart";
import { useNavigate } from "react-router";
import "./styles/Admin.css";

import Axios from "axios";

export default function Task() {
  const Role = localStorage.getItem("role");
  const id = localStorage.getItem("id");
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    Axios.get(`http://localhost:7000/taskuri/finalizate/${id}`).then(
      (resFinalizate) => {
        Axios.get(`http://localhost:7000/taskuri/totale/${id}`).then(
          (resTotal) => {
            setChartData({
              labels: ["Tasks Done", "Tasks Left"],
              datasets: [
                {
                  data: [
                    resFinalizate.data[0][0],
                    resTotal.data[0][0] - resFinalizate.data[0][0],
                  ],
                  backgroundColor: ["green", "red"],
                  hoverBackgroundColor: ["green", "red"],
                },
              ],
            });
          }
        );
      }
    );
  }, []);

  let navigate = useNavigate();

  function redirectEditUser() {
    navigate("/allTasks");
  }

  function redirectAddTasks() {
    navigate("/addTasks");
  }

  function redirectAssignTasks() {
    navigate("/assignTasks");
  }

  function redirectMyTasks() {
    navigate("/myTasks");
  }

  return (
    <div>
      <div className="Navbar">
        <h3>Tasks</h3>
        <SidebarFinal></SidebarFinal>
      </div>
      <h2 className="title">Tasks</h2>
      <div className="cards">
        {Role == 0 ? (
          <Chart
            type="doughnut"
            data={chartData}
            style={{ position: "relative", width: "20em" }}
          />
        ) : (
          <></>
        )}

        {Role == 2 || Role == 1 ? (
          <Card
            title="All Tasks"
            header={
              <i
                style={{
                  width: "10rem",
                  fontSize: "10rem",
                  marginLeft: "0.1em",
                }}
                className="pi pi-book"
              ></i>
            }
            className="Card-Class"
            style={{
              width: "20rem",
              marginBottom: "2em",
              marginLeft: "1em",
            }}
            onClick={redirectEditUser}
          ></Card>
        ) : (
          <></>
        )}

        {Role == 2 || Role == 1 ? (
          <Card
            title="Add Task"
            header={
              <i
                style={{
                  width: "10rem",
                  fontSize: "10rem",
                  marginLeft: "0.1em",
                }}
                className="pi pi-plus-circle"
              ></i>
            }
            className="Card-Class"
            style={{ width: "20rem", marginBottom: "2em", marginLeft: "1em" }}
            onClick={redirectAddTasks}
          ></Card>
        ) : (
          <></>
        )}
      </div>
      <div className="cards">
        {Role == 2 || Role == 1 ? (
          <Card
            title="Assign Tasks"
            header={
              <i
                style={{
                  width: "10rem",
                  fontSize: "10rem",
                  marginLeft: "0.1em",
                }}
                className="pi pi-calendar-plus"
              ></i>
            }
            className="Card-Class"
            style={{ width: "20rem", marginBottom: "2em", marginLeft: "1em" }}
            onClick={redirectAssignTasks}
          ></Card>
        ) : (
          <></>
        )}
        <Card
          title="My Tasks"
          header={
            <i
              style={{
                width: "10rem",
                fontSize: "10rem",
                marginLeft: "0.1em",
              }}
              className="pi pi-chart-line"
            ></i>
          }
          className="Card-Class"
          style={{ width: "20rem", marginBottom: "2em", marginLeft: "1em" }}
          onClick={redirectMyTasks}
        ></Card>
      </div>
    </div>
  );
}
