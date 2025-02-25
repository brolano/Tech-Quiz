import Quiz from '../../client/src/components/Quiz';
import { mount } from 'cypress/react';

// Mock questions data
const mockQuestions = [
  {
    question: 'What is 2 + 2?',
    answers: [
      { text: '3', isCorrect: false },
      { text: '4', isCorrect: true },
      { text: '5', isCorrect: false },
      { text: '6', isCorrect: false },
    ],
  },
  {
    question: 'What is the capital of France?',
    answers: [
      { text: 'Berlin', isCorrect: false },
      { text: 'Madrid', isCorrect: false },
      { text: 'Paris', isCorrect: true },
      { text: 'Rome', isCorrect: false },
    ],
  },
];

// Mock API module
jest.mock('../../src/services/questionApi', () => ({
  getQuestions: jest.fn(() => Promise.resolve(mockQuestions)),
}));

describe('Quiz Component', () => {
  beforeEach(() => {
    mount(<Quiz />);
  });

  it('should render the start quiz button initially', () => {
    cy.contains('Start Quiz').should('be.visible');
  });

  it('should start the quiz and display the first question', () => {
    cy.contains('Start Quiz').click();
    cy.contains('What is 2 + 2?').should('be.visible');
  });

  it('should allow answering questions and show the next question', () => {
    cy.contains('Start Quiz').click();
    cy.contains('What is 2 + 2?').should('be.visible');
    cy.contains('4').click();
    cy.contains('What is the capital of France?').should('be.visible');
  });

  it('should complete the quiz and display the final score', () => {
    cy.contains('Start Quiz').click();
    cy.contains('4').click(); // Correct answer for first question
    cy.contains('Paris').click(); // Correct answer for second question
    cy.contains('Quiz Completed').should('be.visible');
    cy.contains('Your score: 2/2').should('be.visible');
  });

  it('should allow restarting the quiz', () => {
    cy.contains('Start Quiz').click();
    cy.contains('4').click();
    cy.contains('Paris').click();
    cy.contains('Take New Quiz').click();
    cy.contains('Start Quiz').should('be.visible');
  });
});