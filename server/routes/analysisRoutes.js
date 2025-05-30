const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

// Configure multer for handling file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadsDir = path.join(__dirname, '..', 'uploads');
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Mock skin analysis function (replace with actual ML model integration)
const analyzeSkinImage = (imagePath, imageIndex) => {
  // Define a set of distinctly different results for different images
  const results = [
    {
      hydration: 'Moderate',
      oiliness: 'Moderate',
      sensitivity: 'Low',
      acne: {
        severity: 'Mild',
        location: 'Face'
      },
      concerns: ['Mild acne', 'Occasional breakouts']
    },
    {
      hydration: 'Low',
      oiliness: 'High',
      sensitivity: 'High',
      acne: {
        severity: 'Severe',
        location: 'Face'
      },
      concerns: ['Severe acne', 'Inflammation', 'Redness', 'Scarring']
    },
    {
      hydration: 'Good',
      oiliness: 'Low',
      sensitivity: 'Moderate',
      acne: {
        severity: 'Moderate',
        location: 'Face'
      },
      concerns: ['Moderate acne', 'Blackheads', 'Uneven texture']
    }
  ];

  // Ensure we get a valid index within our results array
  const safeIndex = Math.min(imageIndex, results.length - 1);
  return results[safeIndex];
};

router.post('/analyze-skin', upload.array('images', 5), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No images uploaded' });
    }

    // Analyze each uploaded image with its specific index
    const analysisResults = req.files.map((file, index) => ({
      image: file.filename,
      analysis: analyzeSkinImage(file.path, index)
    }));

    // Enhanced aggregation logic to show progression
    const aggregatedResults = {
      hydration: analysisResults[analysisResults.length - 1].analysis.hydration,
      oiliness: analysisResults[analysisResults.length - 1].analysis.oiliness,
      sensitivity: analysisResults[analysisResults.length - 1].analysis.sensitivity,
      acne: analysisResults.reduce((prev, curr) => {
        const severityLevels = { 'None': 0, 'Mild': 1, 'Moderate': 2, 'Severe': 3 };
        if (severityLevels[curr.analysis.acne.severity] > severityLevels[prev.severity]) {
          return {
            severity: curr.analysis.acne.severity,
            location: curr.analysis.acne.location,
            progression: true // Indicate that this represents a progression
          };
        }
        return prev;
      }, { severity: 'None', location: 'N/A', progression: false }),
      concerns: [...new Set(analysisResults.flatMap(r => r.analysis.concerns))]
    };

    // Enhanced recommendations based on severity and progression
    const recommendations = [];
    if (aggregatedResults.acne.severity !== 'None') {
      const isBody = ['Body', 'Both'].includes(aggregatedResults.acne.location);
      const isFace = ['Face', 'Both'].includes(aggregatedResults.acne.location);
      
      if (isFace) {
        const severeProducts = [
          'Benzoyl Peroxide 5-10% Treatment',
          'Prescription-strength Retinoid',
          'Medical-grade Salicylic Acid Cleanser'
        ];
        
        const moderateProducts = [
          'Benzoyl Peroxide 2.5-5% Cleanser',
          'Over-the-counter Retinol',
          'Tea Tree Oil Cleanser'
        ];
        
        const mildProducts = [
          'Gentle Salicylic Acid Cleanser',
          'Niacinamide Serum',
          'Gentle Foaming Cleanser'
        ];
        
        recommendations.push({
          type: 'Face Treatment',
          severity: aggregatedResults.acne.severity,
          suggestions: aggregatedResults.acne.severity === 'Severe' ? severeProducts :
                      aggregatedResults.acne.severity === 'Moderate' ? moderateProducts :
                      mildProducts
        });
      }
      
      if (isBody) {
        recommendations.push({
          type: 'Body Treatment',
          severity: aggregatedResults.acne.severity,
          suggestions: [
            'Medicated Body Wash',
            'Exfoliating Body Scrub',
            'Anti-acne Body Spray'
          ]
        });
      }
    }

    res.json({
      overall: aggregatedResults,
      details: analysisResults,
      recommendations: recommendations
    });
  } catch (error) {
    console.error('Error analyzing skin:', error);
    res.status(500).json({ error: 'Failed to analyze skin images' });
  }
});

module.exports = router; 