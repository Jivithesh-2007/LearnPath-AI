const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Mock database for educational resources
const educationalResources = {
  'web-development': [
    {
      id: 1,
      title: 'HTML & CSS Fundamentals',
      type: 'course',
      platform: 'freeCodeCamp',
      duration: '8 hours',
      level: 'beginner',
      url: 'https://www.freecodecamp.org/learn',
      tags: ['frontend', 'html', 'css']
    },
    {
      id: 2,
      title: 'JavaScript: The Advanced Concepts',
      type: 'course',
      platform: 'Udemy',
      duration: '25 hours',
      level: 'advanced',
      url: 'https://www.udemy.com/course/advanced-javascript-concepts/',
      tags: ['javascript', 'frontend', 'backend']
    },
    {
      id: 3,
      title: 'Full Stack Open',
      type: 'course',
      platform: 'University of Helsinki',
      duration: '150 hours',
      level: 'intermediate',
      url: 'https://fullstackopen.com/en/',
      tags: ['fullstack', 'react', 'node']
    }
  ],
  'data-science': [
    {
      id: 4,
      title: 'Python for Data Science',
      type: 'course',
      platform: 'Coursera',
      duration: '35 hours',
      level: 'beginner',
      url: 'https://www.coursera.org/specializations/data-science-python',
      tags: ['python', 'data-science', 'beginner']
    },
    {
      id: 5,
      title: 'Machine Learning Specialization',
      type: 'specialization',
      platform: 'Coursera',
      duration: '80 hours',
      level: 'intermediate',
      url: 'https://www.coursera.org/specializations/machine-learning-introduction',
      tags: ['machine-learning', 'ai', 'intermediate']
    },
    {
      id: 6,
      title: 'Deep Learning',
      type: 'book',
      platform: 'MIT Press',
      duration: '40 hours',
      level: 'advanced',
      url: 'https://www.deeplearningbook.org/',
      tags: ['deep-learning', 'ai', 'advanced']
    }
  ],
  'mobile-development': [
    {
      id: 7,
      title: 'Flutter Development Bootcamp',
      type: 'course',
      platform: 'Udemy',
      duration: '30 hours',
      level: 'beginner',
      url: 'https://www.udemy.com/course/flutter-bootcamp-with-dart/',
      tags: ['flutter', 'mobile', 'dart']
    },
    {
      id: 8,
      title: 'iOS Development with SwiftUI',
      type: 'course',
      platform: 'Stanford University',
      duration: '40 hours',
      level: 'intermediate',
      url: 'https://cs193p.sites.stanford.edu/',
      tags: ['ios', 'swift', 'mobile']
    }
  ]
};

// Mock AI recommendation engine
const aiRecommendationEngine = {
  generateLearningPath: (userData) => {
    const { goal, currentLevel, timeAvailable, interests } = userData;
    
    // Simulate AI processing delay
    const delay = Math.random() * 1000 + 500;
    
    return new Promise((resolve) => {
      setTimeout(() => {
        // AI logic to generate personalized path
        let recommendedResources = [];
        let estimatedCompletionTime = 0;
        
        // Based on goal, select relevant resources
        if (goal.includes('web') || goal.includes('frontend') || goal.includes('backend')) {
          recommendedResources = educationalResources['web-development']
            .filter(resource => {
              // Match level
              if (currentLevel === 'beginner' && resource.level !== 'beginner') return false;
              if (currentLevel === 'intermediate' && resource.level === 'advanced') return false;
              return true;
            })
            .slice(0, 3);
        } else if (goal.includes('data') || goal.includes('ai') || goal.includes('machine')) {
          recommendedResources = educationalResources['data-science']
            .filter(resource => {
              if (currentLevel === 'beginner' && resource.level !== 'beginner') return false;
              if (currentLevel === 'intermediate' && resource.level === 'advanced') return false;
              return true;
            })
            .slice(0, 3);
        } else if (goal.includes('mobile') || goal.includes('app')) {
          recommendedResources = educationalResources['mobile-development']
            .filter(resource => {
              if (currentLevel === 'beginner' && resource.level !== 'beginner') return false;
              if (currentLevel === 'intermediate' && resource.level === 'advanced') return false;
              return true;
            })
            .slice(0, 3);
        }
        
        // Calculate estimated completion time based on user availability
        const hoursPerResource = recommendedResources.reduce((sum, resource) => {
          const hours = parseInt(resource.duration) || 10;
          return sum + hours;
        }, 0);
        
        estimatedCompletionTime = Math.ceil(hoursPerResource / (timeAvailable * 4)); // weeks
        
        // Generate learning path steps
        const learningPath = recommendedResources.map((resource, index) => ({
          week: index + 1,
          resource: resource,
          focus: `Week ${index + 1}: Focus on ${resource.title.split(':')[0] || resource.title}`,
          milestones: [
            `Complete ${resource.title}`,
            `Build a small project using the concepts`,
            `Join a community discussion about ${resource.tags[0]}`
          ]
        }));
        
        resolve({
          path: learningPath,
          estimatedWeeks: estimatedCompletionTime,
          resources: recommendedResources,
          insights: [
            `Based on your ${currentLevel} level, we recommend starting with fundamentals`,
            `With ${timeAvailable} hours/week, you can complete this path in ${estimatedCompletionTime} weeks`,
            `Your interest in ${interests} aligns well with these resources`
          ]
        });
      }, delay);
    });
  }
};

// Routes
app.get('/api/resources', (req, res) => {
  const category = req.query.category || 'web-development';
  res.json(educationalResources[category] || []);
});

app.post('/api/generate-path', async (req, res) => {
  try {
    const userData = req.body;
    const learningPath = await aiRecommendationEngine.generateLearningPath(userData);
    res.json(learningPath);
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate learning path' });
  }
});

app.get('/api/stats', (req, res) => {
  // Generate mock statistics
  const totalResources = Object.values(educationalResources).flat().length;
  const stats = {
    totalResources,
    averageCompletionTime: '8 weeks',
    mostPopularField: 'Web Development',
    successRate: '87%',
    activeUsers: 1243
  };
  res.json(stats);
});

// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
