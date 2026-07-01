const {
  getNumericValue,
  collectBudgetDataFromInputs,
  createSummaryValues,
  formatCurrency,
  updateUsernameMessage,
} = require('./script');

describe('Budget app helper functions', () => {
  test('getNumericValue returns positive numbers from input values', () => {
    expect(getNumericValue({ value: '123.45' })).toBe(123.45);
    expect(getNumericValue({ value: '0' })).toBe(0);
  });

  test('getNumericValue returns zero for invalid or negative values', () => {
    expect(getNumericValue({ value: '-10' })).toBe(0);
    expect(getNumericValue({ value: 'abc' })).toBe(0);
    expect(getNumericValue({ value: '' })).toBe(0);
  });

  test('collectBudgetDataFromInputs maps monthly input values and fills missing months with zero', () => {
    const incomes = [
      { dataset: { month: 'Jan' }, value: '100' },
      { dataset: { month: 'Mar' }, value: '250' },
    ];
    const expenses = [
      { dataset: { month: 'Feb' }, value: '50' },
      { dataset: { month: 'Dec' }, value: '75' },
    ];

    const result = collectBudgetDataFromInputs(incomes, expenses);

    expect(result.incomes.length).toBe(12);
    expect(result.expenses.length).toBe(12);
    expect(result.incomes[0]).toBe(100);
    expect(result.incomes[1]).toBe(0);
    expect(result.incomes[2]).toBe(250);
    expect(result.expenses[0]).toBe(0);
    expect(result.expenses[1]).toBe(50);
    expect(result.expenses[11]).toBe(75);
  });

  test('createSummaryValues calculates totals and net balance correctly', () => {
    const summary = createSummaryValues([100, 200, 300], [50, 50, 100]);

    expect(summary).toEqual({
      totalIncome: 600,
      totalExpense: 200,
      netBalance: 400,
    });
  });

  test('formatCurrency formats values using INR currency rules', () => {
    expect(formatCurrency(1234.56)).toBe('₹1,234.56');
    expect(formatCurrency(0)).toBe('₹0.00');
  });

  test('updateUsernameMessage writes message text and toggles classes on the provided element', () => {
    document.body.innerHTML = '<p id="username-message"></p>';
    const messageElement = document.getElementById('username-message');

    updateUsernameMessage(true, messageElement);
    expect(messageElement.textContent).toBe('Username is valid. Nice work!');
    expect(messageElement.classList.contains('success')).toBe(true);
    expect(messageElement.classList.contains('error')).toBe(false);

    updateUsernameMessage(false, messageElement);
    expect(messageElement.textContent).toContain('Invalid username. Use at least 5 characters');
    expect(messageElement.classList.contains('success')).toBe(false);
    expect(messageElement.classList.contains('error')).toBe(true);
  });
});