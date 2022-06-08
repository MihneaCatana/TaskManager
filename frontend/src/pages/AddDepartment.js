import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { classNames } from "primereact/utils";
import "./styles/AddDepartment.css";
import { useNavigate } from "react-router";

import Axios from "axios";

export default function AddDepartment() {
  const [showMessage, setShowMessage] = useState(false);
  const [formData, setFormData] = useState({});

  let navigate = useNavigate();

  function redirect() {
    navigate("/admin");
  }

  const defaultValues = {
    nume_departament: "",
  };

  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm({ defaultValues });

  const onSubmit = (data) => {
    setFormData(data);
    Axios.post("http://localhost:7000/departament/add", {
      nume_departament: data.nume_departament,
      loggedIn: localStorage.getItem("auth"),
    });

    console.log(data);
    setShowMessage(true);

    reset();
  };

  const getFormErrorMessage = (name) => {
    return (
      errors[name] && <small className="p-error">{errors[name].message}</small>
    );
  };

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

  return (
    <div className="formAddDepartment">
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
          <h5>Departament Added!</h5>
        </div>
      </Dialog>

      <div className="cardAdd">
        <h3 className="text-center">Add Department</h3>
        <form onSubmit={handleSubmit(onSubmit)} className="p-fluid">
          <div className="field">
            <span className="p-float-label">
              <Controller
                name="nume_departament"
                control={control}
                rules={{ required: "Name of Department is required." }}
                render={({ field, fieldState }) => (
                  <InputText
                    id={field.name}
                    {...field}
                    autoFocus
                    className={classNames({
                      "p-invalid": fieldState.error,
                    })}
                  />
                )}
              />
              <label
                htmlFor="nume_departament"
                className={classNames({ "p-error": errors.name })}
              >
                Nume Departament*
              </label>
            </span>
            {getFormErrorMessage("nume_departament")}
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
