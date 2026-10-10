import "dotenv/config";

import app from "./app";

const PORT =
  Number(
    process.env.PORT
  ) || 4000;

app.listen(
  PORT,
  () => {

    console.log(
      "--------------------------------"
    );

    console.log(
      "CAIMI Backend"
    );

    console.log(
      `Servidor: http://localhost:${PORT}`
    );

    console.log(
      "--------------------------------"
    );
  }
);