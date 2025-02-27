describe('Quiz App End-to-End Test', () => {
  beforeEach(() => {
    cy.intercept('GET', '/api/questions/random', { fixture: 'questions.json' }).as('getQuestions');
    cy.visit('/');
  });

  it('should start the quiz, answer questions, and complete it', () => {
    // Start quiz
    cy.contains('Start Quiz').click();
    
    // Wait for API response and check if questions are displayed
    cy.wait('@getQuestions');
    
    cy.get('.card h2').should('be.visible'); // Question should be visible

    // Loop through and answer all questions
    cy.fixture('questions.json').then((questions) => {
      questions.forEach(() => {
        cy.get('.btn-primary').first().click(); // Click the first answer button
      });
    });

    // Verify quiz completion
    cy.contains('Quiz Completed').should('be.visible');
    cy.contains('Your score:').should('be.visible');
  });

  it('should allow restarting the quiz', () => {
    // Start and complete quiz
    cy.contains('Start Quiz').click();
    cy.wait('@getQuestions');

    cy.fixture('questions.json').then((questions) => {
      questions.forEach(() => {
        cy.get('.btn-primary').first().click();
      });
    });

    // Restart the quiz
    cy.contains('Take New Quiz').click();

// Ensure the first question is visible instead of "Start Quiz"
cy.get('.card h2').should('be.visible'); // Checks if a question is displayed
  });
});
