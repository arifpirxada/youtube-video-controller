import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema(
  {
    videoId: { type: String, required: true },
    event: { type: String, required: true },
  },
  { timestamps: true }
);

const EventModel = mongoose.model('event', eventSchema);

export default EventModel;
