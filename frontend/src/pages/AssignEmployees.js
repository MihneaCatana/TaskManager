import { useState, useEffect } from "react";
import { Dropdown } from "primereact/dropdown";
import { Dialog } from "primereact/dialog";
import { useForm, Controller } from "react-hook-form";
import { classNames } from "primereact/utils";
import { Button } from "primereact/button";
import SidebarFinal from "../Components/Sidebar/Sidebar";
import "./styles/AssignEmployees.css";

import Axios from "axios";

export default function AssignEmployees() {
  const [showMessage, setShowMessage] = useState(false);
  const [departament, setDepartament] = useState([]);
  const [departamentSelected, setDepartamentSelected] = useState();
  const [angajati, setAngajati] = useState([]);
  const [angajatSelected, setAngajatSelected] = useState();

  useEffect(() => {
    Axios.get("http://localhost:7000/departament/").then((response) => {
      setDepartament(response.data);
    });
  }, []);

  useEffect(() => {
    Axios.get("http://localhost:7000/angajati/ang").then((response) => {
      setAngajati(response.data);
    });
  }, []);

  const dialogFooter = (
    <div className="flex justify-content-center">
      <Button
        label="OK"
        className="p-button-text"
        autoFocus
        onClick={() => setShowMessage(false)}
      />
    </div>
  );

  const getFormErrorMessage = (name) => {
    return (
      errors[name] && <small className="p-error">{errors[name].message}</small>
    );
  };

  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm();

  const onSubmit = () => {
    Axios.put(
      `http://localhost:7000/departament/angajat/${angajatSelected[0]}`,
      {
        id_departament: departamentSelected[0],
      }
    );

    setShowMessage(true);
    console.log(departamentSelected[0]);
    console.log(angajatSelected[0]);

    reset();
  };

  const onSelectedEmployee = (e) => {
    setAngajatSelected(e.value);
  };

  const onSelectedTask = (e) => {
    setDepartamentSelected(e.value);
  };

  const leaderDepartment = [];

  for (let i = 0; i < angajati.length; i++) {
    leaderDepartment[i] =
      angajati[i][0] + " " + angajati[i][1] + " " + angajati[i][2];
  }

  const departmentEmployee = [];

  for (let i = 0; i < departament.length; i++)
    departmentEmployee[i] = departament[i][0] + " " + departament[i][1];

  return (
    <div>
      <Dialog
        visible={showMessage}
        onHide={() => setShowMessage(false)}
        position="top"
        footer={dialogFooter}
        showHeader={false}
        style={{ width: "300px" }}
      >
        <div className="flex justify-content-center flex-column pt-6 px-3">
          <i
            className="pi pi-check-circle"
            style={{ fontSize: "5rem", color: "var(--green-500)" }}
          ></i>
          <h5>Employee Assigned !</h5>
        </div>
      </Dialog>
      <div className="Navbar">
        <h3>AssignEmployees</h3>
        <SidebarFinal></SidebarFinal>
      </div>
      <div className="Assign">
        <div className="cardAssign">
          <h3 className="text-center" style={{ marginBottom: "2em" }}>
            Assign Employees
          </h3>
          <form onSubmit={handleSubmit(onSubmit)} className="p-fluid">
            <div className="field" style={{ marginBottom: "2em" }}>
              <span className="p-float-label">
                <Controller
                  name="id_departament"
                  control={control}
                  render={({ field, fieldState }) => (
                    <div className="field">
                      <span className="p-float-label">
                        <Controller
                          name="id_departament"
                          control={control}
                          render={({ field }) => (
                            <Dropdown
                              value={departamentSelected}
                              options={departmentEmployee}
                              onChange={onSelectedTask}
                            />
                          )}
                        />
                        <label htmlFor="id_departament">ID Departament</label>
                      </span>
                    </div>
                  )}
                />
              </span>
              {getFormErrorMessage("id_departament")}
            </div>
            <div className="field">
              <span className="p-float-label">
                <Controller
                  name="id_angajat"
                  control={control}
                  render={({ field, fieldState }) => (
                    <div className="field">
                      <span className="p-float-label">
                        <Controller
                          name="id_angajat"
                          control={control}
                          render={({ field }) => (
                            <Dropdown
                              value={angajatSelected}
                              options={leaderDepartment}
                              onChange={onSelectedEmployee}
                            />
                          )}
                        />
                        <label htmlFor="id_angajat">ID Angajat</label>
                      </span>
                    </div>
                  )}
                />
              </span>
              {getFormErrorMessage("id_angajat")}
            </div>

            <Button type="submit" label="Submit" className="mt-2" />
          </form>
        </div>
      </div>
    </div>
  );
}
