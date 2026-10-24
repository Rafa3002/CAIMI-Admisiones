import bcrypt from "bcryptjs";

import { randomUUID } from "crypto";

import { db } from "./db";


async function createTables() {

  console.log(
    "Creando tablas..."
  );

  /*
   * USUARIOS
   */
  await db.query(`
    CREATE TABLE IF NOT EXISTS users (

      id UUID PRIMARY KEY,

      name VARCHAR(150) NOT NULL,

      username VARCHAR(80)
        UNIQUE
        NOT NULL,

      password_hash TEXT NOT NULL,

      role VARCHAR(30)
        NOT NULL
        CHECK (
          role IN (
            'ADMIN',
            'ADMISIONES',
            'CONSULTA'
          )
        ),

      active BOOLEAN
        NOT NULL
        DEFAULT TRUE,

      created_at TIMESTAMPTZ
        NOT NULL
        DEFAULT NOW(),

      updated_at TIMESTAMPTZ
        NOT NULL
        DEFAULT NOW()
    );
  `);


  /*
   * PACIENTES
   */
  await db.query(`
    CREATE TABLE IF NOT EXISTS patients (

      id UUID PRIMARY KEY,

      cui VARCHAR(30)
        UNIQUE,

      expediente VARCHAR(50)
        UNIQUE
        NOT NULL,

      first_name VARCHAR(100)
        NOT NULL,

      second_name VARCHAR(100),

      first_surname VARCHAR(100)
        NOT NULL,

      second_surname VARCHAR(100),

      married_surname VARCHAR(100),

      birth_date DATE,

      sex VARCHAR(30),

      phone VARCHAR(30),

      department VARCHAR(100),

      municipality VARCHAR(100),

      community VARCHAR(150),

      address TEXT,

      created_at TIMESTAMPTZ
        NOT NULL
        DEFAULT NOW(),

      updated_at TIMESTAMPTZ
        NOT NULL
        DEFAULT NOW()
    );
  `);


  /*
   * ADMISIONES
   */
  await db.query(`
    CREATE TABLE IF NOT EXISTS admissions (

      id UUID PRIMARY KEY,

      patient_id UUID
        NOT NULL,

      admission_date TIMESTAMPTZ
        NOT NULL,

      service VARCHAR(150)
        NOT NULL,

      area VARCHAR(150)
        NOT NULL,

      reason TEXT
        NOT NULL,

      observations TEXT,

      responsible_user_id UUID
        NOT NULL,

      created_at TIMESTAMPTZ
        NOT NULL
        DEFAULT NOW(),

      CONSTRAINT fk_admission_patient

        FOREIGN KEY (
          patient_id
        )

        REFERENCES patients(id)

        ON DELETE RESTRICT,

      CONSTRAINT fk_admission_user

        FOREIGN KEY (
          responsible_user_id
        )

        REFERENCES users(id)

        ON DELETE RESTRICT
    );
  `);


  /*
   * AUDITORÍA
   */
  await db.query(`
    CREATE TABLE IF NOT EXISTS audit_logs (

      id UUID PRIMARY KEY,

      user_id UUID,

      action VARCHAR(80)
        NOT NULL,

      entity VARCHAR(80)
        NOT NULL,

      entity_id UUID,

      description TEXT,

      created_at TIMESTAMPTZ
        NOT NULL
        DEFAULT NOW(),

      CONSTRAINT fk_audit_user

        FOREIGN KEY (
          user_id
        )

        REFERENCES users(id)

        ON DELETE SET NULL
    );
  `);


  /*
   * ÍNDICES
   */

  await db.query(`
    CREATE INDEX IF NOT EXISTS
      idx_patient_first_name
    ON patients(first_name);
  `);

  await db.query(`
    CREATE INDEX IF NOT EXISTS
      idx_patient_first_surname
    ON patients(first_surname);
  `);

  await db.query(`
    CREATE INDEX IF NOT EXISTS
      idx_admission_patient
    ON admissions(patient_id);
  `);

  await db.query(`
    CREATE INDEX IF NOT EXISTS
      idx_admission_date
    ON admissions(admission_date);
  `);


  console.log(
    "Tablas creadas correctamente."
  );
}


async function createInitialUsers() {

  console.log(
    "Verificando usuarios iniciales..."
  );

  const result =
    await db.query(
      `
      SELECT COUNT(*)::int AS total
      FROM users;
      `
    );

  const total =
    result.rows[0].total;

  if (total > 0) {

    console.log(
      "Los usuarios ya existen."
    );

    return;
  }


  /*
   * Administrador
   */
  const adminPassword =
    await bcrypt.hash(
      "admin123",
      10
    );

  /*
   * Personal de admisiones
   */
  const admissionsPassword =
    await bcrypt.hash(
      "admisiones123",
      10
    );

  /*
   * Consulta
   */
  const consultationPassword =
    await bcrypt.hash(
      "consulta123",
      10
    );


  await db.query(
    `
    INSERT INTO users (

      id,
      name,
      username,
      password_hash,
      role,
      active

    )
    VALUES

    ($1, $2, $3, $4, $5, TRUE),

    ($6, $7, $8, $9, $10, TRUE),

    ($11, $12, $13, $14, $15, TRUE);
    `,

    [

      randomUUID(),
      "Administrador CAIMI",
      "admin",
      adminPassword,
      "ADMIN",

      randomUUID(),
      "Ana López",
      "alopez",
      admissionsPassword,
      "ADMISIONES",

      randomUUID(),
      "Carlos Choc",
      "cchoc",
      consultationPassword,
      "CONSULTA",
    ]
  );


  console.log(
    "Usuarios iniciales creados."
  );
}


async function main() {

  try {

    console.log(
      "--------------------------------"
    );

    console.log(
      "Configurando base de datos CAIMI"
    );

    console.log(
      "--------------------------------"
    );


    await createTables();

    await createInitialUsers();


    console.log(
      "--------------------------------"
    );

    console.log(
      "Base de datos configurada."
    );

    console.log(
      "--------------------------------"
    );

  } catch (error) {

    console.error(
      "Error configurando BD:",
      error
    );

    process.exitCode = 1;

  } finally {

    await db.end();
  }
}


main();