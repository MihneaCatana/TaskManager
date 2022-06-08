import { useState, useEffect } from "react";
import { Dialog } from "primereact/dialog";
import { useForm, Controller } from "react-hook-form";
import { classNames } from "primereact/utils";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";

import { useNavigate } from "react-router";

import "./styles/AssignTask.css";
import Axios from "axios";

export default function AssignTasks() {
  const [showMessage, setShowMessage] = useState(false);
  const [formData, setFormData] = useState({});
  const [tasks, setTasks] = useState([]);
  const [taskSelected, setTaskSelected] = useState();
  const [angajati, setAngajati] = useState([]);
  const [angajatSelected, setAngajatSelected] = useState();

  let navigate = useNavigate();

  function redirect() {
    navigate("/task");
  }

  useEffect(() => {
    Axios.get("http://localhost:7000/taskuri/neterminate").then((response) => {
      setTasks(response.data);
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

  const defaultValues = {
    denumire_grup: "",
  };

  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm({ defaultValues });

  const onSubmit = (data) => {
    setFormData(data);

    Axios.post("http://localhost:7000/grup_task/add", {
      id_task: taskSelected[0],
      id_angajat: angajatSelected[0],
      denumire_grup: data.denumire_grup,
    });

    setShowMessage(true);

    reset();
  };

  const onSelectedEmployee = (e) => {
    setAngajatSelected(e.value);
  };

  const onSelectedTask = (e) => {
    setTaskSelected(e.value);
  };

  const leaderDepartment = [];

  for (let i = 0; i < angajati.length; i++) {
    leaderDepartment[i] =
      angajati[i][0] + " " + angajati[i][1] + " " + angajati[i][2];
  }

  const taskForEmployee = [];

  for (let i = 0; i < tasks.length; i++)
    taskForEmployee[i] = tasks[i][0] + " " + tasks[i][2];

  return (
    <div className="AssignTasks">
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
          <h5>Task Added !</h5>
        </div>
      </Dialog>

      <div className="cardAdd">
        <h3 className="text-center">Asign Tasks</h3>
        <form onSubmit={handleSubmit(onSubmit)} className="p-fluid">
          <div className="field">
            <span className="p-float-label">
              <Controller
                name="denumire_grup"
                control={control}
                rules={{ required: "Description is required." }}
                render={({ field, fieldState }) => (
                  <InputText
                    id={field.name}
                    {...field}
                    autoFocus
                    className={classNames({ "p-invalid": fieldState.error })}
                  />
                )}
              />
              <label
                htmlFor="denumire_grup"
                className={classNames({ "p-error": errors.name })}
              >
                Description Task*
              </label>
            </span>
            {getFormErrorMessage("denumire_grup")}
          </div>
          <div className="field">
            <span className="p-float-label">
              <Controller
                name="id_task"
                control={control}
                render={({ field, fieldState }) => (
                  <div className="field">
                    <span className="p-float-label">
                      <Controller
                        name="id_task"
                        control={control}
                        render={({ field }) => (
                          <Dropdown
                            value={taskSelected}
                            options={taskForEmployee}
                            onChange={onSelectedTask}
                          />
                        )}
                      />
                      <label htmlFor="id_task">ID Task</label>
                    </span>
                  </div>
                )}
              />
            </span>
            {getFormErrorMessage("id_task")}
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
        <Button
          icon="pi pi-times"
          className="p-button-rounded p-button-danger"
          aria-label="Cancel"
          onClick={redirect}
        />
      </div>
      {console.log(angajati)}
    </div>
  );
}
