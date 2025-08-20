function calculateROI() {
    // Get input values
    const setupCost = parseFloat(document.getElementById('setupCost').value) || 0;
    const monthlyVoiceAgent = parseFloat(document.getElementById('monthlyVoiceAgent').value) || 0;
    const monthlyReceptionist = parseFloat(document.getElementById('monthlyReceptionist').value) || 0;
    const missedCalls = parseFloat(document.getElementById('missedCalls').value) || 0;
    const averageServiceCost = parseFloat(document.getElementById('averageServiceCost').value) || 0;
    const conversionRate = parseFloat(document.getElementById('conversionRate').value) || 0;
    const timeFrame = parseFloat(document.getElementById('timeFrame').value) || 12;

    const resultDiv = document.getElementById('result');
    const monthlySavingsElement = document.getElementById('monthlySavings');
    const recoveredRevenueElement = document.getElementById('recoveredRevenue');
    const totalROIElement = document.getElementById('totalROI');
    const paybackPeriodElement = document.getElementById('paybackPeriod');
    const breakdownElement = document.getElementById('breakdown');
    const interpretationElement = document.getElementById('interpretation');

    // Reset classes
    resultDiv.className = 'result';

    // Validate inputs
    if (monthlyVoiceAgent <= 0) {
        showError('Please enter a valid monthly voice agent cost.');
        return;
    }

    if (conversionRate < 0 || conversionRate > 100) {
        showError('Conversion rate must be between 0 and 100%.');
        return;
    }

    if (timeFrame <= 0 || timeFrame > 60) {
        showError('Time frame must be between 1 and 60 months.');
        return;
    }

    // Calculate monthly savings (receptionist cost - voice agent cost)
    const monthlySavings = monthlyReceptionist - monthlyVoiceAgent;
    
    // Calculate monthly revenue from recovered missed calls
    const monthlyRecoveredRevenue = (missedCalls * (conversionRate / 100) * averageServiceCost);
    
    // Calculate total monthly benefit
    const totalMonthlyBenefit = monthlySavings + monthlyRecoveredRevenue;
    
    // Calculate total costs and benefits over time period
    const totalCosts = setupCost + (monthlyVoiceAgent * timeFrame);
    const totalBenefits = totalMonthlyBenefit * timeFrame;
    const netBenefit = totalBenefits - setupCost;
    
    // Calculate ROI
    const roi = totalCosts > 0 ? (netBenefit / totalCosts) * 100 : 0;
    
    // Calculate payback period
    let paybackPeriod = 'N/A';
    if (totalMonthlyBenefit > 0) {
        const paybackMonths = setupCost / totalMonthlyBenefit;
        if (paybackMonths <= timeFrame) {
            paybackPeriod = `${paybackMonths.toFixed(1)} months`;
        } else {
            paybackPeriod = `${paybackMonths.toFixed(1)} months (beyond selected timeframe)`;
        }
    }

    // Display results
    monthlySavingsElement.textContent = `$${monthlySavings.toFixed(2)}`;
    recoveredRevenueElement.textContent = `$${monthlyRecoveredRevenue.toFixed(2)}/month`;
    totalROIElement.textContent = `${roi.toFixed(1)}%`;
    paybackPeriodElement.textContent = paybackPeriod;

    // Create detailed breakdown
    const breakdownHTML = `
        <h4>Financial Breakdown (${timeFrame} months):</h4>
        <div class="breakdown-item">
            <span>Setup Cost:</span>
            <span>-$${setupCost.toFixed(2)}</span>
        </div>
        <div class="breakdown-item">
            <span>Voice Agent Cost (${timeFrame} months):</span>
            <span>-$${(monthlyVoiceAgent * timeFrame).toFixed(2)}</span>
        </div>
        <div class="breakdown-item">
            <span>Receptionist Savings (${timeFrame} months):</span>
            <span style="color: #4caf50;">+$${(monthlyReceptionist * timeFrame).toFixed(2)}</span>
        </div>
        <div class="breakdown-item">
            <span>Revenue from Recovered Calls:</span>
            <span style="color: #4caf50;">+$${(monthlyRecoveredRevenue * timeFrame).toFixed(2)}</span>
        </div>
        <div class="breakdown-item">
            <span>Net Benefit:</span>
            <span style="color: #1E3A57; font-weight: bold;">$${netBenefit.toFixed(2)}</span>
        </div>
    `;
    breakdownElement.innerHTML = breakdownHTML;

    // Provide interpretation
    let interpretation = '';
    let resultClass = 'show';

    if (roi > 200) {
        interpretation = '🚀 Exceptional ROI! The AI voice agent will deliver outstanding returns and pay for itself very quickly. This is an excellent investment for your business.';
        resultClass += ' positive';
    } else if (roi > 100) {
        interpretation = '📈 Excellent ROI! The AI voice agent is a highly profitable investment for your business. You\'ll see significant returns.';
        resultClass += ' positive';
    } else if (roi > 50) {
        interpretation = '✅ Good ROI! The AI voice agent will provide solid returns on your investment. This is a smart business decision.';
        resultClass += ' positive';
    } else if (roi > 0) {
        interpretation = '💰 Positive ROI! The AI voice agent will generate more value than it costs, making it a worthwhile investment.';
        resultClass += ' positive';
    } else if (roi === 0) {
        interpretation = '⚖️ Break-even scenario. The AI voice agent will pay for itself but won\'t generate additional profit with these numbers.';
    } else {
        interpretation = '⚠️ Negative ROI with current inputs. Consider optimizing your conversion rate, reducing missed calls, or adjusting costs to improve returns.';
        resultClass += ' negative';
    }

    // Add additional insights
    if (monthlyRecoveredRevenue > monthlySavings && monthlyRecoveredRevenue > 0) {
        interpretation += ` The primary value comes from recovering missed calls (${((monthlyRecoveredRevenue / (monthlyRecoveredRevenue + Math.max(monthlySavings, 0))) * 100).toFixed(1)}% of total benefit).`;
    } else if (monthlySavings > monthlyRecoveredRevenue && monthlySavings > 0) {
        interpretation += ` The primary value comes from payroll savings (${((monthlySavings / (monthlyRecoveredRevenue + monthlySavings)) * 100).toFixed(1)}% of total benefit).`;
    }

    interpretationElement.textContent = interpretation;
    resultDiv.className = `result ${resultClass}`;

    // Scroll to results
    resultDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function showError(message) {
    const resultDiv = document.getElementById('result');
    const monthlySavingsElement = document.getElementById('monthlySavings');
    const recoveredRevenueElement = document.getElementById('recoveredRevenue');
    const totalROIElement = document.getElementById('totalROI');
    const paybackPeriodElement = document.getElementById('paybackPeriod');
    const breakdownElement = document.getElementById('breakdown');
    const interpretationElement = document.getElementById('interpretation');

    monthlySavingsElement.textContent = 'Error';
    recoveredRevenueElement.textContent = '';
    totalROIElement.textContent = '';
    paybackPeriodElement.textContent = '';
    breakdownElement.innerHTML = '';
    interpretationElement.textContent = message;
    
    resultDiv.className = 'result show error';
    resultDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// Add enter key support and input validation
document.addEventListener('DOMContentLoaded', function() {
    const inputs = document.querySelectorAll('input');
    
    inputs.forEach(input => {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                calculateROI();
            }
        });
    });

    // Clear results when inputs change
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            const resultDiv = document.getElementById('result');
            if (resultDiv.classList.contains('show')) {
                resultDiv.classList.remove('show');
            }
        });
    });

    // Add real-time validation
    const conversionRateInput = document.getElementById('conversionRate');
    conversionRateInput.addEventListener('input', function() {
        const value = parseFloat(this.value);
        if (value > 100) {
            this.value = 100;
        } else if (value < 0) {
            this.value = 0;
        }
    });

    const timeFrameInput = document.getElementById('timeFrame');
    timeFrameInput.addEventListener('input', function() {
        const value = parseFloat(this.value);
        if (value > 60) {
            this.value = 60;
        } else if (value < 1) {
            this.value = 1;
        }
    });

    // Add example values on page load for demo purposes
    if (window.location.search.includes('demo=true')) {
        document.getElementById('setupCost').value = '1000';
        document.getElementById('monthlyVoiceAgent').value = '200';
        document.getElementById('monthlyReceptionist').value = '3000';
        document.getElementById('missedCalls').value = '50';
        document.getElementById('averageServiceCost').value = '500';
        document.getElementById('conversionRate').value = '20';
        document.getElementById('timeFrame').value = '12';
    }
});

// Add analytics tracking for form submissions (if you want to track usage)
function trackCalculation() {
    // You can add Google Analytics or other tracking here
    console.log('ROI calculation completed');
}