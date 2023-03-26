-- AlterTable
ALTER TABLE "User" ADD COLUMN     "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deletedAt" TIMESTAMP(6),
ADD COLUMN     "updatedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "Component" (
    "id" UUID NOT NULL,
    "title" VARCHAR NOT NULL,
    "description" VARCHAR NOT NULL,
    "urlThumbnail" VARCHAR NOT NULL,
    "price" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(6),

    CONSTRAINT "Component_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" UUID NOT NULL,
    "name" VARCHAR NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(6),

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CategoryToComponent" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_CategoryToComponent_AB_unique" ON "_CategoryToComponent"("A", "B");

-- CreateIndex
CREATE INDEX "_CategoryToComponent_B_index" ON "_CategoryToComponent"("B");

-- AddForeignKey
ALTER TABLE "_CategoryToComponent" ADD CONSTRAINT "_CategoryToComponent_A_fkey" FOREIGN KEY ("A") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoryToComponent" ADD CONSTRAINT "_CategoryToComponent_B_fkey" FOREIGN KEY ("B") REFERENCES "Component"("id") ON DELETE CASCADE ON UPDATE CASCADE;
