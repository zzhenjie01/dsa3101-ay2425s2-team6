import mongoose from "mongoose";

const metricsSchema = new mongoose.Schema({
  "GHG emissions": {
    type: String,
  },
  "Electricity consumption": {
    type: String,
  },
  "Water consumption": {
    type: String,
  },
  "Gender ratio": {
    type: String,
  },
  "Turnover rate": {
    type: String,
  },
  "Board of Director gender ratio": {
    type: String,
  },
  "Number of Corruption cases": {
    type: String,
  },
});

const yearMetricSchema = new mongoose.Schema({
  year: {
    type: String,
    required: true,
  },
  metrics: {
    type: metricsSchema,
  },
});

const leaderboardSchema = new mongoose.Schema({
  environmentalScore: {
    type: Number,
  },
  socialScore: {
    type: Number,
  },
  governanceScore: {
    type: Number,
  },
});

const companySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  data: {
    type: [yearMetricSchema],
  },
  leaderboard: {
    type: Map,
    of: leaderboardSchema,
  },
  avgEsgScores: {
    type: Map,
    of: Number,
  },
});

const Company = mongoose.model("companies", companySchema);

export default Company;
