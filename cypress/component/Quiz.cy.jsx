import React from 'react';
import { mount } from 'cypress/react';
import Quiz from '../../client/src/components/Quiz';

describe('Quiz Component', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/questions/random', {
      fixture: 'questions.json', // Mock response
    }).as('getQuestions');
  });

  it('renders the Start Quiz button initially', () => {
    mount(<Quiz />);
    cy.contains('Start Quiz').should('be.visible');
  });

  it('starts the quiz and loads questions', () => {
    mount(<Quiz />);

    // Click Start Quiz
    cy.contains('Start Quiz').click();

    // Wait for API call
    cy.wait('@getQuestions');

    // Ensure the first question is displayed
    cy.get('.card h2').should('be.visible');
  });

  it('selects an answer and moves to the next question', () => {
    mount(<Quiz />);
    cy.contains('Start Quiz').click();
    cy.wait('@getQuestions');

    // Store the first question text
    cy.get('.card h2').invoke('text').then((firstQuestion) => {
      // Click the first answer button
      cy.get('.btn-primary').first().click();

      // Ensure the next question is different
      cy.get('.card h2').should(($nextQuestion) => {
        expect($nextQuestion.text()).not.to.eq(firstQuestion);
      });
    });
  });
});
