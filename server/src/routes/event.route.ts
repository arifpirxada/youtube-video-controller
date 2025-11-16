import { Router } from 'express';
import EventModel from '../models/event.model';

const router = Router();

router.get('/events', async (req, res) => {
  try {
    const videoId = (req.query.videoId as string) || undefined;
    let events: any[];

    if (videoId) {
      events = await EventModel.find({ videoId }).sort({ createdAt: -1 });
    } else {
      events = await EventModel.find({}).sort({ createdAt: -1 });
    }

    res.json(events);
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to fetch events');
  }
});

export default router;
