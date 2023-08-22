// Load calculation history from localStorage on page load
let calculationHistory = JSON.parse(localStorage.getItem("calculationHistory")) || [];

function calculatePrice() {
    const packageName = document.getElementById("packageName").value;
    const costPrice = parseFloat(document.getElementById("costPrice").value);
    const sellingPrice = parseFloat(document.getElementById("sellingPrice").value);
    const profitPercentage = parseFloat(document.getElementById("profitPercentage").value);
    const currency = document.getElementById("currency").value;
    const frequency = document.getElementById("frequency").value;
    const includeTax = document.getElementById("includeTax").checked;

    if (isNaN(costPrice) && isNaN(sellingPrice) && isNaN(profitPercentage)) {
        alert("Please enter at least one valid value.");
        return;
    }

    let monthlyResult = "";
    let yearlyResult = "";

    if (!isNaN(costPrice) && !isNaN(sellingPrice)) {
        const profit = sellingPrice - costPrice;
        const profitPercentageResult = (profit / costPrice) * 100;
        let tax = 0;
        if (includeTax) {
            tax = 0.18 * costPrice;
        }
        const totalCost = costPrice + tax;
        const totalSellingPrice = sellingPrice + tax;
        monthlyResult = `Cost Price (${packageName}): ${currency === "INR" ? "₹" : "$"}${totalCost.toFixed(2)}, Selling Price: ${currency === "INR" ? "₹" : "$"}${totalSellingPrice.toFixed(2)}, Profit Percentage: ${profitPercentageResult.toFixed(2)}%`;
        yearlyResult = `Cost Price (${packageName}): ${currency === "INR" ? "₹" : "$"}${(totalCost * 12).toFixed(2)}, Selling Price: ${currency === "INR" ? "₹" : "$"}${(totalSellingPrice * 12).toFixed(2)}, Profit Percentage: ${profitPercentageResult.toFixed(2)}% (Yearly)`;
    } else if (!isNaN(costPrice) && !isNaN(profitPercentage)) {
        const profit = (costPrice * profitPercentage) / 100;
        const sellingPriceResult = costPrice + profit;
        let tax = 0;
        if (includeTax) {
            tax = 0.18 * costPrice;
        }
        const totalCost = costPrice + tax;
        const totalSellingPrice = sellingPriceResult + tax;
        monthlyResult = `Cost Price (${packageName}): ${currency === "INR" ? "₹" : "$"}${totalCost.toFixed(2)}, Profit Percentage: ${profitPercentage.toFixed(2)}%, Selling Price: ${currency === "INR" ? "₹" : "$"}${totalSellingPrice.toFixed(2)}`;
        yearlyResult = `Cost Price (${packageName}): ${currency === "INR" ? "₹" : "$"}${(totalCost * 12).toFixed(2)}, Profit Percentage: ${profitPercentage.toFixed(2)}%, Selling Price: ${currency === "INR" ? "₹" : "$"}${(totalSellingPrice * 12).toFixed(2)} (Yearly)`;
    } else if (!isNaN(sellingPrice) && !isNaN(profitPercentage)) {
        const costPriceResult = sellingPrice / (1 + profitPercentage / 100);
        let tax = 0;
        if (includeTax) {
            tax = 0.18 * costPriceResult;
        }
        const totalCost = costPriceResult + tax;
        const totalSellingPrice = sellingPrice + tax;
        monthlyResult = `Selling Price (${packageName}): ${currency === "INR" ? "₹" : "$"}${totalSellingPrice.toFixed(2)}, Profit Percentage: ${profitPercentage.toFixed(2)}%, Cost Price: ${currency === "INR" ? "₹" : "$"}${totalCost.toFixed(2)}`;
        yearlyResult = `Selling Price (${packageName}): ${currency === "INR" ? "₹" : "$"}${(totalSellingPrice * 12).toFixed(2)}, Profit Percentage: ${profitPercentage.toFixed(2)}%, Cost Price: ${currency === "INR" ? "₹" : "$"}${(totalCost * 12).toFixed(2)} (Yearly)`;
    }

    document.getElementById("result").innerHTML = `Monthly:<br>${monthlyResult}<br><br>Yearly:<br>${yearlyResult}`;
    addToCalculationHistory(monthlyResult, yearlyResult);
}

function addToCalculationHistory(monthlyResult, yearlyResult) {
    const timestamp = new Date().toLocaleString();
    const calculation = { timestamp, monthlyResult, yearlyResult };

    // Add the calculation to the history
    calculationHistory.push(calculation);

    // Update the calculation history displayed on the page
    displayCalculationHistory();

    // Save the updated calculation history to localStorage
    localStorage.setItem("calculationHistory", JSON.stringify(calculationHistory));
}

function displayCalculationHistory() {
    const calculationHistoryList = document.getElementById("calculationHistory");
    calculationHistoryList.innerHTML = "";

    calculationHistory.forEach((calculation, index) => {
        const listItem = document.createElement("li");
        listItem.innerHTML = `${calculation.timestamp}:<br>Monthly:<br>${calculation.monthlyResult}<br>Yearly:<br>${calculation.yearlyResult}`;

        // Create a delete button for each item
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.onclick = function () {
            deleteCalculation(index);
        };

        listItem.appendChild(deleteButton);
        calculationHistoryList.appendChild(listItem);
    });
}

function exportHistory() {
    const data = JSON.stringify(calculationHistory);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "calculation_history.json";
    a.click();
    URL.revokeObjectURL(url);
}

function deleteCalculation(index) {
    calculationHistory.splice(index, 1);
    localStorage.setItem("calculationHistory", JSON.stringify(calculationHistory));
    displayCalculationHistory();
}

document.getElementById("importFile").addEventListener("change", function (event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const importedData = JSON.parse(e.target.result);
            if (Array.isArray(importedData)) {
                calculationHistory = importedData;
                localStorage.setItem("calculationHistory", JSON.stringify(calculationHistory));
                displayCalculationHistory();
            } else {
                alert("Invalid file format. Please select a valid JSON file.");
            }
        };
        reader.readAsText(file);
    }
});

// Display calculation history on page load
displayCalculationHistory();