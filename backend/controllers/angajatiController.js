const oracledb = require("oracledb");
const credentials = require("../config/config");

//GET - toti angajatii
const angajati_get = async (req, res) => {
  //conexiune la baza de date
  let connection;
  connection = await oracledb.getConnection(credentials);

  //cautam toti angajatii din firma
  const result =
    await connection.execute(`SELECT a.id_angajat,a.prenume,a.nume,a.email,a.parola,d.nume_departament,s.denumire_status,a.activat 
    from angajati a left join departament d on a.id_departament = d.id_departament 
    left join status_user s on a.id_status_user = s.id_status_user order by a.id_angajat asc`);

  //pentru debugging
  try {
    res.status(200).send(result.rows);
  } catch (err) {
    res.status(404).send(err);
  }
};

const angajati_get_employees = async (req, res) => {
  //conexiune la baza de date
  let connection;
  connection = await oracledb.getConnection(credentials);

  //cautam toti angajatii din firma
  const result =
    await connection.execute(`SELECT a.id_angajat,a.prenume,a.nume,a.email,a.parola,d.nume_departament,s.denumire_status,a.activat 
    from angajati a left join departament d on a.id_departament = d.id_departament 
    left join status_user s on a.id_status_user = s.id_status_user where a.id_status_user IN (0,1) order by a.id_angajat asc `);

  //pentru debugging
  try {
    res.status(200).send(result.rows);
  } catch (err) {
    res.status(404).send(err);
  }
};

//-------------------------------------------------------------------------------------------------------------------------------------//

//GET - la un singur angajat
const angajati_get_utilizator = async (req, res) => {
  //conexiune la baza de date
  let connection;
  connection = await oracledb.getConnection(credentials);

  const utilizator = req.params.utilizator;

  //cautam utilizatorii dupa nume
  const result = await connection.execute(
    `SELECT a.id_angajat,a.prenume,a.nume,a.parola,a.email,d.nume_departament,s.denumire_status,a.activat 
      from angajati a left join departament d on a.id_departament = d.id_departament 
      left join status_user s on a.id_status_user = s.id_status_user where a.nume like  '%' || :VARIABILA || '%' `,
    [utilizator]
  );
  //pentru debugging
  try {
    res.status(200).send(result.rows);
  } catch (err) {
    res.status(404).send(err);
  }
};

//GET - dupa id sa aflam statusul

const angajati_get_id = async (req, res) => {
  //conexiune la baza de date
  let connection;
  connection = await oracledb.getConnection(credentials);

  const id = req.params.utilizator;

  //cautam utilizatorul dupa id si aflam statusul

  const result = await connection.execute(
    `SELECT id_status_user from angajati where a.id_angajat = :VARIABILA `,
    [id]
  );

  //pentru debugging
  try {
    res.status(200).send(result.rows);
  } catch (err) {
    res.status(404).send(err);
  }
};

//-------------------------------------------------------------------------------------------------------------------------------------//

//POST - adaugam un nou angajat
const angajati_post = async (req, res) => {
  //conexiune la baza de date
  let connection;
  console.log(req.body);
  connection = await oracledb.getConnection(credentials);

  //preluam datele ce urmeaza a fi inserate -- validarea se va face pe front-end
  const prenume = req.body.prenume;
  const nume = req.body.nume;
  const parola = req.body.parola;
  const email = req.body.email;
  const id_status_user = req.body.id_status_user;

  //inseram in baza de date
  const result = await connection.execute(
    `INSERT into angajati(id_angajat,prenume,nume,parola,email,id_status_user) VALUES (angajati_seq.nextval,:prenume,:nume,:parola,:email,:id_status_user)`,
    [prenume, nume, parola, email, id_status_user]
  );

  console.log(id_status_user);

  //aplicam schimbarile in baza de date
  const commit = connection.execute(`COMMIT`);

  //pentru debugging
  try {
    res.status(200).send("Angajat adaugat");
  } catch (err) {
    res.status(404).send(err);
  }
};

//-------------------------------------------------------------------------------------------------------------------------------------//

//PUT - modificam un angajat

const angajati_put = async (req, res) => {
  //conexiune la baza de date
  let connection;
  connection = await oracledb.getConnection(credentials);

  const id_utilizator = req.params.id;

  //cautam angajatul pe care vrem sa il updatam in baza de date
  const validare = await connection.execute(
    `SELECT a.id_angajat from angajati a where a.id_angajat = :VARIABILA`,
    [id_utilizator]
  );

  //verificam daca angajatul exista in baza de date sau nu
  if (validare.rows && validare.rows.length > 0) {
    var prenume = req.body.prenume;
    var nume = req.body.nume;
    var parola = req.body.parola;
    var email = req.body.email;
    var id_departament = req.body.id_departament;
    var id_status_user = req.body.id_status_user;
    var activat = req.body.activat;

    //preluam toate datele angajatului printr-un query
    const Query = await connection.execute(
      `SELECT * from angajati where id_angajat = :VARIABILA`,
      [id_utilizator]
    );

    // Daca nu este data o valoarea valida, pastram valoarea existenta
    if (prenume === undefined || prenume === "") {
      prenume = Query.rows.toString().split(",")[1];
    }
    if (nume === undefined || nume === "") {
      nume = Query.rows.toString().split(",")[2];
    }
    if (parola === undefined || parola === "") {
      parola = Query.rows.toString().split(",")[3];
    }
    if (email === undefined || email === "") {
      email = Query.rows.toString().split(",")[4];
    }
    if (id_departament === undefined || id_departament === "") {
      id_departament = Query.rows.toString().split(",")[5];
    }
    if (id_status_user === undefined || id_status_user === "") {
      id_status_user = Query.rows.toString().split(",")[6];
    }
    if (activat === undefined || activat === "") {
      activat = Query.rows.toString().split(",")[7];
    }

    //updatam angajatul
    const updateQuery = await connection.execute(
      `UPDATE angajati set prenume = :V1,nume = :V2,parola = :V3,email = :V4,id_departament = :V5,id_status_user = :V6,activat = :V7 
        where id_angajat = :VARIABILA`,
      [
        prenume,
        nume,
        parola,
        email,
        id_departament,
        id_status_user,
        activat,
        id_utilizator,
      ]
    );
  } else res.status(404).send("Angajatul nu exista"); // eroare daca nu gaseste angajatul

  //aplicam schimbarile in baza de date
  const commit = connection.execute(`COMMIT`);

  //pentru debugging
  try {
    res.status(200).send("Angajatul updatat");
  } catch (err) {
    res.status(404).send(err);
  }
};

//PUT - activam un user id

const angajati_activate = async (req, res) => {
  //conexiune la baza de date
  let connection;
  connection = await oracledb.getConnection(credentials);

  const id_utilizator = req.params.id;
  console.log(id_utilizator);

  //cautam angajatul pe care vrem sa il updatam in baza de date
  const validare = await connection.execute(
    `SELECT a.id_angajat from angajati a where a.id_angajat = :VARIABILA`,
    [id_utilizator]
  );

  //verificam daca angajatul exista in baza de date sau nu
  if (validare.rows && validare.rows.length > 0) {
    var activat = req.body.activat;
    console.log(activat);
    //updatam angajatul
    const updateQuery = await connection.execute(
      `UPDATE angajati set activat = :V7 
        where id_angajat = :VARIABILA`,
      [activat, id_utilizator]
    );
  } else res.status(404).send("Angajatul nu exista"); // eroare daca nu gaseste angajatul

  //aplicam schimbarile in baza de date
  const commit = connection.execute(`COMMIT`);

  //pentru debugging
  try {
    res.status(200).send("Angajatul updatat");
  } catch (err) {
    res.status(404).send(err);
  }
};

//-------------------------------------------------------------------------------------------------------------------------------------//

//DELETE - stergem un angajat
const angajati_delete = async (req, res) => {
  //conexiune la baza de date
  let connection;
  connection = await oracledb.getConnection(credentials);

  const id_utilizator = req.params.id;

  //cautam id-ul angajatului pe care vrem sa il stergem in baza de date
  const validare = await connection.execute(
    `SELECT a.id_angajat from angajati a where a.id_angajat = :VARIABILA`,
    [id_utilizator]
  );

  //verificam daca angajatul exista sau nu
  if (validare.rows && validare.rows.length > 0) {
    //stergem angajatul din baza de date
    const result = connection.execute(
      `DELETE FROM angajati where id_angajat = :VARIABILA`,
      [id_utilizator]
    );
  } else res.status(404).send("Angajatul nu exista");

  //aplicam schimbarile in baza de date
  const commit = connection.execute(`COMMIT`);

  //pentru debugging
  try {
    res.status(200).send("Angajat sters");
  } catch (err) {
    res.status(404).send(err);
  }
};

module.exports = {
  angajati_get,
  angajati_get_employees,
  angajati_get_utilizator,
  angajati_get_id,
  angajati_post,
  angajati_put,
  angajati_activate,
  angajati_delete,
};
