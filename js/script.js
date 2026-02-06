
// Initialize theme on page load
function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = savedTheme || (prefersDark ? 'dark' : 'light');
    
    applyTheme(theme);
}

// Apply theme to the document
function applyTheme(theme) {
    const html = document.documentElement;
    
    if (theme === 'light') {
        html.classList.remove('dark-theme');
        html.classList.add('light-theme');
        document.getElementById('themeIcon').textContent = '🌞';
    } else {
        html.classList.remove('light-theme');
        html.classList.add('dark-theme');
        document.getElementById('themeIcon').textContent = '🌙';
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

// Initialize theme when page loads
document.addEventListener('DOMContentLoaded', initTheme);

// Logic to swap visibility using the 'hidden' attribute
function switchCalc() {
    const selected = document.getElementById('mainSwitcher').value;

    document.getElementById('avgStockDiv').hidden = true;
    document.getElementById('requiredQtyDiv').hidden = true;

    // Show only the selected one
    document.getElementById(selected).hidden = false;
}

// Handle Enter key to move to next input
function handleEnter(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        
        // Get all input elements in the current visible calculator section
        const visibleSection = document.querySelector('.calculator-section:not([hidden])');
        if (!visibleSection) return;
        
        const inputs = Array.from(visibleSection.querySelectorAll('input'));
        const currentInput = event.target;
        const currentIndex = inputs.indexOf(currentInput);
        
        // Move to the next input, or stay at the last one
        if (currentIndex < inputs.length - 1) {
            inputs[currentIndex + 1].focus();
        } else {
            // If at the last input, keep focus (user can press Enter again to recalculate)
            currentInput.blur();
        }
    }
}



function calcAvgStock() {
    const oldAvgPrice = parseFloat(document.getElementById('oldAvgPrice').value) || 0;
    const oldQty = parseFloat(document.getElementById('oldQty').value) || 0;
    const newPrice = parseFloat(document.getElementById('newPrice').value) || 0;
    const newQty = parseFloat(document.getElementById('newQty').value) || 0;
    
    const totalQuantity = oldQty + newQty;
    
    if (totalQuantity === 0) {
        document.getElementById('rAvgStock').innerText = "0";
        return;
    }
    
    const newAvgPrice = ((oldAvgPrice * oldQty) + (newPrice * newQty)) / totalQuantity;
    document.getElementById('rAvgStock').innerText = newAvgPrice.toFixed(2);
}

function calcRequiredQty() {
    const targetAvgPrice = parseFloat(document.getElementById('targetAvgPrice').value) || 0;
    const oldQty = parseFloat(document.getElementById('oldQtyReq').value) || 0;
    const oldAvgPrice = parseFloat(document.getElementById('oldAvgPriceReq').value) || 0;
    const newPrice = parseFloat(document.getElementById('newPriceReq').value) || 0;
    
    // Formula: requiredQty = oldQty * (targetAvgPrice - oldAvgPrice) / (newPrice - targetAvgPrice)
    const denominator = newPrice - targetAvgPrice;
    
    if (denominator === 0) {
        document.getElementById('rRequiredQty').innerText = "Invalid (new price = target price)";
        document.getElementById('rTotalPrice').innerText = "0";
        return;
    }
    
    if (oldQty === 0) {
        document.getElementById('rRequiredQty').innerText = "0";
        document.getElementById('rTotalPrice').innerText = "0";
        return;
    }
    
    const requiredQty = (oldQty * (targetAvgPrice - oldAvgPrice)) / denominator;
    
    if (requiredQty < 0) {
        document.getElementById('rRequiredQty').innerText = "Not possible (target price unreachable)";
        document.getElementById('rTotalPrice').innerText = "0";
        return;
    }
    
    const totalPrice = requiredQty * newPrice;
    
    document.getElementById('rRequiredQty').innerText = requiredQty.toFixed(2);
    document.getElementById('rTotalPrice').innerText = totalPrice.toFixed(2);
}
