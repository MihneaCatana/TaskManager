import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Password } from "primereact/password";
import { Dropdown } from "primereact/dropdown";
import { Dialog } from "primereact/dialog";
import { classNames } from "primereact/utils";
import "./styles/AddUser.css";
import { useNavigate } from "react-router";

import Axios from "axios";

export default function AddUser() {
  let navigate = useNavigate();

  const optionStatus = [
    { name: "Angajat", value: 0 },
    { name: "Sef Departament", value: 1 },
    { name: "Administrator", value: 2 },
  ];

  function redirect() {
    navigate("/admin");
  }

  const [showMessage, setShowMessage] = useState(false);
  const [formData, setFormData] = useState({});
  const defaultValues = {
    prenume: "",
    nume: "",
    parola: "",
    email: "",
    id_status_user: 0,
  };

  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm({ defaultValues });

  const onSubmit = (data) => {
    setFormData(data);

    Axios.post("http://localhost:7000/angajati/add", {
      prenume: data.prenume,
      nume: data.nume,
      parola: data.parola,
      email: data.email,
      id_status_user: data.id_status_user,
      loggedIn: localStorage.getItem("auth"),
    });

    console.log(data);
    console.log(data.id_status_user);
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
    <div className="formAddUser">
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
          <h5>User Added!</h5>
        </div>
      </Dialog>

      <div className="cardAdd">
        <h3 className="text-center">Add User</h3>
        <form onSubmit={handleSubmit(onSubmit)} className="p-fluid">
          <div className="field">
            <span className="p-float-label">
              <Controller
                name="prenume"
                control={control}
                rules={{ required: "First Name is required." }}
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
                htmlFor="prenume"
                className={classNames({ "p-error": errors.name })}
              >
                Prenume*
              </label>
            </span>
            {getFormErrorMessage("prenume")}
          </div>
          <div className="field">
            <span className="p-float-label">
              <Controller
                name="nume"
                control={control}
                rules={{ required: "Last Name is required." }}
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
                htmlFor="nume"
                className={classNames({ "p-error": errors.name })}
              >
                Nume*
              </label>
            </span>
            {getFormErrorMessage("nume")}
          </div>
          <div className="field">
            <span className="p-float-label p-input-icon-right">
              <i className="pi pi-envelope" />
              <Controller
                name="email"
                control={control}
                rules={{
                  required: "Email is required.",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                    message: "Invalid email address. E.g. example@email.com",
                  },
                }}
                render={({ field, fieldState }) => (
                  <InputText
                    id={field.name}
                    {...field}
                    className={classNames({
                      "p-invalid": fieldState.error,
                    })}
                  />
                )}
              />
              <label
                htmlFor="email"
                className={classNames({ "p-error": !!errors.email })}
              >
                Email*
              </label>
            </span>
            {getFormErrorMessage("email")}
          </div>
          <div className="field">
            <span className="p-float-label">
              <Controller
                name="parola"
                control={control}
                rules={{ required: "Parola este necesara." }}
                render={({ field, fieldState }) => (
                  <Password
                    id={field.name}
                    {...field}
                    toggleMask
                    className={classNames({ "p-invalid": fieldState.error })}
                  />
                )}
              />
              <label
                htmlFor="parola"
                className={classNames({ "p-error": errors.parola })}
              >
                Parola*
              </label>
            </span>
            {getFormErrorMessage("parola")}
          </div>
          <div className="field">
            <span className="p-float-label">
              <Controller
                name="id_status_user"
                control={control}
                rules={{ required: "Name is required." }}
                render={({ field, fieldState }) => (
                  <div className="field">
                    <span className="p-float-label">
                      <Controller
                        name="id_status_user"
                        control={control}
                        render={({ field }) => (
                          <Dropdown
                            id={field.name}
                            value={field.value}
                            options={optionStatus}
                            onChange={(e) => field.onChange(e.value)}
                            optionLabel="name"
                            optionValue={optionStatus.value}
                          />
                        )}
                      />
                      <label htmlFor="id_status_user">Status User</label>
                    </span>
                  </div>
                )}
              />
            </span>
            {getFormErrorMessage("id_status_user")}
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
