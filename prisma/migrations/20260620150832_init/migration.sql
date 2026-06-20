-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "Trade" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "includeInAnalysis" BOOLEAN NOT NULL DEFAULT true,
    "symbol" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "time" TEXT NOT NULL,
    "stopLoss" DOUBLE PRECISION NOT NULL,
    "rrSecured" DOUBLE PRECISION NOT NULL,
    "durationCandles" INTEGER,
    "maxRR" DOUBLE PRECISION,
    "notes" TEXT NOT NULL DEFAULT '',
    "news" TEXT NOT NULL DEFAULT '',
    "newsNotes" TEXT NOT NULL DEFAULT '',
    "models" TEXT NOT NULL DEFAULT '',
    "extra" TEXT NOT NULL DEFAULT '',
    "criteria1" BOOLEAN NOT NULL DEFAULT false,
    "criteria2" BOOLEAN NOT NULL DEFAULT false,
    "criteria3" BOOLEAN NOT NULL DEFAULT false,
    "criteria4" BOOLEAN NOT NULL DEFAULT false,
    "criteria5" BOOLEAN NOT NULL DEFAULT false,
    "metOverallPlan" BOOLEAN NOT NULL DEFAULT false,
    "criteriaNotes" TEXT NOT NULL DEFAULT '',
    "contextScreenshot" TEXT NOT NULL DEFAULT '',
    "validationScreenshot" TEXT NOT NULL DEFAULT '',
    "entryScreenshot" TEXT NOT NULL DEFAULT '',
    "finalScreenshot" TEXT NOT NULL DEFAULT '',
    "contextTimeframe" TEXT NOT NULL DEFAULT '',
    "validationTimeframe" TEXT NOT NULL DEFAULT '',
    "entryTimeframe" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "Trade_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trade" ADD CONSTRAINT "Trade_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
