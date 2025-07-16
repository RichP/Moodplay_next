-- CreateTable
CREATE TABLE "BlogTag" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "value" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_BlogPostToBlogTag" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_BlogPostToBlogTag_A_fkey" FOREIGN KEY ("A") REFERENCES "BlogPost" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_BlogPostToBlogTag_B_fkey" FOREIGN KEY ("B") REFERENCES "BlogTag" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "_BlogPostToBlogTag_AB_unique" ON "_BlogPostToBlogTag"("A", "B");

-- CreateIndex
CREATE INDEX "_BlogPostToBlogTag_B_index" ON "_BlogPostToBlogTag"("B");
