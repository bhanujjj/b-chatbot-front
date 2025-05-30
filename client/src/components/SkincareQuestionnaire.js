import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stepper,
  Step,
  StepLabel,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Typography,
  Box,
} from '@mui/material';

const questions = [
  {
    id: 'skinType',
    question: 'What is your skin type?',
    options: ['Oily', 'Dry', 'Combination', 'Normal', 'Sensitive'],
  },
  {
    id: 'concerns',
    question: 'What are your main skin concerns?',
    options: ['Acne', 'Aging', 'Dark spots', 'Large pores', 'Dryness', 'Sensitivity'],
  },
  {
    id: 'lifestyle',
    question: 'How would you describe your lifestyle?',
    options: ['Very active/outdoors', 'Mostly indoors', 'Balanced indoor/outdoor'],
  },
  {
    id: 'routine',
    question: 'How much time can you dedicate to your skincare routine?',
    options: ['Minimal (2-3 steps)', 'Moderate (4-5 steps)', 'Extensive (6+ steps)'],
  },
];

const SkincareQuestionnaire = ({ open, onClose, onComplete }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [answers, setAnswers] = useState({});

  const handleNext = () => {
    if (activeStep === questions.length - 1) {
      onComplete(answers);
      onClose();
    } else {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleAnswer = (event) => {
    setAnswers({
      ...answers,
      [questions[activeStep].id]: event.target.value,
    });
  };

  const currentQuestion = questions[activeStep];
  const hasAnswer = answers[currentQuestion.id];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Typography variant="h6" align="center">
          Let's create your personalized skincare routine
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2, mb: 4 }}>
          <Stepper activeStep={activeStep} alternativeLabel>
            {questions.map((q, index) => (
              <Step key={index}>
                <StepLabel>{q.id}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>
        <FormControl component="fieldset">
          <FormLabel component="legend" sx={{ mb: 2 }}>
            <Typography variant="h6">{currentQuestion.question}</Typography>
          </FormLabel>
          <RadioGroup
            value={answers[currentQuestion.id] || ''}
            onChange={handleAnswer}
          >
            {currentQuestion.options.map((option) => (
              <FormControlLabel
                key={option}
                value={option}
                control={<Radio />}
                label={option}
              />
            ))}
          </RadioGroup>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          disabled={activeStep === 0}
          onClick={handleBack}
        >
          Back
        </Button>
        <Button
          variant="contained"
          onClick={handleNext}
          disabled={!hasAnswer}
        >
          {activeStep === questions.length - 1 ? 'Finish' : 'Next'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SkincareQuestionnaire; 