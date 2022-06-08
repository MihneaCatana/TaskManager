const oracledb = require("oracledb");
const credentials = require("../config/config");

//GET - toate departamentele
const departament_get = async (req, res) => {
  //conexiune la baza de date
  let connection;
  connection = await oracledb.getConnection(credentials);

  //cautam in baza de date toate departamentele cu numele sefilor de departament
  const result = await connection.execute(
    `SELECT d.id_departament,d.nume_departament,a.nume || ' ' ||a.prenume nume_sef_departament from departament d
     left join angajati a on d.id_sef_departament = a.id_angajat order by d.id_departament`
  );

  //pentru debugging
  try {
    res.status(200).send(result.rows);
  } catch (err) {
    res.status(404).send(err);
  }
};

//-------------------------------------------------------------------------------------------------------------------------------------//

//GET - toti angajatii din departamentul X
const departament_get_angajati = async (req, res) => {
  //conexiune la baza de date
  let connection;
  connection = await oracledb.getConnection(credentials);

  const id_dep = req.params.id;

  //cautam in baza de date toate departamentele cu numele sefilor de departament
  const result = await connection.execute(
    `SELECT id_angajat,nume,prenume,email from angajati where id_departament = :VARIABILA`,
    [id_dep]
  );

  //pentru debugging
  try {
    res.status(200).send(result.rows);
  } catch (err) {
    console.log(err);
  }
};

//-------------------------------------------------------------------------------------------------------------------------------------//

//GET - departamentul dupa nume
const departament_get_numedep = async (req, res) => {
  //conexiune la baza de date
  let connection;
  connection = await oracledb.getConnection(credentials);

  //cautam in baza de date departamentele dupa
  const nume_departament = req.params.nume_departament;
  const result = await connection.execute(
    `SELECT d.id_departament,d.nume_departament,a.nume || ' ' ||a.prenume nume_sef_departament 
    from departament d left join angajati a on d.id_departament = a.id_departament where d.nume_departament like '%' || :VARIABILA || '%' order by d.id_departament`,
    [nume_departament]
  );

  try {
    res.status(200).send(result.rows);
  } catch (err) {
    console.log(err);
  }
};

//-------------------------------------------------------------------------------------------------------------------------------------//

//POST - adaugam un departament nou
const departament_post = async (req, res) => {
  //conexiunea la baza de date
  let connection;
  console.log("dep -> " + req.body);
  connection = await oracledb.getConnection(credentials);

  const departament = req.body.nume_departament;

  //inseram in baza de date
  const result = await connection.execute(
    `INSERT into departament(id_departament,nume_departament) VALUES (departament_seq.nextval,:VARIABILA)`,
    [departament]
  );

  //aplicam schimbarile in baza de date
  const commit = connection.execute(`COMMIT`);

  //pentru debugging
  try {
    res.status(200).send("Departament adaugat");
  } catch (err) {
    res.status(404).send(err);
  }
};

//-------------------------------------------------------------------------------------------------------------------------------------//

//PUT - modificam un departament
const departament_put = async (req, res) => {
  //conexiune la baza de date
  let connection;
  connection = await oracledb.getConnection(credentials);

  const id_departament = req.params.id;

  //cautam departamentul pe care vrem sa il updatam in baza de date
  const validare = await connection.execute(
    `SELECT id_departament from departament where id_departament = :VARIABILA`,
    [id_departament]
  );

  if (validare.rows && validare.rows.length > 0) {
    nume_departament = req.body.nume_departament;
    id_sef_departament = req.body.id_sef_departament;

    //preluam datele departamentului printr-un query
    const Query = await connection.execute(
      `SELECT nume_departament,id_sef_departament from departament where id_departament = :VARIABILA`,
      [id_departament]
    );

    // Daca nu este data o valoarea valida, pastram valoarea existenta
    if (nume_departament === undefined || nume_departament === "") {
      nume_departament = Query.rows.toString().split(",")[0];
    }

    if (id_sef_departament === undefined || id_sef_departament === "") {
      id_sef_departament = null;
    }

    //updatam departamentul
    const UpdateQuery = await connection.execute(
      `UPDATE departament set nume_departament = :V1, id_sef_departament = :V2 where id_departament = :VARIABILA`,
      [nume_departament, id_sef_departament, id_departament]
    );
  } else res.status(404).send("Departamentul nu exista"); // eroare daca nu gaseste departamentul

  //aplicam schimbarile in baza de date
  const commit = connection.execute(`COMMIT`);

  //pentru debugging
  try {
    res.status(200).send("Departament updatat");
  } catch (err) {
    res.status(404).send(err);
  }
};

//PUT - Adaugam angajatul intr-un nou departament
const departament_angajat_put = async (req, res) => {
  //conexiune la baza de date
  let connection;
  connection = await oracledb.getConnection(credentials);

  const id_angajat = req.params.id;

  //cautam daca angajatul este valid
  const validare = await connection.execute(
    `SELECT * from angajati where id_angajat = :VARIABILA`,
    [id_angajat]
  );

  if (validare.rows && validare.rows.length > 0) {
    id_departament = req.body.id_departament;

    //preluam datele departamentului printr-un query
    const Query = await connection.execute(
      `SELECT nume_departament from departament where id_departament = :VARIABILA`,
      [id_departament]
    );

    if (Query.rows && Query.rows.length > 0) {
      const update = await connection.execute(
        `UPDATE angajati SET id_departament = :VARIABILA1 where id_angajat = ${id_angajat} `,
        [id_departament]
      );
    }
  } else res.status(404).send("Angajatul nu exista"); // eroare daca nu gaseste angajatul

  //aplicam schimbarile in baza de date
  const commit = connection.execute(`COMMIT`);

  //pentru debugging
  try {
    res.status(200).send("Angajat updatat");
  } catch (err) {
    res.status(404).send(err);
  }
};

//-------------------------------------------------------------------------------------------------------------------------------------//

//DELETE - stergem un departament
const departament_delete = async (req, res) => {
  //conexiune la baza de date
  let connection;
  connection = await oracledb.getConnection(credentials);

  const id_departament = req.params.id;

  //cautam departamentul pe care vrem sa il stergem in baza de date
  const validare = await connection.execute(
    `SELECT id_departament from departament where id_departament = :VARIABILA`,
    [id_departament]
  );

  //verificam daca departamentul exista sau nu
  if (validare.rows && validare.rows.length > 0) {
    //stergem departamentul din baza de date
    const result = connection.execute(
      `DELETE FROM departament where id_departament = :VARIABILA`,
      [id_departament]
    );

    //aplicam schimbarile in baza de date
    const commit = connection.execute(`COMMIT`);

    //pentru debugging
    try {
      res.status(200).send("Departament sters");
    } catch (err) {
      res.status(404).send(err);
    }
  } else res.status(404).send("Departamentul nu exista");
};

module.exports = {
  departament_get,
  departament_get_angajati,
  departament_get_numedep,
  departament_post,
  departament_put,
  departament_angajat_put,
  departament_delete,
};
