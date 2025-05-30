const express = require('express');
const router = express.Router();

const generateRoutine = (answers) => {
  const routine = {
    morning: [],
    evening: []
  };

  // Basic steps for all routines
  routine.morning.push({
    name: 'Cleanse',
    description: 'Start your day with a gentle cleanser to remove overnight buildup.',
    products: []
  });

  routine.morning.push({
    name: 'Tone',
    description: 'Balance your skin\'s pH and prepare it for treatments.',
    products: []
  });

  // Add treatments based on skin concerns
  if (answers.concerns.includes('Acne')) {
    routine.morning.push({
      name: 'Treatment',
      description: 'Apply acne-fighting ingredients like salicylic acid or benzoyl peroxide.',
      products: []
    });
  }

  if (answers.concerns.includes('Aging')) {
    routine.morning.push({
      name: 'Antioxidant Serum',
      description: 'Apply vitamin C serum for protection against free radicals.',
      products: []
    });
  }

  routine.morning.push({
    name: 'Moisturize',
    description: 'Lock in hydration with a moisturizer suitable for your skin type.',
    products: []
  });

  if (answers.lifestyle === 'Very active/outdoors') {
    routine.morning.push({
      name: 'Sunscreen',
      description: 'Protect your skin with broad-spectrum SPF 30 or higher.',
      products: []
    });
  }

  // Evening routine
  routine.evening.push({
    name: 'Double Cleanse',
    description: 'Remove makeup and sunscreen with an oil-based cleanser, followed by a water-based cleanser.',
    products: []
  });

  routine.evening.push({
    name: 'Tone',
    description: 'Prepare your skin for night treatments.',
    products: []
  });

  // Add treatments based on skin type and concerns
  if (answers.skinType === 'Oily' || answers.concerns.includes('Acne')) {
    routine.evening.push({
      name: 'Exfoliate',
      description: 'Use BHA/salicylic acid to unclog pores (2-3 times per week).',
      products: []
    });
  }

  if (answers.concerns.includes('Aging') || answers.concerns.includes('Dark spots')) {
    routine.evening.push({
      name: 'Treatment',
      description: 'Apply retinol or peptides for skin renewal.',
      products: []
    });
  }

  routine.evening.push({
    name: 'Moisturize',
    description: 'Apply a nourishing night cream.',
    products: []
  });

  // Adjust routine based on preferred routine length
  if (answers.routine === 'Minimal (2-3 steps)') {
    routine.morning = routine.morning.slice(0, 3);
    routine.evening = routine.evening.slice(0, 3);
  } else if (answers.routine === 'Moderate (4-5 steps)') {
    routine.morning = routine.morning.slice(0, 5);
    routine.evening = routine.evening.slice(0, 5);
  }

  return routine;
};

router.post('/create-routine', async (req, res) => {
  try {
    const { answers } = req.body;
    const routine = generateRoutine(answers);
    
    // Here you would typically query your product database to find
    // suitable products for each step based on the user's skin type and concerns
    
    res.json({ routine });
  } catch (error) {
    console.error('Error creating routine:', error);
    res.status(500).json({ error: 'Failed to create skincare routine' });
  }
});

module.exports = router; 