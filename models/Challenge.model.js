const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const challengeSchema = new Schema({
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    category: {
      type: [String],
      enum: ['Education', 'Sports', 'Arts', 'Entertainment', 'Self-care', 'Health', 'Other'],
      required: true
    },
    timeNumber: {
      type: Number,
      required: true
    },
    timeFormat: {
      type: String,
      enum: ['Days', 'Weeks', 'Months', 'Years'],
      required: true
    },
    goal: {
      type: String,
      required: true
    },
    startDate: {
      type: String,
      required: true
    },
    description: {
      type: String
    },
    milestones: {
      type: [String]
    },
    progress: {
      type: Number
    },
    resources: {
      type: String
    },
    thoughts: {
      type: String
    },
    daysLeft: {
      type: Number
    },
    dailyProgress: {
      type: [Boolean]
    }
  },
    {
    timestamps: true
    }
);

module.exports = model('Challenge', challengeSchema);