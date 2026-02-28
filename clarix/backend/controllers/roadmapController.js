// controllers/roadmapController.js
const Roadmap = require('../models/Roadmap');

// Generate a default roadmap (replace with real AI call later)
const generateTasks = (goal) => ({
  weekly: [
    { id:'w1', title:'Solve 5 Easy LeetCode problems', desc:'Focus on Arrays and Strings. Use 2-pointer technique.', tags:['DSA','LeetCode'] },
    { id:'w2', title:'Update GitHub profile & pin 2 projects', desc:'A strong GitHub signals real work to recruiters.', tags:['GitHub','Portfolio'] },
    { id:'w3', title:'Complete 1 module of target skill course', desc:'Dedicate 2 hrs. Quality over speed.', tags:['Learning'] },
    { id:'w4', title:'Connect with 1 senior for guidance', desc:'A 20-minute call can save months of wrong direction.', tags:['Networking'] }
  ],
  monthly: [
    { id:'m1', title:'Complete 50 LeetCode problems', desc:'Focus on Sliding Window, Two Pointers, BFS/DFS patterns.', tags:['DSA'] },
    { id:'m2', title:'Build and deploy 1 full project', desc:'Live project speaks louder than 10 unfinished ones.', tags:['Projects'] },
    { id:'m3', title:'Get resume reviewed by a senior', desc:'Use STAR format for experience bullets.', tags:['Resume'] },
    { id:'m4', title:'Apply to 5 relevant internships', desc:'Volume + relevance. Track all applications.', tags:['Applications'] }
  ],
  semester: [
    { id:'s1', title:'Complete a recognized certification', desc:'Pick AWS/Google/Coursera aligned to your goal.', tags:['Certification'] },
    { id:'s2', title:'Contribute to 2 open-source repos', desc:'Even documentation PRs count.', tags:['Open Source'] },
    { id:'s3', title:'Land first internship or research role', desc:'Real environment validates your skills.', tags:['Milestone'] },
    { id:'s4', title:'Build personal brand (LinkedIn 500+)', desc:'Recruiters look at LinkedIn. Post your journey.', tags:['Branding'] }
  ],
  insights: `Based on your goal of "${goal}", focus on structured consistency over random effort. The gap between top candidates and the rest isn't talent — it's deliberate practice and visibility.`
});

// @route  GET /api/roadmap
exports.getRoadmap = async (req, res) => {
  try {
    let roadmap = await Roadmap.findOne({ student: req.user.id });
    if (!roadmap) {
      const tasks = generateTasks(req.user.goal || 'Software Engineer');
      roadmap = await Roadmap.create({ student: req.user.id, goal: req.user.goal, ...tasks });
    }
    res.json({ success: true, roadmap });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route  PATCH /api/roadmap/task/:taskId
exports.toggleTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const roadmap = await Roadmap.findOne({ student: req.user.id });
    if (!roadmap) return res.status(404).json({ success: false, message: 'Roadmap not found.' });

    for (const section of ['weekly','monthly','semester']) {
      const task = roadmap[section].find(t => t.id === taskId);
      if (task) {
        task.done   = !task.done;
        task.doneAt = task.done ? new Date() : null;
        break;
      }
    }
    roadmap.updatedAt = new Date();
    await roadmap.save();
    res.json({ success: true, roadmap });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route  POST /api/roadmap/regenerate
exports.regenerateRoadmap = async (req, res) => {
  try {
    const tasks = generateTasks(req.user.goal || 'Software Engineer');
    const roadmap = await Roadmap.findOneAndUpdate(
      { student: req.user.id },
      { ...tasks, generatedAt: new Date(), updatedAt: new Date() },
      { new: true, upsert: true }
    );
    res.json({ success: true, roadmap });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
