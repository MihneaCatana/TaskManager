import { useState, useRef, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router";
import { InputText } from "primereact/inputtext";
import { classNames } from "primereact/utils";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import "./LoginForm.css";

import Axios from "axios";

Axios.defaults.withCredentials = true;

function LoginFormular() {
  const toast = useRef();

  const [formData, setFormData] = useState({});
  const defaultValues = {
    email: "",
    parola: "",
  };

  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm({ defaultValues });

  const onSubmit = (data) => {
    setFormData(data);
    Axios.post("http://localhost:7000/login", {
      email: data.email,
      parola: data.parola,
    }).then((response) => {
      if (
        response.data != "Email/Parola incorecta" &&
        response.data != "Introduceti parola si emailul"
      ) {
        console.log(response.data);
        console.log(response.data.activat);
        if (response.data.activat == 1) {
          //pun in local storage
          localStorage.setItem("id", response.data.result);
          localStorage.setItem("auth", response.data.auth);
          localStorage.setItem("role", response.data.role);
          localStorage.setItem("departament", response.data.departament);
          redirect();
        } else {
          toast.current.show({
            severity: "error",
            summary: "Eroare",
            detail: "Cont inactiv ",
            life: 3000,
          });
        }
      } else {
        toast.current.show({
          severity: "error",
          summary: "Eroare",
          detail: "Date de logare gresite ",
          life: 3000,
        });
      }
    });
  };

  const getFormErrorMessage = (name) => {
    return (
      errors[name] && <small className="p-error">{errors[name].message}</small>
    );
  };

  let navigate = useNavigate();

  function redirect() {
    navigate("/homepage");
  }

  return (
    <div className="form-demo">
      <Toast ref={toast} />
      <h2>Login</h2>
      <img src="../assets/logo.png" className="logo" />
      <form onSubmit={handleSubmit(onSubmit)} className="p-fluid">
        <div className="card">
          <div className="field">
            <span className="p-float-label p-input-icon-right">
              <i className="pi pi-envelope" />
              {/* EMAIL */}
              <Controller
                name="email"
                control={control}
                rules={{
                  required: "Emailul este obligatoriu.",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                    message: "Invalid email address. E.g. example@email.com",
                  },
                }}
                render={({ field, fieldState }) => (
                  <InputText
                    id={field.name}
                    {...field}
                    className={classNames({ "p-invalid": fieldState.error })}
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

          {/* PASSWORD */}
          <div className="field">
            <span className="p-float-label">
              <Controller
                name="parola"
                control={control}
                rules={{ required: "Parola este obligatorie." }}
                render={({ field, fieldState }) => (
                  <Password
                    id={field.name}
                    {...field}
                    toggleMask
                    className={classNames({ "p-invalid": fieldState.error })}
                    feedback={false}
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
          <Button type="submit" label="Submit" className="mt-2" />
        </div>
      </form>
    </div>
  );
}

export default LoginFormular;
