import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  prompt: { type: String, required: true },
  output: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'reviewed'], 
    default: 'pending' 
  },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Task', taskSchema);
