# 💰 Multi-Calculator Financial Suite

A comprehensive, feature-rich web application with **70+ financial calculators** covering income, investments, loans, taxes, real estate, retirement, and more. Built with vanilla HTML5, CSS3, and JavaScript—no dependencies required.

![Calculator Suite](https://img.shields.io/badge/Calculators-70+-blue) ![JavaScript](https://img.shields.io/badge/JavaScript-Vanilla-yellow) ![No Dependencies](https://img.shields.io/badge/Dependencies-None-brightgreen) ![License](https://img.shields.io/badge/License-MIT-green)

---

## 📋 Table of Contents

- [Features](#features)
- [Calculator Categories](#calculator-categories)
- [Getting Started](#getting-started)
- [How to Use](#how-to-use)
- [Technical Details](#technical-details)
- [Project Structure](#project-structure)
- [Customization](#customization)
- [Browser Support](#browser-support)

---

## ✨ Features

### 🎯 Core Features
- **70+ Financial Calculators** covering all major financial domains
- **Real-time Calculations** with instant result updates as you type
- **Multiple Instances** run up to 3 calculators simultaneously side-by-side
- **Dark/Light Theme** with persistent preference storage
- **Number Formatting** support (Plain, Millions, Indian numbering)
- **Advanced Search** with category filtering and related terms
- **Detailed Tooltips** with formulas, descriptions, and examples for each calculator
- **Modal Browser** to view and select all calculators in an organized grid
- **Responsive Design** with internal scrolling (no page scroll)
- **Fully Responsive** works seamlessly on desktop, tablet, and mobile
- **Keyboard Navigation** Enter key support for quick calculations
- **Local Storage** saves your theme and formatting preferences

### 🔍 Search & Discovery
- **Instant Search** filters calculators by name and related terms
- **Category Grouping** organized results by financial domain
- **Dropdown Display** click to see all calculators grouped by category
- **Modal View** browse all 70 calculators in organized grid cards
- **Smart Search Terms** each calculator indexed with 5+ related keywords

---

## 📊 Calculator Categories

### 1. **Basic Financial Planning** (7 calculators)
- Compound Interest Calculator
- Simple Interest Calculator
- Future Value Calculator
- Present Value Calculator
- Inflation Impact Calculator
- Purchasing Power Calculator
- Break-even Point Calculator

### 2. **Investment Analysis** (8 calculators)
- Stock Price Analysis
- Systematic Investment Plan (SIP)
- SIP Returns Calculator
- P/E Ratio Calculator
- Dividend Growth Calculator
- Portfolio Rebalancing
- Stock Portfolio Returns
- Investment Returns Calculator

### 3. **FIRE Planning** (3 calculators)
- FIRE (Financial Independence, Retire Early)
- FIRE Calculator - Monthly
- FIRE Calculator - Lump Sum

### 4. **Budgeting & Spending** (8 calculators)
- Budget Allocator (customizable percentages)
- Monthly Budget Planner
- Expense Tracker
- Wedding Budget Calculator
- Vacation Budget Calculator
- Expense Inflation Calculator
- Cost of Living Calculator
- Monthly Spending Planner

### 5. **Loan & Debt Management** (6 calculators)
- Loan Calculator (EMI)
- Loan Comparison
- Payback Period Calculator
- Early Loan Payoff
- Additional EMI Calculator
- Debt Payoff Calculator

### 6. **Wealth & Net Worth** (5 calculators)
- Net Worth Calculator
- Wealth Growth Calculator
- Wealth Target Calculator
- Asset Allocation Calculator
- Financial Goal Tracker

### 7. **Real Estate** (4 calculators)
- Property Investment Returns
- Home Affordability Calculator
- Rent vs Buy Calculator
- Rental Yield Calculator

### 8. **Retirement Planning** (4 calculators)
- Retirement Corpus Calculator
- Pension Calculator
- Social Security Calculator
- Retirement Savings Calculator

### 9. **Vehicle Finance** (3 calculators)
- Car EMI Calculator
- Bike Loan Calculator
- Lease vs Buy Calculator

### 10. **Insurance Planning** (3 calculators)
- Insurance Need Calculator
- Life Insurance Amount Calculator
- Insurance Coverage Calculator

### 11. **Education Planning** (3 calculators)
- Child Education Calculator
- College Cost Projection
- Higher Education Planner

### 12. **Income & Earning** (3 calculators)
- Salary Calculator
- Side Hustle Income Calculator
- Freelance Rate Calculator

### 13. **Tracking & Monitoring** (3 calculators)
- Savings Rate Calculator
- Financial Goal Tracker
- Expense Tracker

### 14. **Tax Planning** (3 calculators)
- Tax Loss Harvesting Calculator
- Tax Bracket Calculator
- Gift/Inheritance Tax Calculator

### 15. **Business & Freelance** (2 calculators)
- Business Profit Calculator
- Markup vs Margin Calculator

### 16. **Advanced Financial** (5 calculators)
- Bond Yield Calculator
- Net Present Value (NPV)
- Internal Rate of Return (IRR)
- Crypto ROI Calculator
- Crypto Dollar Cost Averaging (DCA)

### 17. **Additional Tools** (2 calculators)
- Cost of Living Comparison
- General Purpose Calculator

---

## 🚀 Getting Started

### Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/rehanguha/calculator.git
   cd calculator
   ```

2. **Open in Browser**
   - Double-click `index.html` to open directly
   - Or use a local server:
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Node.js (if http-server installed)
   http-server -p 8000
   
   # PHP
   php -S localhost:8000
   ```

3. **Access the App**
   - Open `http://localhost:8000` in your web browser
   - No installation or build process required!

---

## 📖 How to Use

### Basic Usage

1. **Select a Calculator**
   - Click the dropdown menu to see all 70 calculators
   - Or use the **Search Calculators** box to find by name/keywords
   - Click a calculator to add it to your workspace

2. **Enter Values**
   - Fill in the input fields
   - Results update in real-time as you type
   - All fields have helpful placeholders

3. **View Results**
   - Results display immediately below the inputs
   - Hover the **ℹ️ icon** to see formula, description, and examples
   - Results format based on your selected number format

4. **Add Multiple Calculators**
   - Click "+ Add Calculator" button to add up to 3 instances
   - Run calculations side-by-side for comparison
   - Each instance operates independently

5. **Reset Values**
   - Click "Reset" button to clear all inputs and results
   - Useful for starting fresh calculations

### Advanced Features

#### 🔍 Search Calculators
- **Type keywords** to filter by name or related terms
- Results grouped by category for easy browsing
- Examples: "loan", "invest", "salary", "tax", "real estate"

#### 👁️ View All Calculators
- Click on the Search box or "View All" button to see all 70 calculators
- Modal displays organized grid of all available tools
- Click "Add" button on any card to use that calculator
- Search within the modal to filter specific category

#### 🎨 Theme Options
- **Dark Mode** reduces eye strain in low-light environments
- **Light Mode** for bright daylight use
- Toggle via button in top-right corner
- Your preference is saved automatically

#### 🔢 Number Formatting
- **Plain Format**: 1000000 (standard digits)
- **Millions Format**: 10 L (10 Lakh - Indian style)
- **Indian Format**: 10,00,000 (Indian numbering system)
- All numbers in results automatically format to your choice
- Selection persists across sessions

#### ⌨️ Keyboard Navigation
- **Enter key** in any input field triggers calculation
- No need to click buttons for quick entries
- Tab between fields for easy navigation

#### 💡 Tooltips
- Each calculator has a detailed tooltip
- Shows **Formula**: mathematical calculation used
- Shows **Description**: what the calculator does
- Shows **Example**: sample input and expected output
- Click **×** to close, or click elsewhere

---

## 🛠️ Technical Details

### Technology Stack
- **HTML5**: Semantic markup structure
- **CSS3**: Modern styling with CSS variables for theming
- **JavaScript (Vanilla)**: No frameworks or libraries
- **LocalStorage API**: For theme and preference persistence

### Key Specifications
- **No Dependencies**: Pure vanilla implementation
- **File Size**: Lightweight (~4100 lines total)
- **Performance**: Instant calculations, no lag
- **Browser Support**: All modern browsers (Chrome, Firefox, Safari, Edge)
- **Responsive**: Works on all screen sizes

### Design Patterns
- **Event-Driven Architecture**: Real-time input handling
- **Template Literals**: Dynamic HTML generation
- **Module-like Structure**: Organized calculator functions
- **Data-Driven**: Centralized calculator metadata
- **CSS Variables**: Easy theme customization

---

## 📁 Project Structure

```
calculator/
├── index.html              # Main HTML file (single-page app)
├── css/
│   └── main.css            # Complete styling (900+ lines)
├── js/
│   └── script.js           # All logic (4000+ lines)
├── README.md               # This file
└── LICENSE                 # MIT License
```

### index.html (49 lines)
Contains the single-page application structure with:
- Header with title, theme toggle, and format selector
- Search box with dropdown
- Grid container for calculator instances
- Modal for viewing all calculators
- Minimal markup for maximum performance

### css/main.css (900+ lines)
Comprehensive styling including:
- CSS variables for light/dark themes
- Responsive grid layout
- Modal styling with animations
- Tooltip positioning and animations
- Input field styling
- Button and control styling
- Mobile-responsive design

### js/script.js (4000+ lines)
Complete application logic:
- **Data Layer**: `calculatorData` object with all 70 calculators
- **UI Functions**: Theme, search, modal, dropdown handling
- **Calculation Functions**: 70 individual calculator implementations
- **Utility Functions**: Number formatting, event handling
- **Storage**: LocalStorage for persistence

---

## 🎨 Customization

### Adding a New Calculator

1. **Add to Data Structure** (js/script.js, around line 113):
```javascript
myNewCalculator: { 
  name: 'My New Calculator', 
  category: 'Category Name', 
  terms: ['keyword1', 'keyword2', 'keyword3'] 
},
```

2. **Add Dropdown Option** (js/script.js, in the select element):
```html
<option value="myNewCalculator">My New Calculator</option>
```

3. **Add HTML Section** (js/script.js, in calculatorHTML template):
```html
<div id="myNewCalculator-${id}" class="calculator-section" hidden>
    <div class="section-header">
        <h3>My New Calculator</h3>
        <span class="tooltip-icon" onclick="toggleTooltip(event, 'myNewCalculator-tooltip-${id}')">ℹ️</span>
    </div>
    <div class="tooltip-box" id="myNewCalculator-tooltip-${id}">
        <button class="tooltip-close" onclick="closeTooltip(event)">×</button>
        <p class="tooltip-description">Description here</p>
        <h4>Formula</h4>
        <p class="formula">Your formula here</p>
        <h4>Example</h4>
        <p><strong>Input:</strong> Example input</p>
        <p><strong>Result:</strong> Example result</p>
    </div>
    <div class="input-group">
        <label for="input1-${id}">Input Label</label>
        <input type="number" id="input1-${id}" placeholder="Placeholder" step="0.01" oninput="calcMyNew(${id})" onkeypress="handleEnter(event)">
    </div>
    <div class="result-group">
        <div class="result">Result Label: <span id="rResult-${id}">0</span></div>
    </div>
</div>
```

4. **Add Calculation Function** (js/script.js, at the end):
```javascript
function calcMyNew(id) {
    const input1 = parseFloat(document.getElementById(`input1-${id}`).value) || 0;
    
    // Your calculation logic here
    const result = input1 * 2; // Example
    
    document.getElementById(`rResult-${id}`).innerText = formatNumber(result);
}
```

### Customizing Themes

Modify CSS variables in `main.css` (lines 1-30):
```css
:root {
    --bg-primary: #ffffff;
    --text-primary: #000000;
    --bg-secondary: #f5f5f5;
    /* ... more variables */
}

[data-theme="dark"] {
    --bg-primary: #1a1a1a;
    --text-primary: #ffffff;
    /* ... more dark variables */
}
```

### Changing Colors
Update CSS variables for:
- Background colors
- Text colors
- Accent colors
- Border colors
- Shadow colors

---

## 🌐 Browser Support

| Browser | Version | Status |
|---------|---------|--------|
| Chrome | Latest | ✅ Full Support |
| Firefox | Latest | ✅ Full Support |
| Safari | Latest | ✅ Full Support |
| Edge | Latest | ✅ Full Support |
| Opera | Latest | ✅ Full Support |
| IE 11 | - | ❌ Not Supported |

**Note**: For best experience, use a modern browser with:
- ES6 support (arrow functions, template literals)
- CSS Grid support
- LocalStorage support

---

## 💡 Tips & Tricks

### Efficiency Tips
1. **Add Multiple Instances** for side-by-side comparisons (loan comparison, portfolio allocation, etc.)
2. **Use Search** to quickly find specific calculators among 70+ options
3. **Save Preferences** theme and number format are remembered across sessions
4. **Keyboard Navigation** press Enter after inputting values for quick calculation

### Common Use Cases
- **Compare Loans**: Add loan calculator 2-3 times, enter different loan terms
- **Investment Planning**: Use SIP, FIRE, and portfolio calculators together
- **Retirement Planning**: Combine retirement corpus, pension, and net worth calculators
- **Tax Planning**: Use salary calculator with tax bracket and loss harvesting tools
- **Real Estate**: Compare property investment returns with rental yield calculator

---

## 📝 Calculator Details

### Categories Overview

Each calculator is organized into logical categories:
- **Basic Financial Planning**: Foundation calculators for fundamental concepts
- **Investment Analysis**: Stock and portfolio analysis tools
- **FIRE Planning**: Retirement independence calculators
- **Budgeting & Spending**: Income and expense management
- **Loan & Debt**: Borrowing and repayment calculations
- **Wealth & Net Worth**: Asset and net worth tracking
- **Real Estate**: Property and rental analysis
- **Retirement**: Retirement planning and projections
- **Vehicle Finance**: Auto and bike loan calculations
- **Insurance**: Coverage and need calculations
- **Education**: Student and college planning
- **Income & Earning**: Salary and freelance calculators
- **Tracking & Monitoring**: Progress and spending trackers
- **Tax Planning**: Tax optimization tools
- **Business**: Profit and pricing calculators
- **Advanced Finance**: NPV, IRR, bonds, and crypto
- **Comparison Tools**: Lease vs buy and cost of living

---

## 🔒 Privacy & Data

- **No Server Requests**: Everything runs locally in your browser
- **No Data Collection**: We don't track or store your calculations
- **Local Storage Only**: Only your theme and format preferences stored locally
- **Completely Offline**: Works without internet connection
- **No Cookies**: We don't use cookies or third-party services

---

## 🤝 Contributing

Contributions welcome! Here's how:

1. **Report Issues**: Found a bug? Open an issue with details
2. **Suggest Calculators**: Recommend new calculators to add
3. **Improve Code**: Submit pull requests for improvements
4. **Fix Bugs**: Help fix reported issues
5. **Improve Documentation**: Enhance README or code comments

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙋 FAQ

### Q: Can I download this for offline use?
**A**: Yes! Clone the repository or download the files. It works completely offline.

### Q: Is there a mobile app?
**A**: The web app is fully responsive and works great on mobile devices. Open it in any mobile browser.

### Q: Can I modify or fork this project?
**A**: Absolutely! It's MIT licensed - modify, fork, and use however you want.

### Q: What if I find an error in a calculation?
**A**: Open an issue with the calculator name, inputs, and expected output.

### Q: How often are new calculators added?
**A**: Check the repository for updates. We regularly add new financial tools.

### Q: Can I contribute calculators?
**A**: Yes! Submit a pull request with the new calculator following the existing pattern.

### Q: Does it work on iPad/Tablet?
**A**: Yes! The app is fully responsive and works on all devices.

### Q: Can I print the results?
**A**: Yes! Use your browser's print function (Ctrl+P or Cmd+P) to print calculations.

---

## 🎯 Roadmap

Future improvements and features:
- [ ] Export calculations to CSV/PDF
- [ ] Comparison charts and graphs
- [ ] Historical calculation tracking
- [ ] Advanced investment portfolio tools
- [ ] Multi-currency support
- [ ] Mobile app (iOS/Android)
- [ ] API for developers
- [ ] Calculation templates and presets
- [ ] Social sharing of results
- [ ] Collaborative planning tools

---

## 📞 Support

Need help? Here's how to get support:

1. **Check FAQ Section** above
2. **Review Calculator Tooltips** each has formula and examples
3. **Open GitHub Issue** for bugs or suggestions
4. **Read Code Comments** for technical details

---

## 🌟 Acknowledgments

Built with vanilla HTML5, CSS3, and JavaScript - no frameworks, no bloat, just pure functionality.

Inspired by the need for a comprehensive, accessible, and offline-capable financial calculator suite for personal finance management.

---

**Happy Calculating!** 💰✨

For the latest updates and features, visit the [GitHub Repository](https://github.com/rehanguha/calculator)

---

**Last Updated**: February 2026  
**Version**: 2.0 (70+ Calculators)  
**Status**: Actively Maintained ✅