import { useEffect, useState, useRef } from "react";
import SidebarFinal from "../Components/Sidebar/Sidebar";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Dialog } from "primereact/dialog";
import { useNavigate } from "react-router";
import { classNames } from "primereact/utils";
import { useForm, Controller } from "react-hook-form";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import Axios from "axios";
import "./styles/EditUser.css";

export default function EditUser() {
  const [displayResponsive, setDisplayResponsive] = useState(false);
  const [position, setPosition] = useState("center");
  const [angajati, setAngajati] = useState([]);
  const [angajatSelected, setAngajatSelected] = useState();
  const [showMessage, setShowMessage] = useState(false);
  const [formData, setFormData] = useState({});
  const [department, setDepartment] = useState([]);
  const [copy, setCopy] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [valDef1, setValDef1] = useState("");
  const [pozition1, setPozition] = useState();

  // FORM
  useEffect(() => {
    Axios.get("http://localhost:7000/angajati/").then((response) => {
      setAngajati(response.data);
    });
  }, []);

  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm();

  function calculatePozition(selectedDepartment) {
    for (let i = 0; i < department.length; i++) {
      if (selectedDepartment == department[i][0]) {
        setPozition(i);
        break;
      }
    }
  }

  const onSubmit = (data) => {
    setFormData(data);
    setShowMessage(true);

    for (let i = 0; i < department.length; i++) {
      if (selectedDepartment == department[i][0]) {
        Axios.put(
          `http://localhost:7000/departament/update/${selectedDepartment}`,
          {
            nume_departament: data.nume_departament,
            id_sef_departament: angajatSelected[0],
          }
        );
        department[i][1] = data.nume_departament;
        department[i][2] =
          angajatSelected.split(" ")[2] + " " + angajatSelected.split(" ")[1];

        break;
      }
    }
    reset();
  };

  const getFormErrorMessage = (name) => {
    return (
      errors[name] && <small className="p-error">{errors[name].message}</small>
    );
  };

  const leaderDepartment = [];

  for (let i = 0; i < angajati.length; i++) {
    leaderDepartment[i] =
      angajati[i][0] + " " + angajati[i][1] + " " + angajati[i][2];
  }

  const onSelectedEmployee = (e) => {
    setAngajatSelected(e.value);
  };

  //END FORM

  //start dialog
  const dialogFuncMap = {
    displayResponsive: setDisplayResponsive,
  };

  const onClickButton = (name, position) => {
    dialogFuncMap[`${name}`](true);

    if (position) {
      setPosition(position);
    }
    for (let i = 0; i < department.length; i++) {
      if (selectedDepartment == department[i][0]) {
        setPozition(i);
        break;
      }
    }
    setValDef1(department[pozition1][1]);
  };

  const onHide = (name) => {
    dialogFuncMap[`${name}`](false);
  };

  //end dialog

  //for redirect on back button
  let navigate = useNavigate();

  function redirect() {
    navigate("/admin");
  }

  const toast = useRef(null);

  //functia de delete
  const deleteUser = () => {
    toast.current.show({
      severity: "info",
      summary: "Confirmed",
      detail: "Operation successful",
      life: 3000,
    });

    let pos;
    for (let i = 0; i < department.length; i++) {
      if (selectedDepartment == department[i][0]) {
        pos = i;
        break;
      }
    }

    let copy = department;
    setCopy(copy.splice(pos, 1));
    setDepartment(copy);
    Axios.delete(
      `http://localhost:7000/departament/delete/${selectedDepartment}`
    );
  };

  //popup pentru confirmare pentru delete
  const confirm1 = () => {
    confirmDialog({
      message: "Are you sure you want to proceed?",
      header: "Confirmation",
      icon: "pi pi-exclamation-triangle",
      accept: deleteUser,
    });
    setSelectedDepartment(null);
  };

  //preia datele pentru tabela de informatii
  useEffect(() => {
    Axios.get("http://localhost:7000/departament/").then((response) => {
      setDepartment(response.data);
    });
  }, []);

  return (
    <div className="EditDepartment">
      {/* Dialogul pentru update user  */}
      <Dialog
        header="Update Department "
        visible={displayResponsive}
        onHide={() => onHide("displayResponsive")}
        breakpoints={{ "960px": "75vw" }}
        style={{ width: "50vw" }}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="p-fluid">
          <div className="field">
            <span className="p-float-label">
              <Controller
                name="nume_departament"
                control={control}
                rules={{ required: "Numele departamentului este obligatoriu." }}
                render={({ field, fieldState }) => (
                  <InputText
                    id={field.name}
                    {...field}
                    autoFocus
                    className={classNames({ "p-invalid": fieldState.error })}
                  />
                )}
                defaultValue={valDef1}
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
          <div className="field">
            <span className="p-float-label">
              <Controller
                name="id_sef_departament"
                control={control}
                render={({ field }) => (
                  <Dropdown
                    value={angajatSelected}
                    options={leaderDepartment}
                    onChange={onSelectedEmployee}
                  />
                )}
              />

              <label htmlFor="id_sef_departament">Sef Departament</label>
            </span>
            {getFormErrorMessage("nume_departament")}
          </div>
          <Button type="submit" label="Submit" className="mt-2" />
        </form>
      </Dialog>
      <Toast ref={toast} />

      {/* Navbarul */}
      <div className="Navbar">
        <h3>Edit/Update Departament</h3>
        <ConfirmDialog />

        <SidebarFinal></SidebarFinal>
      </div>
      <h2 style={{ textAlign: "center" }}> Departments List </h2>

      {/* TABELA CU INFORMATIILE */}
      <DataTable
        value={department}
        selectionMode="single"
        selection={selectedDepartment}
        onSelectionChange={(e) => {
          setSelectedDepartment(e.value[0]);
          calculatePozition(e.value[0]);
        }}
        dataKey="id"
        responsiveLayout="scroll"
      >
        <Column field="0" header="Id"></Column>
        <Column field="1" header="Name"></Column>
        <Column field="2" header="Leader of Departament"></Column>
      </DataTable>

      {/* Butoanele de Update si Delete */}
      <div className="buttons">
        {selectedDepartment != null ? (
          <Button
            label="Update"
            icon="pi pi-check"
            className="Update"
            onClick={() => onClickButton("displayResponsive")}
            // onClick={confirm1}
          />
        ) : (
          <Button
            label="Update"
            icon="pi pi-check"
            className="Update"
            disabled
          />
        )}
        {selectedDepartment != null ? (
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
