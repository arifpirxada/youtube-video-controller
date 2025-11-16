import { Router } from 'express';
import noteModel from '../models/note.model';

const router = Router();

// Get notes for a video
router.get('/notes/:videoId', async (req, res) => {
  try {
    const notes = await noteModel.find({ videoId: req.params.videoId });
    res.json(notes);
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to fetch notes');
  }
});

// Create a new note for a video
router.post('/notes/:videoId', async (req, res) => {
  const { note } = req.body;
  if (!note) return res.status(400).send('Note text is required');
  try {
    const newNote = await noteModel.create({ videoId: req.params.videoId, note });
    // Log event after creating note
    try {
      const { default: EventModel } = await import("../models/event.model");
      const eventText = `Created note: "${note?.slice(0, 100) ?? ''}"`;
      const eventLog = new EventModel({ videoId: req.params.videoId, event: eventText });
      await eventLog.save();
    } catch (e) {
      console.error("Failed to log created note event", e);
    }
    res.json(newNote);
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to create note');
  }
});

// Update a note by id
router.patch('/notes/:noteId', async (req, res) => {
  const { note } = req.body;
  if (!note) return res.status(400).send('Note text is required');
  try {
    const updated = await noteModel.findByIdAndUpdate(req.params.noteId, { note }, { new: true });
    if (!updated) return res.status(404).send('Note not found');
    // Log event after update
    try {
      const { default: EventModel } = await import("../models/event.model");
      const eventText = `Updated note: "${note?.slice(0, 100) ?? ''}"`;
      const eventLog = new EventModel({ videoId: updated.videoId, event: eventText });
      await eventLog.save();
    } catch (e) {
      console.error("Failed to log updated note event", e);
    }
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to update note');
  }
});

// Delete a note by id
router.delete('/notes/:noteId', async (req, res) => {
  try {
    const noteToDelete = await noteModel.findById(req.params.noteId);
    if (!noteToDelete) return res.status(404).send('Note not found');
    const deleted = await noteModel.findByIdAndDelete(req.params.noteId);
    if (!deleted) return res.status(404).send('Note not found');
    // Log event after delete
    try {
      const { default: EventModel } = await import("../models/event.model");
      const eventText = `Deleted note: "${noteToDelete.note?.slice(0, 100) ?? ''}"`;
      const eventLog = new EventModel({ videoId: noteToDelete.videoId, event: eventText });
      await eventLog.save();
    } catch (e) {
      console.error("Failed to log deleted note event", e);
    }
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to delete note');
  }
});

export default router;
