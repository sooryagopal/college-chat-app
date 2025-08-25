import mongoose from 'mongoose';

const GroupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  type: {
    type: String,
    enum: ['Global', 'Department', 'Batch'],
    required: true,
  },
  department: {
    type: String,
    required: function() { return this.type !== 'Global'; }
  },
  batch: {
    type: String,
    required: function() { return this.type === 'Batch'; }
  },
}, { timestamps: true });

const Group = mongoose.model('Group', GroupSchema);
export default Group;
