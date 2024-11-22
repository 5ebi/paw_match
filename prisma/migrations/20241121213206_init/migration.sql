-- CreateTable
CREATE TABLE "Owner" (
  "id" serial NOT NULL,
  "name" text NOT NULL,
  "email" text NOT NULL,
  "password" text NOT NULL,
  "postal_code" text,
  "created_at" timestamp(3) DEFAULT CURRENT_TIMESTAMP,
  "verified" boolean DEFAULT FALSE,
  "verification_code" text,
  CONSTRAINT "Owner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
  "id" serial NOT NULL,
  "token" text NOT NULL,
  "userId" integer NOT NULL,
  "expiresAt" timestamp(3) NOT NULL,
  "createdAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE index "Owner_email_key" ON "Owner" ("email");

-- CreateIndex
CREATE UNIQUE index "Session_token_key" ON "Session" ("token");

-- AddForeignKey
ALTER TABLE "Session"
ADD CONSTRAINT "Session_userId_fkey" FOREIGN key ("userId") REFERENCES "Owner" ("id") ON DELETE restrict ON UPDATE cascade;
