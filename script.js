const monthLabels = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

const numberFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 2,
});

const tabData = document.getElementById('tab-data');
const tabChart = document.getElementById('tab-chart');
const dataPanel = document.getElementById('data-panel');
const chartPanel = document.getElementById('chart-panel');
const incomeInputs = Array.from(document.querySelectorAll('.income-input'));
const expenseInputs = Array.from(document.querySelectorAll('.expense-input'));
const totalIncomeLabel = document.getElementById('total-income');
const totalExpenseLabel = document.getElementById('total-expense');
const netBalanceLabel = document.getElementById('net-balance');
const chartCanvas = document.getElementById('budgetChart');
const downloadButton = document.getElementById('downloadChart');

let budgetChart = null;

function activateTab(selectedTab) {
  const isData = selectedTab === 'data';

  tabData.classList.toggle('active', isData);
  tabData.setAttribute('aria-selected', String(isData));
  tabChart.classList.toggle('active', !isData);
  tabChart.setAttribute('aria-selected', String(!isData));

  dataPanel.classList.toggle('active', isData);
  chartPanel.classList.toggle('active', !isData);

  if (!isData) {
    budgetChart?.resize();
  }
}

function getNumericValue(input) {
  const value = parseFloat(input.value);
  return Number.isFinite(value) && value >= 0 ? value : 0;
}

function collectBudgetData() {
  const incomes = monthLabels.map((month) => {
    const input = incomeInputs.find((item) => item.dataset.month === month);
    return getNumericValue(input);
  });

  const expenses = monthLabels.map((month) => {
    const input = expenseInputs.find((item) => item.dataset.month === month);
    return getNumericValue(input);
  });

  return { incomes, expenses };
}

function updateSummary(incomes, expenses) {
  const totalIncome = incomes.reduce((sum, value) => sum + value, 0);
  const totalExpense = expenses.reduce((sum, value) => sum + value, 0);
  const netBalance = totalIncome - totalExpense;

  totalIncomeLabel.textContent = numberFormatter.format(totalIncome);
  totalExpenseLabel.textContent = numberFormatter.format(totalExpense);
  netBalanceLabel.textContent = numberFormatter.format(netBalance);
}

function createChart() {
  const initialData = collectBudgetData();

  const config = {
    type: 'bar',
    data: {
      labels: monthLabels,
      datasets: [
        {
          label: 'Income',
          data: initialData.incomes,
          backgroundColor: 'rgba(59, 130, 246, 0.78)',
          borderRadius: 10,
          barPercentage: 0.55,
          categoryPercentage: 0.8,
        },
        {
          label: 'Expense',
          data: initialData.expenses,
          backgroundColor: 'rgba(239, 68, 68, 0.78)',
          borderRadius: 10,
          barPercentage: 0.55,
          categoryPercentage: 0.8,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            usePointStyle: true,
            pointStyle: 'circle',
            padding: 20,
          },
        },
        tooltip: {
          callbacks: {
            label(context) {
              const value = context.raw || 0;
              return `${context.dataset.label}: ${numberFormatter.format(value)}`;
            },
          },
        },
      },
      scales: {
        x: {
          grid: {
            display: false,
          },
        },
        y: {
          beginAtZero: true,
          ticks: {
            callback(value) {
              return numberFormatter.format(value);
            },
          },
          grid: {
            color: 'rgba(148, 163, 184, 0.18)',
          },
        },
      },
    },
  };

  budgetChart = new Chart(chartCanvas, config);
}

function refreshChart() {
  if (!budgetChart) {
    return;
  }

  const { incomes, expenses } = collectBudgetData();
  budgetChart.data.datasets[0].data = incomes;
  budgetChart.data.datasets[1].data = expenses;
  budgetChart.update();
  updateSummary(incomes, expenses);
}

function downloadChartAsPng() {
  if (!budgetChart) {
    return;
  }

  const imageUrl = budgetChart.toBase64Image();
  const link = document.createElement('a');
  link.href = imageUrl;
  link.download = 'bucks2bar-chart.png';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

document.addEventListener('DOMContentLoaded', () => {
  activateTab('data');
  createChart();
  refreshChart();

  tabData.addEventListener('click', () => activateTab('data'));
  tabChart.addEventListener('click', () => activateTab('chart'));
  downloadButton?.addEventListener('click', downloadChartAsPng);

  const allInputs = [...incomeInputs, ...expenseInputs];
  allInputs.forEach((input) => {
    input.addEventListener('input', refreshChart);
  });
});
