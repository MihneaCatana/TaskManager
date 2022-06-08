import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Sidebar } from "primereact/sidebar";
import { Button } from "primereact/button";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "./Sidebar.css";
import Protected from "../Protected/Protected";

function SidebarFinal() {
  function LogOut() {
    localStorage.clear();
  }

  const isAuth = localStorage.getItem("auth");
  const Role = localStorage.getItem("role");

  const [visibleLeft, setVisibleLeft] = useState(false);

  return (
    <div>
      <Protected isAuth={isAuth}>
        <Sidebar
          className="p-sidebar-sm"
          visible={visibleLeft}
          onHide={() => setVisibleLeft(false)}
        >
          <img src="../assets/logo.png" className="logo" />
          <h2>Navigation Menu</h2>
          <Link to={"/homepage"} className="links">
            <h4>Homepage</h4>
          </Link>
          {Role == 2 ? (
            <Link to={"/admin"} className="links">
              <h4>Admin</h4>
            </Link>
          ) : (
            <></>
          )}
          {Role == 2 || Role == 1 ? (
            <Link to={"/assignEmployees"} className="links">
              <h4 className="links">Assign Employees</h4>
            </Link>
          ) : (
            <></>
          )}

          <Link to={"/task"} className="links">
            <h4>Tasks</h4>
          </Link>
          <Link to={"/login"} className="links">
            <h4 className="links" onClick={LogOut}>
              Logout
            </h4>
          </Link>
        </Sidebar>
        <Button
          icon="pi pi-bars"
          onClick={(e) => setVisibleLeft(true)}
          className="mr-2"
        />
      </Protected>
    </div>
  );
}

export default SidebarFinal;
