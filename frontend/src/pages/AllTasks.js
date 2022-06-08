import { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import Axios from "axios";
import SidebarFinal from "../Components/Sidebar/Sidebar";

export default function MyTasks() {
  const [tasks, setTasks] = useState([]);
  const [groupTasks, setGroupTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [selectedGroupTask, setSelectedGroupTask] = useState(null);

  //adauga datele in tabela de informatii
  useEffect(() => {
    Axios.get("http://localhost:7000/taskuri/").then((response) => {
      setTasks(response.data);
    });
  }, []);

  //adauga datele in tabela de informatii
  useEffect(() => {
    Axios.get("http://localhost:7000/grup_task/").then((response) => {
      setGroupTasks(response.data);
    });
  }, []);

  return (
    <div className="Homepage">
      <div className="Navbar">
        <h3>My Tasks</h3>

        <SidebarFinal></SidebarFinal>
      </div>
      <h3 className="title">All Tasks</h3>
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
        <Column field="0" header="Id"></Column>
        <Column field="1" header="Deadline"></Column>
        <Column field="2" header="Description"></Column>
        <Column field="3" header="Status Task"></Column>
        <Column field="4" header="Finished Time"></Column>
        <Column field="5" header="Starting Time"></Column>
      </DataTable>

      <h3 className="title">Tasks Distribution</h3>
      <DataTable
        value={groupTasks}
        selectionMode="single"
        selection={selectedGroupTask}
        onSelectionChange={(e) => {
          setSelectedGroupTask(e.value[0]);
          //calculatePozition(e.value[0]);
        }}
        dataKey="id"
        responsiveLayout="scroll"
      >
        <Column field="0" header="Id"></Column>
        <Column field="1" header="Description"></Column>
        <Column field="2" header="Employee asigned"></Column>
        <Column field="3" header="Group Description"></Column>
      </DataTable>
    </div>
  );
}
