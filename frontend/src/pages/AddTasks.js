import { useState } from "react";
import { Dialog } from "primereact/dialog";
import { useForm, Controller } from "react-hook-form";
import { classNames } from "primereact/utils";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import "./styles/AddTask.css";
import { useNavigate } from "react-router";

import Axios from "axios";

export default function AddTasks() {
  const [showMessage, setShowMessage] = useState(false);
  const [formData, setFormData] = useState({});
  const [deadline, setDeadline] = useState();

  let navigate = useNavigate();

  function redirect() {
    navigate("/task");
  }

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
    descriere_task: "",
  };

  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm({ defaultValues });

  const onSubmit = (data) => {
    setFormData(data);
    Axios.post("http://localhost:7000/taskuri/add", {
      deadline: data.deadline.toLocaleDateString(),
      descriere_task: data.descriere_task,
    });
    console.log(data.deadline.toLocaleDateString());
    console.log("-------");
    console.log(data);

    setShowMessage(true);

    reset();
  };

  return (
    <div className="formAddTask">
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
        <h3 className="text-center">Add Task</h3>
        <form onSubmit={handleSubmit(onSubmit)} className="p-fluid">
          <div className="field">
            <span className="p-float-label">
              <Controller
                name="descriere_task"
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
                htmlFor="descriere_task"
                className={classNames({ "p-error": errors.name })}
              >
                Description Task*
              </label>
            </span>
            {getFormErrorMessage("descriere_task")}
          </div>
          <div className="field">
            <span className="p-float-label">
              <Controller
                name="deadline"
                control={control}
                render={({ field, fieldState }) => (
                  <Calendar
                    id={field.name}
                    value={field.value}
                    onChange={(e) => field.onChange(e.value)}
                    dateFormat="mm-dd-yy"
                    showIcon
                  />
                )}
              />
              <label htmlFor="deadline">Deadline Task</label>
            </span>
            {getFormErrorMessage("deadline")}
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
    </div>
  );
}
