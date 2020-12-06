const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const challengeSchema = new Schema({
    category: {
      type: String,
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
      required: true,
    },
    startDate: {
      type: Date,
      required: true
    },
    description: {
      type: String,
      default: 'Remember to describe your challenge!'
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
    dailyProgress: {
      type: [Boolean]
    }
  },
    {
    timestamps: true
    }
);

module.exports = model('Challenge', challengeSchema);