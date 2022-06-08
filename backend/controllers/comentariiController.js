const oracledb = require("oracledb");
const credentials = require("../config/config");

//GET - toate comentariile
const comentarii_get = async (req, res) => {
  //conectiunea la baza de date
  let connection;
  connection = await oracledb.getConnection(credentials);
  const result =
    await connection.execute(`SELECT id_comentariu, text_comentariu, id_task, a.nume || ' ' ||a.prenume autor  from comentarii c 
      left join angajati a on c.id_angajat = a.id_angajat order by c.id_comentariu`);

  //pentru debugging
  try {
    res.status(200).send(result.rows);
  } catch (err) {
    res.status(404).send(err);
  }
};

//-------------------------------------------------------------------------------------------------------------------------------------//

//GET - toate comentariile ale unui autor
const comentarii_get_autor = async (req, res) => {
  //conectiunea la baza de date
  let connection;
  connection = await oracledb.getConnection(credentials);

  const autor = req.params.autor;
  const result = await connection.execute(
    `SELECT id_comentariu, text_comentariu, id_task, a.nume || ' ' ||a.prenume autor  from comentarii c 
      left join angajati a on c.id_angajat = a.id_angajat where  a.nume || ' ' ||a.prenume like '%' || :VARIABIALA || '%' order by c.id_comentariu`,
    [autor]
  );

  //pentru debugging
  try {
    res.status(200).send(result.rows);
  } catch (err) {
    res.status(404).send(err);
  }
};

//-------------------------------------------------------------------------------------------------------------------------------------//

//POST - adaugam un comentariu nou
const comentarii_post = async (req, res) => {
  //conexiunea la baza de date
  let connection;
  connection = await oracledb.getConnection(credentials);

  //preluam datele ce urmeaza a fi inserate -- validarea se va face pe front-end
  const id_angajat = req.body.id_angajat;
  const text_comentariu = req.body.text_comentariu;
  const id_task = req.body.id_task;

  //inseram in baza de date
  const result = await connection.execute(
    `INSERT into comentarii(id_angajat,id_comentariu,text_comentariu,id_task) VALUES (comentariu_seq.nextval,:V1,:V2,:V3)`,
    [id_angajat, text_comentariu, id_task]
  );

  //aplicam schimbarile in baza de date
  const commit = connection.execute(`COMMIT`);

  //pentru debugging
  try {
    res.status(200).send("Comentariu adaugat");
  } catch (err) {
    res.status(404).send(err);
  }
};

//-------------------------------------------------------------------------------------------------------------------------------------//

//PUT - modificam un comentariu

const comentarii_put = async (req, res) => {
  //conexiune la baza de date
  let connection;
  connection = await oracledb.getConnection(credentials);

  id_comentariu = req.params.id;

  //cautam comentariu pe care vrem sa il updatam in baza de date
  const validare = await connection.execute(
    `SELECT id_comentariu from comentarii where id_comentariu = :VARIABILA`,
    [id_comentariu]
  );

  //verificam daca comentariul exista sau nu
  if (validare.rows && validare.rows.length > 0) {
    text_comentariu = req.body.text_comentariu;

    //preluam toate datele necesare intr-un query
    const Query = await connection.execute(
      `SELECT text_comentariu from comentarii where id_comentariu = :VARIABILA`,
      [id_comentariu]
    );

    // Daca nu este data o valoarea valida, pastram valoarea existenta
    if (text_comentariu === undefined || text_comentariu === "") {
      text_comentariu = Query.rows.toString();
    }

    //updatam comentariul
    const updateQuery = await connection.execute(
      `UPDATE comentarii set text_comentariu = :V1 
      where id_comentariu = :VARIABILA`,
      [text_comentariu, id_comentariu]
    );
  } else res.status(404).send("Comentariul nu exista");

  //aplicam schimbarile in baza de date
  const commit = connection.execute(`COMMIT`);

  //pentru debugging
  try {
    res.status(200).send("Comentariu updatat");
  } catch (err) {
    res.status(404).send(err);
  }
};

//-------------------------------------------------------------------------------------------------------------------------------------//

//DELETE - stergem un comentariu

const comentarii_delete = async (req, res) => {
  //conexiune la baza de date
  let connection;
  console.log(req.body);
  connection = await oracledb.getConnection(credentials);

  const id_comentariu = req.params.id;

  //cautam comentariu pe care vrem sa il updatam in baza de date
  const validare = await connection.execute(
    `SELECT id_comentariu from comentarii where id_comentariu = :VARIABILA`,
    [id_comentariu]
  );

  //verificam daca comentariul exista sau nu
  if (validare.rows && validare.rows.length > 0) {
    //stergem comentariul din baza de date
    const result = connection.execute(
      `DELETE from comentarii where id_comentariu = :VARIABILA`,
      [id_comentariu]
    );

    //aplicam schimbarile in baza de date
    const commit = connection.execute(`COMMIT`);
  } else res.status(404).send("Comentariul nu exista");

  //pentru debugging
  try {
    res.status(200).send("Comentariu sters");
  } catch (err) {
    res.status(404).send(err);
  }
};

module.exports = {
  comentarii_get,
  comentarii_get_autor,
  comentarii_post,
  comentarii_put,
  comentarii_delete,
};
