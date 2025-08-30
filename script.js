function calculateROI() {
    console.log('Calculate ROI button clicked!');
    
    // Get input values
    const setupCost = parseFloat(document.getElementById('setupCost').value) || 0;
    const monthlyVoiceAgent = parseFloat(document.getElementById('monthlyVoiceAgent').value) || 0;
    const monthlyReceptionist = parseFloat(document.getElementById('monthlyReceptionist').value) || 0;
    const missedCalls = parseFloat(document.getElementById('missedCalls').value) || 0;
    const averageServiceCost = parseFloat(document.getElementById('averageServiceCost').value) || 0;
    const conversionRate = parseFloat(document.getElementById('conversionRate').value) || 0;
    const timeFrame = parseFloat(document.getElementById('timeFrame').value) || 12;
    
    console.log('Input values:', { setupCost, monthlyVoiceAgent, monthlyReceptionist, missedCalls, averageServiceCost, conversionRate, timeFrame });

    const resultDiv = document.getElementById('result');
    const monthlySavingsElement = document.getElementById('monthlySavings');
    const recoveredRevenueElement = document.getElementById('recoveredRevenue');
    const totalROIElement = document.getElementById('totalROI');
    const paybackPeriodElement = document.getElementById('paybackPeriod');
    const breakdownElement = document.getElementById('breakdown');
    const interpretationElement = document.getElementById('interpretation');
    
    console.log('DOM elements found:', {
        resultDiv: !!resultDiv,
        monthlySavingsElement: !!monthlySavingsElement,
        recoveredRevenueElement: !!recoveredRevenueElement,
        totalROIElement: !!totalROIElement,
        paybackPeriodElement: !!paybackPeriodElement,
        breakdownElement: !!breakdownElement,
        interpretationElement: !!interpretationElement
    });

    // Check if all required elements exist
    if (!monthlySavingsElement || !recoveredRevenueElement || !totalROIElement || !paybackPeriodElement) {
        console.error('Some required DOM elements not found!');
        alert('Error: Required display elements not found. Please check the HTML structure.');
        return;
    }

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
    const totalSavings = monthlySavings * timeFrame;
    const totalRecoveredRevenue = monthlyRecoveredRevenue * timeFrame;
    const netBenefit = totalSavings + totalRecoveredRevenue;
    
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
        <div class="mt-4 p-4 rounded-md bg-[#f8fafc] border border-[#d1d5db]">
            <h4 class="text-[#1e3a8a] text-lg font-bold mb-4">Financial Breakdown (${timeFrame} months):</h4>
            <div class="space-y-2">
                <div class="flex justify-between py-2 text-sm">
                    <span class="text-[#64748b] font-medium">Total Investment:</span>
                    <span class="text-red-600 font-bold">-$${totalCosts.toFixed(2)}</span>
                </div>
                <div class="flex justify-between py-1 text-sm ml-4">
                    <span class="text-[#64748b]">• Setup Cost:</span>
                    <span class="text-[#64748b]">-$${setupCost.toFixed(2)}</span>
                </div>
                <div class="flex justify-between py-1 text-sm ml-4">
                    <span class="text-[#64748b]">• Voice Agent Cost (${timeFrame} months):</span>
                    <span class="text-[#64748b]">-$${(monthlyVoiceAgent * timeFrame).toFixed(2)}</span>
                </div>
                <div class="flex justify-between py-2 text-sm border-t border-[#d1d5db] mt-2 pt-2">
                    <span class="text-[#64748b] font-medium">Total Benefits:</span>
                    <span class="text-green-600 font-bold">+$${netBenefit.toFixed(2)}</span>
                </div>
                <div class="flex justify-between py-1 text-sm ml-4">
                    <span class="text-[#64748b]">• Payroll Savings (${timeFrame} months):</span>
                    <span class="text-[#64748b]">+$${totalSavings.toFixed(2)}</span>
                </div>
                <div class="flex justify-between py-1 text-sm ml-4">
                    <span class="text-[#64748b]">• Revenue from Recovered Calls:</span>
                    <span class="text-[#64748b]">+$${totalRecoveredRevenue.toFixed(2)}</span>
                </div>
                <div class="flex justify-between py-2 text-base border-t border-[#d1d5db] mt-2 pt-2">
                    <span class="text-[#1e3a8a] font-bold">Net Profit:</span>
                    <span class="text-[var(--primary-color)] font-bold text-xl">$${(netBenefit - totalCosts).toFixed(2)}</span>
                </div>
            </div>
        </div>
    `;
    breakdownElement.innerHTML = breakdownHTML;

    // Provide interpretation
    let interpretation = '';
    let resultClass = 'show';

    if (roi > 200) {
        interpretation = '🚀 Exceptional ROI! The AI voice agent will deliver outstanding returns and pay for itself very quickly.';
        resultClass += ' positive';
    } else if (roi > 100) {
        interpretation = '📈 Excellent ROI! The AI voice agent is a highly profitable investment for your business.';
        resultClass += ' positive';
    } else if (roi > 50) {
        interpretation = '✅ Good ROI! The AI voice agent will provide solid returns on your investment.';
        resultClass += ' positive';
    } else if (roi > 0) {
        interpretation = '💰 Positive ROI! The AI voice agent will generate more value than it costs.';
        resultClass += ' positive';
    } else if (roi === 0) {
        interpretation = '⚖️ Break-even scenario. The AI voice agent will pay for itself but won\'t generate additional profit.';
    } else {
        interpretation = '⚠️ Negative ROI. Consider optimizing your conversion rate or reducing missed calls to improve returns.';
        resultClass += ' negative';
    }

    // Add additional insights
    if (monthlyRecoveredRevenue > monthlySavings && monthlyRecoveredRevenue > 0) {
        interpretation += ` The primary value comes from recovering missed calls (${((monthlyRecoveredRevenue / (monthlyRecoveredRevenue + monthlySavings)) * 100).toFixed(1)}% of total benefit).`;
    } else if (monthlySavings > monthlyRecoveredRevenue && monthlySavings > 0) {
        interpretation += ` The primary value comes from payroll savings (${((monthlySavings / (monthlyRecoveredRevenue + monthlySavings)) * 100).toFixed(1)}% of total benefit).`;
    }

    interpretationElement.textContent = interpretation;
    resultDiv.className = `result ${resultClass}`;
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
}

// Add enter key support and input validation
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, setting up event listeners...');
    
    // Test if calculate button exists
    const calculateButton = document.querySelector('button[onclick="calculateROI()"]');
    console.log('Calculate button found:', !!calculateButton);
    
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
});

// Test function for AI Voice Agent ROI calculations
function testAIVoiceAgentROI() {
    console.log('Testing AI Voice Agent ROI calculations...');
    
    // Test case 1: High-value scenario
    const test1 = {
        setupCost: 1000,
        monthlyVoiceAgent: 200,
        monthlyReceptionist: 3000,
        missedCalls: 50,
        averageServiceCost: 500,
        conversionRate: 20,
        timeFrame: 12
    };
    
    const monthlySavings1 = test1.monthlyReceptionist - test1.monthlyVoiceAgent;
    const monthlyRecoveredRevenue1 = (test1.missedCalls * (test1.conversionRate / 100) * test1.averageServiceCost);
    const totalMonthlyBenefit1 = monthlySavings1 + monthlyRecoveredRevenue1;
    const totalCosts1 = test1.setupCost + (test1.monthlyVoiceAgent * test1.timeFrame);
    const totalBenefits1 = totalMonthlyBenefit1 * test1.timeFrame;
    const roi1 = (totalBenefits1 / totalCosts1) * 100;
    
    console.log(`Test 1 - High-value scenario:`);
    console.log(`Monthly Savings: $${monthlySavings1}`);
    console.log(`Monthly Recovered Revenue: $${monthlyRecoveredRevenue1}`);
    console.log(`ROI: ${roi1.toFixed(1)}%`);
    console.log(`Expected high ROI: ${roi1 > 100 ? 'PASSED' : 'FAILED'}`);
    
    // Test case 2: Break-even scenario
    const test2 = {
        setupCost: 500,
        monthlyVoiceAgent: 100,
        monthlyReceptionist: 100,
        missedCalls: 0,
        averageServiceCost: 0,
        conversionRate: 0,
        timeFrame: 12
    };
    
    const monthlySavings2 = test2.monthlyReceptionist - test2.monthlyVoiceAgent;
    const totalCosts2 = test2.setupCost + (test2.monthlyVoiceAgent * test2.timeFrame);
    const totalBenefits2 = monthlySavings2 * test2.timeFrame;
    const roi2 = totalCosts2 > 0 ? (totalBenefits2 / totalCosts2) * 100 : 0;
    
    console.log(`Test 2 - Break-even scenario:`);
    console.log(`Monthly Savings: $${monthlySavings2}`);
    console.log(`ROI: ${roi2.toFixed(1)}%`);
    console.log(`Expected negative ROI due to setup cost: ${roi2 < 0 ? 'PASSED' : 'FAILED'}`);
    
    console.log('AI Voice Agent ROI calculation tests completed.');
}

// Run tests in console (uncomment for testing)
// testAIVoiceAgentROI();