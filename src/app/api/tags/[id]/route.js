import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function PATCH(request, { params }) {
  const { id } = params;
  const body = await request.json();
  const updatedTag = await prisma.tag.update({
    where: { id: Number(id) },
    data: { value: body.value },
  });
  return Response.json({ success: true, tag: updatedTag });
}

export async function DELETE(request, { params }) {
  const { id } = params;
  await prisma.tag.delete({ where: { id: Number(id) } });
  return Response.json({ success: true });
}
