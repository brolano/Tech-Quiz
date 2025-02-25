describe('Quiz E2E', () => {
    // Mock API response
    const mockQuestions = [
      {
        question: 'What is 2+2?',
        answers: [
          { text: '3', isCorrect: false },
          { text: '4', isCorrect: true },
          { text: '5', isCorrect: false }
        ]
      },
      {
        question: 'What color is the sky?',
        answers: [
          { text: 'Green', isCorrect: false },
          { text: 'Blue', isCorrect: true },
          { text: 'Red', isCorrect: false }
        ]
      }
    ];
  
    beforeEach(() => {
      // Set up API intercept
      cy.intercept('GET', '/api/questions', {
        statusCode: 200,
        body: mockQuestions
      }).as('getQuestions');
  
      // Visit the page where the Quiz component is mounted
      cy.visit('/quiz');
    });
  
    it('completes a full quiz journey with perfect score', () => {
      // Start the quiz
      cy.visit('http://localhost:3002/')
    });
  
    it('completes a quiz with some incorrect answers', () => {
      cy.get('button').contains('Start Quiz').click();
      cy.wait('@getQuestions');
  
      // Answer first question incorrectly
      cy.get('.btn-primary').first().click();
  
      // Answer second question correctly
      cy.get('.btn-primary').eq(1).click();
  
      // Verify partial score
      cy.get('.alert-success').should('contain', '1/2');
    });
  
    it('can start multiple quizzes', () => {
      // Complete first quiz
      cy.get('button').contains('Start Quiz').click();
      cy.wait('@getQuestions');
      cy.get('.btn-primary').first().click();
      cy.get('.btn-primary').first().click();
  
      // Start new quiz
      cy.get('button').contains('Take New Quiz').click();
      cy.wait('@getQuestions');
  
      // Verify we're back at the first question
      cy.get('h2').should('contain', mockQuestions[0].question);
    });
  
    it('handles API errors gracefully', () => {
      // Override the intercept to simulate an error
      cy.intercept('GET', '/api/questions', {
        statusCode: 500,
        body: { error: 'Server error' }
      }).as('getQuestionsError');
  
      cy.get('button').contains('Start Quiz').click();
      cy.wait('@getQuestionsError');
  
      // Should show loading state
      cy.get('.spinner-border').should('exist');
    });
  
    it('displays questions and answers correctly', () => {
      cy.get('button').contains('Start Quiz').click();
      cy.wait('@getQuestions');
  
      // Check first question structure
      cy.get('h2').should('contain', mockQuestions[0].question);
      
      // Verify all answers are displayed
      mockQuestions[0].answers.forEach((answer, index) => {
        cy.get('.alert-secondary').eq(index).should('contain', answer.text);
      });
  
      // Verify buttons are numbered correctly
      cy.get('.btn-primary').each(($btn, index) => {
        cy.wrap($btn).should('contain', index + 1);
      });
    });
  
    it('preserves score throughout quiz', () => {
      cy.get('button').contains('Start Quiz').click();
      cy.wait('@getQuestions');
  
      // Answer first question correctly
      cy.get('.btn-primary').eq(1).click();
  
      // Answer second question incorrectly
      cy.get('.btn-primary').first().click();
  
      // Verify final score matches actions
      cy.get('.alert-success').should('contain', '1/2');
  
      // Start new quiz and verify score reset
      cy.get('button').contains('Take New Quiz').click();
      cy.wait('@getQuestions');
      
      // Complete new quiz all correct
      cy.get('.btn-primary').eq(1).click();
      cy.get('.btn-primary').eq(1).click();
      
      // Verify new score
      cy.get('.alert-success').should('contain', '2/2');
    });
  });