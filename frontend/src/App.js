import "./App.css";
import Login from "./pages/Login";
import Homepage from "./pages/Homepage";
import Admin from "./pages/Admin";
import Page404 from "./pages/Page404";
import Task from "./pages/Task";
import AddUser from "./pages/AddUser";
import AddDepartment from "./pages/AddDepartment";
import EditUser from "./pages/EditUser";
import EditDepartment from "./pages/EditDepartment";
import AllTasks from "./pages/AllTasks";
import AddTasks from "./pages/AddTasks";
import AssignTasks from "./pages/AssignTasks";
import MyTasks from "./pages/MyTasks";
import AssignEmployees from "./pages/AssignEmployees";

import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route index element={<Login />} />
          <Route path="/homepage" element={<Homepage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/task" element={<Task />} />
          <Route path="/addUser" element={<AddUser />} />
          <Route path="/addDepartment" element={<AddDepartment />} />
          <Route path="/editUser" element={<EditUser />} />
          <Route path="/editDepartment" element={<EditDepartment />} />
          <Route path="/addTasks" element={<AddTasks />} />
          <Route path="/allTasks" element={<AllTasks />} />
          <Route path="/assignTasks" element={<AssignTasks />} />
          <Route path="/assignEmployees" element={<AssignEmployees />} />
          <Route path="/myTasks" element={<MyTasks />} />
          <Route path="*" element={<Page404 />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
