// Global variables
let isMetric = true;
let bmiData = null;

// DOM elements
const metricBtn = document.getElementById('metric-btn');
const imperialBtn = document.getElementById('imperial-btn');
const weightInput = document.getElementById('weight');
const heightInput = document.getElementById('height');
const feetInput = document.getElementById('feet');
const inchesInput = document.getElementById('inches');
const metricHeight = document.getElementById('metric-height');
const imperialHeight = document.getElementById('imperial-height');
const weightUnit = document.getElementById('weight-unit');
const heightUnit = document.getElementById('height-unit');
const calculateBtn = document.getElementById('calculate-btn');
const btnText = document.getElementById('btn-text');
const loading = document.getElementById('loading');
const noResults = document.getElementById('no-results');
const bmiResults = document.getElementById('bmi-results');
const bmiValue = document.getElementById('bmi-value');
const bmiCategory = document.getElementById('bmi-category');
const scaleIndicator = document.getElementById('scale-indicator');
const healthTipText = document.getElementById('health-tip-text');

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    updateInputValidation();
    
    // Add input event listeners
    weightInput.addEventListener('input', updateInputValidation);
    heightInput.addEventListener('input', updateInputValidation);
    feetInput.addEventListener('input', updateInputValidation);
    inchesInput.addEventListener('input', updateInputValidation);
});

// Set unit system
function setUnit(metric) {
    isMetric = metric;
    
    // Update button states
    if (metric) {
        metricBtn.classList.add('active');
        imperialBtn.classList.remove('active');
        metricHeight.classList.remove('hidden');
        imperialHeight.classList.add('hidden');
        weightUnit.textContent = '(kg)';
        heightUnit.textContent = '(cm)';
        weightInput.placeholder = 'e.g., 70';
        heightInput.placeholder = 'e.g., 175';
    } else {
        imperialBtn.classList.add('active');
        metricBtn.classList.remove('active');
        imperialHeight.classList.remove('hidden');
        metricHeight.classList.add('hidden');
        weightUnit.textContent = '(lbs)';
        heightUnit.textContent = '(ft & in)';
        weightInput.placeholder = 'e.g., 154';
        feetInput.placeholder = 'Feet';
        inchesInput.placeholder = 'Inches';
    }
    
    // Clear inputs when switching units
    resetCalculator();
    updateInputValidation();
}

// Reset calculator
function resetCalculator() {
    weightInput.value = '';
    heightInput.value = '';
    feetInput.value = '';
    inchesInput.value = '';
    bmiData = null;
    
    // Hide results and show no results
    bmiResults.classList.add('hidden');
    noResults.classList.remove('hidden');
    
    updateInputValidation();
}

// Update input validation and button state
function updateInputValidation() {
    const isValid = isValidInput();
    calculateBtn.disabled = !isValid;
}

// Check if input is valid
function isValidInput() {
    if (isMetric) {
        const weight = parseFloat(weightInput.value);
        const height = parseFloat(heightInput.value);
        return weight > 0 && height > 0;
    } else {
        const weight = parseFloat(weightInput.value);
        const feet = parseFloat(feetInput.value);
        const inches = parseFloat(inchesInput.value);
        return weight > 0 && feet > 0 && inches >= 0;
    }
}

// Calculate BMI
function calculateBMI() {
    if (!isValidInput()) return;
    
    // Show loading state
    btnText.classList.add('hidden');
    loading.classList.remove('hidden');
    calculateBtn.disabled = true;
    
    setTimeout(() => {
        let weightKg = parseFloat(weightInput.value);
        let heightM = parseFloat(heightInput.value) / 100;

        if (!isMetric) {
            // Convert pounds to kg and feet/inches to meters
            weightKg = parseFloat(weightInput.value) * 0.453592;
            const totalInches = parseFloat(feetInput.value) * 12 + parseFloat(inchesInput.value);
            heightM = totalInches * 0.0254;
        }

        if (weightKg > 0 && heightM > 0) {
            const bmi = weightKg / (heightM * heightM);
            const bmiRounded = Math.round(bmi * 10) / 10;

            let category = '';
            let categoryClass = '';
            let healthTip = '';

            if (bmiRounded < 18.5) {
                category = 'Underweight';
                categoryClass = 'underweight';
                healthTip = 'Consider consulting with a healthcare provider about healthy weight gain strategies.';
            } else if (bmiRounded < 25) {
                category = 'Normal Weight';
                categoryClass = 'normal';
                healthTip = 'Great job! Maintain your healthy lifestyle with regular exercise and balanced nutrition.';
            } else if (bmiRounded < 30) {
                category = 'Overweight';
                categoryClass = 'overweight';
                healthTip = 'Consider incorporating more physical activity and reviewing your diet with a healthcare provider.';
            } else {
                category = 'Obese';
                categoryClass = 'obese';
                healthTip = 'Consult with a healthcare provider to develop a safe and effective weight management plan.';
            }

            bmiData = {
                bmi: bmiRounded,
                category,
                categoryClass,
                healthTip
            };

            displayResults();
        }
        
        // Hide loading state
        loading.classList.add('hidden');
        btnText.classList.remove('hidden');
        calculateBtn.disabled = false;
        updateInputValidation();
    }, 800);
}

// Display BMI results
function displayResults() {
    if (!bmiData) return;
    
    // Update BMI value and category
    bmiValue.textContent = bmiData.bmi;
    bmiCategory.textContent = bmiData.category;
    bmiCategory.className = `bmi-category ${bmiData.categoryClass}`;
    
    // Update scale indicator position
    const position = getBMIPosition(bmiData.bmi);
    scaleIndicator.style.left = `${position}%`;
    
    // Update health tip
    healthTipText.textContent = bmiData.healthTip;
    
    // Show results
    noResults.classList.add('hidden');
    bmiResults.classList.remove('hidden');
}

// Get BMI position on scale (0-100%)
function getBMIPosition(bmi) {
    if (bmi < 15) return 0;
    if (bmi > 40) return 100;
    return ((bmi - 15) / 25) * 100;
}