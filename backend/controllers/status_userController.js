const oracledb = require("oracledb");
const credentials = require("../config/config");

//GET - toate statusurile userilor
const status_user_get = async (req, res) => {
  //conexiune la baza de date
  let connection;
  connection = await oracledb.getConnection(credentials);

  //cautam toate statusurile userilor
  const result = await connection.execute(`SELECT * from status_user`);

  //pentru debugging
  try {
    res.status(200).send(result.rows);
  } catch (err) {
    res.status(404).send(err);
  }
};

module.exports = { status_user_get };
