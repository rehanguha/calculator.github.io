
// Track active calculators with proper ID management
let availableIds = [1, 2, 3];
let activeCalculators = new Set();
const maxCalculators = 3;
let numberFormat = 'million'; // Default format

// Initialize theme on page load
function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = savedTheme || (prefersDark ? 'dark' : 'light');
    
    applyTheme(theme);
}

// Initialize number format
function initNumberFormat() {
    const savedFormat = localStorage.getItem('numberFormat') || 'million';
    numberFormat = savedFormat;
    document.getElementById('numberFormat').value = savedFormat;
}

// Change number format
function changeNumberFormat(format) {
    numberFormat = format;
    localStorage.setItem('numberFormat', format);
    // Refresh all calculations to update display
    const inputs = document.querySelectorAll('.calculator-wrapper input[type="number"]');
    inputs.forEach(input => {
        input.dispatchEvent(new Event('input', { bubbles: true }));
    });
}

// Format number based on selected format
function formatNumber(num) {
    const value = parseFloat(num);
    if (isNaN(value)) return '0';
    
    const fixed = value.toFixed(2);
    const parts = fixed.split('.');
    let integerPart = parts[0];
    const decimalPart = parts[1];
    
    if (numberFormat === 'plain') {
        return fixed;
    } else if (numberFormat === 'million') {
        // Standard format: 1,000,000
        integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    } else if (numberFormat === 'indian') {
        // Indian format: 1,00,000 (rightmost 3 digits, then groups of 2)
        const digits = integerPart.split('');
        let result = '';
        let count = 0;
        for (let i = digits.length - 1; i >= 0; i--) {
            if (count === 3 || (count > 3 && (count - 3) % 2 === 0)) {
                result = ',' + result;
            }
            result = digits[i] + result;
            count++;
        }
        integerPart = result;
    }
    
    return integerPart + '.' + decimalPart;
}

// Apply theme to the document
function applyTheme(theme) {
    const html = document.documentElement;
    const icon = document.getElementById('themeIcon');
    
    if (theme === 'light') {
        html.classList.remove('dark-theme');
        html.classList.add('light-theme');
        icon.textContent = '🌞';
    } else {
        html.classList.remove('light-theme');
        html.classList.add('dark-theme');
        icon.textContent = '🌙';
    }
    
    localStorage.setItem('theme', theme);
}

// Toggle between light and dark themes
function toggleTheme() {
    const html = document.documentElement;
    const currentTheme = html.classList.contains('light-theme') ? 'light' : 'dark';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    applyTheme(newTheme);
}

// Listen for system theme changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    if (!localStorage.getItem('theme')) {
        applyTheme(e.matches ? 'dark' : 'light');
    }
});

// Calculator data with related search terms
const calculatorData = {
    avgStock: { name: 'Average Stock Price', category: 'Stock & Portfolio', terms: ['average', 'stock', 'price', 'purchase', 'cost basis', 'mean'] },
    requiredQty: { name: 'Required Quantity & Price', category: 'Stock & Portfolio', terms: ['quantity', 'price', 'required', 'shares', 'amount'] },
    dividend: { name: 'Dividend Calculator', category: 'Stock & Portfolio', terms: ['dividend', 'yield', 'income', 'passive', 'earnings'] },
    breakeven: { name: 'Breakeven Point', category: 'Stock & Portfolio', terms: ['breakeven', 'break even', 'profit', 'loss'] },
    sip: { name: 'SIP Calculator', category: 'Investment Planning', terms: ['sip', 'systematic', 'investment', 'plan', 'monthly'] },
    compound: { name: 'Compound Interest', category: 'Investment Planning', terms: ['compound', 'interest', 'growth', 'power', 'multiplier'] },
    investmentGoal: { name: 'Investment Goal', category: 'Investment Planning', terms: ['goal', 'target', 'savings', 'amount', 'future'] },
    costOfDelay: { name: 'Cost of Delay', category: 'Investment Planning', terms: ['delay', 'cost', 'lost', 'opportunity', 'waiting'] },
    fireNumber: { name: 'FIRE Number', category: 'FIRE & Retirement', terms: ['fire', 'financial', 'independence', 'retire', 'number'] },
    yearsToFire: { name: 'Years to FIRE', category: 'FIRE & Retirement', terms: ['years', 'fire', 'timeline', 'when', 'independence'] },
    fatFire: { name: 'FatFIRE Calculator', category: 'FIRE & Retirement', terms: ['fatfire', 'fat', 'luxury', 'premium', 'lifestyle'] },
    leanFire: { name: 'LeanFIRE Calculator', category: 'FIRE & Retirement', terms: ['leanfire', 'lean', 'minimal', 'frugal', 'simple'] },
    retirementAge: { name: 'Retirement Age', category: 'FIRE & Retirement', terms: ['retirement', 'age', 'when', 'retire', 'old'] },
    loanEmi: { name: 'Loan EMI Calculator', category: 'Loans & Borrowing', terms: ['loan', 'emi', 'payment', 'monthly', 'interest'] },
    propertyRoi: { name: 'Property Investment ROI', category: 'Real Estate', terms: ['property', 'roi', 'return', 'investment', 'real estate'] },
    mortgageEmi: { name: 'Mortgage/Home Loan', category: 'Real Estate', terms: ['mortgage', 'home', 'loan', 'house', 'emi'] },
    rule72: { name: 'Rule of 72', category: 'Time & Growth', terms: ['rule', '72', 'double', 'doubling', 'time'] },
    inflation: { name: 'Inflation Calculator', category: 'Time & Growth', terms: ['inflation', 'purchasing', 'power', 'price', 'future'] },
    expenseRatio: { name: 'Expense Ratio Calculator', category: 'Taxes & Fees', terms: ['expense', 'ratio', 'fee', 'fund', 'cost'] },
    emergencyFund: { name: 'Emergency Fund Calculator', category: 'Budgeting & Savings', terms: ['emergency', 'fund', 'savings', 'months', 'buffer'] },
    monthlySavings: { name: 'Monthly Savings Calculator', category: 'Budgeting & Savings', terms: ['savings', 'monthly', 'goal', 'target', 'amount'] },
    budgetAllocator: { name: 'Budget Allocator', category: 'Budgeting & Savings', terms: ['budget', 'allocate', 'allocation', '50/30/20', 'needs'] },
    debtPayoff: { name: 'Debt Payoff Calculator', category: 'Debt Management', terms: ['debt', 'payoff', 'payment', 'timeline', 'interest'] },
    creditCardPayoff: { name: 'Credit Card Payoff Calculator', category: 'Debt Management', terms: ['credit', 'card', 'debt', 'payoff', 'interest'] },
    debtConsolidation: { name: 'Debt Consolidation Calculator', category: 'Debt Management', terms: ['consolidation', 'debt', 'combine', 'merge', 'emi'] },
    cagr: { name: 'CAGR Calculator', category: 'Investment Analysis', terms: ['cagr', 'compound', 'annual', 'growth', 'rate'] },
    roi: { name: 'ROI Calculator', category: 'Investment Analysis', terms: ['roi', 'return', 'investment', 'profit', 'percentage'] },
    drip: { name: 'Dividend Reinvestment (DRIP)', category: 'Investment Analysis', terms: ['drip', 'reinvestment', 'dividend', 'compound', 'growth'] },
    dca: { name: 'Dollar Cost Averaging', category: 'Investment Analysis', terms: ['dca', 'dollar', 'cost', 'averaging', 'monthly'] },
    netWorth: { name: 'Net Worth Calculator', category: 'Wealth Building', terms: ['net', 'worth', 'assets', 'liabilities', 'total'] },
    wealthProjection: { name: 'Wealth Projection', category: 'Wealth Building', terms: ['wealth', 'projection', 'future', 'growth', 'forecast'] },
    millionaireTimeline: { name: 'Millionaire Timeline', category: 'Wealth Building', terms: ['millionaire', 'timeline', 'when', 'crore', 'wealthy'] },
    homeAffordability: { name: 'Home Affordability', category: 'Real Estate (Additional)', terms: ['home', 'affordability', 'price', 'can afford', 'property'] },
    rentVsBuy: { name: 'Rent vs Buy', category: 'Real Estate (Additional)', terms: ['rent', 'buy', 'comparison', 'cost', 'lease'] },
    propertyAppreciation: { name: 'Property Appreciation', category: 'Real Estate (Additional)', terms: ['property', 'appreciation', 'value', 'growth', 'future'] },
    annuityCorpus: { name: 'Annuity/Corpus Calculator', category: 'Retirement (Additional)', terms: ['annuity', 'corpus', 'withdrawal', 'payment', 'income'] },
    retirementIncome: { name: 'Retirement Income Calculator', category: 'Retirement (Additional)', terms: ['retirement', 'income', 'monthly', 'withdrawal', '4%'] },
    inflationCorpus: { name: 'Inflation-Adjusted Corpus', category: 'Retirement (Additional)', terms: ['inflation', 'adjusted', 'corpus', 'future', 'value'] },
    carLoanEmi: { name: 'Car Loan EMI Calculator', category: 'Vehicle Finance', terms: ['car', 'loan', 'emi', 'vehicle', 'payment'] },
    depreciation: { name: 'Depreciation Calculator', category: 'Vehicle Finance', terms: ['depreciation', 'vehicle', 'value', 'car', 'loss'] },
    lifeInsurance: { name: 'Life Insurance Needs', category: 'Insurance', terms: ['insurance', 'life', 'coverage', 'needs', 'protection'] },
    termInsurance: { name: 'Term Insurance Premium', category: 'Insurance', terms: ['term', 'insurance', 'premium', 'cost', 'policy'] },
    educationFund: { name: 'Education Fund Calculator', category: 'Education Planning', terms: ['education', 'fund', 'savings', 'school', 'college'] },
    collegeCost: { name: 'College Cost Projection', category: 'Education Planning', terms: ['college', 'cost', 'education', 'future', 'inflation'] },
    salaryCalculator: { name: 'Salary Calculator', category: 'Income & Earning', terms: ['salary', 'gross', 'net', 'deduction', 'tax'] },
    sideHustleIncome: { name: 'Side Hustle Income', category: 'Income & Earning', terms: ['side', 'hustle', 'income', 'passive', 'extra'] },
    freelanceRate: { name: 'Freelance Rate Calculator', category: 'Income & Earning', terms: ['freelance', 'rate', 'hourly', 'per hour', 'earning'] },
    savingsRate: { name: 'Savings Rate Calculator', category: 'Tracking & Monitoring', terms: ['savings', 'rate', 'percentage', 'how much', 'percent'] },
    goalTracker: { name: 'Goal Tracker', category: 'Tracking & Monitoring', terms: ['goal', 'tracker', 'progress', 'target', 'tracking'] },
    expenseTracker: { name: 'Expense Tracker', category: 'Tracking & Monitoring', terms: ['expense', 'tracker', 'spending', 'monitor', 'track'] },
    loanComparison: { name: 'Loan Comparison', category: 'Loan Comparisons', terms: ['loan', 'comparison', 'compare', 'best', 'options'] },
    paybackPeriod: { name: 'Payback Period Calculator', category: 'Loan Comparisons', terms: ['payback', 'period', 'when', 'paid', 'investment'] },
    earlyPayoff: { name: 'Early Loan Payoff', category: 'Loan Comparisons', terms: ['early', 'payoff', 'extra', 'payment', 'loan'] },
    peRatio: { name: 'P/E Ratio & EPS', category: 'Investment Analysis (Advanced)', terms: ['p/e', 'pe', 'earnings', 'price', 'ratio', 'eps'] },
    dividendGrowth: { name: 'Dividend Growth Calculator', category: 'Investment Analysis (Advanced)', terms: ['dividend', 'growth', 'income', 'future', 'projection'] },
    portfolioRebalancing: { name: 'Portfolio Rebalancing', category: 'Investment Analysis (Advanced)', terms: ['portfolio', 'rebalance', 'allocation', 'asset', 'weightage'] },
    taxLossHarvesting: { name: 'Tax Loss Harvesting', category: 'Tax Planning', terms: ['tax', 'loss', 'harvesting', 'offset', 'capital'] },
    taxBracket: { name: 'Tax Bracket Calculator', category: 'Tax Planning', terms: ['tax', 'bracket', 'rate', 'slab', 'income'] },
    giftTax: { name: 'Gift/Inheritance Tax', category: 'Tax Planning', terms: ['gift', 'inheritance', 'tax', 'estate', 'legacy'] },
    businessProfit: { name: 'Business Profit Calculator', category: 'Business & Freelance', terms: ['business', 'profit', 'revenue', 'cost', 'earnings'] },
    markupMargin: { name: 'Markup vs Margin', category: 'Business & Freelance', terms: ['markup', 'margin', 'price', 'cost', 'profit'] },
    expenseInflation: { name: 'Expense Inflation Calculator', category: 'Lifestyle & Planning', terms: ['expense', 'inflation', 'future', 'cost', 'price'] },
    weddingBudget: { name: 'Wedding Budget Planner', category: 'Lifestyle & Planning', terms: ['wedding', 'budget', 'planner', 'cost', 'event'] },
    vacationBudget: { name: 'Vacation Budget Planner', category: 'Lifestyle & Planning', terms: ['vacation', 'budget', 'trip', 'travel', 'cost'] },
    pensionCalculator: { name: 'Pension Calculator', category: 'Retirement (Additional)', terms: ['pension', 'defined benefit', 'retirement', 'income', 'benefit'] },
    socialSecurity: { name: 'Social Security Estimator', category: 'Retirement (Additional)', terms: ['social security', 'benefits', 'retirement', 'income', 'government'] },
    cryptoROI: { name: 'Crypto Investment ROI', category: 'Crypto & Modern Investing', terms: ['crypto', 'cryptocurrency', 'roi', 'return', 'bitcoin'] },
    cryptoDCA: { name: 'Crypto DCA Calculator', category: 'Crypto & Modern Investing', terms: ['crypto', 'dca', 'dollar cost', 'averaging', 'bitcoin'] },
    bondYield: { name: 'Bond Yield Calculator', category: 'Advanced Financial', terms: ['bond', 'yield', 'interest', 'return', 'fixed income'] },
    npv: { name: 'Net Present Value (NPV)', category: 'Advanced Financial', terms: ['npv', 'net', 'present', 'value', 'project'] },
    irr: { name: 'Internal Rate of Return (IRR)', category: 'Advanced Financial', terms: ['irr', 'internal', 'rate', 'return', 'efficiency'] },
    leaseVsBuy: { name: 'Lease vs Buy Calculator', category: 'Comparison Tools', terms: ['lease', 'buy', 'comparison', 'car', 'equipment'] },
    costOfLiving: { name: 'Cost of Living Adjuster', category: 'Comparison Tools', terms: ['cost', 'living', 'location', 'salary', 'adjust'] },
    rentalYield: { name: 'Rental Yield Calculator', category: 'Real Estate', terms: ['rental', 'yield', 'rent', 'return', 'property'] }
};

// Filter calculators based on search input
function filterCalculators(id) {
    const searchInput = document.getElementById(`search-${id}`);
    const searchTerm = searchInput.value.toLowerCase().trim();
    const resultsContainer = document.getElementById(`search-results-${id}`);
    
    if (!searchTerm) {
        resultsContainer.style.display = 'none';
        return;
    }
    
    const matches = [];
    
    for (const [key, data] of Object.entries(calculatorData)) {
        const nameMatch = data.name.toLowerCase().includes(searchTerm);
        const categoryMatch = data.category.toLowerCase().includes(searchTerm);
        const termsMatch = data.terms.some(term => term.includes(searchTerm));
        
        if (nameMatch || categoryMatch || termsMatch) {
            matches.push({ key, ...data });
        }
    }
    
    // Group results by category
    const grouped = {};
    matches.forEach(item => {
        if (!grouped[item.category]) {
            grouped[item.category] = [];
        }
        grouped[item.category].push(item);
    });
    
    // Build HTML
    let html = '';
    if (matches.length === 0) {
        html = '<div class="search-no-results">No calculators found</div>';
    } else {
        for (const [category, items] of Object.entries(grouped)) {
            html += `<div class="search-result-category">${category}</div>`;
            items.forEach(item => {
                html += `<div class="search-result-item" onclick="selectCalculator(${id}, '${item.key}', event)">${item.name}</div>`;
            });
        }
    }
    
    resultsContainer.innerHTML = html;
    resultsContainer.style.display = 'block';
}

// Show all calculators when search input is clicked
function showAllCalculators(id) {
    const resultsContainer = document.getElementById(`search-results-${id}`);
    const searchInput = document.getElementById(`search-${id}`);
    
    // If search input already has text, don't override
    if (searchInput.value.trim()) {
        return;
    }
    
    // Group all calculators by category
    const grouped = {};
    for (const [key, data] of Object.entries(calculatorData)) {
        if (!grouped[data.category]) {
            grouped[data.category] = [];
        }
        grouped[data.category].push({ key, ...data });
    }
    
    // Build HTML showing all calculators
    let html = '';
    for (const [category, items] of Object.entries(grouped)) {
        html += `<div class="search-result-category">${category}</div>`;
        items.forEach(item => {
            html += `<div class="search-result-item" onclick="selectCalculator(${id}, '${item.key}', event)">${item.name}</div>`;
        });
    }
    
    resultsContainer.innerHTML = html;
    resultsContainer.style.display = 'block';
}

// Select calculator from search results
function selectCalculator(id, value, event) {
    event.stopPropagation();
    const searchInput = document.getElementById(`search-${id}`);
    const resultsContainer = document.getElementById(`search-results-${id}`);
    const select = document.getElementById(`switcher-${id}`);
    
    // Set the select value and trigger change
    select.value = value;
    searchInput.value = calculatorData[value].name;
    resultsContainer.style.display = 'none';
    
    // Trigger the calculator switch
    switchCalc(id);
}

// Close search results when clicking outside
document.addEventListener('click', function(event) {
    const searchResults = document.querySelectorAll('.search-results');
    searchResults.forEach(result => {
        if (!result.closest('.calculator-search-wrapper').contains(event.target)) {
            result.style.display = 'none';
        }
    });
});

// Open calculator list modal
function openCalculatorList() {
    const modal = document.getElementById('calculatorListModal');
    modal.style.display = 'flex';
    populateCalculatorList();
}

// Close calculator list modal
function closeCalculatorList() {
    const modal = document.getElementById('calculatorListModal');
    modal.style.display = 'none';
    document.getElementById('modalSearch').value = '';
}

// Populate calculator list in modal
function populateCalculatorList() {
    const body = document.getElementById('calculatorListBody');
    const grouped = {};
    
    // Group calculators by category
    for (const [key, data] of Object.entries(calculatorData)) {
        if (!grouped[data.category]) {
            grouped[data.category] = [];
        }
        grouped[data.category].push({ key, ...data });
    }
    
    // Build HTML
    let html = '';
    for (const [category, calculators] of Object.entries(grouped)) {
        html += `
            <div class="calculator-category">
                <div class="category-title">${category}</div>
                <div class="calculator-grid-list">
        `;
        
        calculators.forEach(calc => {
            html += `
                <div class="calculator-card" data-search-text="${calc.name.toLowerCase()} ${calc.terms.join(' ').toLowerCase()}">
                    <div class="calculator-card-name">${calc.name}</div>
                    <button class="calculator-card-btn" onclick="addCalculatorFromModal('${calc.key}')">Add</button>
                </div>
            `;
        });
        
        html += `
                </div>
            </div>
        `;
    }
    
    body.innerHTML = html;
}

// Filter calculators in modal
function filterModalCalculators() {
    const searchTerm = document.getElementById('modalSearch').value.toLowerCase().trim();
    const cards = document.querySelectorAll('.calculator-card');
    let visibleCount = 0;
    
    cards.forEach(card => {
        const searchText = card.getAttribute('data-search-text');
        if (searchTerm === '' || searchText.includes(searchTerm)) {
            card.style.display = 'flex';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });
    
    // Show no results message if needed
    const body = document.getElementById('calculatorListBody');
    let noResults = body.querySelector('.no-results');
    
    if (visibleCount === 0) {
        if (!noResults) {
            noResults = document.createElement('div');
            noResults.className = 'no-results';
            noResults.textContent = 'No calculators found';
            body.appendChild(noResults);
        }
        noResults.style.display = 'block';
    } else {
        if (noResults) {
            noResults.style.display = 'none';
        }
    }
}

// Add calculator from modal list
function addCalculatorFromModal(calcKey) {
    closeCalculatorList();
    addCalculator();
    
    // Wait for the calculator to be added, then select the calculator
    setTimeout(() => {
        const lastCalculatorId = Array.from(activeCalculators).sort().pop();
        if (lastCalculatorId) {
            const select = document.getElementById(`switcher-${lastCalculatorId}`);
            select.value = calcKey;
            switchCalc(lastCalculatorId);
        }
    }, 100);
}

// Close modal when clicking outside
document.addEventListener('click', function(event) {
    const modal = document.getElementById('calculatorListModal');
    if (event.target === modal) {
        closeCalculatorList();
    }
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initNumberFormat();
    addCalculator(); // Add first calculator
});

// Add a new calculator instance
function addCalculator() {
    if (activeCalculators.size >= maxCalculators) {
        alert(`Maximum ${maxCalculators} calculators allowed`);
        return;
    }
    
    // Find the first available ID
    let id = null;
    for (let availableId of availableIds) {
        if (!activeCalculators.has(availableId)) {
            id = availableId;
            break;
        }
    }
    
    if (id === null) return;
    
    activeCalculators.add(id);
    const grid = document.getElementById('calculatorsGrid');
    
    const calculatorHTML = `
        <div class="calculator-wrapper" id="calc-${id}">
            <div class="calculator-header">
                <button class="close-calculator-btn" onclick="removeCalculator(${id})">×</button>
                <h2>Calculator ${id}</h2>
            </div>
            
            <div class="calculator-search-wrapper">
                <input type="text" id="search-${id}" class="calculator-search" placeholder="Search calculators..." oninput="filterCalculators(${id})" onclick="showAllCalculators(${id})">
                <div id="search-results-${id}" class="search-results" style="display: none;"></div>
            </div>
            
            <select id="switcher-${id}" class="calculator-select" onchange="switchCalc(${id})" style="display: none;">
                <optgroup label="Stock & Portfolio">
                    <option value="avgStock">Average Stock Price</option>
                    <option value="requiredQty">Required Quantity & Price</option>
                    <option value="dividend">Dividend Calculator</option>
                    <option value="breakeven">Breakeven Point</option>
                </optgroup>
                <optgroup label="Investment Planning">
                    <option value="sip">SIP Calculator</option>
                    <option value="compound">Compound Interest</option>
                    <option value="investmentGoal">Investment Goal</option>
                    <option value="costOfDelay">Cost of Delay</option>
                </optgroup>
                <optgroup label="FIRE & Retirement">
                    <option value="fireNumber">FIRE Number</option>
                    <option value="yearsToFire">Years to FIRE</option>
                    <option value="fatFire">FatFIRE Calculator</option>
                    <option value="leanFire">LeanFIRE Calculator</option>
                    <option value="retirementAge">Retirement Age</option>
                </optgroup>
                <optgroup label="Loans & Borrowing">
                    <option value="loanEmi">Loan EMI Calculator</option>
                </optgroup>
                <optgroup label="Real Estate">
                    <option value="propertyRoi">Property Investment ROI</option>
                    <option value="mortgageEmi">Mortgage/Home Loan</option>
                </optgroup>
                <optgroup label="Time & Growth">
                    <option value="rule72">Rule of 72</option>
                    <option value="inflation">Inflation Calculator</option>
                </optgroup>
                <optgroup label="Taxes & Fees">
                    <option value="expenseRatio">Expense Ratio Calculator</option>
                </optgroup>
                <optgroup label="Budgeting & Savings">
                    <option value="emergencyFund">Emergency Fund Calculator</option>
                    <option value="monthlySavings">Monthly Savings Calculator</option>
                    <option value="budgetAllocator">Budget Allocator</option>
                </optgroup>
                <optgroup label="Debt Management">
                    <option value="debtPayoff">Debt Payoff Calculator</option>
                    <option value="creditCardPayoff">Credit Card Payoff Calculator</option>
                    <option value="debtConsolidation">Debt Consolidation Calculator</option>
                </optgroup>
                <optgroup label="Investment Analysis">
                    <option value="cagr">CAGR Calculator</option>
                    <option value="roi">ROI Calculator</option>
                    <option value="drip">Dividend Reinvestment (DRIP)</option>
                    <option value="dca">Dollar Cost Averaging</option>
                </optgroup>
                <optgroup label="Wealth Building">
                    <option value="netWorth">Net Worth Calculator</option>
                    <option value="wealthProjection">Wealth Projection</option>
                    <option value="millionaireTimeline">Millionaire Timeline</option>
                </optgroup>
                <optgroup label="Real Estate (Additional)">
                    <option value="homeAffordability">Home Affordability</option>
                    <option value="rentVsBuy">Rent vs Buy</option>
                    <option value="propertyAppreciation">Property Appreciation</option>
                </optgroup>
                <optgroup label="Retirement (Additional)">
                    <option value="annuityCorpus">Annuity/Corpus Calculator</option>
                    <option value="retirementIncome">Retirement Income Calculator</option>
                    <option value="inflationCorpus">Inflation-Adjusted Corpus</option>
                </optgroup>
                <optgroup label="Vehicle Finance">
                    <option value="carLoanEmi">Car Loan EMI Calculator</option>
                    <option value="depreciation">Depreciation Calculator</option>
                </optgroup>
                <optgroup label="Insurance">
                    <option value="lifeInsurance">Life Insurance Needs</option>
                    <option value="termInsurance">Term Insurance Premium</option>
                </optgroup>
                <optgroup label="Education Planning">
                    <option value="educationFund">Education Fund Calculator</option>
                    <option value="collegeCost">College Cost Projection</option>
                </optgroup>
                <optgroup label="Income & Earning">
                    <option value="salaryCalculator">Salary Calculator</option>
                    <option value="sideHustleIncome">Side Hustle Income</option>
                    <option value="freelanceRate">Freelance Rate Calculator</option>
                </optgroup>
                <optgroup label="Tracking & Monitoring">
                    <option value="savingsRate">Savings Rate Calculator</option>
                    <option value="goalTracker">Goal Tracker</option>
                    <option value="expenseTracker">Expense Tracker</option>
                </optgroup>
                <optgroup label="Loan Comparisons">
                    <option value="loanComparison">Loan Comparison</option>
                    <option value="paybackPeriod">Payback Period Calculator</option>
                    <option value="earlyPayoff">Early Loan Payoff</option>
                </optgroup>
                <optgroup label="Investment Analysis (Advanced)">
                    <option value="peRatio">P/E Ratio & EPS</option>
                    <option value="dividendGrowth">Dividend Growth Calculator</option>
                    <option value="portfolioRebalancing">Portfolio Rebalancing</option>
                </optgroup>
                <optgroup label="Tax Planning">
                    <option value="taxLossHarvesting">Tax Loss Harvesting</option>
                    <option value="taxBracket">Tax Bracket Calculator</option>
                    <option value="giftTax">Gift/Inheritance Tax</option>
                </optgroup>
                <optgroup label="Business & Freelance">
                    <option value="businessProfit">Business Profit Calculator</option>
                    <option value="markupMargin">Markup vs Margin</option>
                </optgroup>
                <optgroup label="Lifestyle & Planning">
                    <option value="expenseInflation">Expense Inflation Calculator</option>
                    <option value="weddingBudget">Wedding Budget Planner</option>
                    <option value="vacationBudget">Vacation Budget Planner</option>
                </optgroup>
                <optgroup label="Crypto & Modern Investing">
                    <option value="cryptoROI">Crypto Investment ROI</option>
                    <option value="cryptoDCA">Crypto DCA Calculator</option>
                </optgroup>
                <optgroup label="Advanced Financial">
                    <option value="bondYield">Bond Yield Calculator</option>
                    <option value="npv">Net Present Value (NPV)</option>
                    <option value="irr">Internal Rate of Return (IRR)</option>
                </optgroup>
                <optgroup label="Comparison Tools">
                    <option value="leaseVsBuy">Lease vs Buy Calculator</option>
                    <option value="costOfLiving">Cost of Living Adjuster</option>
                </optgroup>
                <optgroup label="Real Estate">
                    <option value="rentalYield">Rental Yield Calculator</option>
                </optgroup>
            </select>

            <!-- AVERAGE STOCK PRICE CALCULATOR -->
            <div id="avgStock-${id}" class="calculator-section">
                <div class="section-header">
                    <h3>Average Stock Price</h3>
                    <span class="tooltip-icon" onclick="toggleTooltip(event, 'avgStock-tooltip-${id}')">ℹ️</span>
                </div>
                <div class="tooltip-box" id="avgStock-tooltip-${id}">
                    <button class="tooltip-close" onclick="closeTooltip(event)">×</button>
                    <p class="tooltip-description">Calculate the new average price when buying additional stocks at a different price. Useful for portfolio management and understanding your cost basis.</p>
                    <h4>Formula</h4>
                    <p class="formula">New Avg = ((Old Avg × Old Qty) + (New Price × New Qty)) / (Old Qty + New Qty)</p>
                    <h4>Example</h4>
                    <p><strong>Input:</strong> Old Avg: 100, Old Qty: 50, New Price: 120, New Qty: 30</p>
                    <p><strong>Calculation:</strong> ((100 × 50) + (120 × 30)) / (50 + 30) = (5000 + 3600) / 80 = <strong>107.50</strong></p>
                </div>
                <div class="input-group">
                    <label for="oldAvgPrice-${id}">Old Average Stock Price</label>
                    <input type="number" id="oldAvgPrice-${id}" placeholder="Old Average Stock Price" step="0.01" oninput="calcAvgStock(${id})" onkeypress="handleEnter(event)">
                    <label for="oldQty-${id}">Quantity of Old Stock</label>
                    <input type="number" id="oldQty-${id}" placeholder="Quantity of Old Stock" oninput="calcAvgStock(${id})" onkeypress="handleEnter(event)">
                    <label for="newPrice-${id}">Price of New Stock</label>
                    <input type="number" id="newPrice-${id}" placeholder="Price of New Stock" step="0.01" oninput="calcAvgStock(${id})" onkeypress="handleEnter(event)">
                    <label for="newQty-${id}">Quantity to Buy</label>
                    <input type="number" id="newQty-${id}" placeholder="Quantity to Buy" oninput="calcAvgStock(${id})" onkeypress="handleEnter(event)">
                </div>
                <div class="result">New Average Price: <span id="rAvgStock-${id}">0</span></div>
            </div>

            <!-- REQUIRED QUANTITY & PRICE CALCULATOR -->
            <div id="requiredQty-${id}" class="calculator-section" hidden>
                <div class="section-header">
                    <h3>Required Quantity & Price</h3>
                    <span class="tooltip-icon" onclick="toggleTooltip(event, 'requiredQty-tooltip-${id}')">ℹ️</span>
                </div>
                <div class="tooltip-box" id="requiredQty-tooltip-${id}">
                    <button class="tooltip-close" onclick="closeTooltip(event)">×</button>
                    <p class="tooltip-description">Find how many shares to buy at a new price to reach your target average cost. Helps you plan strategic purchases to optimize your cost basis.</p>
                    <h4>Formula</h4>
                    <p class="formula">Required Qty = (Old Qty × (Target Avg - Old Avg)) / (New Price - Target Avg)</p>
                    <p class="formula">Total Price = Required Qty × New Price</p>
                    <h4>Example</h4>
                    <p><strong>Input:</strong> Target: 105, Old Qty: 100, Old Avg: 100, New Price: 110</p>
                    <p><strong>Calculation:</strong> (100 × (105 - 100)) / (110 - 105) = (100 × 5) / 5 = <strong>100</strong> units</p>
                    <p>Total Price = 100 × 110 = <strong>11,000</strong></p>
                </div>
                <div class="input-group">
                    <label for="targetAvgPrice-${id}">Target Average Stock Price</label>
                    <input type="number" id="targetAvgPrice-${id}" placeholder="Target Average Stock Price" step="0.01" oninput="calcRequiredQty(${id})" onkeypress="handleEnter(event)">
                    <label for="oldQtyReq-${id}">Old Quantity</label>
                    <input type="number" id="oldQtyReq-${id}" placeholder="Old Quantity" oninput="calcRequiredQty(${id})" onkeypress="handleEnter(event)">
                    <label for="oldAvgPriceReq-${id}">Old Average Price</label>
                    <input type="number" id="oldAvgPriceReq-${id}" placeholder="Old Average Price" step="0.01" oninput="calcRequiredQty(${id})" onkeypress="handleEnter(event)">
                    <label for="newPriceReq-${id}">New Purchase Price</label>
                    <input type="number" id="newPriceReq-${id}" placeholder="New Purchase Price" step="0.01" oninput="calcRequiredQty(${id})" onkeypress="handleEnter(event)">
                </div>
                <div class="result-group">
                    <div class="result">Required Quantity: <span id="rRequiredQty-${id}">0</span></div>
                    <div class="result">Total Price: <span id="rTotalPrice-${id}">0</span></div>
                </div>
            </div>

            <!-- SIP CALCULATOR -->
            <div id="sip-${id}" class="calculator-section" hidden>
                <div class="section-header">
                    <h3>SIP Calculator</h3>
                    <span class="tooltip-icon" onclick="toggleTooltip(event, 'sip-tooltip-${id}')">ℹ️</span>
                </div>
                <div class="tooltip-box" id="sip-tooltip-${id}">
                    <button class="tooltip-close" onclick="closeTooltip(event)">×</button>
                    <p class="tooltip-description">Project your investment growth with regular monthly contributions combined with an initial amount. Perfect for retirement planning, mutual fund investments, and building long-term wealth.</p>
                    <h4>Formula</h4>
                    <p class="formula">FV = PV(1 + r)^n + PMT × [((1 + r)^n - 1) / r]</p>
                    <p style="font-size: 12px; margin-top: 8px;">Where: PV = Initial Corpus, PMT = Monthly SIP, r = Monthly Rate, n = Total Months</p>
                    <p class="formula">Total Invested = PV + (PMT × months)</p>
                    <p class="formula">Gains = FV - Total Invested</p>
                    <h4>Example</h4>
                    <p><strong>Input:</strong> Corpus: ₹100,000, Monthly SIP: ₹5,000, Annual Return: 12%, Years: 10</p>
                    <p><strong>Calculation:</strong> Monthly rate = 12% / 12 = 1%, Total months = 120</p>
                    <p>FV ≈ ₹1,004,000 | Total Invested = ₹700,000 | Gains ≈ ₹304,000</p>
                </div>
                <div class="input-group">
                    <label for="currentCorpus-${id}">Current Corpus</label>
                    <input type="number" id="currentCorpus-${id}" placeholder="Initial Investment" step="0.01" oninput="calcSIP(${id})" onkeypress="handleEnter(event)">
                    <label for="monthlySIP-${id}">Monthly SIP Amount</label>
                    <input type="number" id="monthlySIP-${id}" placeholder="Monthly Investment" step="0.01" oninput="calcSIP(${id})" onkeypress="handleEnter(event)">
                    <label for="annualReturn-${id}">Expected Annual Return %</label>
                    <input type="number" id="annualReturn-${id}" placeholder="Annual Growth %" step="0.01" oninput="calcSIP(${id})" onkeypress="handleEnter(event)">
                    <label for="sipYears-${id}">Investment Period (Years)</label>
                    <input type="number" id="sipYears-${id}" placeholder="Number of Years" step="0.1" oninput="calcSIP(${id})" onkeypress="handleEnter(event)">
                </div>
                <div class="result-group">
                    <div class="result">Total Invested: <span id="rTotalInvested-${id}">0</span></div>
                    <div class="result">Future Value: <span id="rFutureValue-${id}">0</span></div>
                    <div class="result">Gains: <span id="rGains-${id}">0</span></div>
                </div>
            </div>

            <!-- FIRE NUMBER CALCULATOR -->
            <div id="fireNumber-${id}" class="calculator-section" hidden>
                <div class="section-header">
                    <h3>FIRE Number Calculator</h3>
                    <span class="tooltip-icon" onclick="toggleTooltip(event, 'fireNumber-tooltip-${id}')">ℹ️</span>
                </div>
                <div class="tooltip-box" id="fireNumber-tooltip-${id}">
                    <button class="tooltip-close" onclick="closeTooltip(event)">×</button>
                    <p class="tooltip-description">Calculate how much money you need to retire comfortably using the 4% rule. This is the total corpus required to live off investment returns indefinitely.</p>
                    <h4>Formula</h4>
                    <p class="formula">FIRE Number = Annual Expenses / (Withdrawal Rate / 100)</p>
                    <p class="formula">Annual Expenses = Annual Income - Annual Savings</p>
                    <h4>Example</h4>
                    <p><strong>Input:</strong> Annual Income: ₹1,000,000, Annual Savings: ₹400,000, Withdrawal Rate: 4%</p>
                    <p><strong>Calculation:</strong> Annual Expenses = 1,000,000 - 400,000 = 600,000</p>
                    <p>FIRE Number = 600,000 / (4/100) = <strong>₹15,000,000</strong></p>
                </div>
                <div class="input-group">
                    <label for="fireIncome-${id}">Annual Income</label>
                    <input type="number" id="fireIncome-${id}" placeholder="Annual Income" step="0.01" oninput="calcFireNumber(${id})" onkeypress="handleEnter(event)">
                    <label for="fireSavings-${id}">Annual Savings</label>
                    <input type="number" id="fireSavings-${id}" placeholder="Annual Savings" step="0.01" oninput="calcFireNumber(${id})" onkeypress="handleEnter(event)">
                    <label for="fireWithdrawal-${id}">Withdrawal Rate (%)</label>
                    <input type="number" id="fireWithdrawal-${id}" placeholder="Withdrawal Rate %" value="4" step="0.01" oninput="calcFireNumber(${id})" onkeypress="handleEnter(event)">
                </div>
                <div class="result-group">
                    <div class="result">Annual Expenses: <span id="rFireExpenses-${id}">0</span></div>
                    <div class="result">FIRE Number: <span id="rFireNumber-${id}">0</span></div>
                </div>
            </div>

            <!-- YEARS TO FIRE CALCULATOR -->
            <div id="yearsToFire-${id}" class="calculator-section" hidden>
                <div class="section-header">
                    <h3>Years to FIRE Calculator</h3>
                    <span class="tooltip-icon" onclick="toggleTooltip(event, 'yearsToFire-tooltip-${id}')">ℹ️</span>
                </div>
                <div class="tooltip-box" id="yearsToFire-tooltip-${id}">
                    <button class="tooltip-close" onclick="closeTooltip(event)">×</button>
                    <p class="tooltip-description">Calculate how many years until you can retire based on your current savings, annual contributions, and expected returns.</p>
                    <h4>Formula</h4>
                    <p class="formula">Years to FIRE: Using FV of Annuity formula to reach target FIRE Number</p>
                    <h4>Example</h4>
                    <p><strong>Input:</strong> Current Savings: ₹1,000,000, Annual Contribution: ₹500,000, FIRE Target: ₹15,000,000, Return: 10%</p>
                    <p><strong>Result:</strong> Approximately <strong>16.3 years</strong> to achieve FIRE</p>
                </div>
                <div class="input-group">
                    <label for="ytfCurrent-${id}">Current Savings</label>
                    <input type="number" id="ytfCurrent-${id}" placeholder="Current Savings" step="0.01" oninput="calcYearsToFire(${id})" onkeypress="handleEnter(event)">
                    <label for="ytfAnnual-${id}">Annual Contribution</label>
                    <input type="number" id="ytfAnnual-${id}" placeholder="Annual Contribution" step="0.01" oninput="calcYearsToFire(${id})" onkeypress="handleEnter(event)">
                    <label for="ytfTarget-${id}">FIRE Target Amount</label>
                    <input type="number" id="ytfTarget-${id}" placeholder="FIRE Target" step="0.01" oninput="calcYearsToFire(${id})" onkeypress="handleEnter(event)">
                    <label for="ytfReturn-${id}">Expected Annual Return (%)</label>
                    <input type="number" id="ytfReturn-${id}" placeholder="Annual Return %" value="10" step="0.01" oninput="calcYearsToFire(${id})" onkeypress="handleEnter(event)">
                </div>
                <div class="result">Years to FIRE: <span id="rYearsToFire-${id}">0</span></div>
            </div>

            <!-- FATFIRE CALCULATOR -->
            <div id="fatFire-${id}" class="calculator-section" hidden>
                <div class="section-header">
                    <h3>FatFIRE Calculator</h3>
                    <span class="tooltip-icon" onclick="toggleTooltip(event, 'fatFire-tooltip-${id}')">ℹ️</span>
                </div>
                <div class="tooltip-box" id="fatFire-tooltip-${id}">
                    <button class="tooltip-close" onclick="closeTooltip(event)">×</button>
                    <p class="tooltip-description">Calculate FIRE numbers for a luxurious lifestyle with higher annual expenses. Perfect for those who want to retire early without cutting back on spending.</p>
                    <h4>Formula</h4>
                    <p class="formula">FatFIRE Number = Desired Annual Expenses / (Withdrawal Rate / 100)</p>
                    <h4>Example</h4>
                    <p><strong>Input:</strong> Desired Annual Expenses: ₹1,000,000, Withdrawal Rate: 4%</p>
                    <p><strong>Calculation:</strong> FatFIRE Number = 1,000,000 / 0.04 = <strong>₹25,000,000</strong></p>
                </div>
                <div class="input-group">
                    <label for="ffExpenses-${id}">Desired Annual Expenses</label>
                    <input type="number" id="ffExpenses-${id}" placeholder="Annual Expenses (Luxurious)" step="0.01" oninput="calcFatFire(${id})" onkeypress="handleEnter(event)">
                    <label for="ffWithdrawal-${id}">Withdrawal Rate (%)</label>
                    <input type="number" id="ffWithdrawal-${id}" placeholder="Withdrawal Rate %" value="4" step="0.01" oninput="calcFatFire(${id})" onkeypress="handleEnter(event)">
                </div>
                <div class="result">FatFIRE Number: <span id="rFatFire-${id}">0</span></div>
            </div>

            <!-- DIVIDEND CALCULATOR -->
            <div id="dividend-${id}" class="calculator-section" hidden>
                <div class="section-header">
                    <h3>Dividend Calculator</h3>
                    <span class="tooltip-icon" onclick="toggleTooltip(event, 'dividend-tooltip-${id}')">ℹ️</span>
                </div>
                <div class="tooltip-box" id="dividend-tooltip-${id}">
                    <button class="tooltip-close" onclick="closeTooltip(event)">×</button>
                    <p class="tooltip-description">Calculate annual dividend income and dividend yield on your investment.</p>
                    <h4>Formula</h4>
                    <p class="formula">Annual Dividend = Shares × Dividend per Share</p>
                    <p class="formula">Dividend Yield = (Annual Dividend / Investment) × 100</p>
                    <h4>Example</h4>
                    <p><strong>Input:</strong> Shares: 100, Dividend/Share: ₹50, Current Price: ₹1000</p>
                    <p><strong>Result:</strong> Annual Dividend: ₹5000 | Yield: 5%</p>
                </div>
                <div class="input-group">
                    <label for="divShares-${id}">Number of Shares</label>
                    <input type="number" id="divShares-${id}" placeholder="Number of Shares" step="1" oninput="calcDividend(${id})" onkeypress="handleEnter(event)">
                    <label for="divPerShare-${id}">Dividend per Share (₹)</label>
                    <input type="number" id="divPerShare-${id}" placeholder="Dividend per Share" step="0.01" oninput="calcDividend(${id})" onkeypress="handleEnter(event)">
                    <label for="divCurrentPrice-${id}">Current Share Price (₹)</label>
                    <input type="number" id="divCurrentPrice-${id}" placeholder="Current Share Price" step="0.01" oninput="calcDividend(${id})" onkeypress="handleEnter(event)">
                </div>
                <div class="result-group">
                    <div class="result">Annual Dividend: <span id="rDividend-${id}">0</span></div>
                    <div class="result">Dividend Yield: <span id="rDividendYield-${id}">0</span>%</div>
                </div>
            </div>

            <!-- BREAKEVEN CALCULATOR -->
            <div id="breakeven-${id}" class="calculator-section" hidden>
                <div class="section-header">
                    <h3>Breakeven Point</h3>
                    <span class="tooltip-icon" onclick="toggleTooltip(event, 'breakeven-tooltip-${id}')">ℹ️</span>
                </div>
                <div class="tooltip-box" id="breakeven-tooltip-${id}">
                    <button class="tooltip-close" onclick="closeTooltip(event)">×</button>
                    <p class="tooltip-description">Find the breakeven price for your stock investment - the price needed to recover your investment.</p>
                    <h4>Formula</h4>
                    <p class="formula">Breakeven Price = Average Cost per Share + (Brokerage / Total Shares)</p>
                    <h4>Example</h4>
                    <p><strong>Input:</strong> Total Investment: ₹100,000, Shares Bought: 100, Brokerage: ₹500</p>
                    <p><strong>Result:</strong> Breakeven: ₹1005</p>
                </div>
                <div class="input-group">
                    <label for="beInvestment-${id}">Total Investment (₹)</label>
                    <input type="number" id="beInvestment-${id}" placeholder="Total Investment" step="0.01" oninput="calcBreakeven(${id})" onkeypress="handleEnter(event)">
                    <label for="beShares-${id}">Total Shares Bought</label>
                    <input type="number" id="beShares-${id}" placeholder="Total Shares" step="1" oninput="calcBreakeven(${id})" onkeypress="handleEnter(event)">
                    <label for="beBrokerage-${id}">Brokerage/Commission (₹)</label>
                    <input type="number" id="beBrokerage-${id}" placeholder="Brokerage" step="0.01" oninput="calcBreakeven(${id})" onkeypress="handleEnter(event)">
                </div>
                <div class="result">Breakeven Price: <span id="rBreakeven-${id}">0</span></div>
            </div>

            <!-- COMPOUND INTEREST CALCULATOR -->
            <div id="compound-${id}" class="calculator-section" hidden>
                <div class="section-header">
                    <h3>Compound Interest</h3>
                    <span class="tooltip-icon" onclick="toggleTooltip(event, 'compound-tooltip-${id}')">ℹ️</span>
                </div>
                <div class="tooltip-box" id="compound-tooltip-${id}">
                    <button class="tooltip-close" onclick="closeTooltip(event)">×</button>
                    <p class="tooltip-description">Calculate compound interest on your principal amount.</p>
                    <h4>Formula</h4>
                    <p class="formula">A = P(1 + r/100)^n</p>
                    <h4>Example</h4>
                    <p><strong>Input:</strong> Principal: ₹100,000, Rate: 10%, Years: 5</p>
                    <p><strong>Result:</strong> Amount: ₹161,051 | Interest: ₹61,051</p>
                </div>
                <div class="input-group">
                    <label for="cpPrincipal-${id}">Principal Amount (₹)</label>
                    <input type="number" id="cpPrincipal-${id}" placeholder="Principal" step="0.01" oninput="calcCompound(${id})" onkeypress="handleEnter(event)">
                    <label for="cpRate-${id}">Annual Rate (%)</label>
                    <input type="number" id="cpRate-${id}" placeholder="Annual Rate" step="0.01" oninput="calcCompound(${id})" onkeypress="handleEnter(event)">
                    <label for="cpYears-${id}">Time Period (Years)</label>
                    <input type="number" id="cpYears-${id}" placeholder="Years" step="0.1" oninput="calcCompound(${id})" onkeypress="handleEnter(event)">
                </div>
                <div class="result-group">
                    <div class="result">Total Amount: <span id="rCompoundAmount-${id}">0</span></div>
                    <div class="result">Interest Earned: <span id="rCompoundInterest-${id}">0</span></div>
                </div>
            </div>

            <!-- INVESTMENT GOAL CALCULATOR -->
            <div id="investmentGoal-${id}" class="calculator-section" hidden>
                <div class="section-header">
                    <h3>Investment Goal</h3>
                    <span class="tooltip-icon" onclick="toggleTooltip(event, 'investmentGoal-tooltip-${id}')">ℹ️</span>
                </div>
                <div class="tooltip-box" id="investmentGoal-tooltip-${id}">
                    <button class="tooltip-close" onclick="closeTooltip(event)">×</button>
                    <p class="tooltip-description">Calculate how much you need to invest monthly to reach your target goal.</p>
                    <h4>Formula</h4>
                    <p class="formula">EMI = FV / [((1 + r)^n - 1) / r]</p>
                    <h4>Example</h4>
                    <p><strong>Input:</strong> Target: ₹1,000,000, Years: 10, Return: 12%</p>
                    <p><strong>Result:</strong> Monthly Investment: ₹5,288</p>
                </div>
                <div class="input-group">
                    <label for="igTarget-${id}">Target Amount (₹)</label>
                    <input type="number" id="igTarget-${id}" placeholder="Target Amount" step="0.01" oninput="calcInvestmentGoal(${id})" onkeypress="handleEnter(event)">
                    <label for="igYears-${id}">Time Period (Years)</label>
                    <input type="number" id="igYears-${id}" placeholder="Years" step="0.1" oninput="calcInvestmentGoal(${id})" onkeypress="handleEnter(event)">
                    <label for="igReturn-${id}">Expected Annual Return (%)</label>
                    <input type="number" id="igReturn-${id}" placeholder="Annual Return" value="12" step="0.01" oninput="calcInvestmentGoal(${id})" onkeypress="handleEnter(event)">
                </div>
                <div class="result">Monthly Investment Needed: <span id="rInvestmentGoal-${id}">0</span></div>
            </div>

            <!-- COST OF DELAY CALCULATOR -->
            <div id="costOfDelay-${id}" class="calculator-section" hidden>
                <div class="section-header">
                    <h3>Cost of Delay</h3>
                    <span class="tooltip-icon" onclick="toggleTooltip(event, 'costOfDelay-tooltip-${id}')">ℹ️</span>
                </div>
                <div class="tooltip-box" id="costOfDelay-tooltip-${id}">
                    <button class="tooltip-close" onclick="closeTooltip(event)">×</button>
                    <p class="tooltip-description">See how delaying investments costs you in lost returns.</p>
                    <h4>Formula</h4>
                    <p class="formula">Cost = Amount × [(1 + r)^delay_years - 1]</p>
                    <h4>Example</h4>
                    <p><strong>Input:</strong> Amount: ₹500,000, Return: 10%, Delay: 5 years</p>
                    <p><strong>Result:</strong> Lost Growth: ₹305,256</p>
                </div>
                <div class="input-group">
                    <label for="codAmount-${id}">Investment Amount (₹)</label>
                    <input type="number" id="codAmount-${id}" placeholder="Investment Amount" step="0.01" oninput="calcCostOfDelay(${id})" onkeypress="handleEnter(event)">
                    <label for="codReturn-${id}">Expected Annual Return (%)</label>
                    <input type="number" id="codReturn-${id}" placeholder="Annual Return" value="10" step="0.01" oninput="calcCostOfDelay(${id})" onkeypress="handleEnter(event)">
                    <label for="codDelay-${id}">Delay (Years)</label>
                    <input type="number" id="codDelay-${id}" placeholder="Delay in Years" step="0.1" oninput="calcCostOfDelay(${id})" onkeypress="handleEnter(event)">
                </div>
                <div class="result">Cost of Delay (Lost Growth): <span id="rCostOfDelay-${id}">0</span></div>
            </div>

            <!-- RETIREMENT AGE CALCULATOR -->
            <div id="retirementAge-${id}" class="calculator-section" hidden>
                <div class="section-header">
                    <h3>Retirement Age</h3>
                    <span class="tooltip-icon" onclick="toggleTooltip(event, 'retirementAge-tooltip-${id}')">ℹ️</span>
                </div>
                <div class="tooltip-box" id="retirementAge-tooltip-${id}">
                    <button class="tooltip-close" onclick="closeTooltip(event)">×</button>
                    <p class="tooltip-description">Find your retirement age based on current savings rate and goals.</p>
                    <h4>Formula</h4>
                    <p class="formula">Retirement Age = Current Age + Years to reach goal</p>
                    <h4>Example</h4>
                    <p><strong>Input:</strong> Current Age: 30, Current Savings: ₹1,000,000, Annual Savings: ₹500,000, FIRE Goal: ₹15,000,000, Return: 10%</p>
                    <p><strong>Result:</strong> Retirement Age: ~46 years</p>
                </div>
                <div class="input-group">
                    <label for="raAge-${id}">Current Age</label>
                    <input type="number" id="raAge-${id}" placeholder="Current Age" step="1" oninput="calcRetirementAge(${id})" onkeypress="handleEnter(event)">
                    <label for="raCurrent-${id}">Current Savings (₹)</label>
                    <input type="number" id="raCurrent-${id}" placeholder="Current Savings" step="0.01" oninput="calcRetirementAge(${id})" onkeypress="handleEnter(event)">
                    <label for="raAnnual-${id}">Annual Savings (₹)</label>
                    <input type="number" id="raAnnual-${id}" placeholder="Annual Savings" step="0.01" oninput="calcRetirementAge(${id})" onkeypress="handleEnter(event)">
                    <label for="raTarget-${id}">FIRE Target (₹)</label>
                    <input type="number" id="raTarget-${id}" placeholder="FIRE Target" step="0.01" oninput="calcRetirementAge(${id})" onkeypress="handleEnter(event)">
                    <label for="raReturn-${id}">Expected Return (%)</label>
                    <input type="number" id="raReturn-${id}" placeholder="Return %" value="10" step="0.01" oninput="calcRetirementAge(${id})" onkeypress="handleEnter(event)">
                </div>
                <div class="result">Retirement Age: <span id="rRetirementAge-${id}">0</span></div>
            </div>

            <!-- LOAN EMI CALCULATOR -->
            <div id="loanEmi-${id}" class="calculator-section" hidden>
                <div class="section-header">
                    <h3>Loan EMI Calculator</h3>
                    <span class="tooltip-icon" onclick="toggleTooltip(event, 'loanEmi-tooltip-${id}')">ℹ️</span>
                </div>
                <div class="tooltip-box" id="loanEmi-tooltip-${id}">
                    <button class="tooltip-close" onclick="closeTooltip(event)">×</button>
                    <p class="tooltip-description">Calculate monthly EMI, total interest payable, and amortization for loans.</p>
                    <h4>Formula</h4>
                    <p class="formula">EMI = P × [r(1+r)^n] / [(1+r)^n - 1]</p>
                    <h4>Example</h4>
                    <p><strong>Input:</strong> Principal: ₹5,000,000, Rate: 7%, Years: 20</p>
                    <p><strong>Result:</strong> EMI: ₹38,635 | Total Interest: ₹4,270,437</p>
                </div>
                <div class="input-group">
                    <label for="loanPrincipal-${id}">Loan Amount (₹)</label>
                    <input type="number" id="loanPrincipal-${id}" placeholder="Loan Amount" step="0.01" oninput="calcLoanEmi(${id})" onkeypress="handleEnter(event)">
                    <label for="loanRate-${id}">Annual Interest Rate (%)</label>
                    <input type="number" id="loanRate-${id}" placeholder="Annual Rate" step="0.01" oninput="calcLoanEmi(${id})" onkeypress="handleEnter(event)">
                    <label for="loanYears-${id}">Loan Period (Years)</label>
                    <input type="number" id="loanYears-${id}" placeholder="Years" step="0.1" oninput="calcLoanEmi(${id})" onkeypress="handleEnter(event)">
                </div>
                <div class="result-group">
                    <div class="result">Monthly EMI: <span id="rLoanEmi-${id}">0</span></div>
                    <div class="result">Total Interest: <span id="rLoanInterest-${id}">0</span></div>
                </div>
            </div>

            <!-- PROPERTY ROI CALCULATOR -->
            <div id="propertyRoi-${id}" class="calculator-section" hidden>
                <div class="section-header">
                    <h3>Property Investment ROI</h3>
                    <span class="tooltip-icon" onclick="toggleTooltip(event, 'propertyRoi-tooltip-${id}')">ℹ️</span>
                </div>
                <div class="tooltip-box" id="propertyRoi-tooltip-${id}">
                    <button class="tooltip-close" onclick="closeTooltip(event)">×</button>
                    <p class="tooltip-description">Calculate rental yield and total ROI from property investment.</p>
                    <h4>Formula</h4>
                    <p class="formula">Rental Yield = (Annual Rent / Property Price) × 100</p>
                    <p class="formula">Total ROI = [(Current Value + Total Rent - Investment) / Investment] × 100</p>
                    <h4>Example</h4>
                    <p><strong>Input:</strong> Investment: ₹5,000,000, Annual Rent: ₹300,000, Current Value: ₹6,000,000</p>
                    <p><strong>Result:</strong> Rental Yield: 6% | ROI: 36%</p>
                </div>
                <div class="input-group">
                    <label for="propInvestment-${id}">Property Investment (₹)</label>
                    <input type="number" id="propInvestment-${id}" placeholder="Investment Amount" step="0.01" oninput="calcPropertyRoi(${id})" onkeypress="handleEnter(event)">
                    <label for="propAnnualRent-${id}">Annual Rental Income (₹)</label>
                    <input type="number" id="propAnnualRent-${id}" placeholder="Annual Rent" step="0.01" oninput="calcPropertyRoi(${id})" onkeypress="handleEnter(event)">
                    <label for="propCurrentValue-${id}">Current Property Value (₹)</label>
                    <input type="number" id="propCurrentValue-${id}" placeholder="Current Value" step="0.01" oninput="calcPropertyRoi(${id})" onkeypress="handleEnter(event)">
                </div>
                <div class="result-group">
                    <div class="result">Rental Yield: <span id="rPropertyYield-${id}">0</span>%</div>
                    <div class="result">Total ROI: <span id="rPropertyRoi-${id}">0</span>%</div>
                </div>
            </div>

            <!-- MORTGAGE CALCULATOR -->
            <div id="mortgageEmi-${id}" class="calculator-section" hidden>
                <div class="section-header">
                    <h3>Mortgage/Home Loan</h3>
                    <span class="tooltip-icon" onclick="toggleTooltip(event, 'mortgageEmi-tooltip-${id}')">ℹ️</span>
                </div>
                <div class="tooltip-box" id="mortgageEmi-tooltip-${id}">
                    <button class="tooltip-close" onclick="closeTooltip(event)">×</button>
                    <p class="tooltip-description">Calculate home loan EMI with principal breakdown.</p>
                    <h4>Formula</h4>
                    <p class="formula">EMI = P × [r(1+r)^n] / [(1+r)^n - 1]</p>
                    <h4>Example</h4>
                    <p><strong>Input:</strong> Property: ₹10,000,000, LTV: 80%, Rate: 6.5%, Years: 20</p>
                    <p><strong>Result:</strong> EMI: ₹41,309 | Total Interest: ₹4,914,229</p>
                </div>
                <div class="input-group">
                    <label for="mortgagePrice-${id}">Property Price (₹)</label>
                    <input type="number" id="mortgagePrice-${id}" placeholder="Property Price" step="0.01" oninput="calcMortgage(${id})" onkeypress="handleEnter(event)">
                    <label for="mortgageLtv-${id}">Loan to Value (%)</label>
                    <input type="number" id="mortgageLtv-${id}" placeholder="LTV %" value="80" step="0.01" oninput="calcMortgage(${id})" onkeypress="handleEnter(event)">
                    <label for="mortgageRate-${id}">Interest Rate (%)</label>
                    <input type="number" id="mortgageRate-${id}" placeholder="Interest Rate" step="0.01" oninput="calcMortgage(${id})" onkeypress="handleEnter(event)">
                    <label for="mortgageYears-${id}">Loan Period (Years)</label>
                    <input type="number" id="mortgageYears-${id}" placeholder="Years" step="0.1" oninput="calcMortgage(${id})" onkeypress="handleEnter(event)">
                </div>
                <div class="result-group">
                    <div class="result">Loan Amount: <span id="rMortgageLoan-${id}">0</span></div>
                    <div class="result">Monthly EMI: <span id="rMortgageEmi-${id}">0</span></div>
                    <div class="result">Total Interest: <span id="rMortgageInterest-${id}">0</span></div>
                </div>
            </div>

            <!-- RULE OF 72 CALCULATOR -->
            <div id="rule72-${id}" class="calculator-section" hidden>
                <div class="section-header">
                    <h3>Rule of 72</h3>
                    <span class="tooltip-icon" onclick="toggleTooltip(event, 'rule72-tooltip-${id}')">ℹ️</span>
                </div>
                <div class="tooltip-box" id="rule72-tooltip-${id}">
                    <button class="tooltip-close" onclick="closeTooltip(event)">×</button>
                    <p class="tooltip-description">Quick way to find how long an investment takes to double.</p>
                    <h4>Formula</h4>
                    <p class="formula">Years to Double = 72 / Annual Return Rate (%)</p>
                    <h4>Example</h4>
                    <p><strong>Input:</strong> Annual Return: 12%</p>
                    <p><strong>Result:</strong> Investment doubles in 6 years</p>
                </div>
                <div class="input-group">
                    <label for="rule72Rate-${id}">Annual Return Rate (%)</label>
                    <input type="number" id="rule72Rate-${id}" placeholder="Annual Return %" step="0.01" oninput="calcRule72(${id})" onkeypress="handleEnter(event)">
                </div>
                <div class="result">Years to Double: <span id="rRule72-${id}">0</span></div>
            </div>

            <!-- INFLATION CALCULATOR -->
            <div id="inflation-${id}" class="calculator-section" hidden>
                <div class="section-header">
                    <h3>Inflation Calculator</h3>
                    <span class="tooltip-icon" onclick="toggleTooltip(event, 'inflation-tooltip-${id}')">ℹ️</span>
                </div>
                <div class="tooltip-box" id="inflation-tooltip-${id}">
                    <button class="tooltip-close" onclick="closeTooltip(event)">×</button>
                    <p class="tooltip-description">Calculate future value of money adjusted for inflation.</p>
                    <h4>Formula</h4>
                    <p class="formula">Future Value = Present Value / (1 + Inflation Rate)^Years</p>
                    <h4>Example</h4>
                    <p><strong>Input:</strong> Today's Value: ₹100,000, Inflation: 6%, Years: 10</p>
                    <p><strong>Result:</strong> Future Equivalent: ₹55,839</p>
                </div>
                <div class="input-group">
                    <label for="inflationAmount-${id}">Amount Today (₹)</label>
                    <input type="number" id="inflationAmount-${id}" placeholder="Amount Today" step="0.01" oninput="calcInflation(${id})" onkeypress="handleEnter(event)">
                    <label for="inflationRate-${id}">Annual Inflation Rate (%)</label>
                    <input type="number" id="inflationRate-${id}" placeholder="Inflation Rate %" value="6" step="0.01" oninput="calcInflation(${id})" onkeypress="handleEnter(event)">
                    <label for="inflationYears-${id}">Time Period (Years)</label>
                    <input type="number" id="inflationYears-${id}" placeholder="Years" step="0.1" oninput="calcInflation(${id})" onkeypress="handleEnter(event)">
                </div>
                <div class="result">Purchasing Power (Future Value): <span id="rInflation-${id}">0</span></div>
            </div>

            <!-- EXPENSE RATIO CALCULATOR -->
            <div id="expenseRatio-${id}" class="calculator-section" hidden>
                <div class="section-header">
                    <h3>Expense Ratio Calculator</h3>
                    <span class="tooltip-icon" onclick="toggleTooltip(event, 'expenseRatio-tooltip-${id}')">ℹ️</span>
                </div>
                <div class="tooltip-box" id="expenseRatio-tooltip-${id}">
                    <button class="tooltip-close" onclick="closeTooltip(event)">×</button>
                    <p class="tooltip-description">Calculate annual fees charged by mutual funds and their impact on returns.</p>
                    <h4>Formula</h4>
                    <p class="formula">Annual Fee = Fund Value × (Expense Ratio / 100)</p>
                    <p class="formula">Net Return = Gross Return - Expense Ratio</p>
                    <h4>Example</h4>
                    <p><strong>Input:</strong> Fund Value: ₹1,000,000, Expense Ratio: 0.5%, Gross Return: 12%</p>
                    <p><strong>Result:</strong> Annual Fee: ₹5,000 | Net Return: 11.5%</p>
                </div>
                <div class="input-group">
                    <label for="erFundValue-${id}">Fund Value (₹)</label>
                    <input type="number" id="erFundValue-${id}" placeholder="Fund Value" step="0.01" oninput="calcExpenseRatio(${id})" onkeypress="handleEnter(event)">
                    <label for="erExpenseRatio-${id}">Expense Ratio (%)</label>
                    <input type="number" id="erExpenseRatio-${id}" placeholder="Expense Ratio %" step="0.01" oninput="calcExpenseRatio(${id})" onkeypress="handleEnter(event)">
                    <label for="erGrossReturn-${id}">Gross Annual Return (%)</label>
                    <input type="number" id="erGrossReturn-${id}" placeholder="Gross Return %" step="0.01" oninput="calcExpenseRatio(${id})" onkeypress="handleEnter(event)">
                </div>
                <div class="result-group">
                    <div class="result">Annual Fee: <span id="rExpenseRatioFee-${id}">0</span></div>
                    <div class="result">Net Return: <span id="rExpenseRatioNet-${id}">0</span>%</div>
                </div>
            </div>

            <!-- EMERGENCY FUND CALCULATOR -->
            <div id="emergencyFund-${id}" class="calculator-section" hidden>
                <div class="section-header">
                    <h3>Emergency Fund Calculator</h3>
                    <span class="tooltip-icon" onclick="toggleTooltip(event, 'emergencyFund-tooltip-${id}')">ℹ️</span>
                </div>
                <div class="tooltip-box" id="emergencyFund-tooltip-${id}">
                    <button class="tooltip-close" onclick="closeTooltip(event)">×</button>
                    <p class="tooltip-description">Calculate emergency fund needed for 3-12 months of expenses.</p>
                    <h4>Formula</h4>
                    <p class="formula">Emergency Fund = Monthly Expenses × Number of Months</p>
                    <h4>Example</h4>
                    <p><strong>Input:</strong> Monthly Expenses: ₹50,000, Months: 6</p>
                    <p><strong>Result:</strong> Emergency Fund Needed: ₹3,00,000</p>
                </div>
                <div class="input-group">
                    <label for="efExpenses-${id}">Monthly Expenses (₹)</label>
                    <input type="number" id="efExpenses-${id}" placeholder="Monthly Expenses" step="0.01" oninput="calcEmergencyFund(${id})" onkeypress="handleEnter(event)">
                    <label for="efMonths-${id}">Number of Months</label>
                    <input type="number" id="efMonths-${id}" placeholder="Months" value="6" step="0.5" oninput="calcEmergencyFund(${id})" onkeypress="handleEnter(event)">
                </div>
                <div class="result-group">
                    <div class="result">Emergency Fund Needed: <span id="rEmergencyFund-${id}">0</span></div>
                </div>
            </div>

            <!-- MONTHLY SAVINGS CALCULATOR -->
            <div id="monthlySavings-${id}" class="calculator-section" hidden>
                <div class="section-header">
                    <h3>Monthly Savings Calculator</h3>
                    <span class="tooltip-icon" onclick="toggleTooltip(event, 'monthlySavings-tooltip-${id}')">ℹ️</span>
                </div>
                <div class="tooltip-box" id="monthlySavings-tooltip-${id}">
                    <button class="tooltip-close" onclick="closeTooltip(event)">×</button>
                    <p class="tooltip-description">Calculate monthly savings needed to reach a financial goal.</p>
                    <h4>Formula</h4>
                    <p class="formula">Monthly Savings = Target / (((1+r)^n - 1) / r)</p>
                    <h4>Example</h4>
                    <p><strong>Input:</strong> Target: ₹10,00,000, Rate: 10%, Years: 10</p>
                    <p><strong>Result:</strong> Monthly Savings: ₹6,274</p>
                </div>
                <div class="input-group">
                    <label for="msTarget-${id}">Target Amount (₹)</label>
                    <input type="number" id="msTarget-${id}" placeholder="Target Amount" step="0.01" oninput="calcMonthlySavings(${id})" onkeypress="handleEnter(event)">
                    <label for="msRate-${id}">Annual Return Rate (%)</label>
                    <input type="number" id="msRate-${id}" placeholder="Return Rate %" value="10" step="0.01" oninput="calcMonthlySavings(${id})" onkeypress="handleEnter(event)">
                    <label for="msYears-${id}">Time Period (Years)</label>
                    <input type="number" id="msYears-${id}" placeholder="Years" value="10" step="0.5" oninput="calcMonthlySavings(${id})" onkeypress="handleEnter(event)">
                </div>
                <div class="result-group">
                    <div class="result">Monthly Savings: <span id="rMonthlySavings-${id}">0</span></div>
                </div>
            </div>

            <!-- BUDGET ALLOCATOR -->
            <div id="budgetAllocator-${id}" class="calculator-section" hidden>
                <div class="section-header">
                    <h3>Budget Allocator</h3>
                    <span class="tooltip-icon" onclick="toggleTooltip(event, 'budgetAllocator-tooltip-${id}')">ℹ️</span>
                </div>
                <div class="tooltip-box" id="budgetAllocator-tooltip-${id}">
                    <button class="tooltip-close" onclick="closeTooltip(event)">×</button>
                    <p class="tooltip-description">Allocate income with custom percentages for Needs, Wants, and Savings.</p>
                    <h4>Formula</h4>
                    <p class="formula">Amount = Monthly Income × (Percentage / 100)</p>
                    <h4>Example</h4>
                    <p><strong>Input:</strong> Monthly Income: ₹1,00,000, Needs: 50%, Wants: 30%, Savings: 20%</p>
                    <p><strong>Result:</strong> Needs: ₹50,000 | Wants: ₹30,000 | Savings: ₹20,000</p>
                </div>
                <div class="input-group">
                    <label for="baIncome-${id}">Monthly Income (₹)</label>
                    <input type="number" id="baIncome-${id}" placeholder="Monthly Income" step="0.01" oninput="calcBudgetAllocator(${id})" onkeypress="handleEnter(event)">
                    <label for="baNeedsPercent-${id}">Needs (%)</label>
                    <input type="number" id="baNeedsPercent-${id}" placeholder="Needs %" value="50" min="0" max="100" step="0.1" oninput="calcBudgetAllocator(${id})" onkeypress="handleEnter(event)">
                    <label for="baWantsPercent-${id}">Wants (%)</label>
                    <input type="number" id="baWantsPercent-${id}" placeholder="Wants %" value="30" min="0" max="100" step="0.1" oninput="calcBudgetAllocator(${id})" onkeypress="handleEnter(event)">
                    <label for="baSavingsPercent-${id}">Savings (%)</label>
                    <input type="number" id="baSavingsPercent-${id}" placeholder="Savings %" value="20" min="0" max="100" step="0.1" oninput="calcBudgetAllocator(${id})" onkeypress="handleEnter(event)">
                </div>
                <div class="result-group">
                    <div class="result" style="display: flex; justify-content: space-between; gap: 10px;">
                        <span>Total Allocation: <span id="rBudgetTotal-${id}" style="font-weight: 600; color: var(--accent-primary);">0</span>%</span>
                    </div>
                    <div class="result">Needs: <span id="rBudgetNeeds-${id}">0</span></div>
                    <div class="result">Wants: <span id="rBudgetWants-${id}">0</span></div>
                    <div class="result">Savings: <span id="rBudgetSavings-${id}">0</span></div>
                </div>
            </div>

            <!-- DEBT PAYOFF CALCULATOR -->
            <div id="debtPayoff-${id}" class="calculator-section" hidden>
                <div class="section-header">
                    <h3>Debt Payoff Calculator</h3>
                    <span class="tooltip-icon" onclick="toggleTooltip(event, 'debtPayoff-tooltip-${id}')">ℹ️</span>
                </div>
                <div class="tooltip-box" id="debtPayoff-tooltip-${id}">
                    <button class="tooltip-close" onclick="closeTooltip(event)">×</button>
                    <p class="tooltip-description">Calculate time and total amount to pay off debt with fixed payments.</p>
                    <h4>Formula</h4>
                    <p class="formula">Months = log(Payment / (Payment - Principal × Rate/12)) / log(1 + Rate/12)</p>
                    <h4>Example</h4>
                    <p><strong>Input:</strong> Debt: ₹2,00,000, Monthly Payment: ₹10,000, Rate: 12%</p>
                    <p><strong>Result:</strong> Months: 22 | Total Paid: ₹2,20,000</p>
                </div>
                <div class="input-group">
                    <label for="dpDebt-${id}">Total Debt (₹)</label>
                    <input type="number" id="dpDebt-${id}" placeholder="Total Debt" step="0.01" oninput="calcDebtPayoff(${id})" onkeypress="handleEnter(event)">
                    <label for="dpPayment-${id}">Monthly Payment (₹)</label>
                    <input type="number" id="dpPayment-${id}" placeholder="Monthly Payment" step="0.01" oninput="calcDebtPayoff(${id})" onkeypress="handleEnter(event)">
                    <label for="dpRate-${id}">Annual Interest Rate (%)</label>
                    <input type="number" id="dpRate-${id}" placeholder="Interest Rate %" value="12" step="0.01" oninput="calcDebtPayoff(${id})" onkeypress="handleEnter(event)">
                </div>
                <div class="result-group">
                    <div class="result">Months to Payoff: <span id="rDebtPayoffMonths-${id}">0</span></div>
                    <div class="result">Total Amount Paid: <span id="rDebtPayoffTotal-${id}">0</span></div>
                </div>
            </div>

            <!-- CREDIT CARD PAYOFF CALCULATOR -->
            <div id="creditCardPayoff-${id}" class="calculator-section" hidden>
                <div class="section-header">
                    <h3>Credit Card Payoff Calculator</h3>
                    <span class="tooltip-icon" onclick="toggleTooltip(event, 'creditCardPayoff-tooltip-${id}')">ℹ️</span>
                </div>
                <div class="tooltip-box" id="creditCardPayoff-tooltip-${id}">
                    <button class="tooltip-close" onclick="closeTooltip(event)">×</button>
                    <p class="tooltip-description">Calculate how long to pay off credit card debt with interest accrual.</p>
                    <h4>Formula</h4>
                    <p class="formula">Balance = Balance × (1 + Monthly Rate) - Monthly Payment</p>
                    <h4>Example</h4>
                    <p><strong>Input:</strong> Balance: ₹1,00,000, Payment: ₹5,000, Rate: 18%</p>
                    <p><strong>Result:</strong> Months: 22 | Total Interest: ₹10,000</p>
                </div>
                <div class="input-group">
                    <label for="ccBalance-${id}">Credit Card Balance (₹)</label>
                    <input type="number" id="ccBalance-${id}" placeholder="Balance" step="0.01" oninput="calcCreditCardPayoff(${id})" onkeypress="handleEnter(event)">
                    <label for="ccPayment-${id}">Monthly Payment (₹)</label>
                    <input type="number" id="ccPayment-${id}" placeholder="Monthly Payment" step="0.01" oninput="calcCreditCardPayoff(${id})" onkeypress="handleEnter(event)">
                    <label for="ccRate-${id}">Annual Interest Rate (%)</label>
                    <input type="number" id="ccRate-${id}" placeholder="Interest Rate %" value="18" step="0.01" oninput="calcCreditCardPayoff(${id})" onkeypress="handleEnter(event)">
                </div>
                <div class="result-group">
                    <div class="result">Months to Payoff: <span id="rCCPayoffMonths-${id}">0</span></div>
                    <div class="result">Total Interest Paid: <span id="rCCPayoffInterest-${id}">0</span></div>
                </div>
            </div>

            <!-- DEBT CONSOLIDATION CALCULATOR -->
            <div id="debtConsolidation-${id}" class="calculator-section" hidden>
                <div class="section-header">
                    <h3>Debt Consolidation Calculator</h3>
                    <span class="tooltip-icon" onclick="toggleTooltip(event, 'debtConsolidation-tooltip-${id}')">ℹ️</span>
                </div>
                <div class="tooltip-box" id="debtConsolidation-tooltip-${id}">
                    <button class="tooltip-close" onclick="closeTooltip(event)">×</button>
                    <p class="tooltip-description">Compare multiple debts vs consolidating into single loan.</p>
                    <h4>Formula</h4>
                    <p class="formula">Consolidated EMI = Total Debt × [r(1+r)^n] / [(1+r)^n-1]</p>
                    <h4>Example</h4>
                    <p><strong>Input:</strong> Total Debt: ₹5,00,000, Rate: 10%, Years: 5</p>
                    <p><strong>Result:</strong> Monthly EMI: ₹10,604</p>
                </div>
                <div class="input-group">
                    <label for="dcTotalDebt-${id}">Total Debt (₹)</label>
                    <input type="number" id="dcTotalDebt-${id}" placeholder="Total Debt" step="0.01" oninput="calcDebtConsolidation(${id})" onkeypress="handleEnter(event)">
                    <label for="dcRate-${id}">Consolidated Interest Rate (%)</label>
                    <input type="number" id="dcRate-${id}" placeholder="Interest Rate %" value="10" step="0.01" oninput="calcDebtConsolidation(${id})" onkeypress="handleEnter(event)">
                    <label for="dcYears-${id}">Loan Tenure (Years)</label>
                    <input type="number" id="dcYears-${id}" placeholder="Years" value="5" step="0.5" oninput="calcDebtConsolidation(${id})" onkeypress="handleEnter(event)">
                </div>
                <div class="result-group">
                    <div class="result">Monthly EMI: <span id="rDebtConsolidationEmi-${id}">0</span></div>
                    <div class="result">Total Interest: <span id="rDebtConsolidationInterest-${id}">0</span></div>
                </div>
            </div>

            <!-- CAGR CALCULATOR -->
            <div id="cagr-${id}" class="calculator-section" hidden>
                <div class="section-header">
                    <h3>CAGR Calculator</h3>
                    <span class="tooltip-icon" onclick="toggleTooltip(event, 'cagr-tooltip-${id}')">ℹ️</span>
                </div>
                <div class="tooltip-box" id="cagr-tooltip-${id}">
                    <button class="tooltip-close" onclick="closeTooltip(event)">×</button>
                    <p class="tooltip-description">Calculate Compound Annual Growth Rate for investments.</p>
                    <h4>Formula</h4>
                    <p class="formula">CAGR = (Ending Value / Beginning Value)^(1/Years) - 1</p>
                    <h4>Example</h4>
                    <p><strong>Input:</strong> Beginning: ₹1,00,000, Ending: ₹5,00,000, Years: 5</p>
                    <p><strong>Result:</strong> CAGR: 38.04%</p>
                </div>
                <div class="input-group">
                    <label for="cagrBeginning-${id}">Beginning Value (₹)</label>
                    <input type="number" id="cagrBeginning-${id}" placeholder="Beginning Value" step="0.01" oninput="calcCAGR(${id})" onkeypress="handleEnter(event)">
                    <label for="cagrEnding-${id}">Ending Value (₹)</label>
                    <input type="number" id="cagrEnding-${id}" placeholder="Ending Value" step="0.01" oninput="calcCAGR(${id})" onkeypress="handleEnter(event)">
                    <label for="cagrYears-${id}">Years</label>
                    <input type="number" id="cagrYears-${id}" placeholder="Years" value="5" step="0.5" oninput="calcCAGR(${id})" onkeypress="handleEnter(event)">
                </div>
                <div class="result-group">
                    <div class="result">CAGR: <span id="rCAGR-${id}">0</span>%</div>
                </div>
            </div>

            <!-- ROI CALCULATOR -->
            <div id="roi-${id}" class="calculator-section" hidden>
                <div class="section-header">
                    <h3>ROI Calculator</h3>
                    <span class="tooltip-icon" onclick="toggleTooltip(event, 'roi-tooltip-${id}')">ℹ️</span>
                </div>
                <div class="tooltip-box" id="roi-tooltip-${id}">
                    <button class="tooltip-close" onclick="closeTooltip(event)">×</button>
                    <p class="tooltip-description">Calculate Return on Investment for any investment.</p>
                    <h4>Formula</h4>
                    <p class="formula">ROI = ((Final Value - Initial Value) / Initial Value) × 100</p>
                    <h4>Example</h4>
                    <p><strong>Input:</strong> Initial: ₹50,000, Final: ₹75,000</p>
                    <p><strong>Result:</strong> ROI: 50%</p>
                </div>
                <div class="input-group">
                    <label for="roiInitial-${id}">Initial Investment (₹)</label>
                    <input type="number" id="roiInitial-${id}" placeholder="Initial Investment" step="0.01" oninput="calcROI(${id})" onkeypress="handleEnter(event)">
                    <label for="roiFinal-${id}">Final Value (₹)</label>
                    <input type="number" id="roiFinal-${id}" placeholder="Final Value" step="0.01" oninput="calcROI(${id})" onkeypress="handleEnter(event)">
                </div>
                <div class="result-group">
                    <div class="result">ROI: <span id="rROI-${id}">0</span>%</div>
                </div>
            </div>

            <!-- DIVIDEND REINVESTMENT (DRIP) CALCULATOR -->
            <div id="drip-${id}" class="calculator-section" hidden>
                <div class="section-header">
                    <h3>Dividend Reinvestment (DRIP)</h3>
                    <span class="tooltip-icon" onclick="toggleTooltip(event, 'drip-tooltip-${id}')">ℹ️</span>
                </div>
                <div class="tooltip-box" id="drip-tooltip-${id}">
                    <button class="tooltip-close" onclick="closeTooltip(event)">×</button>
                    <p class="tooltip-description">Calculate impact of reinvesting dividends over time.</p>
                    <h4>Formula</h4>
                    <p class="formula">Final Value = Initial × (1 + Dividend%)^Years</p>
                    <h4>Example</h4>
                    <p><strong>Input:</strong> Initial: ₹1,00,000, Dividend: 5%, Years: 10</p>
                    <p><strong>Result:</strong> Final Value: ₹1,62,889</p>
                </div>
                <div class="input-group">
                    <label for="dripInitial-${id}">Initial Investment (₹)</label>
                    <input type="number" id="dripInitial-${id}" placeholder="Initial Investment" step="0.01" oninput="calcDRIP(${id})" onkeypress="handleEnter(event)">
                    <label for="dripDividend-${id}">Annual Dividend Yield (%)</label>
                    <input type="number" id="dripDividend-${id}" placeholder="Dividend Yield %" value="5" step="0.01" oninput="calcDRIP(${id})" onkeypress="handleEnter(event)">
                    <label for="dripYears-${id}">Years</label>
                    <input type="number" id="dripYears-${id}" placeholder="Years" value="10" step="0.5" oninput="calcDRIP(${id})" onkeypress="handleEnter(event)">
                </div>
                <div class="result-group">
                    <div class="result">Final Value: <span id="rDRIPValue-${id}">0</span></div>
                </div>
            </div>

            <!-- DOLLAR COST AVERAGING (DCA) CALCULATOR -->
            <div id="dca-${id}" class="calculator-section" hidden>
                <div class="section-header">
                    <h3>Dollar Cost Averaging (DCA)</h3>
                    <span class="tooltip-icon" onclick="toggleTooltip(event, 'dca-tooltip-${id}')">ℹ️</span>
                </div>
                <div class="tooltip-box" id="dca-tooltip-${id}">
                    <button class="tooltip-close" onclick="closeTooltip(event)">×</button>
                    <p class="tooltip-description">Calculate portfolio value with monthly DCA investing.</p>
                    <h4>Formula</h4>
                    <p class="formula">Final Value = Monthly Investment × [((1+r)^n - 1) / r] × (1+r)</p>
                    <h4>Example</h4>
                    <p><strong>Input:</strong> Monthly: ₹10,000, Rate: 10%, Months: 120</p>
                    <p><strong>Result:</strong> Final Value: ₹24,50,000</p>
                </div>
                <div class="input-group">
                    <label for="dcaMonthly-${id}">Monthly Investment (₹)</label>
                    <input type="number" id="dcaMonthly-${id}" placeholder="Monthly Investment" step="0.01" oninput="calcDCA(${id})" onkeypress="handleEnter(event)">
                    <label for="dcaRate-${id}">Annual Return Rate (%)</label>
                    <input type="number" id="dcaRate-${id}" placeholder="Return Rate %" value="10" step="0.01" oninput="calcDCA(${id})" onkeypress="handleEnter(event)">
                    <label for="dcaMonths-${id}">Investment Period (Months)</label>
                    <input type="number" id="dcaMonths-${id}" placeholder="Months" value="120" step="1" oninput="calcDCA(${id})" onkeypress="handleEnter(event)">
                </div>
                <div class="result-group">
                    <div class="result">Total Invested: <span id="rDCAInvested-${id}">0</span></div>
                    <div class="result">Final Value: <span id="rDCAValue-${id}">0</span></div>
                </div>
            </div>

            <!-- NET WORTH CALCULATOR -->
            <div id="netWorth-${id}" class="calculator-section" hidden>
                <div class="section-header">
                    <h3>Net Worth Calculator</h3>
                    <span class="tooltip-icon" onclick="toggleTooltip(event, 'netWorth-tooltip-${id}')">ℹ️</span>
                </div>
                <div class="tooltip-box" id="netWorth-tooltip-${id}">
                    <button class="tooltip-close" onclick="closeTooltip(event)">×</button>
                    <p class="tooltip-description">Calculate total net worth (assets minus liabilities).</p>
                    <h4>Formula</h4>
                    <p class="formula">Net Worth = Total Assets - Total Liabilities</p>
                    <h4>Example</h4>
                    <p><strong>Input:</strong> Assets: ₹50,00,000, Liabilities: ₹10,00,000</p>
                    <p><strong>Result:</strong> Net Worth: ₹40,00,000</p>
                </div>
                <div class="input-group">
                    <label for="nwAssets-${id}">Total Assets (₹)</label>
                    <input type="number" id="nwAssets-${id}" placeholder="Total Assets" step="0.01" oninput="calcNetWorth(${id})" onkeypress="handleEnter(event)">
                    <label for="nwLiabilities-${id}">Total Liabilities (₹)</label>
                    <input type="number" id="nwLiabilities-${id}" placeholder="Total Liabilities" step="0.01" oninput="calcNetWorth(${id})" onkeypress="handleEnter(event)">
                </div>
                <div class="result-group">
                    <div class="result">Net Worth: <span id="rNetWorth-${id}">0</span></div>
                </div>
            </div>

            <!-- WEALTH PROJECTION CALCULATOR -->
            <div id="wealthProjection-${id}" class="calculator-section" hidden>
                <div class="section-header">
                    <h3>Wealth Projection</h3>
                    <span class="tooltip-icon" onclick="toggleTooltip(event, 'wealthProjection-tooltip-${id}')">ℹ️</span>
                </div>
                <div class="tooltip-box" id="wealthProjection-tooltip-${id}">
                    <button class="tooltip-close" onclick="closeTooltip(event)">×</button>
                    <p class="tooltip-description">Project wealth growth with regular contributions and returns.</p>
                    <h4>Formula</h4>
                    <p class="formula">Final Wealth = Initial × (1+r)^n + Monthly × [((1+r)^n - 1) / r]</p>
                    <h4>Example</h4>
                    <p><strong>Input:</strong> Initial: ₹1,00,000, Monthly: ₹10,000, Rate: 12%, Years: 20</p>
                    <p><strong>Result:</strong> Final Wealth: ₹1,00,00,000</p>
                </div>
                <div class="input-group">
                    <label for="wpInitial-${id}">Initial Wealth (₹)</label>
                    <input type="number" id="wpInitial-${id}" placeholder="Initial Wealth" step="0.01" oninput="calcWealthProjection(${id})" onkeypress="handleEnter(event)">
                    <label for="wpMonthly-${id}">Monthly Contribution (₹)</label>
                    <input type="number" id="wpMonthly-${id}" placeholder="Monthly Contribution" step="0.01" oninput="calcWealthProjection(${id})" onkeypress="handleEnter(event)">
                    <label for="wpRate-${id}">Annual Return Rate (%)</label>
                    <input type="number" id="wpRate-${id}" placeholder="Return Rate %" value="12" step="0.01" oninput="calcWealthProjection(${id})" onkeypress="handleEnter(event)">
                    <label for="wpYears-${id}">Years</label>
                    <input type="number" id="wpYears-${id}" placeholder="Years" value="20" step="0.5" oninput="calcWealthProjection(${id})" onkeypress="handleEnter(event)">
                </div>
                <div class="result-group">
                    <div class="result">Projected Wealth: <span id="rWealthProjection-${id}">0</span></div>
                </div>
            </div>

            <!-- MILLIONAIRE TIMELINE CALCULATOR -->
            <div id="millionaireTimeline-${id}" class="calculator-section" hidden>
                <div class="section-header">
                    <h3>Millionaire Timeline</h3>
                    <span class="tooltip-icon" onclick="toggleTooltip(event, 'millionaireTimeline-tooltip-${id}')">ℹ️</span>
                </div>
                <div class="tooltip-box" id="millionaireTimeline-tooltip-${id}">
                    <button class="tooltip-close" onclick="closeTooltip(event)">×</button>
                    <p class="tooltip-description">Calculate when you'll reach 1 crore/millionaire status.</p>
                    <h4>Formula</h4>
                    <p class="formula">Uses iterative calculation with compound growth</p>
                    <h4>Example</h4>
                    <p><strong>Input:</strong> Current Wealth: ₹10,00,000, Monthly: ₹25,000, Rate: 10%</p>
                    <p><strong>Result:</strong> Years to Millionaire: 15</p>
                </div>
                <div class="input-group">
                    <label for="mtCurrent-${id}">Current Wealth (₹)</label>
                    <input type="number" id="mtCurrent-${id}" placeholder="Current Wealth" step="0.01" oninput="calcMillionaireTimeline(${id})" onkeypress="handleEnter(event)">
                    <label for="mtMonthly-${id}">Monthly Contribution (₹)</label>
                    <input type="number" id="mtMonthly-${id}" placeholder="Monthly Contribution" step="0.01" oninput="calcMillionaireTimeline(${id})" onkeypress="handleEnter(event)">
                    <label for="mtRate-${id}">Annual Return Rate (%)</label>
                    <input type="number" id="mtRate-${id}" placeholder="Return Rate %" value="10" step="0.01" oninput="calcMillionaireTimeline(${id})" onkeypress="handleEnter(event)">
                </div>
                <div class="result-group">
                    <div class="result">Years to 1 Crore: <span id="rMillionaireYears-${id}">0</span></div>
                </div>
            </div>

            <!-- HOME AFFORDABILITY CALCULATOR -->
            <div id="homeAffordability-${id}" class="calculator-section" hidden>
                <div class="section-header">
                    <h3>Home Affordability</h3>
                    <span class="tooltip-icon" onclick="toggleTooltip(event, 'homeAffordability-tooltip-${id}')">ℹ️</span>
                </div>
                <div class="tooltip-box" id="homeAffordability-tooltip-${id}">
                    <button class="tooltip-close" onclick="closeTooltip(event)">×</button>
                    <p class="tooltip-description">Calculate affordable home price based on income and savings.</p>
                    <h4>Formula</h4>
                    <p class="formula">Affordable Price = (Monthly Income × 3 × Loan Tenure) + Savings</p>
                    <h4>Example</h4>
                    <p><strong>Input:</strong> Monthly Income: ₹1,00,000, Savings: ₹20,00,000, Tenure: 20 years</p>
                    <p><strong>Result:</strong> Affordable Price: ₹92,00,000</p>
                </div>
                <div class="input-group">
                    <label for="haIncome-${id}">Monthly Income (₹)</label>
                    <input type="number" id="haIncome-${id}" placeholder="Monthly Income" step="0.01" oninput="calcHomeAffordability(${id})" onkeypress="handleEnter(event)">
                    <label for="haSavings-${id}">Down Payment Savings (₹)</label>
                    <input type="number" id="haSavings-${id}" placeholder="Down Payment" step="0.01" oninput="calcHomeAffordability(${id})" onkeypress="handleEnter(event)">
                    <label for="haTenure-${id}">Loan Tenure (Years)</label>
                    <input type="number" id="haTenure-${id}" placeholder="Tenure Years" value="20" step="0.5" oninput="calcHomeAffordability(${id})" onkeypress="handleEnter(event)">
                </div>
                <div class="result-group">
                    <div class="result">Affordable Home Price: <span id="rHomeAffordable-${id}">0</span></div>
                </div>
            </div>

            <!-- RENT VS BUY CALCULATOR -->
            <div id="rentVsBuy-${id}" class="calculator-section" hidden>
                <div class="section-header">
                    <h3>Rent vs Buy</h3>
                    <span class="tooltip-icon" onclick="toggleTooltip(event, 'rentVsBuy-tooltip-${id}')">ℹ️</span>
                </div>
                <div class="tooltip-box" id="rentVsBuy-tooltip-${id}">
                    <button class="tooltip-close" onclick="closeTooltip(event)">×</button>
                    <p class="tooltip-description">Compare long-term cost of renting vs buying.</p>
                    <h4>Formula</h4>
                    <p class="formula">Rent Cost = Monthly Rent × 12 × Years</p>
                    <p class="formula">Buy Cost = EMI × 12 × Years</p>
                    <h4>Example</h4>
                    <p><strong>Input:</strong> Rent: ₹30,000 vs Buy EMI: ₹40,000, Years: 20</p>
                    <p><strong>Result:</strong> Rent Total: ₹72,00,000 | Buy Total: ₹96,00,000</p>
                </div>
                <div class="input-group">
                    <label for="rvbRent-${id}">Monthly Rent (₹)</label>
                    <input type="number" id="rvbRent-${id}" placeholder="Monthly Rent" step="0.01" oninput="calcRentVsBuy(${id})" onkeypress="handleEnter(event)">
                    <label for="rvbEmi-${id}">Monthly Home Loan EMI (₹)</label>
                    <input type="number" id="rvbEmi-${id}" placeholder="Monthly EMI" step="0.01" oninput="calcRentVsBuy(${id})" onkeypress="handleEnter(event)">
                    <label for="rvbYears-${id}">Years</label>
                    <input type="number" id="rvbYears-${id}" placeholder="Years" value="20" step="0.5" oninput="calcRentVsBuy(${id})" onkeypress="handleEnter(event)">
                </div>
                <div class="result-group">
                    <div class="result">Rent Total Cost: <span id="rRentTotal-${id}">0</span></div>
                    <div class="result">Buy Total Cost: <span id="rBuyTotal-${id}">0</span></div>
                </div>
            </div>

            <!-- PROPERTY APPRECIATION CALCULATOR -->
            <div id="propertyAppreciation-${id}" class="calculator-section" hidden>
                <div class="section-header">
                    <h3>Property Appreciation</h3>
                    <span class="tooltip-icon" onclick="toggleTooltip(event, 'propertyAppreciation-tooltip-${id}')">ℹ️</span>
                </div>
                <div class="tooltip-box" id="propertyAppreciation-tooltip-${id}">
                    <button class="tooltip-close" onclick="closeTooltip(event)">×</button>
                    <p class="tooltip-description">Calculate future property value with appreciation.</p>
                    <h4>Formula</h4>
                    <p class="formula">Future Value = Current Value × (1 + Appreciation Rate)^Years</p>
                    <h4>Example</h4>
                    <p><strong>Input:</strong> Current: ₹50,00,000, Rate: 5%, Years: 10</p>
                    <p><strong>Result:</strong> Future Value: ₹81,44,660</p>
                </div>
                <div class="input-group">
                    <label for="paCurrent-${id}">Current Property Value (₹)</label>
                    <input type="number" id="paCurrent-${id}" placeholder="Current Value" step="0.01" oninput="calcPropertyAppreciation(${id})" onkeypress="handleEnter(event)">
                    <label for="paRate-${id}">Annual Appreciation Rate (%)</label>
                    <input type="number" id="paRate-${id}" placeholder="Appreciation Rate %" value="5" step="0.01" oninput="calcPropertyAppreciation(${id})" onkeypress="handleEnter(event)">
                    <label for="paYears-${id}">Years</label>
                    <input type="number" id="paYears-${id}" placeholder="Years" value="10" step="0.5" oninput="calcPropertyAppreciation(${id})" onkeypress="handleEnter(event)">
                </div>
                <div class="result-group">
                    <div class="result">Future Property Value: <span id="rPropertyFutureValue-${id}">0</span></div>
                </div>
            </div>

            <!-- ANNUITY/CORPUS CALCULATOR -->
            <div id="annuityCorpus-${id}" class="calculator-section" hidden>
                <div class="section-header">
                    <h3>Annuity/Corpus Calculator</h3>
                    <span class="tooltip-icon" onclick="toggleTooltip(event, 'annuityCorpus-tooltip-${id}')">ℹ️</span>
                </div>
                <div class="tooltip-box" id="annuityCorpus-tooltip-${id}">
                    <button class="tooltip-close" onclick="closeTooltip(event)">×</button>
                    <p class="tooltip-description">Calculate corpus needed for regular withdrawals.</p>
                    <h4>Formula</h4>
                    <p class="formula">Corpus = Annual Withdrawal / (Interest Rate / 100)</p>
                    <h4>Example</h4>
                    <p><strong>Input:</strong> Annual Withdrawal: ₹6,00,000, Rate: 8%</p>
                    <p><strong>Result:</strong> Corpus Needed: ₹75,00,000</p>
                </div>
                <div class="input-group">
                    <label for="acWithdrawal-${id}">Annual Withdrawal (₹)</label>
                    <input type="number" id="acWithdrawal-${id}" placeholder="Annual Withdrawal" step="0.01" oninput="calcAnnuityCorpus(${id})" onkeypress="handleEnter(event)">
                    <label for="acRate-${id}">Annual Interest Rate (%)</label>
                    <input type="number" id="acRate-${id}" placeholder="Interest Rate %" value="8" step="0.01" oninput="calcAnnuityCorpus(${id})" onkeypress="handleEnter(event)">
                </div>
                <div class="result-group">
                    <div class="result">Corpus Needed: <span id="rAnnuityCorpus-${id}">0</span></div>
                </div>
            </div>

            <!-- RETIREMENT INCOME CALCULATOR -->
            <div id="retirementIncome-${id}" class="calculator-section" hidden>
                <div class="section-header">
                    <h3>Retirement Income Calculator</h3>
                    <span class="tooltip-icon" onclick="toggleTooltip(event, 'retirementIncome-tooltip-${id}')">ℹ️</span>
                </div>
                <div class="tooltip-box" id="retirementIncome-tooltip-${id}">
                    <button class="tooltip-close" onclick="closeTooltip(event)">×</button>
                    <p class="tooltip-description">Calculate monthly income from retirement corpus using 4% rule.</p>
                    <h4>Formula</h4>
                    <p class="formula">Monthly Income = (Corpus × Annual Rate / 100) / 12</p>
                    <h4>Example</h4>
                    <p><strong>Input:</strong> Corpus: ₹1,00,00,000, Rate: 4%</p>
                    <p><strong>Result:</strong> Monthly Income: ₹33,333</p>
                </div>
                <div class="input-group">
                    <label for="ricCorpus-${id}">Retirement Corpus (₹)</label>
                    <input type="number" id="ricCorpus-${id}" placeholder="Retirement Corpus" step="0.01" oninput="calcRetirementIncome(${id})" onkeypress="handleEnter(event)">
                    <label for="ricRate-${id}">Withdrawal Rate (%)</label>
                    <input type="number" id="ricRate-${id}" placeholder="Withdrawal Rate %" value="4" step="0.01" oninput="calcRetirementIncome(${id})" onkeypress="handleEnter(event)">
                </div>
                <div class="result-group">
                    <div class="result">Monthly Income: <span id="rRetirementMonthly-${id}">0</span></div>
                    <div class="result">Annual Income: <span id="rRetirementAnnual-${id}">0</span></div>
                </div>
            </div>

            <!-- INFLATION-ADJUSTED CORPUS CALCULATOR -->
            <div id="inflationCorpus-${id}" class="calculator-section" hidden>
                <div class="section-header">
                    <h3>Inflation-Adjusted Corpus</h3>
                    <span class="tooltip-icon" onclick="toggleTooltip(event, 'inflationCorpus-tooltip-${id}')">ℹ️</span>
                </div>
                <div class="tooltip-box" id="inflationCorpus-tooltip-${id}">
                    <button class="tooltip-close" onclick="closeTooltip(event)">×</button>
                    <p class="tooltip-description">Calculate retirement corpus needed accounting for inflation.</p>
                    <h4>Formula</h4>
                    <p class="formula">Inflation-Adjusted Corpus = Current Corpus × (1 + Inflation Rate)^Years</p>
                    <h4>Example</h4>
                    <p><strong>Input:</strong> Current Corpus: ₹50,00,000, Inflation: 5%, Years: 20</p>
                    <p><strong>Result:</strong> Adjusted Corpus: ₹1,32,66,000</p>
                </div>
                <div class="input-group">
                    <label for="icCorpus-${id}">Current Corpus (₹)</label>
                    <input type="number" id="icCorpus-${id}" placeholder="Current Corpus" step="0.01" oninput="calcInflationCorpus(${id})" onkeypress="handleEnter(event)">
                    <label for="icInflation-${id}">Annual Inflation Rate (%)</label>
                    <input type="number" id="icInflation-${id}" placeholder="Inflation Rate %" value="5" step="0.01" oninput="calcInflationCorpus(${id})" onkeypress="handleEnter(event)">
                    <label for="icYears-${id}">Years</label>
                    <input type="number" id="icYears-${id}" placeholder="Years" value="20" step="0.5" oninput="calcInflationCorpus(${id})" onkeypress="handleEnter(event)">
                </div>
                <div class="result-group">
                    <div class="result">Inflation-Adjusted Corpus: <span id="rInflationCorpus-${id}">0</span></div>
                </div>
            </div>

            <!-- CAR LOAN EMI CALCULATOR -->
            <div id="carLoanEmi-${id}" class="calculator-section" hidden>
                <div class="section-header">
                    <h3>Car Loan EMI Calculator</h3>
                    <span class="tooltip-icon" onclick="toggleTooltip(event, 'carLoanEmi-tooltip-${id}')">ℹ️</span>
                </div>
                <div class="tooltip-box" id="carLoanEmi-tooltip-${id}">
                    <button class="tooltip-close" onclick="closeTooltip(event)">×</button>
                    <p class="tooltip-description">Calculate monthly EMI for car loans with interest.</p>
                    <h4>Formula</h4>
                    <p class="formula">EMI = P × [r(1+r)^n] / [(1+r)^n-1]</p>
                    <h4>Example</h4>
                    <p><strong>Input:</strong> Loan: ₹5,00,000, Rate: 8%, Years: 5</p>
                    <p><strong>Result:</strong> EMI: ₹11,996</p>
                </div>
                <div class="input-group">
                    <label for="ceLoan-${id}">Car Loan Amount (₹)</label>
                    <input type="number" id="ceLoan-${id}" placeholder="Loan Amount" step="0.01" oninput="calcCarLoanEmi(${id})" onkeypress="handleEnter(event)">
                    <label for="ceRate-${id}">Annual Interest Rate (%)</label>
                    <input type="number" id="ceRate-${id}" placeholder="Interest Rate %" value="8" step="0.01" oninput="calcCarLoanEmi(${id})" onkeypress="handleEnter(event)">
                    <label for="ceYears-${id}">Loan Tenure (Years)</label>
                    <input type="number" id="ceYears-${id}" placeholder="Years" value="5" step="0.5" oninput="calcCarLoanEmi(${id})" onkeypress="handleEnter(event)">
                </div>
                <div class="result-group">
                    <div class="result">Monthly EMI: <span id="rCarEmi-${id}">0</span></div>
                    <div class="result">Total Interest: <span id="rCarInterest-${id}">0</span></div>
                </div>
            </div>

            <!-- DEPRECIATION CALCULATOR -->
            <div id="depreciation-${id}" class="calculator-section" hidden>
                <div class="section-header">
                    <h3>Depreciation Calculator</h3>
                    <span class="tooltip-icon" onclick="toggleTooltip(event, 'depreciation-tooltip-${id}')">ℹ️</span>
                </div>
                <div class="tooltip-box" id="depreciation-tooltip-${id}">
                    <button class="tooltip-close" onclick="closeTooltip(event)">×</button>
                    <p class="tooltip-description">Calculate vehicle value after depreciation.</p>
                    <h4>Formula</h4>
                    <p class="formula">Future Value = Current Value × (1 - Depreciation Rate)^Years</p>
                    <h4>Example</h4>
                    <p><strong>Input:</strong> Current: ₹10,00,000, Rate: 15%, Years: 5</p>
                    <p><strong>Result:</strong> Future Value: ₹4,43,371</p>
                </div>
                <div class="input-group">
                    <label for="depCurrent-${id}">Current Vehicle Value (₹)</label>
                    <input type="number" id="depCurrent-${id}" placeholder="Current Value" step="0.01" oninput="calcDepreciation(${id})" onkeypress="handleEnter(event)">
                    <label for="depRate-${id}">Annual Depreciation Rate (%)</label>
                    <input type="number" id="depRate-${id}" placeholder="Depreciation Rate %" value="15" step="0.01" oninput="calcDepreciation(${id})" onkeypress="handleEnter(event)">
                    <label for="depYears-${id}">Years</label>
                    <input type="number" id="depYears-${id}" placeholder="Years" value="5" step="0.5" oninput="calcDepreciation(${id})" onkeypress="handleEnter(event)">
                </div>
                <div class="result-group">
                    <div class="result">Future Vehicle Value: <span id="rDepreciationValue-${id}">0</span></div>
                </div>
            </div>

            <!-- LIFE INSURANCE NEEDS CALCULATOR -->
            <div id="lifeInsurance-${id}" class="calculator-section" hidden>
                <div class="section-header">
                    <h3>Life Insurance Needs</h3>
                    <span class="tooltip-icon" onclick="toggleTooltip(event, 'lifeInsurance-tooltip-${id}')">ℹ️</span>
                </div>
                <div class="tooltip-box" id="lifeInsurance-tooltip-${id}">
                    <button class="tooltip-close" onclick="closeTooltip(event)">×</button>
                    <p class="tooltip-description">Calculate life insurance coverage needed based on responsibilities.</p>
                    <h4>Formula</h4>
                    <p class="formula">Coverage = (Annual Expenses × Years) + Debts - Existing Assets</p>
                    <h4>Example</h4>
                    <p><strong>Input:</strong> Annual Expenses: ₹6,00,000, Years: 25, Debts: ₹20,00,000</p>
                    <p><strong>Result:</strong> Coverage Needed: ₹3,70,00,000</p>
                </div>
                <div class="input-group">
                    <label for="linAnnualExpense-${id}">Annual Family Expenses (₹)</label>
                    <input type="number" id="linAnnualExpense-${id}" placeholder="Annual Expenses" step="0.01" oninput="calcLifeInsurance(${id})" onkeypress="handleEnter(event)">
                    <label for="linYears-${id}">Number of Years to Cover</label>
                    <input type="number" id="linYears-${id}" placeholder="Years" value="25" step="0.5" oninput="calcLifeInsurance(${id})" onkeypress="handleEnter(event)">
                    <label for="linDebts-${id}">Outstanding Debts (₹)</label>
                    <input type="number" id="linDebts-${id}" placeholder="Debts" step="0.01" oninput="calcLifeInsurance(${id})" onkeypress="handleEnter(event)">
                    <label for="linAssets-${id}">Existing Assets (₹)</label>
                    <input type="number" id="linAssets-${id}" placeholder="Existing Assets" step="0.01" oninput="calcLifeInsurance(${id})" onkeypress="handleEnter(event)">
                </div>
                <div class="result-group">
                    <div class="result">Coverage Needed: <span id="rLifeInsuranceCoverage-${id}">0</span></div>
                </div>
            </div>

            <!-- TERM INSURANCE PREMIUM CALCULATOR -->
            <div id="termInsurance-${id}" class="calculator-section" hidden>
                <div class="section-header">
                    <h3>Term Insurance Premium</h3>
                    <span class="tooltip-icon" onclick="toggleTooltip(event, 'termInsurance-tooltip-${id}')">ℹ️</span>
                </div>
                <div class="tooltip-box" id="termInsurance-tooltip-${id}">
                    <button class="tooltip-close" onclick="closeTooltip(event)">×</button>
                    <p class="tooltip-description">Estimate term insurance premium based on age and coverage.</p>
                    <h4>Formula</h4>
                    <p class="formula">Annual Premium = (Coverage / 100,000) × (Age Factor) × Base Rate</p>
                    <h4>Example</h4>
                    <p><strong>Input:</strong> Coverage: ₹1,00,00,000, Age: 30</p>
                    <p><strong>Result:</strong> Estimated Premium: ₹8,000 - ₹12,000</p>
                </div>
                <div class="input-group">
                    <label for="tipCoverage-${id}">Coverage Amount (₹)</label>
                    <input type="number" id="tipCoverage-${id}" placeholder="Coverage Amount" step="0.01" oninput="calcTermInsurance(${id})" onkeypress="handleEnter(event)">
                    <label for="tipAge-${id}">Your Age (Years)</label>
                    <input type="number" id="tipAge-${id}" placeholder="Age" value="30" step="1" oninput="calcTermInsurance(${id})" onkeypress="handleEnter(event)">
                    <label for="tipTerm-${id}">Policy Term (Years)</label>
                    <input type="number" id="tipTerm-${id}" placeholder="Term Years" value="20" step="1" oninput="calcTermInsurance(${id})" onkeypress="handleEnter(event)">
                </div>
                <div class="result-group">
                    <div class="result">Est. Annual Premium: <span id="rTermPremium-${id}">0</span></div>
                </div>
            </div>

            <!-- EDUCATION FUND CALCULATOR -->
            <div id="educationFund-${id}" class="calculator-section" hidden>
                <div class="section-header">
                    <h3>Education Fund Calculator</h3>
                    <span class="tooltip-icon" onclick="toggleTooltip(event, 'educationFund-tooltip-${id}')">ℹ️</span>
                </div>
                <div class="tooltip-box" id="educationFund-tooltip-${id}">
                    <button class="tooltip-close" onclick="closeTooltip(event)">×</button>
                    <p class="tooltip-description">Calculate monthly savings needed for education goals.</p>
                    <h4>Formula</h4>
                    <p class="formula">Monthly Savings = Target / (((1+r)^n - 1) / r)</p>
                    <h4>Example</h4>
                    <p><strong>Input:</strong> Target: ₹20,00,000, Rate: 10%, Years: 10</p>
                    <p><strong>Result:</strong> Monthly Savings: ₹12,548</p>
                </div>
                <div class="input-group">
                    <label for="efTarget-${id}">Education Goal (₹)</label>
                    <input type="number" id="efTarget-${id}" placeholder="Education Goal" step="0.01" oninput="calcEducationFund(${id})" onkeypress="handleEnter(event)">
                    <label for="efRate-${id}">Annual Return Rate (%)</label>
                    <input type="number" id="efRate-${id}" placeholder="Return Rate %" value="10" step="0.01" oninput="calcEducationFund(${id})" onkeypress="handleEnter(event)">
                    <label for="efYears-${id}">Years Until Education</label>
                    <input type="number" id="efYears-${id}" placeholder="Years" value="10" step="0.5" oninput="calcEducationFund(${id})" onkeypress="handleEnter(event)">
                </div>
                <div class="result-group">
                    <div class="result">Monthly Savings Needed: <span id="rEducationMonthly-${id}">0</span></div>
                </div>
            </div>

            <!-- COLLEGE COST PROJECTION CALCULATOR -->
            <div id="collegeCost-${id}" class="calculator-section" hidden>
                <div class="section-header">
                    <h3>College Cost Projection</h3>
                    <span class="tooltip-icon" onclick="toggleTooltip(event, 'collegeCost-tooltip-${id}')">ℹ️</span>
                </div>
                <div class="tooltip-box" id="collegeCost-tooltip-${id}">
                    <button class="tooltip-close" onclick="closeTooltip(event)">×</button>
                    <p class="tooltip-description">Project future college costs with inflation adjustments.</p>
                    <h4>Formula</h4>
                    <p class="formula">Future Cost = Current Cost × (1 + Inflation Rate)^Years</p>
                    <h4>Example</h4>
                    <p><strong>Input:</strong> Current Cost: ₹10,00,000, Inflation: 8%, Years: 10</p>
                    <p><strong>Result:</strong> Future Cost: ₹21,59,160</p>
                </div>
                <div class="input-group">
                    <label for="ccCurrent-${id}">Current College Cost (₹)</label>
                    <input type="number" id="ccCurrent-${id}" placeholder="Current Cost" step="0.01" oninput="calcCollegeCost(${id})" onkeypress="handleEnter(event)">
                    <label for="ccInflation-${id}">Annual Inflation Rate (%)</label>
                    <input type="number" id="ccInflation-${id}" placeholder="Inflation Rate %" value="8" step="0.01" oninput="calcCollegeCost(${id})" onkeypress="handleEnter(event)">
                    <label for="ccYears-${id}">Years Until College</label>
                    <input type="number" id="ccYears-${id}" placeholder="Years" value="10" step="0.5" oninput="calcCollegeCost(${id})" onkeypress="handleEnter(event)">
                </div>
                <div class="result-group">
                    <div class="result">Projected College Cost: <span id="rCollegeFutureCost-${id}">0</span></div>
                </div>
            </div>

            <!-- Salary Calculator -->
            <div id="salaryCalculator-${id}" class="calculator-section" hidden>
                <div class="section-header">
                    <h3>Salary Calculator</h3>
                    <span class="tooltip-icon" onclick="toggleTooltip(event, 'salaryCalculator-tooltip-${id}')">ℹ️</span>
                </div>
                <div class="tooltip-box" id="salaryCalculator-tooltip-${id}">
                    <button class="tooltip-close" onclick="closeTooltip(event)">×</button>
                    <p class="tooltip-description">Calculate net salary after tax and deductions.</p>
                    <h4>Formula</h4>
                    <p class="formula">Net Salary = Gross Salary - Tax - Deductions</p>
                    <h4>Example</h4>
                    <p><strong>Input:</strong> Gross: ₹50,000, Tax Rate: 20%, Deductions: ₹5,000</p>
                    <p><strong>Result:</strong> Net: ₹35,000</p>
                </div>
                <div class="input-group">
                    <label for="scGross-${id}">Gross Salary (₹)</label>
                    <input type="number" id="scGross-${id}" placeholder="Gross Salary" step="0.01" oninput="calcSalary(${id})" onkeypress="handleEnter(event)">
                    <label for="scTaxRate-${id}">Tax Rate (%)</label>
                    <input type="number" id="scTaxRate-${id}" placeholder="Tax Rate" value="20" step="0.01" oninput="calcSalary(${id})" onkeypress="handleEnter(event)">
                    <label for="scDeductions-${id}">Deductions (₹)</label>
                    <input type="number" id="scDeductions-${id}" placeholder="Deductions" step="0.01" oninput="calcSalary(${id})" onkeypress="handleEnter(event)">
                </div>
                <div class="result-group">
                    <div class="result">Net Salary: <span id="rNetSalary-${id}">0</span></div>
                    <div class="result">Tax Amount: <span id="rTaxAmount-${id}">0</span></div>
                </div>
            </div>

            <!-- Side Hustle Income Calculator -->
            <div id="sideHustleIncome-${id}" class="calculator-section" hidden>
                <div class="section-header">
                    <h3>Side Hustle Income Calculator</h3>
                    <span class="tooltip-icon" onclick="toggleTooltip(event, 'sideHustleIncome-tooltip-${id}')">ℹ️</span>
                </div>
                <div class="tooltip-box" id="sideHustleIncome-tooltip-${id}">
                    <button class="tooltip-close" onclick="closeTooltip(event)">×</button>
                    <p class="tooltip-description">Calculate total income from side hustle after expenses.</p>
                    <h4>Formula</h4>
                    <p class="formula">Net Income = (Hourly Rate × Hours) - Expenses</p>
                    <h4>Example</h4>
                    <p><strong>Input:</strong> Rate: ₹500/hr, Hours: 20, Expenses: ₹2,000</p>
                    <p><strong>Result:</strong> Net Income: ₹8,000</p>
                </div>
                <div class="input-group">
                    <label for="shiRate-${id}">Hourly Rate (₹)</label>
                    <input type="number" id="shiRate-${id}" placeholder="Rate per hour" step="0.01" oninput="calcSideHustle(${id})" onkeypress="handleEnter(event)">
                    <label for="shiHours-${id}">Hours per Month</label>
                    <input type="number" id="shiHours-${id}" placeholder="Hours" step="0.5" oninput="calcSideHustle(${id})" onkeypress="handleEnter(event)">
                    <label for="shiExpenses-${id}">Monthly Expenses (₹)</label>
                    <input type="number" id="shiExpenses-${id}" placeholder="Expenses" step="0.01" oninput="calcSideHustle(${id})" onkeypress="handleEnter(event)">
                </div>
                <div class="result-group">
                    <div class="result">Gross Income: <span id="rGrossIncome-${id}">0</span></div>
                    <div class="result">Net Income: <span id="rNetIncome-${id}">0</span></div>
                </div>
            </div>

            <!-- Freelance Rate Calculator -->
            <div id="freelanceRate-${id}" class="calculator-section" hidden>
                <div class="section-header">
                    <h3>Freelance Rate Calculator</h3>
                    <span class="tooltip-icon" onclick="toggleTooltip(event, 'freelanceRate-tooltip-${id}')">ℹ️</span>
                </div>
                <div class="tooltip-box" id="freelanceRate-tooltip-${id}">
                    <button class="tooltip-close" onclick="closeTooltip(event)">×</button>
                    <p class="tooltip-description">Calculate recommended freelance hourly rate.</p>
                    <h4>Formula</h4>
                    <p class="formula">Hourly Rate = (Annual Salary ÷ 2000) × (1 + Markup)</p>
                    <h4>Example</h4>
                    <p><strong>Input:</strong> Salary: ₹10,00,000, Markup: 30%</p>
                    <p><strong>Result:</strong> Rate: ₹650/hr</p>
                </div>
                <div class="input-group">
                    <label for="frSalary-${id}">Desired Annual Salary (₹)</label>
                    <input type="number" id="frSalary-${id}" placeholder="Annual Salary" step="0.01" oninput="calcFreelanceRate(${id})" onkeypress="handleEnter(event)">
                    <label for="frMarkup-${id}">Markup for Expenses (%)</label>
                    <input type="number" id="frMarkup-${id}" placeholder="Markup %" value="30" step="0.01" oninput="calcFreelanceRate(${id})" onkeypress="handleEnter(event)">
                </div>
                <div class="result-group">
                    <div class="result">Recommended Hourly Rate: <span id="rHourlyRate-${id}">0</span></div>
                    <div class="result">Annual Target Hours: 2000</div>
                </div>
            </div>

            <!-- Savings Rate Calculator -->
            <div id="savingsRate-${id}" class="calculator-section" hidden>
                <div class="section-header">
                    <h3>Savings Rate Calculator</h3>
                    <span class="tooltip-icon" onclick="toggleTooltip(event, 'savingsRate-tooltip-${id}')">ℹ️</span>
                </div>
                <div class="tooltip-box" id="savingsRate-tooltip-${id}">
                    <button class="tooltip-close" onclick="closeTooltip(event)">×</button>
                    <p class="tooltip-description">Calculate your savings rate percentage.</p>
                    <h4>Formula</h4>
                    <p class="formula">Savings Rate = (Monthly Savings ÷ Monthly Income) × 100</p>
                    <h4>Example</h4>
                    <p><strong>Input:</strong> Income: ₹50,000, Savings: ₹15,000</p>
                    <p><strong>Result:</strong> Savings Rate: 30%</p>
                </div>
                <div class="input-group">
                    <label for="srIncome-${id}">Monthly Income (₹)</label>
                    <input type="number" id="srIncome-${id}" placeholder="Monthly Income" step="0.01" oninput="calcSavingsRate(${id})" onkeypress="handleEnter(event)">
                    <label for="srSavings-${id}">Monthly Savings (₹)</label>
                    <input type="number" id="srSavings-${id}" placeholder="Monthly Savings" step="0.01" oninput="calcSavingsRate(${id})" onkeypress="handleEnter(event)">
                </div>
                <div class="result-group">
                    <div class="result">Savings Rate: <span id="rSavingsRate-${id}">0%</span></div>
                    <div class="result">Monthly Spending: <span id="rMonthlySpending-${id}">0</span></div>
                </div>
            </div>

            <!-- Goal Tracker Calculator -->
            <div id="goalTracker-${id}" class="calculator-section" hidden>
                <div class="section-header">
                    <h3>Financial Goal Tracker</h3>
                    <span class="tooltip-icon" onclick="toggleTooltip(event, 'goalTracker-tooltip-${id}')">ℹ️</span>
                </div>
                <div class="tooltip-box" id="goalTracker-tooltip-${id}">
                    <button class="tooltip-close" onclick="closeTooltip(event)">×</button>
                    <p class="tooltip-description">Track progress towards financial goals.</p>
                    <h4>Formula</h4>
                    <p class="formula">Progress % = (Current Amount ÷ Target Amount) × 100</p>
                    <h4>Example</h4>
                    <p><strong>Input:</strong> Target: ₹10,00,000, Current: ₹3,00,000</p>
                    <p><strong>Result:</strong> Progress: 30%</p>
                </div>
                <div class="input-group">
                    <label for="gtTarget-${id}">Target Amount (₹)</label>
                    <input type="number" id="gtTarget-${id}" placeholder="Target Amount" step="0.01" oninput="calcGoalTracker(${id})" onkeypress="handleEnter(event)">
                    <label for="gtCurrent-${id}">Current Amount (₹)</label>
                    <input type="number" id="gtCurrent-${id}" placeholder="Current Amount" step="0.01" oninput="calcGoalTracker(${id})" onkeypress="handleEnter(event)">
                </div>
                <div class="result-group">
                    <div class="result">Progress: <span id="rProgress-${id}">0%</span></div>
                    <div class="result">Remaining: <span id="rRemaining-${id}">0</span></div>
                </div>
            </div>

            <!-- Expense Tracker Calculator -->
            <div id="expenseTracker-${id}" class="calculator-section" hidden>
                <div class="section-header">
                    <h3>Expense Tracker</h3>
                    <span class="tooltip-icon" onclick="toggleTooltip(event, 'expenseTracker-tooltip-${id}')">ℹ️</span>
                </div>
                <div class="tooltip-box" id="expenseTracker-tooltip-${id}">
                    <button class="tooltip-close" onclick="closeTooltip(event)">×</button>
                    <p class="tooltip-description">Calculate total expenses and percentage of income.</p>
                    <h4>Formula</h4>
                    <p class="formula">Total = Sum of All Expenses, Percentage = (Total ÷ Income) × 100</p>
                    <h4>Example</h4>
                    <p><strong>Input:</strong> Food: ₹10k, Transport: ₹3k, Entertainment: ₹2k, Other: ₹5k, Income: ₹50k</p>
                    <p><strong>Result:</strong> Total: ₹20k, Percentage: 40%</p>
                </div>
                <div class="input-group">
                    <label for="etFood-${id}">Food & Groceries (₹)</label>
                    <input type="number" id="etFood-${id}" placeholder="Food expenses" step="0.01" oninput="calcExpenseTracker(${id})" onkeypress="handleEnter(event)">
                    <label for="etTransport-${id}">Transport (₹)</label>
                    <input type="number" id="etTransport-${id}" placeholder="Transport" step="0.01" oninput="calcExpenseTracker(${id})" onkeypress="handleEnter(event)">
                    <label for="etEntertainment-${id}">Entertainment (₹)</label>
                    <input type="number" id="etEntertainment-${id}" placeholder="Entertainment" step="0.01" oninput="calcExpenseTracker(${id})" onkeypress="handleEnter(event)">
                    <label for="etOther-${id}">Other Expenses (₹)</label>
                    <input type="number" id="etOther-${id}" placeholder="Other" step="0.01" oninput="calcExpenseTracker(${id})" onkeypress="handleEnter(event)">
                    <label for="etIncome-${id}">Monthly Income (₹)</label>
                    <input type="number" id="etIncome-${id}" placeholder="Income" step="0.01" oninput="calcExpenseTracker(${id})" onkeypress="handleEnter(event)">
                </div>
                <div class="result-group">
                    <div class="result">Total Expenses: <span id="rTotalExpenses-${id}">0</span></div>
                    <div class="result">Expense Ratio: <span id="rExpenseRatio-${id}">0%</span></div>
                </div>
            </div>

            <!-- Loan Comparison Calculator -->
            <div id="loanComparison-${id}" class="calculator-section" hidden>
                <div class="section-header">
                    <h3>Loan Comparison</h3>
                    <span class="tooltip-icon" onclick="toggleTooltip(event, 'loanComparison-tooltip-${id}')">ℹ️</span>
                </div>
                <div class="tooltip-box" id="loanComparison-tooltip-${id}">
                    <button class="tooltip-close" onclick="closeTooltip(event)">×</button>
                    <p class="tooltip-description">Compare two loan options side by side.</p>
                    <h4>Formula</h4>
                    <p class="formula">Total Interest = (EMI × Months) - Principal</p>
                    <h4>Example</h4>
                    <p><strong>Input:</strong> Loan 1: ₹10L @ 8% for 5yr, Loan 2: ₹10L @ 9% for 5yr</p>
                    <p><strong>Result:</strong> Interest comparison</p>
                </div>
                <div class="input-group">
                    <label for="lcLoan1Principal-${id}">Loan 1: Principal (₹)</label>
                    <input type="number" id="lcLoan1Principal-${id}" placeholder="Principal" step="0.01" oninput="calcLoanComparison(${id})" onkeypress="handleEnter(event)">
                    <label for="lcLoan1Rate-${id}">Loan 1: Interest Rate (%)</label>
                    <input type="number" id="lcLoan1Rate-${id}" placeholder="Rate %" value="8" step="0.01" oninput="calcLoanComparison(${id})" onkeypress="handleEnter(event)">
                    <label for="lcLoan1Tenure-${id}">Loan 1: Tenure (Years)</label>
                    <input type="number" id="lcLoan1Tenure-${id}" placeholder="Tenure" value="5" step="0.5" oninput="calcLoanComparison(${id})" onkeypress="handleEnter(event)">
                    <label for="lcLoan2Principal-${id}">Loan 2: Principal (₹)</label>
                    <input type="number" id="lcLoan2Principal-${id}" placeholder="Principal" step="0.01" oninput="calcLoanComparison(${id})" onkeypress="handleEnter(event)">
                    <label for="lcLoan2Rate-${id}">Loan 2: Interest Rate (%)</label>
                    <input type="number" id="lcLoan2Rate-${id}" placeholder="Rate %" value="9" step="0.01" oninput="calcLoanComparison(${id})" onkeypress="handleEnter(event)">
                    <label for="lcLoan2Tenure-${id}">Loan 2: Tenure (Years)</label>
                    <input type="number" id="lcLoan2Tenure-${id}" placeholder="Tenure" value="5" step="0.5" oninput="calcLoanComparison(${id})" onkeypress="handleEnter(event)">
                </div>
                <div class="result-group">
                    <div class="result">Loan 1 EMI: <span id="rLoan1EMI-${id}">0</span></div>
                    <div class="result">Loan 1 Total Interest: <span id="rLoan1Interest-${id}">0</span></div>
                    <div class="result">Loan 2 EMI: <span id="rLoan2EMI-${id}">0</span></div>
                    <div class="result">Loan 2 Total Interest: <span id="rLoan2Interest-${id}">0</span></div>
                </div>
            </div>

            <!-- Payback Period Calculator -->
            <div id="paybackPeriod-${id}" class="calculator-section" hidden>
                <div class="section-header">
                    <h3>Payback Period</h3>
                    <span class="tooltip-icon" onclick="toggleTooltip(event, 'paybackPeriod-tooltip-${id}')">ℹ️</span>
                </div>
                <div class="tooltip-box" id="paybackPeriod-tooltip-${id}">
                    <button class="tooltip-close" onclick="closeTooltip(event)">×</button>
                    <p class="tooltip-description">Calculate payback period for an investment.</p>
                    <h4>Formula</h4>
                    <p class="formula">Payback Period = Initial Investment ÷ Annual Cash Flow</p>
                    <h4>Example</h4>
                    <p><strong>Input:</strong> Investment: ₹10,00,000, Annual Cash Flow: ₹2,00,000</p>
                    <p><strong>Result:</strong> Payback Period: 5 years</p>
                </div>
                <div class="input-group">
                    <label for="ppInvestment-${id}">Initial Investment (₹)</label>
                    <input type="number" id="ppInvestment-${id}" placeholder="Investment" step="0.01" oninput="calcPaybackPeriod(${id})" onkeypress="handleEnter(event)">
                    <label for="ppAnnualCash-${id}">Annual Cash Flow (₹)</label>
                    <input type="number" id="ppAnnualCash-${id}" placeholder="Annual Cash Flow" step="0.01" oninput="calcPaybackPeriod(${id})" onkeypress="handleEnter(event)">
                </div>
                <div class="result-group">
                    <div class="result">Payback Period: <span id="rPaybackYears-${id}">0</span> years</div>
                </div>
            </div>

            <!-- Early Loan Payoff Calculator -->
            <div id="earlyPayoff-${id}" class="calculator-section" hidden>
                <div class="section-header">
                    <h3>Early Loan Payoff</h3>
                    <span class="tooltip-icon" onclick="toggleTooltip(event, 'earlyPayoff-tooltip-${id}')">ℹ️</span>
                </div>
                <div class="tooltip-box" id="earlyPayoff-tooltip-${id}">
                    <button class="tooltip-close" onclick="closeTooltip(event)">×</button>
                    <p class="tooltip-description">Calculate savings from paying off loan early.</p>
                    <h4>Formula</h4>
                    <p class="formula">Interest Saved = Total Interest - Remaining Interest</p>
                    <h4>Example</h4>
                    <p><strong>Input:</strong> Principal: ₹10L, Rate: 8%, Tenure: 5yr, Extra Payment: ₹10k/month</p>
                    <p><strong>Result:</strong> Payoff in 3 years, Save ₹2,00,000</p>
                </div>
                <div class="input-group">
                    <label for="epPrincipal-${id}">Principal (₹)</label>
                    <input type="number" id="epPrincipal-${id}" placeholder="Principal" step="0.01" oninput="calcEarlyPayoff(${id})" onkeypress="handleEnter(event)">
                    <label for="epRate-${id}">Interest Rate (%)</label>
                    <input type="number" id="epRate-${id}" placeholder="Rate %" value="8" step="0.01" oninput="calcEarlyPayoff(${id})" onkeypress="handleEnter(event)">
                    <label for="epTenure-${id}">Tenure (Years)</label>
                    <input type="number" id="epTenure-${id}" placeholder="Tenure" value="5" step="0.5" oninput="calcEarlyPayoff(${id})" onkeypress="handleEnter(event)">
                    <label for="epExtraPayment-${id}">Extra Monthly Payment (₹)</label>
                    <input type="number" id="epExtraPayment-${id}" placeholder="Extra Payment" step="0.01" oninput="calcEarlyPayoff(${id})" onkeypress="handleEnter(event)">
                </div>
                <div class="result-group">
                    <div class="result">Regular EMI: <span id="rRegularEMI-${id}">0</span></div>
                    <div class="result">New Payoff Period: <span id="rNewPayoff-${id}">0</span> years</div>
                    <div class="result">Interest Saved: <span id="rSavedInterest-${id}">0</span></div>
                </div>
            </div>

            <!-- P/E Ratio Calculator -->
            <div id="peRatio-${id}" class="calculator-section" hidden>
                <div class="section-header">
                    <h3>P/E Ratio Calculator</h3>
                    <span class="tooltip-icon" onclick="toggleTooltip(event, 'peRatio-tooltip-${id}')">ℹ️</span>
                </div>
                <div class="tooltip-box" id="peRatio-tooltip-${id}">
                    <button class="tooltip-close" onclick="closeTooltip(event)">×</button>
                    <p class="tooltip-description">Calculate Price to Earnings ratio for stock valuation.</p>
                    <h4>Formula</h4>
                    <p class="formula">P/E Ratio = Stock Price ÷ Earnings Per Share</p>
                    <h4>Example</h4>
                    <p><strong>Input:</strong> Price: ₹1,000, EPS: ₹100</p>
                    <p><strong>Result:</strong> P/E Ratio: 10</p>
                </div>
                <div class="input-group">
                    <label for="perPrice-${id}">Stock Price (₹)</label>
                    <input type="number" id="perPrice-${id}" placeholder="Stock Price" step="0.01" oninput="calcPERatio(${id})" onkeypress="handleEnter(event)">
                    <label for="perEPS-${id}">Earnings Per Share (₹)</label>
                    <input type="number" id="perEPS-${id}" placeholder="EPS" step="0.01" oninput="calcPERatio(${id})" onkeypress="handleEnter(event)">
                </div>
                <div class="result-group">
                    <div class="result">P/E Ratio: <span id="rPERatio-${id}">0</span></div>
                </div>
            </div>

            <!-- Dividend Growth Calculator -->
            <div id="dividendGrowth-${id}" class="calculator-section" hidden>
                <div class="section-header">
                    <h3>Dividend Growth Calculator</h3>
                    <span class="tooltip-icon" onclick="toggleTooltip(event, 'dividendGrowth-tooltip-${id}')">ℹ️</span>
                </div>
                <div class="tooltip-box" id="dividendGrowth-tooltip-${id}">
                    <button class="tooltip-close" onclick="closeTooltip(event)">×</button>
                    <p class="tooltip-description">Project future dividend income with growth rate.</p>
                    <h4>Formula</h4>
                    <p class="formula">Future Dividend = Current × (1 + Growth Rate)^Years</p>
                    <h4>Example</h4>
                    <p><strong>Input:</strong> Current: ₹5, Growth: 8%, Years: 10</p>
                    <p><strong>Result:</strong> Future: ₹10.79</p>
                </div>
                <div class="input-group">
                    <label for="dgCurrent-${id}">Current Dividend Per Share (₹)</label>
                    <input type="number" id="dgCurrent-${id}" placeholder="Current Dividend" step="0.01" oninput="calcDividendGrowth(${id})" onkeypress="handleEnter(event)">
                    <label for="dgGrowthRate-${id}">Annual Growth Rate (%)</label>
                    <input type="number" id="dgGrowthRate-${id}" placeholder="Growth Rate %" value="8" step="0.01" oninput="calcDividendGrowth(${id})" onkeypress="handleEnter(event)">
                    <label for="dgYears-${id}">Years</label>
                    <input type="number" id="dgYears-${id}" placeholder="Years" value="10" step="0.5" oninput="calcDividendGrowth(${id})" onkeypress="handleEnter(event)">
                </div>
                <div class="result-group">
                    <div class="result">Future Dividend: <span id="rFutureDividend-${id}">0</span></div>
                </div>
            </div>

            <!-- Portfolio Rebalancing Calculator -->
            <div id="portfolioRebalancing-${id}" class="calculator-section" hidden>
                <div class="section-header">
                    <h3>Portfolio Rebalancing</h3>
                    <span class="tooltip-icon" onclick="toggleTooltip(event, 'portfolioRebalancing-tooltip-${id}')">ℹ️</span>
                </div>
                <div class="tooltip-box" id="portfolioRebalancing-tooltip-${id}">
                    <button class="tooltip-close" onclick="closeTooltip(event)">×</button>
                    <p class="tooltip-description">Calculate allocation needed to rebalance portfolio.</p>
                    <h4>Formula</h4>
                    <p class="formula">Target Value = Total Portfolio × Target % - Current Value</p>
                    <h4>Example</h4>
                    <p><strong>Input:</strong> Stocks: ₹60k (40%), Bonds: ₹40k (60%), Total: ₹100k, New: 50/50</p>
                    <p><strong>Result:</strong> Buy ₹10k stocks</p>
                </div>
                <div class="input-group">
                    <label for="prStockValue-${id}">Current Stock Value (₹)</label>
                    <input type="number" id="prStockValue-${id}" placeholder="Stock Value" step="0.01" oninput="calcPortfolioRebalancing(${id})" onkeypress="handleEnter(event)">
                    <label for="prBondValue-${id}">Current Bond Value (₹)</label>
                    <input type="number" id="prBondValue-${id}" placeholder="Bond Value" step="0.01" oninput="calcPortfolioRebalancing(${id})" onkeypress="handleEnter(event)">
                    <label for="prTargetStock-${id}">Target Stock %</label>
                    <input type="number" id="prTargetStock-${id}" placeholder="Target %" value="50" step="0.01" oninput="calcPortfolioRebalancing(${id})" onkeypress="handleEnter(event)">
                </div>
                <div class="result-group">
                    <div class="result">Total Portfolio: <span id="rTotalPortfolio-${id}">0</span></div>
                    <div class="result">Stocks Adjustment: <span id="rStocksAdjustment-${id}">0</span></div>
                    <div class="result">Bonds Adjustment: <span id="rBondsAdjustment-${id}">0</span></div>
                </div>
            </div>

            <!-- Tax Loss Harvesting Calculator -->
            <div id="taxLossHarvesting-${id}" class="calculator-section" hidden>
                <div class="section-header">
                    <h3>Tax Loss Harvesting</h3>
                    <span class="tooltip-icon" onclick="toggleTooltip(event, 'taxLossHarvesting-tooltip-${id}')">ℹ️</span>
                </div>
                <div class="tooltip-box" id="taxLossHarvesting-tooltip-${id}">
                    <button class="tooltip-close" onclick="closeTooltip(event)">×</button>
                    <p class="tooltip-description">Calculate tax savings from realized losses.</p>
                    <h4>Formula</h4>
                    <p class="formula">Tax Saved = Loss Amount × Tax Rate</p>
                    <h4>Example</h4>
                    <p><strong>Input:</strong> Loss: ₹50,000, Tax Rate: 30%</p>
                    <p><strong>Result:</strong> Tax Saved: ₹15,000</p>
                </div>
                <div class="input-group">
                    <label for="tlhLoss-${id}">Realized Loss (₹)</label>
                    <input type="number" id="tlhLoss-${id}" placeholder="Loss Amount" step="0.01" oninput="calcTaxLossHarvesting(${id})" onkeypress="handleEnter(event)">
                    <label for="tlhTaxRate-${id}">Tax Rate (%)</label>
                    <input type="number" id="tlhTaxRate-${id}" placeholder="Tax Rate %" value="30" step="0.01" oninput="calcTaxLossHarvesting(${id})" onkeypress="handleEnter(event)">
                </div>
                <div class="result-group">
                    <div class="result">Tax Saved: <span id="rTaxSaved-${id}">0</span></div>
                </div>
            </div>

            <!-- Tax Bracket Calculator -->
            <div id="taxBracket-${id}" class="calculator-section" hidden>
                <div class="section-header">
                    <h3>Tax Bracket Calculator</h3>
                    <span class="tooltip-icon" onclick="toggleTooltip(event, 'taxBracket-tooltip-${id}')">ℹ️</span>
                </div>
                <div class="tooltip-box" id="taxBracket-tooltip-${id}">
                    <button class="tooltip-close" onclick="closeTooltip(event)">×</button>
                    <p class="tooltip-description">Calculate tax amount based on income brackets.</p>
                    <h4>Formula</h4>
                    <p class="formula">Tax = Sum of (Income in bracket × Rate for bracket)</p>
                    <h4>Example</h4>
                    <p><strong>Input:</strong> Income: ₹15,00,000</p>
                    <p><strong>Result:</strong> Tax: ₹4,20,000 (Effective Rate: 28%)</p>
                </div>
                <div class="input-group">
                    <label for="tbIncome-${id}">Annual Income (₹)</label>
                    <input type="number" id="tbIncome-${id}" placeholder="Annual Income" step="0.01" oninput="calcTaxBracket(${id})" onkeypress="handleEnter(event)">
                </div>
                <div class="result-group">
                    <div class="result">Total Tax: <span id="rTotalTax-${id}">0</span></div>
                    <div class="result">Effective Tax Rate: <span id="rEffectiveRate-${id}">0%</span></div>
                </div>
            </div>

            <!-- Gift/Inheritance Tax Calculator -->
            <div id="giftTax-${id}" class="calculator-section" hidden>
                <div class="section-header">
                    <h3>Gift/Inheritance Tax</h3>
                    <span class="tooltip-icon" onclick="toggleTooltip(event, 'giftTax-tooltip-${id}')">ℹ️</span>
                </div>
                <div class="tooltip-box" id="giftTax-tooltip-${id}">
                    <button class="tooltip-close" onclick="closeTooltip(event)">×</button>
                    <p class="tooltip-description">Calculate gift or inheritance tax liability.</p>
                    <h4>Formula</h4>
                    <p class="formula">Tax = Amount × Tax Rate (if applicable)</p>
                    <h4>Example</h4>
                    <p><strong>Input:</strong> Gift: ₹25,00,000, Tax Rate: 5%</p>
                    <p><strong>Result:</strong> Tax: ₹1,25,000</p>
                </div>
                <div class="input-group">
                    <label for="gtAmount-${id}">Gift/Inheritance Amount (₹)</label>
                    <input type="number" id="gtAmount-${id}" placeholder="Amount" step="0.01" oninput="calcGiftTax(${id})" onkeypress="handleEnter(event)">
                    <label for="gtRate-${id}">Tax Rate (%)</label>
                    <input type="number" id="gtRate-${id}" placeholder="Tax Rate %" value="5" step="0.01" oninput="calcGiftTax(${id})" onkeypress="handleEnter(event)">
                </div>
                <div class="result-group">
                    <div class="result">Tax Amount: <span id="rTaxAmount-${id}">0</span></div>
                    <div class="result">Net Received: <span id="rNetReceived-${id}">0</span></div>
                </div>
            </div>

            <!-- Business Profit Calculator -->
            <div id="businessProfit-${id}" class="calculator-section" hidden>
                <div class="section-header">
                    <h3>Business Profit Calculator</h3>
                    <span class="tooltip-icon" onclick="toggleTooltip(event, 'businessProfit-tooltip-${id}')">ℹ️</span>
                </div>
                <div class="tooltip-box" id="businessProfit-tooltip-${id}">
                    <button class="tooltip-close" onclick="closeTooltip(event)">×</button>
                    <p class="tooltip-description">Calculate profit margin for your business.</p>
                    <h4>Formula</h4>
                    <p class="formula">Profit = Revenue - (COGS + Expenses), Margin = (Profit ÷ Revenue) × 100</p>
                    <h4>Example</h4>
                    <p><strong>Input:</strong> Revenue: ₹10,00,000, COGS: ₹4,00,000, Expenses: ₹2,00,000</p>
                    <p><strong>Result:</strong> Profit: ₹4,00,000, Margin: 40%</p>
                </div>
                <div class="input-group">
                    <label for="bpRevenue-${id}">Total Revenue (₹)</label>
                    <input type="number" id="bpRevenue-${id}" placeholder="Revenue" step="0.01" oninput="calcBusinessProfit(${id})" onkeypress="handleEnter(event)">
                    <label for="bpCOGS-${id}">Cost of Goods Sold (₹)</label>
                    <input type="number" id="bpCOGS-${id}" placeholder="COGS" step="0.01" oninput="calcBusinessProfit(${id})" onkeypress="handleEnter(event)">
                    <label for="bpExpenses-${id}">Operating Expenses (₹)</label>
                    <input type="number" id="bpExpenses-${id}" placeholder="Expenses" step="0.01" oninput="calcBusinessProfit(${id})" onkeypress="handleEnter(event)">
                </div>
                <div class="result-group">
                    <div class="result">Total Profit: <span id="rProfit-${id}">0</span></div>
                    <div class="result">Profit Margin: <span id="rMargin-${id}">0%</span></div>
                </div>
            </div>

            <!-- Markup vs Margin Calculator -->
            <div id="markupMargin-${id}" class="calculator-section" hidden>
                <div class="section-header">
                    <h3>Markup vs Margin Calculator</h3>
                    <span class="tooltip-icon" onclick="toggleTooltip(event, 'markupMargin-tooltip-${id}')">ℹ️</span>
                </div>
                <div class="tooltip-box" id="markupMargin-tooltip-${id}">
                    <button class="tooltip-close" onclick="closeTooltip(event)">×</button>
                    <p class="tooltip-description">Understand difference between markup and profit margin.</p>
                    <h4>Formula</h4>
                    <p class="formula">Markup = ((Selling - Cost) ÷ Cost) × 100, Margin = ((Selling - Cost) ÷ Selling) × 100</p>
                    <h4>Example</h4>
                    <p><strong>Input:</strong> Cost: ₹100, Selling: ₹150</p>
                    <p><strong>Result:</strong> Markup: 50%, Margin: 33.33%</p>
                </div>
                <div class="input-group">
                    <label for="mmCost-${id}">Cost Price (₹)</label>
                    <input type="number" id="mmCost-${id}" placeholder="Cost Price" step="0.01" oninput="calcMarkupMargin(${id})" onkeypress="handleEnter(event)">
                    <label for="mmSelling-${id}">Selling Price (₹)</label>
                    <input type="number" id="mmSelling-${id}" placeholder="Selling Price" step="0.01" oninput="calcMarkupMargin(${id})" onkeypress="handleEnter(event)">
                </div>
                <div class="result-group">
                    <div class="result">Markup: <span id="rMarkup-${id}">0%</span></div>
                    <div class="result">Profit Margin: <span id="rProfitMargin-${id}">0%</span></div>
                </div>
            </div>

            <!-- Expense Inflation Calculator -->
            <div id="expenseInflation-${id}" class="calculator-section" hidden>
                <div class="section-header">
                    <h3>Expense Inflation Calculator</h3>
                    <span class="tooltip-icon" onclick="toggleTooltip(event, 'expenseInflation-tooltip-${id}')">ℹ️</span>
                </div>
                <div class="tooltip-box" id="expenseInflation-tooltip-${id}">
                    <button class="tooltip-close" onclick="closeTooltip(event)">×</button>
                    <p class="tooltip-description">Project future expense needs based on inflation.</p>
                    <h4>Formula</h4>
                    <p class="formula">Future Expense = Current × (1 + Inflation Rate)^Years</p>
                    <h4>Example</h4>
                    <p><strong>Input:</strong> Current: ₹50,000, Inflation: 6%, Years: 10</p>
                    <p><strong>Result:</strong> Future: ₹89,542</p>
                </div>
                <div class="input-group">
                    <label for="eiCurrent-${id}">Current Expense (₹)</label>
                    <input type="number" id="eiCurrent-${id}" placeholder="Current Expense" step="0.01" oninput="calcExpenseInflation(${id})" onkeypress="handleEnter(event)">
                    <label for="eiRate-${id}">Annual Inflation Rate (%)</label>
                    <input type="number" id="eiRate-${id}" placeholder="Inflation Rate %" value="6" step="0.01" oninput="calcExpenseInflation(${id})" onkeypress="handleEnter(event)">
                    <label for="eiYears-${id}">Years</label>
                    <input type="number" id="eiYears-${id}" placeholder="Years" value="10" step="0.5" oninput="calcExpenseInflation(${id})" onkeypress="handleEnter(event)">
                </div>
                <div class="result-group">
                    <div class="result">Future Expense: <span id="rFutureExpense-${id}">0</span></div>
                </div>
            </div>

            <!-- Wedding Budget Calculator -->
            <div id="weddingBudget-${id}" class="calculator-section" hidden>
                <div class="section-header">
                    <h3>Wedding Budget Calculator</h3>
                    <span class="tooltip-icon" onclick="toggleTooltip(event, 'weddingBudget-tooltip-${id}')">ℹ️</span>
                </div>
                <div class="tooltip-box" id="weddingBudget-tooltip-${id}">
                    <button class="tooltip-close" onclick="closeTooltip(event)">×</button>
                    <p class="tooltip-description">Plan and allocate wedding budget.</p>
                    <h4>Formula</h4>
                    <p class="formula">Total = Venue + Catering + Decorations + Other, Per-Guest = Catering ÷ Guests</p>
                    <h4>Example</h4>
                    <p><strong>Input:</strong> Venue: ₹5L, Catering: 300 guests @ ₹500, Decorations: ₹3L, Other: ₹1L</p>
                    <p><strong>Result:</strong> Total: ₹15,00,000, Per-Guest: ₹500</p>
                </div>
                <div class="input-group">
                    <label for="wbVenue-${id}">Venue Cost (₹)</label>
                    <input type="number" id="wbVenue-${id}" placeholder="Venue" step="0.01" oninput="calcWeddingBudget(${id})" onkeypress="handleEnter(event)">
                    <label for="wbGuests-${id}">Number of Guests</label>
                    <input type="number" id="wbGuests-${id}" placeholder="Guests" step="1" oninput="calcWeddingBudget(${id})" onkeypress="handleEnter(event)">
                    <label for="wbCateringPerGuest-${id}">Catering Cost Per Guest (₹)</label>
                    <input type="number" id="wbCateringPerGuest-${id}" placeholder="Cost/Guest" value="500" step="0.01" oninput="calcWeddingBudget(${id})" onkeypress="handleEnter(event)">
                    <label for="wbDecorations-${id}">Decorations (₹)</label>
                    <input type="number" id="wbDecorations-${id}" placeholder="Decorations" step="0.01" oninput="calcWeddingBudget(${id})" onkeypress="handleEnter(event)">
                    <label for="wbOther-${id}">Other Expenses (₹)</label>
                    <input type="number" id="wbOther-${id}" placeholder="Other" step="0.01" oninput="calcWeddingBudget(${id})" onkeypress="handleEnter(event)">
                </div>
                <div class="result-group">
                    <div class="result">Total Catering: <span id="rTotalCatering-${id}">0</span></div>
                    <div class="result">Total Budget: <span id="rWeddingTotal-${id}">0</span></div>
                    <div class="result">Per Person Cost: <span id="rPerPersonCost-${id}">0</span></div>
                </div>
            </div>

            <!-- Vacation Budget Calculator -->
            <div id="vacationBudget-${id}" class="calculator-section" hidden>
                <div class="section-header">
                    <h3>Vacation Budget Calculator</h3>
                    <span class="tooltip-icon" onclick="toggleTooltip(event, 'vacationBudget-tooltip-${id}')">ℹ️</span>
                </div>
                <div class="tooltip-box" id="vacationBudget-tooltip-${id}">
                    <button class="tooltip-close" onclick="closeTooltip(event)">×</button>
                    <p class="tooltip-description">Plan vacation expenses by category.</p>
                    <h4>Formula</h4>
                    <p class="formula">Total = Flight + Hotel + Activities + Food + Other</p>
                    <h4>Example</h4>
                    <p><strong>Input:</strong> Flight: ₹20k, Hotel: ₹50k, Activities: ₹15k, Food: ₹10k, Other: ₹5k</p>
                    <p><strong>Result:</strong> Total: ₹1,00,000</p>
                </div>
                <div class="input-group">
                    <label for="vbFlight-${id}">Flight (₹)</label>
                    <input type="number" id="vbFlight-${id}" placeholder="Flight" step="0.01" oninput="calcVacationBudget(${id})" onkeypress="handleEnter(event)">
                    <label for="vbHotel-${id}">Hotel (₹)</label>
                    <input type="number" id="vbHotel-${id}" placeholder="Hotel" step="0.01" oninput="calcVacationBudget(${id})" onkeypress="handleEnter(event)">
                    <label for="vbActivities-${id}">Activities (₹)</label>
                    <input type="number" id="vbActivities-${id}" placeholder="Activities" step="0.01" oninput="calcVacationBudget(${id})" onkeypress="handleEnter(event)">
                    <label for="vbFood-${id}">Food & Dining (₹)</label>
                    <input type="number" id="vbFood-${id}" placeholder="Food" step="0.01" oninput="calcVacationBudget(${id})" onkeypress="handleEnter(event)">
                    <label for="vbOther-${id}">Other Expenses (₹)</label>
                    <input type="number" id="vbOther-${id}" placeholder="Other" step="0.01" oninput="calcVacationBudget(${id})" onkeypress="handleEnter(event)">
                </div>
                <div class="result-group">
                    <div class="result">Total Vacation Cost: <span id="rVacationTotal-${id}">0</span></div>
                </div>
            </div>

            <!-- Crypto ROI Calculator -->
            <div id="cryptoROI-${id}" class="calculator-section" hidden>
                <div class="section-header">
                    <h3>Crypto ROI Calculator</h3>
                    <span class="tooltip-icon" onclick="toggleTooltip(event, 'cryptoROI-tooltip-${id}')">ℹ️</span>
                </div>
                <div class="tooltip-box" id="cryptoROI-tooltip-${id}">
                    <button class="tooltip-close" onclick="closeTooltip(event)">×</button>
                    <p class="tooltip-description">Calculate return on cryptocurrency investment.</p>
                    <h4>Formula</h4>
                    <p class="formula">ROI = ((Current Value - Initial) ÷ Initial) × 100</p>
                    <h4>Example</h4>
                    <p><strong>Input:</strong> Initial: ₹50,000, Current: ₹1,00,000</p>
                    <p><strong>Result:</strong> ROI: 100%</p>
                </div>
                <div class="input-group">
                    <label for="crInitial-${id}">Initial Investment (₹)</label>
                    <input type="number" id="crInitial-${id}" placeholder="Initial Investment" step="0.01" oninput="calcCryptoROI(${id})" onkeypress="handleEnter(event)">
                    <label for="crCurrent-${id}">Current Value (₹)</label>
                    <input type="number" id="crCurrent-${id}" placeholder="Current Value" step="0.01" oninput="calcCryptoROI(${id})" onkeypress="handleEnter(event)">
                </div>
                <div class="result-group">
                    <div class="result">ROI %: <span id="rROI-${id}">0%</span></div>
                    <div class="result">Profit/Loss: <span id="rProfitLoss-${id}">0</span></div>
                </div>
            </div>

            <!-- Crypto DCA Calculator -->
            <div id="cryptoDCA-${id}" class="calculator-section" hidden>
                <div class="section-header">
                    <h3>Crypto Dollar Cost Averaging</h3>
                    <span class="tooltip-icon" onclick="toggleTooltip(event, 'cryptoDCA-tooltip-${id}')">ℹ️</span>
                </div>
                <div class="tooltip-box" id="cryptoDCA-tooltip-${id}">
                    <button class="tooltip-close" onclick="closeTooltip(event)">×</button>
                    <p class="tooltip-description">Calculate DCA investment strategy outcomes.</p>
                    <h4>Formula</h4>
                    <p class="formula">Total Invested = Monthly Amount × Months, Average Price = Total ÷ Total Coins</p>
                    <h4>Example</h4>
                    <p><strong>Input:</strong> Monthly: ₹10,000, Months: 12, Avg Price: ₹50,000</p>
                    <p><strong>Result:</strong> 2.4 coins, Cost: ₹1,20,000</p>
                </div>
                <div class="input-group">
                    <label for="cdMonthly-${id}">Monthly Investment (₹)</label>
                    <input type="number" id="cdMonthly-${id}" placeholder="Monthly Amount" step="0.01" oninput="calcCryptoDCA(${id})" onkeypress="handleEnter(event)">
                    <label for="cdMonths-${id}">Number of Months</label>
                    <input type="number" id="cdMonths-${id}" placeholder="Months" value="12" step="1" oninput="calcCryptoDCA(${id})" onkeypress="handleEnter(event)">
                    <label for="cdAvgPrice-${id}">Average Crypto Price (₹)</label>
                    <input type="number" id="cdAvgPrice-${id}" placeholder="Average Price" step="0.01" oninput="calcCryptoDCA(${id})" onkeypress="handleEnter(event)">
                </div>
                <div class="result-group">
                    <div class="result">Total Invested: <span id="rTotalInvested-${id}">0</span></div>
                    <div class="result">Total Coins: <span id="rTotalCoins-${id}">0</span></div>
                </div>
            </div>

            <!-- Bond Yield Calculator -->
            <div id="bondYield-${id}" class="calculator-section" hidden>
                <div class="section-header">
                    <h3>Bond Yield Calculator</h3>
                    <span class="tooltip-icon" onclick="toggleTooltip(event, 'bondYield-tooltip-${id}')">ℹ️</span>
                </div>
                <div class="tooltip-box" id="bondYield-tooltip-${id}">
                    <button class="tooltip-close" onclick="closeTooltip(event)">×</button>
                    <p class="tooltip-description">Calculate yield to maturity and annual coupon.</p>
                    <h4>Formula</h4>
                    <p class="formula">Coupon = Face Value × Coupon Rate, YTM ≈ (Coupon + (FV-Price)/Years) ÷ ((FV+Price)/2)</p>
                    <h4>Example</h4>
                    <p><strong>Input:</strong> Face: ₹1,000, Rate: 8%, Price: ₹950, Years: 5</p>
                    <p><strong>Result:</strong> Coupon: ₹80, YTM: 8.76%</p>
                </div>
                <div class="input-group">
                    <label for="byFaceValue-${id}">Face Value (₹)</label>
                    <input type="number" id="byFaceValue-${id}" placeholder="Face Value" value="1000" step="0.01" oninput="calcBondYield(${id})" onkeypress="handleEnter(event)">
                    <label for="byCouponRate-${id}">Coupon Rate (%)</label>
                    <input type="number" id="byCouponRate-${id}" placeholder="Coupon Rate %" value="8" step="0.01" oninput="calcBondYield(${id})" onkeypress="handleEnter(event)">
                    <label for="byPrice-${id}">Current Price (₹)</label>
                    <input type="number" id="byPrice-${id}" placeholder="Current Price" value="950" step="0.01" oninput="calcBondYield(${id})" onkeypress="handleEnter(event)">
                    <label for="byYearsToMaturity-${id}">Years to Maturity</label>
                    <input type="number" id="byYearsToMaturity-${id}" placeholder="Years" value="5" step="0.5" oninput="calcBondYield(${id})" onkeypress="handleEnter(event)">
                </div>
                <div class="result-group">
                    <div class="result">Annual Coupon: <span id="rCoupon-${id}">0</span></div>
                    <div class="result">Yield to Maturity: <span id="rYTM-${id}">0%</span></div>
                </div>
            </div>

            <!-- NPV Calculator -->
            <div id="npv-${id}" class="calculator-section" hidden>
                <div class="section-header">
                    <h3>Net Present Value (NPV)</h3>
                    <span class="tooltip-icon" onclick="toggleTooltip(event, 'npv-tooltip-${id}')">ℹ️</span>
                </div>
                <div class="tooltip-box" id="npv-tooltip-${id}">
                    <button class="tooltip-close" onclick="closeTooltip(event)">×</button>
                    <p class="tooltip-description">Calculate NPV for investment decision making.</p>
                    <h4>Formula</h4>
                    <p class="formula">NPV = -Initial + Σ(Cash Flow ÷ (1 + Discount Rate)^Year)</p>
                    <h4>Example</h4>
                    <p><strong>Input:</strong> Initial: ₹10L, Cash Flows: ₹3L per year for 5 years, Rate: 10%</p>
                    <p><strong>Result:</strong> NPV: ₹13,75,733</p>
                </div>
                <div class="input-group">
                    <label for="npvInitial-${id}">Initial Investment (₹)</label>
                    <input type="number" id="npvInitial-${id}" placeholder="Investment" step="0.01" oninput="calcNPV(${id})" onkeypress="handleEnter(event)">
                    <label for="npvAnnualCF-${id}">Annual Cash Flow (₹)</label>
                    <input type="number" id="npvAnnualCF-${id}" placeholder="Annual Cash Flow" step="0.01" oninput="calcNPV(${id})" onkeypress="handleEnter(event)">
                    <label for="npvYears-${id}">Number of Years</label>
                    <input type="number" id="npvYears-${id}" placeholder="Years" value="5" step="1" oninput="calcNPV(${id})" onkeypress="handleEnter(event)">
                    <label for="npvDiscount-${id}">Discount Rate (%)</label>
                    <input type="number" id="npvDiscount-${id}" placeholder="Discount Rate %" value="10" step="0.01" oninput="calcNPV(${id})" onkeypress="handleEnter(event)">
                </div>
                <div class="result-group">
                    <div class="result">NPV: <span id="rNPV-${id}">0</span></div>
                </div>
            </div>

            <!-- IRR Calculator -->
            <div id="irr-${id}" class="calculator-section" hidden>
                <div class="section-header">
                    <h3>Internal Rate of Return (IRR)</h3>
                    <span class="tooltip-icon" onclick="toggleTooltip(event, 'irr-tooltip-${id}')">ℹ️</span>
                </div>
                <div class="tooltip-box" id="irr-tooltip-${id}">
                    <button class="tooltip-close" onclick="closeTooltip(event)">×</button>
                    <p class="tooltip-description">Calculate IRR for investment analysis.</p>
                    <h4>Formula</h4>
                    <p class="formula">IRR is the discount rate where NPV = 0 (Estimated using approximation)</p>
                    <h4>Example</h4>
                    <p><strong>Input:</strong> Initial: ₹10L, Annual CF: ₹3L for 5 years</p>
                    <p><strong>Result:</strong> IRR: ~15.2%</p>
                </div>
                <div class="input-group">
                    <label for="irrInitial-${id}">Initial Investment (₹)</label>
                    <input type="number" id="irrInitial-${id}" placeholder="Investment" step="0.01" oninput="calcIRR(${id})" onkeypress="handleEnter(event)">
                    <label for="irrAnnualCF-${id}">Annual Cash Flow (₹)</label>
                    <input type="number" id="irrAnnualCF-${id}" placeholder="Annual Cash Flow" step="0.01" oninput="calcIRR(${id})" onkeypress="handleEnter(event)">
                    <label for="irrYears-${id}">Number of Years</label>
                    <input type="number" id="irrYears-${id}" placeholder="Years" value="5" step="1" oninput="calcIRR(${id})" onkeypress="handleEnter(event)">
                </div>
                <div class="result-group">
                    <div class="result">IRR (Estimated): <span id="rIRR-${id}">0%</span></div>
                </div>
            </div>

            <!-- Lease vs Buy Calculator -->
            <div id="leaseVsBuy-${id}" class="calculator-section" hidden>
                <div class="section-header">
                    <h3>Lease vs Buy Calculator</h3>
                    <span class="tooltip-icon" onclick="toggleTooltip(event, 'leaseVsBuy-tooltip-${id}')">ℹ️</span>
                </div>
                <div class="tooltip-box" id="leaseVsBuy-tooltip-${id}">
                    <button class="tooltip-close" onclick="closeTooltip(event)">×</button>
                    <p class="tooltip-description">Compare leasing vs buying an asset.</p>
                    <h4>Formula</h4>
                    <p class="formula">Total Lease = Monthly Lease × Months, Total Buy = Price - Resale Value + Maintenance</p>
                    <h4>Example</h4>
                    <p><strong>Input:</strong> Lease: ₹30k/mo, Buy: ₹20L, Maintenance: ₹1.5L/yr, Resale: ₹15L</p>
                    <p><strong>Result:</strong> Lease 5yr: ₹18L, Buy: ₹12.5L</p>
                </div>
                <div class="input-group">
                    <label for="lvbLeaseMonthly-${id}">Monthly Lease Payment (₹)</label>
                    <input type="number" id="lvbLeaseMonthly-${id}" placeholder="Lease Payment" step="0.01" oninput="calcLeaseVsBuy(${id})" onkeypress="handleEnter(event)">
                    <label for="lvbMonths-${id}">Lease Duration (Months)</label>
                    <input type="number" id="lvbMonths-${id}" placeholder="Months" value="60" step="1" oninput="calcLeaseVsBuy(${id})" onkeypress="handleEnter(event)">
                    <label for="lvbBuyPrice-${id}">Purchase Price (₹)</label>
                    <input type="number" id="lvbBuyPrice-${id}" placeholder="Purchase Price" step="0.01" oninput="calcLeaseVsBuy(${id})" onkeypress="handleEnter(event)">
                    <label for="lvbMaintenance-${id}">Annual Maintenance (₹)</label>
                    <input type="number" id="lvbMaintenance-${id}" placeholder="Annual Maintenance" step="0.01" oninput="calcLeaseVsBuy(${id})" onkeypress="handleEnter(event)">
                    <label for="lvbResale-${id}">Resale Value (₹)</label>
                    <input type="number" id="lvbResale-${id}" placeholder="Resale Value" step="0.01" oninput="calcLeaseVsBuy(${id})" onkeypress="handleEnter(event)">
                </div>
                <div class="result-group">
                    <div class="result">Total Lease Cost: <span id="rTotalLease-${id}">0</span></div>
                    <div class="result">Total Buy Cost: <span id="rTotalBuy-${id}">0</span></div>
                    <div class="result">Better Option: <span id="rBetterOption-${id}">-</span></div>
                </div>
            </div>

            <!-- Cost of Living Calculator -->
            <div id="costOfLiving-${id}" class="calculator-section" hidden>
                <div class="section-header">
                    <h3>Cost of Living Calculator</h3>
                    <span class="tooltip-icon" onclick="toggleTooltip(event, 'costOfLiving-tooltip-${id}')">ℹ️</span>
                </div>
                <div class="tooltip-box" id="costOfLiving-tooltip-${id}">
                    <button class="tooltip-close" onclick="closeTooltip(event)">×</button>
                    <p class="tooltip-description">Calculate and compare cost of living across locations.</p>
                    <h4>Formula</h4>
                    <p class="formula">Total = Housing + Food + Transport + Utilities + Other</p>
                    <h4>Example</h4>
                    <p><strong>Input:</strong> Housing: ₹30k, Food: ₹10k, Transport: ₹3k, Utilities: ₹2k, Other: ₹5k</p>
                    <p><strong>Result:</strong> Total: ₹50,000/month</p>
                </div>
                <div class="input-group">
                    <label for="colHousing-${id}">Housing (₹)</label>
                    <input type="number" id="colHousing-${id}" placeholder="Housing" step="0.01" oninput="calcCostOfLiving(${id})" onkeypress="handleEnter(event)">
                    <label for="colFood-${id}">Food (₹)</label>
                    <input type="number" id="colFood-${id}" placeholder="Food" step="0.01" oninput="calcCostOfLiving(${id})" onkeypress="handleEnter(event)">
                    <label for="colTransport-${id}">Transport (₹)</label>
                    <input type="number" id="colTransport-${id}" placeholder="Transport" step="0.01" oninput="calcCostOfLiving(${id})" onkeypress="handleEnter(event)">
                    <label for="colUtilities-${id}">Utilities (₹)</label>
                    <input type="number" id="colUtilities-${id}" placeholder="Utilities" step="0.01" oninput="calcCostOfLiving(${id})" onkeypress="handleEnter(event)">
                    <label for="colOther-${id}">Other Expenses (₹)</label>
                    <input type="number" id="colOther-${id}" placeholder="Other" step="0.01" oninput="calcCostOfLiving(${id})" onkeypress="handleEnter(event)">
                </div>
                <div class="result-group">
                    <div class="result">Monthly Cost: <span id="rMonthlyCost-${id}">0</span></div>
                    <div class="result">Annual Cost: <span id="rAnnualCost-${id}">0</span></div>
                </div>
            </div>

            <!-- Rental Yield Calculator -->
            <div id="rentalYield-${id}" class="calculator-section" hidden>
                <div class="section-header">
                    <h3>Rental Yield Calculator</h3>
                    <span class="tooltip-icon" onclick="toggleTooltip(event, 'rentalYield-tooltip-${id}')">ℹ️</span>
                </div>
                <div class="tooltip-box" id="rentalYield-tooltip-${id}">
                    <button class="tooltip-close" onclick="closeTooltip(event)">×</button>
                    <p class="tooltip-description">Calculate rental yield and investment metrics.</p>
                    <h4>Formula</h4>
                    <p class="formula">Gross Yield = (Annual Rent ÷ Property Price) × 100, Net Yield = (Annual Profit ÷ Property Price) × 100</p>
                    <h4>Example</h4>
                    <p><strong>Input:</strong> Property: ₹50L, Annual Rent: ₹4L, Maintenance: ₹50k</p>
                    <p><strong>Result:</strong> Gross Yield: 8%, Net Yield: 7%</p>
                </div>
                <div class="input-group">
                    <label for="ryPropertyPrice-${id}">Property Price (₹)</label>
                    <input type="number" id="ryPropertyPrice-${id}" placeholder="Property Price" step="0.01" oninput="calcRentalYield(${id})" onkeypress="handleEnter(event)">
                    <label for="ryMonthlyRent-${id}">Monthly Rent (₹)</label>
                    <input type="number" id="ryMonthlyRent-${id}" placeholder="Monthly Rent" step="0.01" oninput="calcRentalYield(${id})" onkeypress="handleEnter(event)">
                    <label for="ryMaintenanceAnnual-${id}">Annual Maintenance (₹)</label>
                    <input type="number" id="ryMaintenanceAnnual-${id}" placeholder="Annual Maintenance" step="0.01" oninput="calcRentalYield(${id})" onkeypress="handleEnter(event)">
                    <label for="ryPropertyTax-${id}">Annual Property Tax (₹)</label>
                    <input type="number" id="ryPropertyTax-${id}" placeholder="Property Tax" step="0.01" oninput="calcRentalYield(${id})" onkeypress="handleEnter(event)">
                </div>
                <div class="result-group">
                    <div class="result">Annual Rental Income: <span id="rAnnualRental-${id}">0</span></div>
                    <div class="result">Annual Expenses: <span id="rAnnualExpenses-${id}">0</span></div>
                    <div class="result">Gross Yield: <span id="rGrossYield-${id}">0%</span></div>
                    <div class="result">Net Yield: <span id="rNetYield-${id}">0%</span></div>
                </div>
            </div>

            <button class="reset-calculator-btn" onclick="resetCalculator(${id})">Reset</button>
        </div>
    `;

    
    grid.insertAdjacentHTML('beforeend', calculatorHTML);
    updateAddButton();
}

// Remove a calculator instance
function removeCalculator(id) {
    const element = document.getElementById(`calc-${id}`);
    if (element) {
        element.remove();
        activeCalculators.delete(id);
        updateAddButton();
    }
}

// Update add button state
function updateAddButton() {
    const addBtn = document.getElementById('addCalcBtn');
    addBtn.disabled = activeCalculators.size >= maxCalculators;
}

// Reset all calculators
function resetAllCalculators() {
    const inputs = document.querySelectorAll('.calculator-wrapper input[type="number"]');
    inputs.forEach(input => {
        input.value = '';
        // Trigger calculation for affected calculator
        input.dispatchEvent(new Event('input', { bubbles: true }));
    });
    // Reset all result displays to 0
    const results = document.querySelectorAll('.result span');
    results.forEach(result => {
        result.innerText = '0';
    });
}

// Reset individual calculator
function resetCalculator(id) {
    const inputs = document.querySelectorAll(`#calc-${id} input[type="number"]`);
    inputs.forEach(input => {
        input.value = '';
        input.dispatchEvent(new Event('input', { bubbles: true }));
    });
    // Reset result displays for this calculator
    const results = document.querySelectorAll(`#calc-${id} .result span`);
    results.forEach(result => {
        result.innerText = '0';
    });
}

// Toggle tooltip visibility
function toggleTooltip(event, tooltipId) {
    event.stopPropagation();
    const tooltip = document.getElementById(tooltipId);
    const isVisible = tooltip.classList.contains('visible');
    
    // Hide all tooltips in this calculator
    const calculator = event.target.closest('.calculator-wrapper');
    const allTooltips = calculator.querySelectorAll('.tooltip-box');
    allTooltips.forEach(t => t.classList.remove('visible'));
    
    // Toggle current tooltip
    if (!isVisible) {
        tooltip.classList.add('visible');
        
        // Position tooltip above the icon
        const icon = event.target;
        const rect = icon.getBoundingClientRect();
        const tooltipHeight = tooltip.offsetHeight || 300;
        const tooltipWidth = tooltip.offsetWidth || 320;
        
        let top = rect.top - tooltipHeight - 15;
        let left = rect.left + rect.width / 2 - tooltipWidth / 2;
        
        // Keep tooltip within viewport
        if (top < 10) {
            top = rect.bottom + 15;
        }
        
        if (left < 10) {
            left = 10;
        }
        
        if (left + tooltipWidth > window.innerWidth) {
            left = window.innerWidth - tooltipWidth - 10;
        }
        
        tooltip.style.top = top + 'px';
        tooltip.style.left = left + 'px';
    }
}

// Close tooltip
function closeTooltip(event) {
    event.stopPropagation();
    const tooltip = event.target.closest('.tooltip-box');
    if (tooltip) {
        tooltip.classList.remove('visible');
    }
}

// Calculate SIP (Systematic Investment Plan)
function calcSIP(id) {
    const currentCorpus = parseFloat(document.getElementById(`currentCorpus-${id}`).value) || 0;
    const monthlySIP = parseFloat(document.getElementById(`monthlySIP-${id}`).value) || 0;
    const annualReturn = parseFloat(document.getElementById(`annualReturn-${id}`).value) || 0;
    const years = parseFloat(document.getElementById(`sipYears-${id}`).value) || 0;
    
    if (years === 0) {
        document.getElementById(`rTotalInvested-${id}`).innerText = '0';
        document.getElementById(`rFutureValue-${id}`).innerText = '0';
        document.getElementById(`rGains-${id}`).innerText = '0';
        return;
    }
    
    // Convert annual return to monthly return
    const monthlyReturn = annualReturn / 100 / 12;
    const totalMonths = years * 12;
    
    // Future value of current corpus (lump sum)
    const futureValueCorpus = currentCorpus * Math.pow(1 + monthlyReturn, totalMonths);
    
    // Future value of SIP (annuity formula)
    let futureValueSIP = 0;
    if (monthlyReturn === 0) {
        futureValueSIP = monthlySIP * totalMonths;
    } else {
        futureValueSIP = monthlySIP * (Math.pow(1 + monthlyReturn, totalMonths) - 1) / monthlyReturn;
    }
    
    // Total future value
    const totalFutureValue = futureValueCorpus + futureValueSIP;
    
    // Total amount invested
    const totalInvested = currentCorpus + (monthlySIP * totalMonths);
    
    // Gains/Returns
    const gains = totalFutureValue - totalInvested;
    
    document.getElementById(`rTotalInvested-${id}`).innerText = formatNumber(totalInvested);
    document.getElementById(`rFutureValue-${id}`).innerText = formatNumber(totalFutureValue);
    document.getElementById(`rGains-${id}`).innerText = formatNumber(gains);
}

// Switch calculator type
function switchCalc(id) {
    const selected = document.getElementById(`switcher-${id}`).value;
    const searchInput = document.getElementById(`search-${id}`);
    const resultsContainer = document.getElementById(`search-results-${id}`);
    
    // Update search input with selected calculator name
    if (calculatorData[selected]) {
        searchInput.value = calculatorData[selected].name;
    }
    
    // Hide search results
    resultsContainer.style.display = 'none';
    
    // Hide all calculator sections
    const allSections = document.querySelectorAll(`#calc-${id} .calculator-section`);
    allSections.forEach(section => section.hidden = true);
    
    // Show selected section
    document.getElementById(`${selected}-${id}`).hidden = false;
}

// Handle Enter key to move to next input
function handleEnter(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        
        const visibleSection = event.target.closest('.calculator-section');
        if (!visibleSection) return;
        
        const inputs = Array.from(visibleSection.querySelectorAll('input'));
        const currentInput = event.target;
        const currentIndex = inputs.indexOf(currentInput);
        
        if (currentIndex < inputs.length - 1) {
            inputs[currentIndex + 1].focus();
        } else {
            currentInput.blur();
        }
    }
}

// Calculate average stock price
function calcAvgStock(id) {
    const oldAvgPrice = parseFloat(document.getElementById(`oldAvgPrice-${id}`).value) || 0;
    const oldQty = parseFloat(document.getElementById(`oldQty-${id}`).value) || 0;
    const newPrice = parseFloat(document.getElementById(`newPrice-${id}`).value) || 0;
    const newQty = parseFloat(document.getElementById(`newQty-${id}`).value) || 0;
    
    const totalQuantity = oldQty + newQty;
    
    if (totalQuantity === 0) {
        document.getElementById(`rAvgStock-${id}`).innerText = "0";
        return;
    }
    
    const newAvgPrice = ((oldAvgPrice * oldQty) + (newPrice * newQty)) / totalQuantity;
    document.getElementById(`rAvgStock-${id}`).innerText = formatNumber(newAvgPrice);
}

// Calculate required quantity
function calcRequiredQty(id) {
    const targetAvgPrice = parseFloat(document.getElementById(`targetAvgPrice-${id}`).value) || 0;
    const oldQty = parseFloat(document.getElementById(`oldQtyReq-${id}`).value) || 0;
    const oldAvgPrice = parseFloat(document.getElementById(`oldAvgPriceReq-${id}`).value) || 0;
    const newPrice = parseFloat(document.getElementById(`newPriceReq-${id}`).value) || 0;
    
    const denominator = newPrice - targetAvgPrice;
    
    if (denominator === 0) {
        document.getElementById(`rRequiredQty-${id}`).innerText = "Invalid";
        document.getElementById(`rTotalPrice-${id}`).innerText = "0";
        return;
    }
    
    if (oldQty === 0) {
        document.getElementById(`rRequiredQty-${id}`).innerText = "0";
        document.getElementById(`rTotalPrice-${id}`).innerText = "0";
        return;
    }
    
    const requiredQty = (oldQty * (targetAvgPrice - oldAvgPrice)) / denominator;
    
    if (requiredQty < 0) {
        document.getElementById(`rRequiredQty-${id}`).innerText = "Not possible";
        document.getElementById(`rTotalPrice-${id}`).innerText = "0";
        return;
    }
    
    const totalPrice = requiredQty * newPrice;
    
    document.getElementById(`rRequiredQty-${id}`).innerText = formatNumber(requiredQty);
    document.getElementById(`rTotalPrice-${id}`).innerText = formatNumber(totalPrice);
}

// Calculate FIRE Number
function calcFireNumber(id) {
    const income = parseFloat(document.getElementById(`fireIncome-${id}`).value) || 0;
    const savings = parseFloat(document.getElementById(`fireSavings-${id}`).value) || 0;
    const withdrawalRate = parseFloat(document.getElementById(`fireWithdrawal-${id}`).value) || 4;
    
    if (withdrawalRate === 0) {
        document.getElementById(`rFireExpenses-${id}`).innerText = '0';
        document.getElementById(`rFireNumber-${id}`).innerText = '0';
        return;
    }
    
    const annualExpenses = income - savings;
    const fireNumber = annualExpenses / (withdrawalRate / 100);
    
    document.getElementById(`rFireExpenses-${id}`).innerText = formatNumber(annualExpenses);
    document.getElementById(`rFireNumber-${id}`).innerText = formatNumber(fireNumber);
}

// Calculate Years to FIRE
function calcYearsToFire(id) {
    const current = parseFloat(document.getElementById(`ytfCurrent-${id}`).value) || 0;
    const annual = parseFloat(document.getElementById(`ytfAnnual-${id}`).value) || 0;
    const target = parseFloat(document.getElementById(`ytfTarget-${id}`).value) || 0;
    const returnRate = parseFloat(document.getElementById(`ytfReturn-${id}`).value) || 10;
    
    if (target <= 0 || returnRate === 0) {
        document.getElementById(`rYearsToFire-${id}`).innerText = '0';
        return;
    }
    
    const r = returnRate / 100;
    let years = 0;
    let futureValue = current;
    
    while (futureValue < target && years < 1000) {
        futureValue = futureValue * (1 + r) + annual;
        years++;
    }
    
    document.getElementById(`rYearsToFire-${id}`).innerText = years >= 1000 ? 'Not achievable' : years.toFixed(1);
}

// Calculate FatFIRE
function calcFatFire(id) {
    const expenses = parseFloat(document.getElementById(`ffExpenses-${id}`).value) || 0;
    const withdrawalRate = parseFloat(document.getElementById(`ffWithdrawal-${id}`).value) || 4;
    
    if (withdrawalRate === 0) {
        document.getElementById(`rFatFire-${id}`).innerText = '0';
        return;
    }
    
    const fatFireNumber = expenses / (withdrawalRate / 100);
    
    document.getElementById(`rFatFire-${id}`).innerText = formatNumber(fatFireNumber);
}

// Calculate LeanFIRE
function calcLeanFire(id) {
    const expenses = parseFloat(document.getElementById(`lfExpenses-${id}`).value) || 0;
    const withdrawalRate = parseFloat(document.getElementById(`lfWithdrawal-${id}`).value) || 4;
    
    if (withdrawalRate === 0) {
        document.getElementById(`rLeanFire-${id}`).innerText = '0';
        return;
    }
    
    const leanFireNumber = expenses / (withdrawalRate / 100);
    
    document.getElementById(`rLeanFire-${id}`).innerText = formatNumber(leanFireNumber);
}

// Calculate Dividend
function calcDividend(id) {
    const shares = parseFloat(document.getElementById(`divShares-${id}`).value) || 0;
    const divPerShare = parseFloat(document.getElementById(`divPerShare-${id}`).value) || 0;
    const currentPrice = parseFloat(document.getElementById(`divCurrentPrice-${id}`).value) || 0;
    
    const annualDiv = shares * divPerShare;
    const investment = shares * currentPrice;
    const divYield = investment === 0 ? 0 : (annualDiv / investment) * 100;
    
    document.getElementById(`rDividend-${id}`).innerText = formatNumber(annualDiv);
    document.getElementById(`rDividendYield-${id}`).innerText = divYield.toFixed(2);
}

// Calculate Breakeven
function calcBreakeven(id) {
    const investment = parseFloat(document.getElementById(`beInvestment-${id}`).value) || 0;
    const shares = parseFloat(document.getElementById(`beShares-${id}`).value) || 0;
    const brokerage = parseFloat(document.getElementById(`beBrokerage-${id}`).value) || 0;
    
    if (shares === 0) {
        document.getElementById(`rBreakeven-${id}`).innerText = '0';
        return;
    }
    
    const breakeven = (investment + brokerage) / shares;
    document.getElementById(`rBreakeven-${id}`).innerText = formatNumber(breakeven);
}

// Calculate Compound Interest
function calcCompound(id) {
    const principal = parseFloat(document.getElementById(`cpPrincipal-${id}`).value) || 0;
    const rate = parseFloat(document.getElementById(`cpRate-${id}`).value) || 0;
    const years = parseFloat(document.getElementById(`cpYears-${id}`).value) || 0;
    
    if (years === 0) {
        document.getElementById(`rCompoundAmount-${id}`).innerText = '0';
        document.getElementById(`rCompoundInterest-${id}`).innerText = '0';
        return;
    }
    
    const amount = principal * Math.pow(1 + rate / 100, years);
    const interest = amount - principal;
    
    document.getElementById(`rCompoundAmount-${id}`).innerText = formatNumber(amount);
    document.getElementById(`rCompoundInterest-${id}`).innerText = formatNumber(interest);
}

// Calculate Investment Goal
function calcInvestmentGoal(id) {
    const target = parseFloat(document.getElementById(`igTarget-${id}`).value) || 0;
    const years = parseFloat(document.getElementById(`igYears-${id}`).value) || 0;
    const returnRate = parseFloat(document.getElementById(`igReturn-${id}`).value) || 0;
    
    if (years === 0 || target === 0) {
        document.getElementById(`rInvestmentGoal-${id}`).innerText = '0';
        return;
    }
    
    const monthlyRate = returnRate / 100 / 12;
    const months = years * 12;
    
    let emi = 0;
    if (monthlyRate === 0) {
        emi = target / months;
    } else {
        emi = target * (monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
    }
    
    document.getElementById(`rInvestmentGoal-${id}`).innerText = formatNumber(emi);
}

// Calculate Cost of Delay
function calcCostOfDelay(id) {
    const amount = parseFloat(document.getElementById(`codAmount-${id}`).value) || 0;
    const returnRate = parseFloat(document.getElementById(`codReturn-${id}`).value) || 0;
    const delayYears = parseFloat(document.getElementById(`codDelay-${id}`).value) || 0;
    
    const cost = amount * (Math.pow(1 + returnRate / 100, delayYears) - 1);
    
    document.getElementById(`rCostOfDelay-${id}`).innerText = formatNumber(cost);
}

// Calculate Retirement Age
function calcRetirementAge(id) {
    const currentAge = parseFloat(document.getElementById(`raAge-${id}`).value) || 0;
    const currentSavings = parseFloat(document.getElementById(`raCurrent-${id}`).value) || 0;
    const annualSavings = parseFloat(document.getElementById(`raAnnual-${id}`).value) || 0;
    const target = parseFloat(document.getElementById(`raTarget-${id}`).value) || 0;
    const returnRate = parseFloat(document.getElementById(`raReturn-${id}`).value) || 0;
    
    if (target <= 0) {
        document.getElementById(`rRetirementAge-${id}`).innerText = '0';
        return;
    }
    
    const r = returnRate / 100;
    let futureValue = currentSavings;
    let years = 0;
    
    while (futureValue < target && years < 100) {
        futureValue = futureValue * (1 + r) + annualSavings;
        years++;
    }
    
    const retirementAge = currentAge + years;
    document.getElementById(`rRetirementAge-${id}`).innerText = retirementAge.toFixed(0);
}

// Calculate Loan EMI
function calcLoanEmi(id) {
    const principal = parseFloat(document.getElementById(`loanPrincipal-${id}`).value) || 0;
    const rate = parseFloat(document.getElementById(`loanRate-${id}`).value) || 0;
    const years = parseFloat(document.getElementById(`loanYears-${id}`).value) || 0;
    
    if (years === 0 || rate === 0) {
        document.getElementById(`rLoanEmi-${id}`).innerText = '0';
        document.getElementById(`rLoanInterest-${id}`).innerText = '0';
        return;
    }
    
    const monthlyRate = rate / 100 / 12;
    const months = years * 12;
    
    const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
    const totalAmount = emi * months;
    const totalInterest = totalAmount - principal;
    
    document.getElementById(`rLoanEmi-${id}`).innerText = formatNumber(emi);
    document.getElementById(`rLoanInterest-${id}`).innerText = formatNumber(totalInterest);
}

// Calculate Property ROI
function calcPropertyRoi(id) {
    const investment = parseFloat(document.getElementById(`propInvestment-${id}`).value) || 0;
    const annualRent = parseFloat(document.getElementById(`propAnnualRent-${id}`).value) || 0;
    const currentValue = parseFloat(document.getElementById(`propCurrentValue-${id}`).value) || 0;
    
    if (investment === 0) {
        document.getElementById(`rPropertyYield-${id}`).innerText = '0';
        document.getElementById(`rPropertyRoi-${id}`).innerText = '0';
        return;
    }
    
    const rentalYield = (annualRent / investment) * 100;
    const totalReturn = ((currentValue + annualRent - investment) / investment) * 100;
    
    document.getElementById(`rPropertyYield-${id}`).innerText = rentalYield.toFixed(2);
    document.getElementById(`rPropertyRoi-${id}`).innerText = totalReturn.toFixed(2);
}

// Calculate Mortgage
function calcMortgage(id) {
    const price = parseFloat(document.getElementById(`mortgagePrice-${id}`).value) || 0;
    const ltv = parseFloat(document.getElementById(`mortgageLtv-${id}`).value) || 80;
    const rate = parseFloat(document.getElementById(`mortgageRate-${id}`).value) || 0;
    const years = parseFloat(document.getElementById(`mortgageYears-${id}`).value) || 0;
    
    if (years === 0) {
        document.getElementById(`rMortgageLoan-${id}`).innerText = '0';
        document.getElementById(`rMortgageEmi-${id}`).innerText = '0';
        document.getElementById(`rMortgageInterest-${id}`).innerText = '0';
        return;
    }
    
    const loanAmount = price * (ltv / 100);
    const monthlyRate = rate / 100 / 12;
    const months = years * 12;
    
    let emi = 0, totalInterest = 0;
    if (monthlyRate === 0) {
        emi = loanAmount / months;
        totalInterest = 0;
    } else {
        emi = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
        totalInterest = (emi * months) - loanAmount;
    }
    
    document.getElementById(`rMortgageLoan-${id}`).innerText = formatNumber(loanAmount);
    document.getElementById(`rMortgageEmi-${id}`).innerText = formatNumber(emi);
    document.getElementById(`rMortgageInterest-${id}`).innerText = formatNumber(totalInterest);
}

// Calculate Rule of 72
function calcRule72(id) {
    const rate = parseFloat(document.getElementById(`rule72Rate-${id}`).value) || 0;
    
    if (rate === 0) {
        document.getElementById(`rRule72-${id}`).innerText = '0';
        return;
    }
    
    const years = 72 / rate;
    document.getElementById(`rRule72-${id}`).innerText = years.toFixed(2);
}

// Calculate Inflation
function calcInflation(id) {
    const amount = parseFloat(document.getElementById(`inflationAmount-${id}`).value) || 0;
    const inflationRate = parseFloat(document.getElementById(`inflationRate-${id}`).value) || 0;
    const years = parseFloat(document.getElementById(`inflationYears-${id}`).value) || 0;
    
    if (years === 0) {
        document.getElementById(`rInflation-${id}`).innerText = formatNumber(amount);
        return;
    }
    
    const futureValue = amount / Math.pow(1 + inflationRate / 100, years);
    document.getElementById(`rInflation-${id}`).innerText = formatNumber(futureValue);
}

// Calculate Expense Ratio
function calcExpenseRatio(id) {
    const fundValue = parseFloat(document.getElementById(`erFundValue-${id}`).value) || 0;
    const expenseRatio = parseFloat(document.getElementById(`erExpenseRatio-${id}`).value) || 0;
    const grossReturn = parseFloat(document.getElementById(`erGrossReturn-${id}`).value) || 0;
    
    const annualFee = fundValue * (expenseRatio / 100);
    const netReturn = grossReturn - expenseRatio;
    
    document.getElementById(`rExpenseRatioFee-${id}`).innerText = formatNumber(annualFee);
    document.getElementById(`rExpenseRatioNet-${id}`).innerText = netReturn.toFixed(2);
}

// Calculate Emergency Fund
function calcEmergencyFund(id) {
    const expenses = parseFloat(document.getElementById(`efExpenses-${id}`).value) || 0;
    const months = parseFloat(document.getElementById(`efMonths-${id}`).value) || 0;
    
    const emergencyFund = expenses * months;
    document.getElementById(`rEmergencyFund-${id}`).innerText = formatNumber(emergencyFund);
}

// Calculate Monthly Savings
function calcMonthlySavings(id) {
    const target = parseFloat(document.getElementById(`msTarget-${id}`).value) || 0;
    const rate = parseFloat(document.getElementById(`msRate-${id}`).value) || 0;
    const years = parseFloat(document.getElementById(`msYears-${id}`).value) || 0;
    
    if (years === 0 || target === 0) {
        document.getElementById(`rMonthlySavings-${id}`).innerText = '0';
        return;
    }
    
    const monthlyRate = rate / 100 / 12;
    const months = years * 12;
    
    let savings = 0;
    if (monthlyRate === 0) {
        savings = target / months;
    } else {
        savings = target * monthlyRate / (Math.pow(1 + monthlyRate, months) - 1);
    }
    
    document.getElementById(`rMonthlySavings-${id}`).innerText = formatNumber(savings);
}

// Calculate Budget Allocator
function calcBudgetAllocator(id) {
    const income = parseFloat(document.getElementById(`baIncome-${id}`).value) || 0;
    const needsPercent = parseFloat(document.getElementById(`baNeedsPercent-${id}`).value) || 0;
    const wantsPercent = parseFloat(document.getElementById(`baWantsPercent-${id}`).value) || 0;
    const savingsPercent = parseFloat(document.getElementById(`baSavingsPercent-${id}`).value) || 0;
    
    const totalPercent = needsPercent + wantsPercent + savingsPercent;
    
    const needs = income * (needsPercent / 100);
    const wants = income * (wantsPercent / 100);
    const savings = income * (savingsPercent / 100);
    
    document.getElementById(`rBudgetNeeds-${id}`).innerText = formatNumber(needs);
    document.getElementById(`rBudgetWants-${id}`).innerText = formatNumber(wants);
    document.getElementById(`rBudgetSavings-${id}`).innerText = formatNumber(savings);
    document.getElementById(`rBudgetTotal-${id}`).innerText = totalPercent.toFixed(1);
}

// Calculate Debt Payoff
function calcDebtPayoff(id) {
    const debt = parseFloat(document.getElementById(`dpDebt-${id}`).value) || 0;
    const payment = parseFloat(document.getElementById(`dpPayment-${id}`).value) || 0;
    const rate = parseFloat(document.getElementById(`dpRate-${id}`).value) || 0;
    
    if (payment === 0 || debt === 0) {
        document.getElementById(`rDebtPayoffMonths-${id}`).innerText = '0';
        document.getElementById(`rDebtPayoffTotal-${id}`).innerText = '0';
        return;
    }
    
    const monthlyRate = rate / 100 / 12;
    let balance = debt;
    let months = 0;
    let totalPaid = 0;
    
    while (balance > 0 && months < 600) {
        const interest = balance * monthlyRate;
        const principal = payment - interest;
        
        if (principal <= 0) break;
        
        balance -= principal;
        totalPaid += payment;
        months++;
    }
    
    document.getElementById(`rDebtPayoffMonths-${id}`).innerText = months.toFixed(0);
    document.getElementById(`rDebtPayoffTotal-${id}`).innerText = formatNumber(totalPaid);
}

// Calculate Credit Card Payoff
function calcCreditCardPayoff(id) {
    const balance = parseFloat(document.getElementById(`ccBalance-${id}`).value) || 0;
    const payment = parseFloat(document.getElementById(`ccPayment-${id}`).value) || 0;
    const rate = parseFloat(document.getElementById(`ccRate-${id}`).value) || 0;
    
    if (payment === 0 || balance === 0) {
        document.getElementById(`rCCPayoffMonths-${id}`).innerText = '0';
        document.getElementById(`rCCPayoffInterest-${id}`).innerText = '0';
        return;
    }
    
    const monthlyRate = rate / 100 / 12;
    let currentBalance = balance;
    let months = 0;
    let totalInterest = 0;
    
    while (currentBalance > 0 && months < 600) {
        const interest = currentBalance * monthlyRate;
        currentBalance = currentBalance + interest - payment;
        totalInterest += interest;
        months++;
    }
    
    document.getElementById(`rCCPayoffMonths-${id}`).innerText = months.toFixed(0);
    document.getElementById(`rCCPayoffInterest-${id}`).innerText = formatNumber(totalInterest);
}

// Calculate Debt Consolidation
function calcDebtConsolidation(id) {
    const totalDebt = parseFloat(document.getElementById(`dcTotalDebt-${id}`).value) || 0;
    const rate = parseFloat(document.getElementById(`dcRate-${id}`).value) || 0;
    const years = parseFloat(document.getElementById(`dcYears-${id}`).value) || 0;
    
    if (years === 0 || totalDebt === 0) {
        document.getElementById(`rDebtConsolidationEmi-${id}`).innerText = '0';
        document.getElementById(`rDebtConsolidationInterest-${id}`).innerText = '0';
        return;
    }
    
    const monthlyRate = rate / 100 / 12;
    const months = years * 12;
    
    let emi = 0, totalInterest = 0;
    if (monthlyRate === 0) {
        emi = totalDebt / months;
        totalInterest = 0;
    } else {
        emi = (totalDebt * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
        totalInterest = (emi * months) - totalDebt;
    }
    
    document.getElementById(`rDebtConsolidationEmi-${id}`).innerText = formatNumber(emi);
    document.getElementById(`rDebtConsolidationInterest-${id}`).innerText = formatNumber(totalInterest);
}

// Calculate CAGR
function calcCAGR(id) {
    const beginning = parseFloat(document.getElementById(`cagrBeginning-${id}`).value) || 0;
    const ending = parseFloat(document.getElementById(`cagrEnding-${id}`).value) || 0;
    const years = parseFloat(document.getElementById(`cagrYears-${id}`).value) || 0;
    
    if (years === 0 || beginning === 0) {
        document.getElementById(`rCAGR-${id}`).innerText = '0';
        return;
    }
    
    const cagr = (Math.pow(ending / beginning, 1 / years) - 1) * 100;
    document.getElementById(`rCAGR-${id}`).innerText = cagr.toFixed(2);
}

// Calculate ROI
function calcROI(id) {
    const initial = parseFloat(document.getElementById(`roiInitial-${id}`).value) || 0;
    const final = parseFloat(document.getElementById(`roiFinal-${id}`).value) || 0;
    
    if (initial === 0) {
        document.getElementById(`rROI-${id}`).innerText = '0';
        return;
    }
    
    const roi = ((final - initial) / initial) * 100;
    document.getElementById(`rROI-${id}`).innerText = roi.toFixed(2);
}

// Calculate DRIP
function calcDRIP(id) {
    const initial = parseFloat(document.getElementById(`dripInitial-${id}`).value) || 0;
    const dividend = parseFloat(document.getElementById(`dripDividend-${id}`).value) || 0;
    const years = parseFloat(document.getElementById(`dripYears-${id}`).value) || 0;
    
    if (years === 0) {
        document.getElementById(`rDRIPValue-${id}`).innerText = formatNumber(initial);
        return;
    }
    
    const finalValue = initial * Math.pow(1 + dividend / 100, years);
    document.getElementById(`rDRIPValue-${id}`).innerText = formatNumber(finalValue);
}

// Calculate DCA
function calcDCA(id) {
    const monthly = parseFloat(document.getElementById(`dcaMonthly-${id}`).value) || 0;
    const rate = parseFloat(document.getElementById(`dcaRate-${id}`).value) || 0;
    const months = parseFloat(document.getElementById(`dcaMonths-${id}`).value) || 0;
    
    if (months === 0) {
        document.getElementById(`rDCAInvested-${id}`).innerText = '0';
        document.getElementById(`rDCAValue-${id}`).innerText = '0';
        return;
    }
    
    const totalInvested = monthly * months;
    const monthlyRate = rate / 100 / 12;
    
    let finalValue = 0;
    if (monthlyRate === 0) {
        finalValue = totalInvested;
    } else {
        finalValue = monthly * (Math.pow(1 + monthlyRate, months) - 1) / monthlyRate * (1 + monthlyRate);
    }
    
    document.getElementById(`rDCAInvested-${id}`).innerText = formatNumber(totalInvested);
    document.getElementById(`rDCAValue-${id}`).innerText = formatNumber(finalValue);
}

// Calculate Net Worth
function calcNetWorth(id) {
    const assets = parseFloat(document.getElementById(`nwAssets-${id}`).value) || 0;
    const liabilities = parseFloat(document.getElementById(`nwLiabilities-${id}`).value) || 0;
    
    const netWorth = assets - liabilities;
    document.getElementById(`rNetWorth-${id}`).innerText = formatNumber(netWorth);
}

// Calculate Wealth Projection
function calcWealthProjection(id) {
    const initial = parseFloat(document.getElementById(`wpInitial-${id}`).value) || 0;
    const monthly = parseFloat(document.getElementById(`wpMonthly-${id}`).value) || 0;
    const rate = parseFloat(document.getElementById(`wpRate-${id}`).value) || 0;
    const years = parseFloat(document.getElementById(`wpYears-${id}`).value) || 0;
    
    if (years === 0) {
        document.getElementById(`rWealthProjection-${id}`).innerText = formatNumber(initial);
        return;
    }
    
    const months = years * 12;
    const monthlyRate = rate / 100 / 12;
    
    let finalWealth = initial * Math.pow(1 + monthlyRate, months);
    if (monthlyRate === 0) {
        finalWealth += monthly * months;
    } else {
        finalWealth += monthly * (Math.pow(1 + monthlyRate, months) - 1) / monthlyRate;
    }
    
    document.getElementById(`rWealthProjection-${id}`).innerText = formatNumber(finalWealth);
}

// Calculate Millionaire Timeline
function calcMillionaireTimeline(id) {
    const current = parseFloat(document.getElementById(`mtCurrent-${id}`).value) || 0;
    const monthly = parseFloat(document.getElementById(`mtMonthly-${id}`).value) || 0;
    const rate = parseFloat(document.getElementById(`mtRate-${id}`).value) || 0;
    
    const monthlyRate = rate / 100 / 12;
    let wealth = current;
    let years = 0;
    
    while (wealth < 1000000 && years < 100) {
        wealth = wealth * (1 + monthlyRate) + monthly;
        years += 1/12;
    }
    
    document.getElementById(`rMillionaireYears-${id}`).innerText = years.toFixed(1);
}

// Calculate Home Affordability
function calcHomeAffordability(id) {
    const income = parseFloat(document.getElementById(`haIncome-${id}`).value) || 0;
    const savings = parseFloat(document.getElementById(`haSavings-${id}`).value) || 0;
    const tenure = parseFloat(document.getElementById(`haTenure-${id}`).value) || 0;
    
    const borrowingCapacity = income * 3 * tenure * 12;
    const affordablePrice = borrowingCapacity + savings;
    
    document.getElementById(`rHomeAffordable-${id}`).innerText = formatNumber(affordablePrice);
}

// Calculate Rent vs Buy
function calcRentVsBuy(id) {
    const rent = parseFloat(document.getElementById(`rvbRent-${id}`).value) || 0;
    const emi = parseFloat(document.getElementById(`rvbEmi-${id}`).value) || 0;
    const years = parseFloat(document.getElementById(`rvbYears-${id}`).value) || 0;
    
    const months = years * 12;
    const rentTotal = rent * months;
    const buyTotal = emi * months;
    
    document.getElementById(`rRentTotal-${id}`).innerText = formatNumber(rentTotal);
    document.getElementById(`rBuyTotal-${id}`).innerText = formatNumber(buyTotal);
}

// Calculate Property Appreciation
function calcPropertyAppreciation(id) {
    const current = parseFloat(document.getElementById(`paCurrent-${id}`).value) || 0;
    const rate = parseFloat(document.getElementById(`paRate-${id}`).value) || 0;
    const years = parseFloat(document.getElementById(`paYears-${id}`).value) || 0;
    
    if (years === 0) {
        document.getElementById(`rPropertyFutureValue-${id}`).innerText = formatNumber(current);
        return;
    }
    
    const futureValue = current * Math.pow(1 + rate / 100, years);
    document.getElementById(`rPropertyFutureValue-${id}`).innerText = formatNumber(futureValue);
}

// Calculate Annuity/Corpus
function calcAnnuityCorpus(id) {
    const withdrawal = parseFloat(document.getElementById(`acWithdrawal-${id}`).value) || 0;
    const rate = parseFloat(document.getElementById(`acRate-${id}`).value) || 0;
    
    if (rate === 0) {
        document.getElementById(`rAnnuityCorpus-${id}`).innerText = '0';
        return;
    }
    
    const corpus = withdrawal / (rate / 100);
    document.getElementById(`rAnnuityCorpus-${id}`).innerText = formatNumber(corpus);
}

// Calculate Retirement Income
function calcRetirementIncome(id) {
    const corpus = parseFloat(document.getElementById(`ricCorpus-${id}`).value) || 0;
    const rate = parseFloat(document.getElementById(`ricRate-${id}`).value) || 0;
    
    const annualIncome = corpus * (rate / 100);
    const monthlyIncome = annualIncome / 12;
    
    document.getElementById(`rRetirementMonthly-${id}`).innerText = formatNumber(monthlyIncome);
    document.getElementById(`rRetirementAnnual-${id}`).innerText = formatNumber(annualIncome);
}

// Calculate Inflation-Adjusted Corpus
function calcInflationCorpus(id) {
    const corpus = parseFloat(document.getElementById(`icCorpus-${id}`).value) || 0;
    const inflation = parseFloat(document.getElementById(`icInflation-${id}`).value) || 0;
    const years = parseFloat(document.getElementById(`icYears-${id}`).value) || 0;
    
    if (years === 0) {
        document.getElementById(`rInflationCorpus-${id}`).innerText = formatNumber(corpus);
        return;
    }
    
    const adjustedCorpus = corpus * Math.pow(1 + inflation / 100, years);
    document.getElementById(`rInflationCorpus-${id}`).innerText = formatNumber(adjustedCorpus);
}

// Calculate Car Loan EMI
function calcCarLoanEmi(id) {
    const loan = parseFloat(document.getElementById(`ceLoan-${id}`).value) || 0;
    const rate = parseFloat(document.getElementById(`ceRate-${id}`).value) || 0;
    const years = parseFloat(document.getElementById(`ceYears-${id}`).value) || 0;
    
    if (years === 0) {
        document.getElementById(`rCarEmi-${id}`).innerText = '0';
        document.getElementById(`rCarInterest-${id}`).innerText = '0';
        return;
    }
    
    const monthlyRate = rate / 100 / 12;
    const months = years * 12;
    
    let emi = 0, totalInterest = 0;
    if (monthlyRate === 0) {
        emi = loan / months;
        totalInterest = 0;
    } else {
        emi = (loan * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
        totalInterest = (emi * months) - loan;
    }
    
    document.getElementById(`rCarEmi-${id}`).innerText = formatNumber(emi);
    document.getElementById(`rCarInterest-${id}`).innerText = formatNumber(totalInterest);
}

// Calculate Depreciation
function calcDepreciation(id) {
    const current = parseFloat(document.getElementById(`depCurrent-${id}`).value) || 0;
    const rate = parseFloat(document.getElementById(`depRate-${id}`).value) || 0;
    const years = parseFloat(document.getElementById(`depYears-${id}`).value) || 0;
    
    if (years === 0) {
        document.getElementById(`rDepreciationValue-${id}`).innerText = formatNumber(current);
        return;
    }
    
    const futureValue = current * Math.pow(1 - rate / 100, years);
    document.getElementById(`rDepreciationValue-${id}`).innerText = formatNumber(futureValue);
}

// Calculate Life Insurance Needs
function calcLifeInsurance(id) {
    const annualExpense = parseFloat(document.getElementById(`linAnnualExpense-${id}`).value) || 0;
    const years = parseFloat(document.getElementById(`linYears-${id}`).value) || 0;
    const debts = parseFloat(document.getElementById(`linDebts-${id}`).value) || 0;
    const assets = parseFloat(document.getElementById(`linAssets-${id}`).value) || 0;
    
    const coverageNeeded = (annualExpense * years) + debts - assets;
    document.getElementById(`rLifeInsuranceCoverage-${id}`).innerText = formatNumber(Math.max(0, coverageNeeded));
}

// Calculate Term Insurance Premium
function calcTermInsurance(id) {
    const coverage = parseFloat(document.getElementById(`tipCoverage-${id}`).value) || 0;
    const age = parseFloat(document.getElementById(`tipAge-${id}`).value) || 0;
    const term = parseFloat(document.getElementById(`tipTerm-${id}`).value) || 0;
    
    const baseRate = 50;
    const ageFactor = 1 + (age - 25) * 0.02;
    const termFactor = 1 + (term - 10) * 0.02;
    
    const annualPremium = (coverage / 100000) * ageFactor * termFactor * baseRate;
    document.getElementById(`rTermPremium-${id}`).innerText = formatNumber(annualPremium);
}

// Calculate Education Fund
function calcEducationFund(id) {
    const target = parseFloat(document.getElementById(`efTarget-${id}`).value) || 0;
    const rate = parseFloat(document.getElementById(`efRate-${id}`).value) || 0;
    const years = parseFloat(document.getElementById(`efYears-${id}`).value) || 0;
    
    if (years === 0 || target === 0) {
        document.getElementById(`rEducationMonthly-${id}`).innerText = '0';
        return;
    }
    
    const monthlyRate = rate / 100 / 12;
    const months = years * 12;
    
    let savings = 0;
    if (monthlyRate === 0) {
        savings = target / months;
    } else {
        savings = target * monthlyRate / (Math.pow(1 + monthlyRate, months) - 1);
    }
    
    document.getElementById(`rEducationMonthly-${id}`).innerText = formatNumber(savings);
}

// Calculate College Cost Projection
function calcCollegeCost(id) {
    const current = parseFloat(document.getElementById(`ccCurrent-${id}`).value) || 0;
    const inflation = parseFloat(document.getElementById(`ccInflation-${id}`).value) || 0;
    const years = parseFloat(document.getElementById(`ccYears-${id}`).value) || 0;
    
    if (years === 0) {
        document.getElementById(`rCollegeFutureCost-${id}`).innerText = formatNumber(current);
        return;
    }
    
    const futureCost = current * Math.pow(1 + inflation / 100, years);
    document.getElementById(`rCollegeFutureCost-${id}`).innerText = formatNumber(futureCost);
}

// Salary Calculator
function calcSalary(id) {
    const gross = parseFloat(document.getElementById(`scGross-${id}`).value) || 0;
    const taxRate = parseFloat(document.getElementById(`scTaxRate-${id}`).value) || 0;
    const deductions = parseFloat(document.getElementById(`scDeductions-${id}`).value) || 0;
    
    const tax = gross * (taxRate / 100);
    const net = gross - tax - deductions;
    
    document.getElementById(`rNetSalary-${id}`).innerText = formatNumber(net);
    document.getElementById(`rTaxAmount-${id}`).innerText = formatNumber(tax);
}

// Side Hustle Income Calculator
function calcSideHustle(id) {
    const rate = parseFloat(document.getElementById(`shiRate-${id}`).value) || 0;
    const hours = parseFloat(document.getElementById(`shiHours-${id}`).value) || 0;
    const expenses = parseFloat(document.getElementById(`shiExpenses-${id}`).value) || 0;
    
    const gross = rate * hours;
    const net = gross - expenses;
    
    document.getElementById(`rGrossIncome-${id}`).innerText = formatNumber(gross);
    document.getElementById(`rNetIncome-${id}`).innerText = formatNumber(net);
}

// Freelance Rate Calculator
function calcFreelanceRate(id) {
    const salary = parseFloat(document.getElementById(`frSalary-${id}`).value) || 0;
    const markup = parseFloat(document.getElementById(`frMarkup-${id}`).value) || 0;
    
    if (salary === 0) {
        document.getElementById(`rHourlyRate-${id}`).innerText = '0';
        return;
    }
    
    const baseRate = salary / 2000;
    const rate = baseRate * (1 + markup / 100);
    
    document.getElementById(`rHourlyRate-${id}`).innerText = formatNumber(rate);
}

// Savings Rate Calculator
function calcSavingsRate(id) {
    const income = parseFloat(document.getElementById(`srIncome-${id}`).value) || 0;
    const savings = parseFloat(document.getElementById(`srSavings-${id}`).value) || 0;
    
    if (income === 0) {
        document.getElementById(`rSavingsRate-${id}`).innerText = '0%';
        document.getElementById(`rMonthlySpending-${id}`).innerText = '0';
        return;
    }
    
    const rate = (savings / income) * 100;
    const spending = income - savings;
    
    document.getElementById(`rSavingsRate-${id}`).innerText = (rate.toFixed(2)) + '%';
    document.getElementById(`rMonthlySpending-${id}`).innerText = formatNumber(spending);
}

// Goal Tracker Calculator
function calcGoalTracker(id) {
    const target = parseFloat(document.getElementById(`gtTarget-${id}`).value) || 0;
    const current = parseFloat(document.getElementById(`gtCurrent-${id}`).value) || 0;
    
    if (target === 0) {
        document.getElementById(`rProgress-${id}`).innerText = '0%';
        document.getElementById(`rRemaining-${id}`).innerText = '0';
        return;
    }
    
    const progress = (current / target) * 100;
    const remaining = target - current;
    
    document.getElementById(`rProgress-${id}`).innerText = (progress.toFixed(2)) + '%';
    document.getElementById(`rRemaining-${id}`).innerText = formatNumber(remaining);
}

// Expense Tracker Calculator
function calcExpenseTracker(id) {
    const food = parseFloat(document.getElementById(`etFood-${id}`).value) || 0;
    const transport = parseFloat(document.getElementById(`etTransport-${id}`).value) || 0;
    const entertainment = parseFloat(document.getElementById(`etEntertainment-${id}`).value) || 0;
    const other = parseFloat(document.getElementById(`etOther-${id}`).value) || 0;
    const income = parseFloat(document.getElementById(`etIncome-${id}`).value) || 0;
    
    const total = food + transport + entertainment + other;
    let ratio = 0;
    
    if (income > 0) {
        ratio = (total / income) * 100;
    }
    
    document.getElementById(`rTotalExpenses-${id}`).innerText = formatNumber(total);
    document.getElementById(`rExpenseRatio-${id}`).innerText = (ratio.toFixed(2)) + '%';
}

// Loan Comparison Calculator
function calcLoanComparison(id) {
    const principal1 = parseFloat(document.getElementById(`lcLoan1Principal-${id}`).value) || 0;
    const rate1 = parseFloat(document.getElementById(`lcLoan1Rate-${id}`).value) || 0;
    const tenure1 = parseFloat(document.getElementById(`lcLoan1Tenure-${id}`).value) || 0;
    const principal2 = parseFloat(document.getElementById(`lcLoan2Principal-${id}`).value) || 0;
    const rate2 = parseFloat(document.getElementById(`lcLoan2Rate-${id}`).value) || 0;
    const tenure2 = parseFloat(document.getElementById(`lcLoan2Tenure-${id}`).value) || 0;
    
    const calcEMI = (p, r, t) => {
        if (r === 0) return p / (t * 12);
        const monthlyRate = r / 100 / 12;
        const months = t * 12;
        return (p * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
    };
    
    const emi1 = calcEMI(principal1, rate1, tenure1);
    const interest1 = (emi1 * tenure1 * 12) - principal1;
    const emi2 = calcEMI(principal2, rate2, tenure2);
    const interest2 = (emi2 * tenure2 * 12) - principal2;
    
    document.getElementById(`rLoan1EMI-${id}`).innerText = formatNumber(emi1);
    document.getElementById(`rLoan1Interest-${id}`).innerText = formatNumber(interest1);
    document.getElementById(`rLoan2EMI-${id}`).innerText = formatNumber(emi2);
    document.getElementById(`rLoan2Interest-${id}`).innerText = formatNumber(interest2);
}

// Payback Period Calculator
function calcPaybackPeriod(id) {
    const investment = parseFloat(document.getElementById(`ppInvestment-${id}`).value) || 0;
    const cashFlow = parseFloat(document.getElementById(`ppAnnualCash-${id}`).value) || 0;
    
    if (cashFlow === 0) {
        document.getElementById(`rPaybackYears-${id}`).innerText = '∞';
        return;
    }
    
    const payback = investment / cashFlow;
    document.getElementById(`rPaybackYears-${id}`).innerText = (payback.toFixed(2));
}

// Early Loan Payoff Calculator
function calcEarlyPayoff(id) {
    const principal = parseFloat(document.getElementById(`epPrincipal-${id}`).value) || 0;
    const rate = parseFloat(document.getElementById(`epRate-${id}`).value) || 0;
    const tenure = parseFloat(document.getElementById(`epTenure-${id}`).value) || 0;
    const extraPayment = parseFloat(document.getElementById(`epExtraPayment-${id}`).value) || 0;
    
    const monthlyRate = rate / 100 / 12;
    const months = tenure * 12;
    const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
    const totalEMI = emi + extraPayment;
    
    let balance = principal;
    let newMonths = 0;
    
    while (balance > 0 && newMonths < 600) {
        const interest = balance * monthlyRate;
        const principal_payment = totalEMI - interest;
        balance -= principal_payment;
        newMonths++;
    }
    
    const newTenure = newMonths / 12;
    const regularTotalInterest = (emi * months) - principal;
    const newTotalInterest = (emi * newMonths) + (extraPayment * newMonths) - principal;
    const saved = regularTotalInterest - newTotalInterest;
    
    document.getElementById(`rRegularEMI-${id}`).innerText = formatNumber(emi);
    document.getElementById(`rNewPayoff-${id}`).innerText = (newTenure.toFixed(2));
    document.getElementById(`rSavedInterest-${id}`).innerText = formatNumber(Math.max(saved, 0));
}

// P/E Ratio Calculator
function calcPERatio(id) {
    const price = parseFloat(document.getElementById(`perPrice-${id}`).value) || 0;
    const eps = parseFloat(document.getElementById(`perEPS-${id}`).value) || 0;
    
    if (eps === 0) {
        document.getElementById(`rPERatio-${id}`).innerText = '∞';
        return;
    }
    
    const ratio = price / eps;
    document.getElementById(`rPERatio-${id}`).innerText = (ratio.toFixed(2));
}

// Dividend Growth Calculator
function calcDividendGrowth(id) {
    const current = parseFloat(document.getElementById(`dgCurrent-${id}`).value) || 0;
    const rate = parseFloat(document.getElementById(`dgGrowthRate-${id}`).value) || 0;
    const years = parseFloat(document.getElementById(`dgYears-${id}`).value) || 0;
    
    const future = current * Math.pow(1 + rate / 100, years);
    document.getElementById(`rFutureDividend-${id}`).innerText = formatNumber(future);
}

// Portfolio Rebalancing Calculator
function calcPortfolioRebalancing(id) {
    const stocks = parseFloat(document.getElementById(`prStockValue-${id}`).value) || 0;
    const bonds = parseFloat(document.getElementById(`prBondValue-${id}`).value) || 0;
    const targetStock = parseFloat(document.getElementById(`prTargetStock-${id}`).value) || 0;
    
    const total = stocks + bonds;
    if (total === 0) {
        document.getElementById(`rTotalPortfolio-${id}`).innerText = '0';
        document.getElementById(`rStocksAdjustment-${id}`).innerText = '0';
        document.getElementById(`rBondsAdjustment-${id}`).innerText = '0';
        return;
    }
    
    const targetStockValue = total * (targetStock / 100);
    const targetBondValue = total * (1 - targetStock / 100);
    const stocksAdj = targetStockValue - stocks;
    const bondsAdj = targetBondValue - bonds;
    
    document.getElementById(`rTotalPortfolio-${id}`).innerText = formatNumber(total);
    document.getElementById(`rStocksAdjustment-${id}`).innerText = formatNumber(stocksAdj);
    document.getElementById(`rBondsAdjustment-${id}`).innerText = formatNumber(bondsAdj);
}

// Tax Loss Harvesting Calculator
function calcTaxLossHarvesting(id) {
    const loss = parseFloat(document.getElementById(`tlhLoss-${id}`).value) || 0;
    const taxRate = parseFloat(document.getElementById(`tlhTaxRate-${id}`).value) || 0;
    
    const saved = loss * (taxRate / 100);
    document.getElementById(`rTaxSaved-${id}`).innerText = formatNumber(saved);
}

// Tax Bracket Calculator
function calcTaxBracket(id) {
    const income = parseFloat(document.getElementById(`tbIncome-${id}`).value) || 0;
    
    // Indian tax brackets (2024)
    let tax = 0;
    if (income > 1500000) tax += (income - 1500000) * 0.30;
    else if (income > 1000000) tax += (income - 1000000) * 0.20;
    else if (income > 500000) tax += (income - 500000) * 0.10;
    else if (income > 250000) tax += (income - 250000) * 0.05;
    
    const effectiveRate = income > 0 ? (tax / income) * 100 : 0;
    
    document.getElementById(`rTotalTax-${id}`).innerText = formatNumber(tax);
    document.getElementById(`rEffectiveRate-${id}`).innerText = (effectiveRate.toFixed(2)) + '%';
}

// Gift/Inheritance Tax Calculator
function calcGiftTax(id) {
    const amount = parseFloat(document.getElementById(`gtAmount-${id}`).value) || 0;
    const rate = parseFloat(document.getElementById(`gtRate-${id}`).value) || 0;
    
    const tax = amount * (rate / 100);
    const net = amount - tax;
    
    document.getElementById(`rTaxAmount-${id}`).innerText = formatNumber(tax);
    document.getElementById(`rNetReceived-${id}`).innerText = formatNumber(net);
}

// Business Profit Calculator
function calcBusinessProfit(id) {
    const revenue = parseFloat(document.getElementById(`bpRevenue-${id}`).value) || 0;
    const cogs = parseFloat(document.getElementById(`bpCOGS-${id}`).value) || 0;
    const expenses = parseFloat(document.getElementById(`bpExpenses-${id}`).value) || 0;
    
    const profit = revenue - cogs - expenses;
    let margin = 0;
    if (revenue > 0) {
        margin = (profit / revenue) * 100;
    }
    
    document.getElementById(`rProfit-${id}`).innerText = formatNumber(profit);
    document.getElementById(`rMargin-${id}`).innerText = (margin.toFixed(2)) + '%';
}

// Markup vs Margin Calculator
function calcMarkupMargin(id) {
    const cost = parseFloat(document.getElementById(`mmCost-${id}`).value) || 0;
    const selling = parseFloat(document.getElementById(`mmSelling-${id}`).value) || 0;
    
    let markup = 0, margin = 0;
    if (cost > 0) {
        markup = ((selling - cost) / cost) * 100;
    }
    if (selling > 0) {
        margin = ((selling - cost) / selling) * 100;
    }
    
    document.getElementById(`rMarkup-${id}`).innerText = (markup.toFixed(2)) + '%';
    document.getElementById(`rProfitMargin-${id}`).innerText = (margin.toFixed(2)) + '%';
}

// Expense Inflation Calculator
function calcExpenseInflation(id) {
    const current = parseFloat(document.getElementById(`eiCurrent-${id}`).value) || 0;
    const rate = parseFloat(document.getElementById(`eiRate-${id}`).value) || 0;
    const years = parseFloat(document.getElementById(`eiYears-${id}`).value) || 0;
    
    const future = current * Math.pow(1 + rate / 100, years);
    document.getElementById(`rFutureExpense-${id}`).innerText = formatNumber(future);
}

// Wedding Budget Calculator
function calcWeddingBudget(id) {
    const venue = parseFloat(document.getElementById(`wbVenue-${id}`).value) || 0;
    const guests = parseFloat(document.getElementById(`wbGuests-${id}`).value) || 0;
    const cateringPerGuest = parseFloat(document.getElementById(`wbCateringPerGuest-${id}`).value) || 0;
    const decorations = parseFloat(document.getElementById(`wbDecorations-${id}`).value) || 0;
    const other = parseFloat(document.getElementById(`wbOther-${id}`).value) || 0;
    
    const catering = guests * cateringPerGuest;
    const total = venue + catering + decorations + other;
    const perPerson = guests > 0 ? (catering / guests) : 0;
    
    document.getElementById(`rTotalCatering-${id}`).innerText = formatNumber(catering);
    document.getElementById(`rWeddingTotal-${id}`).innerText = formatNumber(total);
    document.getElementById(`rPerPersonCost-${id}`).innerText = formatNumber(perPerson);
}

// Vacation Budget Calculator
function calcVacationBudget(id) {
    const flight = parseFloat(document.getElementById(`vbFlight-${id}`).value) || 0;
    const hotel = parseFloat(document.getElementById(`vbHotel-${id}`).value) || 0;
    const activities = parseFloat(document.getElementById(`vbActivities-${id}`).value) || 0;
    const food = parseFloat(document.getElementById(`vbFood-${id}`).value) || 0;
    const other = parseFloat(document.getElementById(`vbOther-${id}`).value) || 0;
    
    const total = flight + hotel + activities + food + other;
    document.getElementById(`rVacationTotal-${id}`).innerText = formatNumber(total);
}

// Crypto ROI Calculator
function calcCryptoROI(id) {
    const initial = parseFloat(document.getElementById(`crInitial-${id}`).value) || 0;
    const current = parseFloat(document.getElementById(`crCurrent-${id}`).value) || 0;
    
    let roi = 0;
    if (initial > 0) {
        roi = ((current - initial) / initial) * 100;
    }
    const profitLoss = current - initial;
    
    document.getElementById(`rROI-${id}`).innerText = (roi.toFixed(2)) + '%';
    document.getElementById(`rProfitLoss-${id}`).innerText = formatNumber(profitLoss);
}

// Crypto DCA Calculator
function calcCryptoDCA(id) {
    const monthly = parseFloat(document.getElementById(`cdMonthly-${id}`).value) || 0;
    const months = parseFloat(document.getElementById(`cdMonths-${id}`).value) || 0;
    const avgPrice = parseFloat(document.getElementById(`cdAvgPrice-${id}`).value) || 0;
    
    const totalInvested = monthly * months;
    let totalCoins = 0;
    if (avgPrice > 0) {
        totalCoins = totalInvested / avgPrice;
    }
    
    document.getElementById(`rTotalInvested-${id}`).innerText = formatNumber(totalInvested);
    document.getElementById(`rTotalCoins-${id}`).innerText = (totalCoins.toFixed(8));
}

// Bond Yield Calculator
function calcBondYield(id) {
    const faceValue = parseFloat(document.getElementById(`byFaceValue-${id}`).value) || 1000;
    const couponRate = parseFloat(document.getElementById(`byCouponRate-${id}`).value) || 0;
    const price = parseFloat(document.getElementById(`byPrice-${id}`).value) || 1000;
    const years = parseFloat(document.getElementById(`byYearsToMaturity-${id}`).value) || 0;
    
    const coupon = faceValue * (couponRate / 100);
    let ytm = 0;
    if (years > 0) {
        ytm = ((coupon + (faceValue - price) / years) / ((faceValue + price) / 2)) * 100;
    }
    
    document.getElementById(`rCoupon-${id}`).innerText = formatNumber(coupon);
    document.getElementById(`rYTM-${id}`).innerText = (ytm.toFixed(2)) + '%';
}

// NPV Calculator
function calcNPV(id) {
    const initial = parseFloat(document.getElementById(`npvInitial-${id}`).value) || 0;
    const cashFlow = parseFloat(document.getElementById(`npvAnnualCF-${id}`).value) || 0;
    const years = parseFloat(document.getElementById(`npvYears-${id}`).value) || 0;
    const discountRate = parseFloat(document.getElementById(`npvDiscount-${id}`).value) || 0;
    
    let npv = -initial;
    const rate = discountRate / 100;
    
    for (let year = 1; year <= years; year++) {
        npv += cashFlow / Math.pow(1 + rate, year);
    }
    
    document.getElementById(`rNPV-${id}`).innerText = formatNumber(npv);
}

// IRR Calculator
function calcIRR(id) {
    const initial = parseFloat(document.getElementById(`irrInitial-${id}`).value) || 0;
    const cashFlow = parseFloat(document.getElementById(`irrAnnualCF-${id}`).value) || 0;
    const years = parseFloat(document.getElementById(`irrYears-${id}`).value) || 0;
    
    if (initial === 0 || cashFlow === 0) {
        document.getElementById(`rIRR-${id}`).innerText = '0%';
        return;
    }
    
    // Estimate IRR using Newton-Raphson method
    let irr = cashFlow / initial;
    
    for (let i = 0; i < 100; i++) {
        let npv = -initial;
        let npvDerivative = 0;
        
        for (let year = 1; year <= years; year++) {
            npv += cashFlow / Math.pow(1 + irr, year);
            npvDerivative -= (year * cashFlow) / Math.pow(1 + irr, year + 1);
        }
        
        if (Math.abs(npv) < 0.01) break;
        irr = irr - (npv / npvDerivative);
    }
    
    document.getElementById(`rIRR-${id}`).innerText = ((irr * 100).toFixed(2)) + '%';
}

// Lease vs Buy Calculator
function calcLeaseVsBuy(id) {
    const leaseMonthly = parseFloat(document.getElementById(`lvbLeaseMonthly-${id}`).value) || 0;
    const months = parseFloat(document.getElementById(`lvbMonths-${id}`).value) || 0;
    const buyPrice = parseFloat(document.getElementById(`lvbBuyPrice-${id}`).value) || 0;
    const maintenance = parseFloat(document.getElementById(`lvbMaintenance-${id}`).value) || 0;
    const resale = parseFloat(document.getElementById(`lvbResale-${id}`).value) || 0;
    
    const totalLease = leaseMonthly * months;
    const years = months / 12;
    const totalMaintenance = maintenance * years;
    const totalBuy = buyPrice + totalMaintenance - resale;
    
    let better = '-';
    if (totalLease < totalBuy) {
        better = 'Lease';
    } else if (totalBuy < totalLease) {
        better = 'Buy';
    } else {
        better = 'Same';
    }
    
    document.getElementById(`rTotalLease-${id}`).innerText = formatNumber(totalLease);
    document.getElementById(`rTotalBuy-${id}`).innerText = formatNumber(totalBuy);
    document.getElementById(`rBetterOption-${id}`).innerText = better;
}

// Cost of Living Calculator
function calcCostOfLiving(id) {
    const housing = parseFloat(document.getElementById(`colHousing-${id}`).value) || 0;
    const food = parseFloat(document.getElementById(`colFood-${id}`).value) || 0;
    const transport = parseFloat(document.getElementById(`colTransport-${id}`).value) || 0;
    const utilities = parseFloat(document.getElementById(`colUtilities-${id}`).value) || 0;
    const other = parseFloat(document.getElementById(`colOther-${id}`).value) || 0;
    
    const monthly = housing + food + transport + utilities + other;
    const annual = monthly * 12;
    
    document.getElementById(`rMonthlyCost-${id}`).innerText = formatNumber(monthly);
    document.getElementById(`rAnnualCost-${id}`).innerText = formatNumber(annual);
}

// Rental Yield Calculator
function calcRentalYield(id) {
    const propertyPrice = parseFloat(document.getElementById(`ryPropertyPrice-${id}`).value) || 0;
    const monthlyRent = parseFloat(document.getElementById(`ryMonthlyRent-${id}`).value) || 0;
    const maintenance = parseFloat(document.getElementById(`ryMaintenanceAnnual-${id}`).value) || 0;
    const tax = parseFloat(document.getElementById(`ryPropertyTax-${id}`).value) || 0;
    
    const annualRent = monthlyRent * 12;
    const expenses = maintenance + tax;
    const profit = annualRent - expenses;
    
    let grossYield = 0, netYield = 0;
    if (propertyPrice > 0) {
        grossYield = (annualRent / propertyPrice) * 100;
        netYield = (profit / propertyPrice) * 100;
    }
    
    document.getElementById(`rAnnualRental-${id}`).innerText = formatNumber(annualRent);
    document.getElementById(`rAnnualExpenses-${id}`).innerText = formatNumber(expenses);
    document.getElementById(`rGrossYield-${id}`).innerText = (grossYield.toFixed(2)) + '%';
    document.getElementById(`rNetYield-${id}`).innerText = (netYield.toFixed(2)) + '%';
}
