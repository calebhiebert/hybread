/*
	schema.sql.go

	This file contains the database schema
*/
package main

func GetDropSchema() string {
	return `
		DROP TABLE "users";
	`
}

func GetSchema() string {
	return `
    CREATE TABLE IF NOT EXISTS "users" (
      "id" INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      "username" VARCHAR(32) UNIQUE NOT NULL,
      "password" VARCHAR(64) NOT NULL
    );
	`
}
