-- CreateTable
CREATE TABLE "Book" (
    "ndlBibId" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "authors" TEXT,
    "publisher" TEXT,
    "isbn" TEXT,
    "jpNo" TEXT,
    "thumbnailUrl" TEXT
);
