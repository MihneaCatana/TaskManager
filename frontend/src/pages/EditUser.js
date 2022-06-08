import { useEffect, useState, useRef } from "react";
import SidebarFinal from "../Components/Sidebar/Sidebar";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Dialog } from "primereact/dialog";
import { useForm, Controller } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Dropdown } from "primereact/dropdown";
import { classNames } from "primereact/utils";
import { useNavigate } from "react-router";
import Axios from "axios";
import "./styles/EditUser.css";

export default function EditUser() {
  //Dialog
  const [displayResponsive, setDisplayResponsive] = useState(false);
  const [position, setPosition] = useState("center");
  const [users, setUsers] = useState([]);
  const [copy, setCopy] = useState([]);
  const [selectedUser, setselectedUser] = useState(null);
  const [showMessage, setShowMessage] = useState(false);
  const [formData, setFormData] = useState({});
  const [valDef1, setValDef1] = useState("");
  const [valDef2, setValDef2] = useState("");
  const [valDef3, setValDef3] = useState("");
  const [valDef4, setValDef4] = useState("");
  const [valDef5, setValDef5] = useState();
  const [pozition1, setPozition] = useState();

  const toast = useRef(null);

  const dialogFuncMap = {
    displayResponsive: setDisplayResponsive,
  };

  function calculatePozition(selectedUser) {
    for (let i = 0; i < users.length; i++) {
      if (selectedUser == users[i][0]) {
        setPozition(i);
        break;
      }
    }
  }

  const onClickButton = (name, position) => {
    dialogFuncMap[`${name}`](true);

    if (position) {
      setPosition(position);
    }

    let pos;
    for (let i = 0; i < users.length; i++) {
      if (selectedUser == users[i][0]) {
        pos = i;
        break;
      }
    }

    setValDef1(users[pos][1]);
    setValDef2(users[pos][2]);
    setValDef3(users[pos][3]);
    setValDef4(users[pos][4]);
    if (users[pos][6] == "Administrator") {
      setValDef5(2);
    } else if (users[pos][6] == "Sef de departament") {
      setValDef5(1);
    } else setValDef5(0);

    reset();
  };

  const onHide = (name) => {
    dialogFuncMap[`${name}`](false);
  };

  //end dialog

  let navigate = useNavigate();

  function redirect() {
    navigate("/admin");
  }

  //functia de delete user
  const deleteUser = () => {
    toast.current.show({
      severity: "info",
      summary: "Confirmed",
      detail: "Operation successful",
      life: 3000,
    });

    let pos;
    for (let i = 0; i < users.length; i++) {
      if (selectedUser == users[i][0]) {
        pos = i;
        break;
      }
    }

    let copy = users;
    setCopy(copy.splice(pos, 1));
    setUsers(copy);
    Axios.delete(`http://localhost:7000/angajati/delete/${selectedUser}`);
  };

  //popup de confirm pentru butonul de delete
  const confirm1 = () => {
    confirmDialog({
      message: "Are you sure you want to proceed?",
      header: "Confirmation",
      icon: "pi pi-exclamation-triangle",
      accept: deleteUser,
    });
    setselectedUser(null);
  };

  const confirm2 = () => {
    confirmDialog({
      message: "Are you sure you want to proceed?",
      header: "Confirmation",
      icon: "pi pi-exclamation-triangle",
      accept: activateUser,
    });
  };

  const activateUser = () => {
    toast.current.show({
      severity: "info",
      summary: "Confirmed",
      detail: "Operation successful",
      life: 3000,
    });

    if (users[pozition1][7] == 0) {
      Axios.put(`http://localhost:7000/angajati/activate/${selectedUser}`, {
        activat: 1,
      });

      users[pozition1][7] = 1;
    } else {
      Axios.put(`http://localhost:7000/angajati/activate/${selectedUser}`, {
        activat: 0,
      });
      users[pozition1][7] = 0;
    }
    setselectedUser(null);
  };

  //adauga datele in tabela de informatii
  useEffect(() => {
    Axios.get("http://localhost:7000/angajati/").then((response) => {
      setUsers(response.data);
    });
  }, []);

  //Form
  const optionStatus = [
    { name: "Angajat", value: 0 },
    { name: "Sef de departament", value: 1 },
    { name: "Administrator", value: 2 },
  ];

  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm();

  const onSubmit = (data) => {
    setFormData(data);

    Axios.put(`http://localhost:7000/angajati/update/${selectedUser}`, {
      prenume: data.prenume,
      nume: data.nume,
      parola: data.parola,
      email: data.email,
      id_status_user: data.id_status_user,
    });
    setShowMessage(true);

    for (let i = 0; i < users.length; i++) {
      if (selectedUser == users[i][0]) {
        users[i][1] = data.prenume;
        users[i][2] = data.nume;
        users[i][3] = data.email;
        users[i][4] = data.parola;
        users[i][6] = data.id_status_user;
        setValDef5(data.id_status_user);

        if (data.id_status_user == 2) {
          users[i][6] = "Administrator";
        } else if (data.id_status_user == 1) {
          users[i][6] = "Sef de departament";
        } else {
          users[i][6] = "Angajat";
        }

        break;
      }
    }
  };

  const getFormErrorMessage = (name) => {
    return (
      errors[name] && <small className="p-error">{errors[name].message}</small>
    );
  };
  //End form

  return (
    <div className="EditUser">
      <Toast ref={toast} />
      {/* Dialog */}
      <Dialog
        header="Update User "
        visible={displayResponsive}
        onHide={() => onHide("displayResponsive")}
        breakpoints={{ "960px": "75vw" }}
        style={{ width: "50vw" }}
      >
        {/* Form */}
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
                defaultValue={valDef1}
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
                defaultValue={valDef2}
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
                defaultValue={valDef3}
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
                defaultValue={valDef4}
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
                defaultValue={valDef5}
              />
            </span>
            {getFormErrorMessage("id_status_user")}
          </div>
          <Button type="submit" label="Submit" className="mt-2" />
        </form>
      </Dialog>
      {/* Navbarul */}
      <div className="Navbar">
        <h3>Edit/Update Users</h3>
        <ConfirmDialog />

        <SidebarFinal></SidebarFinal>
      </div>
      <h2 style={{ textAlign: "center" }}> Users List </h2>

      {/* TABELA CU INFORMATIILE */}
      <DataTable
        value={users}
        selectionMode="single"
        selection={selectedUser}
        onSelectionChange={(e) => {
          setselectedUser(e.value[0]);
          calculatePozition(e.value[0]);
        }}
        dataKey="id"
        responsiveLayout="scroll"
      >
        <Column field="0" header="Id"></Column>
        <Column field="1" header="First Name"></Column>
        <Column field="2" header="Last Name"></Column>
        <Column field="3" header="Email"></Column>
        <Column field="5" header="Departament"></Column>
        <Column field="6" header="Status"></Column>
        <Column field="7" header="Activated"></Column>
      </DataTable>

      {/* Butoanele de Update si Delete */}
      <div className="buttons">
        {selectedUser != null ? (
          <Button
            label="Update"
            icon="pi pi-check"
            className="Update"
            // onClick={confirm1}
            onClick={() => onClickButton("displayResponsive")}
          />
        ) : (
          <Button
            label="Update"
            icon="pi pi-check"
            className="Update"
            disabled
          />
        )}

        {selectedUser != null ? (
          <Button
            label="Delete"
            icon="pi pi-check"
            className="Delete"
            onClick={confirm1}
          />
        ) : (
          <Button
            label="Delete"
            icon="pi pi-check"
            className="Delete"
            disabled
          />
        )}
        {selectedUser != null ? (
          users[pozition1][7] == 0 ? (
            <Button
              label="Activate"
              icon="pi pi-check"
              className="Activate"
              onClick={confirm2}
            />
          ) : (
            <Button
              label="Deactivate"
              icon="pi pi-check"
              className="Activate"
              onClick={confirm2}
            />
          )
        ) : (
          <Button
            label="Activate"
            icon="pi pi-check"
            className="Activate"
            disabled
          />
        )}
      </div>

      {/* Butonul de return */}
      <div className="buttons">
        <Button
          icon="pi pi-home"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={redirect}
        ></Button>
      </div>
    </div>
  );
}
