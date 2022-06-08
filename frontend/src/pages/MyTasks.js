import { useEffect, useState, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Toast } from "primereact/toast";
import Axios from "axios";
import SidebarFinal from "../Components/Sidebar/Sidebar";

export default function MyTasks() {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);

  const id_angajat = localStorage.getItem("id");

  useEffect(() => {
    Axios.get(`http://localhost:7000/grup_task/${id_angajat}`).then(
      (response) => {
        setTasks(response.data);
      }
    );
  }, []);

  const finishTask = () => {
    toast.current.show({
      severity: "info",
      summary: "Confirmed",
      detail: "Operation successful",
      life: 3000,
    });
    Axios.put(
      `http://localhost:7000/taskuri/update/finalizare/${selectedTask}`
    ).then(() => {
      Axios.get(`http://localhost:7000/grup_task/${id_angajat}`).then(
        (response) => {
          setTasks(response.data);
        }
      );
    });

    setSelectedTask(null);
  };

  const toast = useRef(null);

  const confirm = () => {
    confirmDialog({
      message: "Are you sure you want to proceed?",
      header: "Confirmation",
      icon: "pi pi-exclamation-triangle",
      accept: finishTask,
    });
  };

  return (
    <div className="MyTasks">
      <div className="Navbar">
        <h3>MyTasks</h3>
        <Toast ref={toast} />
        <ConfirmDialog />
        <SidebarFinal></SidebarFinal>
      </div>
      <h2 style={{ textAlign: "center" }}> Your tasks </h2>

      <DataTable
        value={tasks}
        selectionMode="single"
        selection={selectedTask}
        onSelectionChange={(e) => {
          setSelectedTask(e.value[0]);
        }}
        dataKey="id"
        responsiveLayout="scroll"
      >
        <Column field="1" header="Task Name"></Column>
        <Column field="2" header="Status Task"></Column>
        <Column field="3" header="Deadline"></Column>
        <Column field="4" header="Finished Time"></Column>
        <Column field="5" header="Description Task Group"></Column>
      </DataTable>
      {console.log(selectedTask)}
      <div className="buttons">
        {selectedTask != null ? (
          <Button label="Update" icon="pi pi-check" onClick={confirm}></Button>
        ) : (
          <Button label="Update" icon="pi pi-check" disabled></Button>
        )}
      </div>
    </div>
  );
}
