const oracledb = require("oracledb");
const credentials = require("../config/config");

//GET - toate taskurile
const taskuri_get = async (req, res) => {
  //conexiune la baza de date
  let connection;
  connection = await oracledb.getConnection(credentials);

  //cautam toate taskurile
  const result =
    await connection.execute(`SELECT id_task,deadline,descriere_task,s.denumire_status,data_finalizare,data_inceput_task 
      FROM taskuri t, status_task s where s.id_status_task = t.status_task`);

  //pentru debugging
  try {
    res.status(200).send(result.rows);
  } catch (err) {
    res.status(404).send(err);
  }
};

//GET - cate taskuri sunt
const taskuri_totale = async (req, res) => {
  //conexiune la baza de date
  let connection;
  connection = await oracledb.getConnection(credentials);

  //cautam toate taskurile realizate
  const result = await connection.execute(`SELECT count(id_task) FROM taskuri`);

  //pentru debugging
  try {
    res.status(200).send(result.rows);
  } catch (err) {
    res.status(404).send(err);
  }
};

//GET - cate taskuri sunt finalizate
const taskuri_finalizate = async (req, res) => {
  //conexiune la baza de date
  let connection;
  connection = await oracledb.getConnection(credentials);

  //cautam toate taskurile realizate
  const result = await connection.execute(
    `SELECT count(id_task) FROM taskuri WHERE status_task = 2`
  );

  //pentru debugging
  try {
    res.status(200).send(result.rows);
  } catch (err) {
    res.status(404).send(err);
  }
};

//GET - taskurile nefinalizate sunt

const taskuri_get_neterminate = async (req, res) => {
  //conexiune la baza de date
  let connection;
  connection = await oracledb.getConnection(credentials);

  //cautam toate taskurile
  const result =
    await connection.execute(`SELECT id_task,deadline,descriere_task,s.denumire_status,data_finalizare,data_inceput_task 
        FROM taskuri t, status_task s where s.id_status_task = t.status_task AND t.status_task=1`);

  //pentru debugging
  try {
    res.status(200).send(result.rows);
  } catch (err) {
    res.status(404).send(err);
  }
};

//GET - taskurile nefinalizate pentru angajatul X
const taskuri_finalizate_angajat = async (req, res) => {
  //conexiune la baza de date
  let connection;
  connection = await oracledb.getConnection(credentials);

  id_angajat = req.params.id;
  //cautam toate taskurile
  const result =
    await connection.execute(`SELECT count(taskuri.id_task) FROM taskuri 
    left join grup_taskuri on taskuri.id_task = grup_taskuri.id_task WHERE taskuri.status_task = 2 AND grup_taskuri.id_angajat= ${id_angajat} `);

  //pentru debugging
  try {
    res.status(200).send(result.rows);
  } catch (err) {
    res.status(404).send(err);
  }
};

//GET - taskurile pentru angajatul X
const taskuri_totale_angajat = async (req, res) => {
  //conexiune la baza de date
  let connection;
  connection = await oracledb.getConnection(credentials);

  id_angajat = req.params.id;
  //cautam toate taskurile
  const result =
    await connection.execute(`SELECT count(taskuri.id_task) FROM taskuri 
    left join grup_taskuri on taskuri.id_task = grup_taskuri.id_task WHERE grup_taskuri.id_angajat= ${id_angajat} `);

  //pentru debugging
  try {
    res.status(200).send(result.rows);
  } catch (err) {
    res.status(404).send(err);
  }
};

//-------------------------------------------------------------------------------------------------------------------------------------//

//POST - adaugam un task nou
const taskuri_post = async (req, res) => {
  //conexiunea la baza de date
  let connection;
  connection = await oracledb.getConnection(credentials);

  //preluam datele ce urmeaza a fi inserate
  deadline = req.body.deadline;
  descriere_task = req.body.descriere_task;

  //inseram datele in baza de date  //validam in front end
  const result = await connection.execute(
    `INSERT into taskuri(id_task,deadline,descriere_task,status_task,data_inceput_task) VALUES (taskuri_seq.nextval,:V1,:V2,1,SYSDATE)`,
    [deadline, descriere_task]
  );

  //aplicam schimbarile in baza de date
  const commit = connection.execute(`COMMIT`);

  //pentru debugging
  try {
    res.status(200).send("Task adaugat");
  } catch (err) {
    res.status(404).send(err);
  }
};

//-------------------------------------------------------------------------------------------------------------------------------------//

//PUT - update task

const taskuri_put = async (req, res) => {
  //conexiune la baza de date
  let connection;
  connection = await oracledb.getConnection(credentials);

  id_task = req.params.id;

  //cautam taskul pe care il vrem sa il updatam in baza de date
  const validare = await connection.execute(
    `SELECT id_task from taskuri where id_task = :VARIABILA`,
    [id_task]
  );

  //verificam daca taskul exista sau nu
  if (validare.rows && validare.rows.length > 0) {
    var deadline = req.body.deadline;
    var descriere_task = req.body.descriere_task;
    var status_task = req.body.status_task;

    //preluam toate datele angajatului printr-un query
    const Query = await connection.execute(
      `SELECT deadline,descriere_task,status_task from taskuri where id_task = :VARIABILA`,
      [id_task]
    );

    // Daca nu este data o valoarea valida, pastram valoarea existenta
    if (deadline === undefined || deadline === "") {
      deadline = Query.rows.toString().split(",")[0];
    }
    if (descriere_task === undefined || descriere_task === "") {
      descriere_task = Query.rows.toString().split(",")[1];
    }
    if (status_task === undefined || status_task === "") {
      status_task = Query.rows.toString().split(",")[2];
    }

    //updatam taskul
    const updateQuery = await connection.execute(
      `UPDATE taskuri set deadline = :V1, descriere_task = :V2, status_task =:V3 WHERE id_task = :VARIABILA`,
      [deadline, descriere_task, status_task, id_task]
    );
  } else res.status(404).send("Taskul nu exista");

  //aplicam schimbarile in baza de date
  const commit = connection.execute(`COMMIT`);

  //pentru debugging
  try {
    res.status(200).send("Task updatat");
  } catch (err) {
    res.status(404).send(err);
  }
};

//-------------------------------------------------------------------------------------------------------------------------------------//

//PUT - finalize task
const taskuri_put_finalizare = async (req, res) => {
  //conexiune la baza de date
  let connection;
  connection = await oracledb.getConnection(credentials);

  id_task = req.params.id;

  //cautam taskul pe care il vrem sa il updatam in baza de date
  const validare = await connection.execute(
    `SELECT status_task from taskuri where id_task = :VARIABILA`,
    [id_task]
  );

  //verificam daca taskul exista sau nu
  if (validare.rows && validare.rows.length > 0) {
    var status_task;
    if (validare.rows.toString() == 1) status_task = 2;
    else status_task = 1;

    //updatam taskul
    const updateQuery = await connection.execute(
      `UPDATE taskuri set status_task =:V3 WHERE id_task = :VARIABILA`,
      [status_task, id_task]
    );
  } else res.status(404).send("Taskul nu exista");

  //aplicam schimbarile in baza de date
  const commit = connection.execute(`COMMIT`);

  //pentru debugging
  try {
    res.status(200).send("Task updatat");
  } catch (err) {
    res.status(404).send(err);
  }
};

//-------------------------------------------------------------------------------------------------------------------------------------//

//DELETE - stergere task
const taskuri_delete = async (req, res) => {
  //conexiune la baza de date
  let connection;
  connection = await oracledb.getConnection(credentials);

  id_task = req.params.id;

  //cautam taskul pe care il vrem sa il updatam in baza de date
  const validare = await connection.execute(
    `SELECT id_task from taskuri where id_task = :VARIABILA`,
    [id_task]
  );

  //verificam daca taskul exista sau nu
  if (validare.rows && validare.rows.length > 0) {
    //stergem angajatul din baza de date
    const result = connection.execute(
      `DELETE FROM taskuri where id_task = :VARIABILA`,
      [id_task]
    );

    //aplicam schimbarile in baza de date
    const commit = connection.execute(`COMMIT`);
  } else res.status(404).send("Taskul nu exista");

  //pentru debugging
  try {
    res.status(200).send("Task sters");
  } catch (err) {
    res.status(404).send(err);
  }
};

module.exports = {
  taskuri_get,
  taskuri_totale,
  taskuri_finalizate,
  taskuri_get_neterminate,
  taskuri_finalizate_angajat,
  taskuri_totale_angajat,
  taskuri_post,
  taskuri_put,
  taskuri_put_finalizare,
  taskuri_delete,
};
