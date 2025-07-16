/*
  Warnings:

  - A unique constraint covering the columns `[value]` on the table `BlogTag` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "BlogTag_value_key" ON "BlogTag"("value");
