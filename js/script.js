
    // Logic to swap visibility using the 'hidden' attribute
    function switchCalc() {
        const selected = document.getElementById('mainSwitcher').value;
        
        // Hide all divs
        document.getElementById('sumDiv').hidden = true;
        document.getElementById('divDiv').hidden = true;
        document.getElementById('percDiv').hidden = true;
        document.getElementById('profDiv').hidden = true;
        
        // Show only the selected one
        document.getElementById(selected).hidden = false;
    }

    // Completely independent logic functions
    function calcSum() {
        const a = parseFloat(document.getElementById('s1').value) || 0;
        const b = parseFloat(document.getElementById('s2').value) || 0;
        document.getElementById('rSum').innerText = a + b;
    }

    function calcDiv() {
        const a = parseFloat(document.getElementById('d1').value) || 0;
        const b = parseFloat(document.getElementById('d2').value) || 0;
        document.getElementById('rDiv').innerText = b !== 0 ? (a / b).toFixed(2) : "Cannot divide by 0";
    }

    function calcPerc() {
        const a = parseFloat(document.getElementById('p1').value) || 0;
        const b = parseFloat(document.getElementById('p2').value) || 0;
        document.getElementById('rPerc').innerText = (a / 100) * b;
    }

    function calcProf() {
        const a = parseFloat(document.getElementById('pr1').value) || 0;
        const b = parseFloat(document.getElementById('pr2').value) || 0;
        const diff = a - b;
        document.getElementById('rProf').innerText = diff >= 0 ? "Profit: " + diff : "Loss: " + Math.abs(diff);
    }
