// folosit pentru a verifica daca esti logat sau nu
const oracledb = require("oracledb");
const credentials = require("../config/config");
const path = require("path");

//verifica daca userul este autentificat
const Auth = async (req, res) => {
  //conexiune la baza de date
  let connection;
  connection = await oracledb.getConnection(credentials);

  email = req.body.email;
  parola = req.body.parola;

  //validam ca campurile nu sunt goale
  if (email && parola) {
    //Realizam un Query pe baza de date bazat pe username-ul si parola specificata
    const result = await connection.execute(
      `SELECT * from angajati where email = :V1 AND parola = :V2`,
      [email, parola]
    );

    //verificam daca userul a fost gasit in baza de date
    if (result.rows.length > 0) {
      const id = result.rows[0][0];
      const role = result.rows[0][6];
      const departament = result.rows[0][5];

      req.session.loggedIn = true;

      req.session.save(); //salvez sesiunea si verfic daca este logat userul
      return res.json({
        auth: true,
        result: id,
        role: role,
        departament: departament,
        loggedIn: req.session.loggedIn,
        activat: result.rows[0][7],
      });
    } else {
      eroare = "Email/Parola incorecta";
      return res.send(eroare);
    }
  } else {
    incomplet = "Introduceti parola si emailul";
    return res.send(incomplet);
  }
};

async function validation(req, res, next) {
  console.log(req.body);
  if (req.body.loggedIn == "true") {
    // verific in sesiune daca este logat userul
    next();
  } else res.status(403);
}

module.exports = { Auth, validation };
