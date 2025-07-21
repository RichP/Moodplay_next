import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function DELETE(request, context) {
  try {
    // In newer versions of Next.js, params need to be awaited
    const { id } = context.params;
    
    // Validate that id is a valid number
    const feedbackId = parseInt(id);
    if (isNaN(feedbackId)) {
      return Response.json({ error: 'Invalid feedback ID' }, { status: 400 });
    }
    
    // Try to find the feedback first to check if it exists
    const feedback = await prisma.feedback.findUnique({
      where: { id: feedbackId }
    });
    
    if (!feedback) {
      return Response.json({ error: 'Feedback not found' }, { status: 404 });
    }
    
    // Delete the feedback
    await prisma.feedback.delete({
      where: { id: feedbackId }
    });
    
    return Response.json({ success: true });
  } catch (err) {
    console.error('Error deleting feedback:', err);
    return Response.json({ error: err.message || 'Failed to delete feedback' }, { status: 500 });
  }
}
