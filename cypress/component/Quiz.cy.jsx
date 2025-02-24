import { Quiz } from '../../client/src/components/Quiz';

describe('Quiz Component', () => {
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
    // Stub the API call
    cy.stub(window, 'getQuestions').resolves(mockQuestions);
    cy.mount(<Quiz />);
  });

  it('should display start button initially', () => {
    cy.get('button').contains('Start Quiz').should('be.visible');
  });

  it('should show loading state when starting quiz', () => {
    cy.get('button').contains('Start Quiz').click();
    cy.get('.spinner-border').should('exist');
  });

  it('should display questions after starting', () => {
    cy.get('button').contains('Start Quiz').click();
    cy.get('h2').should('contain', mockQuestions[0].question);
    cy.get('.alert').should('have.length', mockQuestions[0].answers.length);
  });

  it('should progress through questions when answering', () => {
    cy.get('button').contains('Start Quiz').click();
    
    // Answer first question
    cy.get('.btn-primary').first().click();
    
    // Should show second question
    cy.get('h2').should('contain', mockQuestions[1].question);
  });

  it('should keep track of score correctly', () => {
    cy.get('button').contains('Start Quiz').click();
    
    // Answer first question correctly (second answer is correct)
    cy.get('.btn-primary').eq(1).click();
    
    // Answer second question correctly (second answer is correct)
    cy.get('.btn-primary').eq(1).click();
    
    // Check final score
    cy.get('.alert-success').should('contain', '2/2');
  });

  it('should show completion screen with correct score', () => {
    cy.get('button').contains('Start Quiz').click();
    
    // Answer both questions incorrectly
    cy.get('.btn-primary').first().click();
    cy.get('.btn-primary').first().click();
    
    cy.get('h2').should('contain', 'Quiz Completed');
    cy.get('.alert-success').should('contain', '0/2');
    cy.get('button').contains('Take New Quiz').should('be.visible');
  });

  it('should be able to start a new quiz after completion', () => {
    cy.get('button').contains('Start Quiz').click();
    
    // Complete the quiz
    cy.get('.btn-primary').first().click();
    cy.get('.btn-primary').first().click();
    
    // Start new quiz
    cy.get('button').contains('Take New Quiz').click();
    
    // Should show first question again
    cy.get('h2').should('contain', mockQuestions[0].question);
  });

  it('should handle API errors gracefully', () => {
    // Override the stub to simulate an error
    cy.stub(window, 'getQuestions').rejects(new Error('API Error'));
    
    cy.get('button').contains('Start Quiz').click();
    cy.get('.spinner-border').should('exist');
  });
});