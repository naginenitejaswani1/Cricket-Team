const express = require("express");
const path = require("path");

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const app = express();

app.use(express.json());
const dbPath = path.join(__dirname, "cricketTeam.db");

let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB error ${e.message}`);
    process.exit(1);
  }
};
initializeDBAndServer();

app.get("/players/", async (request, response) => {
  const getPlayerQuery = `
        SELECT
            * 
        FROM 
            cricket_team;`;
  const playerList = await db.all(getPlayerQuery);
  const convertDbObjectToResponseObject = (playerList) => {
    return {
      playerId: playerList.player_id,
      playerName: playerList.player_name,
      jerseyNumber: playerList.jersey_number,
      role: playerList.role,
    };
  };
  response.send(playerList.map((i) => convertDbObjectToResponseObject(i)));
});

app.post("/players/", async (request, response) => {
  const details = request.body;
  const { playerName, jerseyNumber, role } = details;
  const api2 = `
  INSERT INTO
  cricket_team (player_name,jersey_number,role)
  VALUES 
  (
      '${playerName}',
      ${jerseyNumber},
      ${role}');`;
  const db3 = await db.run(api2);
  response.send("Player Added to Team");
});

app.get("players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const api3 = `
    SELECT
    * 
    FROM 
    cricket_team 
    WHERE 
    player_id = ${playerId};`;
  const db2 = await db.get(api3);
  response.send(convertDbObjectToResponseObject(db2));
});

app.put("players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const details = request.body;
  const { playerName, jerseyNumber, role } = details;
  const api4 = `
    UPDATE 
        cricket_team 
    SET 
        player_name = '${playerName}',
        jersey_number= ${jerseyNumber}, 
        role = '${role}' 
    WHERE 
        player_id = ${playerId};`;
  await db.get(api4);
  response.send("Player Details Updated");
});

app.delete("players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const api4 = `
    DELETE 
    FROM 
    cricket_team 
    WHERE 
    player_id = ${playerId};`;
  await db.get(api5);
  response.send("Player Removed");
});

module.exports = app;
