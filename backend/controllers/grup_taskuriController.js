const oracledb = require("oracledb");
const credentials = require("../config/config");

//-------------------------------------------------------------------------------------------------------------------------------------//

//GET - toate grupurile de taskuri
const grup_taskuri_get = async (req, res) => {
  //conexiune la baza de date
  let connection;
  connection = await oracledb.getConnection(credentials);

  //cautam toate grupurile de taskuri
  const result =
    await connection.execute(`SELECT id_grup, descriere_task, nume || ' ' || prenume, denumire_grup from grup_taskuri left join taskuri on grup_taskuri.id_task = taskuri.id_task
    left join angajati on grup_taskuri.id_angajat = angajati.id_angajat`);

  //pentru debugging
  try {
    res.status(200).send(result.rows);
  } catch (err) {
    res.status(404).send(err);
  }
};

//GET - taskurile pentru angajatul X

const grup_taskuri_get_angajat = async (req, res) => {
  //conexiune la baza de date
  let connection;
  connection = await oracledb.getConnection(credentials);

  const id_angajat = req.params.id;

  const result = await connection.execute(
    `SELECT t.id_task, t.descriere_task, s.denumire_status, t.deadline, t.data_finalizare,g.denumire_grup from taskuri t left join grup_taskuri g
    on g.id_task = t.id_task left join status_task s on s.id_status_task = t.status_task where g.id_angajat = :VARIABILA order by t.id_task`,
    [id_angajat]
  );

  try {
    res.status(200).send(result.rows);
  } catch (err) {
    console.log(err);
  }
};

//-------------------------------------------------------------------------------------------------------------------------------------//

//POST - adauga un nou grup de taskuri
const grup_taskuri_post = async (req, res) => {
  //conexiune la baza de date
  let connection;
  connection = await oracledb.getConnection(credentials);

  id_task = req.body.id_task;
  id_angajat = req.body.id_angajat;
  denumire_grup = req.body.denumire_grup;

  //inseram in baza de date
  const result = await connection.execute(
    `INSERT into grup_taskuri(id_grup,id_task,id_angajat,denumire_grup) VALUES (grup_taskuri_seq.nextval,:V1,:V2,:V3)`,
    [id_task, id_angajat, denumire_grup]
  );

  //aplicam schimbarile in baza de date
  const commit = connection.execute(`COMMIT`);

  //pentru debugging
  try {
    res.status(200).send("Grup de taskuri adaugat");
  } catch (err) {
    res.status(404).send(err);
  }
};

//-------------------------------------------------------------------------------------------------------------------------------------//

//PUT - modificam un grup de taskuri
const grup_taskuri_put = async (req, res) => {
  //conexiune la baza de date
  let connection;
  connection = await oracledb.getConnection(credentials);

  const id_grup_taskuri = req.params.id;

  //cautam grupul de taskuri dupa id in baza de date
  const validare = await connection.execute(
    `SELECT id_grup from grup_taskuri where id_grup = :VARIABILA`,
    [id_grup_taskuri]
  );

  //verificam daca grupul de taskuri exista in baza de date sau nu
  if (validare.rows && validare.rows.length > 0) {
    id_task = req.body.id_task;
    id_angajat = req.body.id_angajat;
    denumire_grup = req.body.denumire_grup;

    //preluam toate datele grupul de taskuri printr-un query
    const Query = await connection.execute(
      `SELECT * from grup_taskuri where id_grup = :VARIABILA`,
      [id_grup_taskuri]
    );

    // Daca nu este data o valoarea valida, pastram valoarea existenta
    if (id_task === undefined || id_task === "") {
      id_task = Query.rows.toString().split(",")[1];
    }
    if (id_angajat === undefined || id_angajat === "") {
      id_angajat = Query.rows.toString().split(",")[2];
    }
    if (denumire_grup === undefined || denumire_grup === "") {
      denumire_grup = Query.rows.toString().split(",")[3];
    }

    //updatam grup de taskuri
    const updateQuery = await connection.execute(
      `UPDATE grup_taskuri set id_task = :V1 , id_angajat = :V2 , denumire_grup = :V3
      where id_grup = :VARIABILA`,
      [id_task, id_angajat, denumire_grup, id_grup_taskuri]
    );
  } else res.status(404).send("Grupul de taskuri nu exista");

  //aplicam schimbarile in baza de date
  const commit = await connection.execute(`COMMIT`);
  //pentru debugging
  try {
    res.status(200).send("Grup de taskuri updatat");
  } catch (err) {
    res.status(404).send(err);
  }
};

//-------------------------------------------------------------------------------------------------------------------------------------//

//DELETE - stergem un grup de taskuri
const grup_taskuri_delete = async (req, res) => {
  //conexiune la baza de date
  let connection;
  connection = await oracledb.getConnection(credentials);

  id_grup_taskuri = req.params.id;

  //cautam grupul de taskuri dupa id in baza de date
  const validare = await connection.execute(
    `SELECT id_grup from grup_taskuri where id_grup = :VARIABILA`,
    [id_grup_taskuri]
  );

  //verificam daca grupul de taskuri exista in baza de date sau nu
  if (validare.rows && validare.rows.length > 0) {
    //stergem grupul de taskuri din baza de date
    const result = connection.execute(
      `DELETE FROM grup_taskuri where id_grup = :VARIABILA`,
      [id_grup_taskuri]
    );

    //aplicam schimbarile in baza de date
    const commit = connection.execute(`COMMIT`);

    //pentru debugging
    try {
      res.status(200).send("Grup de taskuri sters");
    } catch (err) {
      res.status(404).send(err);
    }
  } else res.status(404).send("Grupul de taskuri nu a fost gasit");
};

module.exports = {
  grup_taskuri_get,
  grup_taskuri_get_angajat,
  grup_taskuri_post,
  grup_taskuri_put,
  grup_taskuri_delete,
};
