-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'PRO');

-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL,
    "email" VARCHAR NOT NULL,
    "name" VARCHAR NOT NULL,
    "password" VARCHAR NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'PRO',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
