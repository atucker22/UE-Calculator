import { FINGERDIPJointData, FINGERPIPJointData, FINGERMPJointData } from '../data/fingerData.js';

export class LittleCalculator {
    static initialize() {
        // Show calculator options when Calculate button is clicked
        const calculateButton = document.getElementById('calculate-little');
        if (calculateButton) {
            calculateButton.addEventListener('click', () => {
                this.showCalculatorOptions();
            });
        }
    }

    static showCalculatorOptions() {
        const calculatorDiv = document.getElementById('little-calculator-options');
        if (!calculatorDiv) return;

        calculatorDiv.innerHTML = `
            <div class="calculator-options">
                <h3>Options for Little</h3>
                <div class="option-item" onclick="showCalculator('little-rom')">
                    <span>ROM</span>
                </div>
                <div class="option-item" onclick="showCalculator('little-arthroplasty')">
                    <span>Arthroplasty</span>
                </div>
                <div class="option-item" onclick="showCalculator('little-sensory')">
                    <span>Sensory</span>
                </div>
                <div class="option-item" onclick="showCalculator('little-amputation')">
                    <span>Amputation</span>
                </div>
                <div class="option-item" onclick="showCalculator('little-synovial')">
                    <span>Synovial Hypertrophy</span>
                </div>
                <div class="option-item" onclick="showCalculator('little-lateral')">
                    <span>Lateral Deviation</span>
                </div>
                <div class="option-item" onclick="showCalculator('little-rotation')">
                    <span>Digit Rotation Deformity</span>
                </div>
                <div class="option-item" onclick="showCalculator('little-subluxation')">
                    <span>Persistent Joint Subluxation/Dislocation</span>
                </div>
                <div class="option-item" onclick="showCalculator('little-instability')">
                    <span>Joint Passive Mediolateral Instability</span>
                </div>
                <div class="option-item" onclick="showCalculator('little-tightness')">
                    <span>Intrinsic Tightness</span>
                </div>
                <div class="option-item" onclick="showCalculator('little-tenosynovitis')">
                    <span>Constrictive Tenosynovitis</span>
                </div>
                <div class="option-item" onclick="showCalculator('little-tendon')">
                    <span>Extensor Tendon Subluxation at MP Joint</span>
                </div>
            </div>
        `;
    }

    static calculateROM() {
        this.updateLittleImpairment();
        this.updateTotalImpairment();
    }

    static updateLittleImpairment() {
        // Calculate DIP Joint
        const dipFlexionInput = document.getElementById('little-dip-flexion');
        const dipExtensionInput = document.getElementById('little-dip-extension');
        const dipAnkylosisInput = document.getElementById('little-dip-ankylosis');
        const dipFlexionImpOutput = document.getElementById('little-dip-flexion-imp');
        const dipExtensionImpOutput = document.getElementById('little-dip-extension-imp');
        const dipAnkylosisImpOutput = document.getElementById('little-dip-ankylosis-imp');
        const dipImpOutput = document.getElementById('little-dip-imp');
        
        let dipImpairment = 0;
        
        // Handle DIP flexion/extension impairments
        if (dipFlexionInput.value === '') {
            dipFlexionImpOutput.textContent = '';
        } else {
            const flexionAngle = parseInt(dipFlexionInput.value);
            const flexionImp = this.findImpairment(flexionAngle, FINGERDIPJointData, 'flexion', 'dtFlexion');
            dipFlexionImpOutput.textContent = flexionImp;
            dipImpairment += flexionImp;
        }
        
        if (dipExtensionInput.value === '') {
            dipExtensionImpOutput.textContent = '';
        } else {
            const extensionAngle = parseInt(dipExtensionInput.value);
            const extensionImp = this.findImpairment(extensionAngle, FINGERDIPJointData, 'extension', 'dtExtension');
            dipExtensionImpOutput.textContent = extensionImp;
            dipImpairment += extensionImp;
        }
        
        if (dipAnkylosisInput.value === '') {
            dipAnkylosisImpOutput.textContent = '';
        } else {
            const ankylosisAngle = parseInt(dipAnkylosisInput.value);
            const ankylosisImp = this.findImpairment(ankylosisAngle, FINGERDIPJointData, 'ankylosis', 'dtAnkylosis');
            dipAnkylosisImpOutput.textContent = ankylosisImp;
            dipImpairment = Math.max(dipImpairment, ankylosisImp);
        }
        
        dipImpOutput.textContent = dipImpairment;

        // Calculate PIP Joint
        const pipFlexionInput = document.getElementById('little-pip-flexion');
        const pipExtensionInput = document.getElementById('little-pip-extension');
        const pipAnkylosisInput = document.getElementById('little-pip-ankylosis');
        const pipFlexionImpOutput = document.getElementById('little-pip-flexion-imp');
        const pipExtensionImpOutput = document.getElementById('little-pip-extension-imp');
        const pipAnkylosisImpOutput = document.getElementById('little-pip-ankylosis-imp');
        const pipImpOutput = document.getElementById('little-pip-imp');
        
        let pipImpairment = 0;
        
        // Handle PIP flexion/extension impairments
        if (pipFlexionInput.value === '') {
            pipFlexionImpOutput.textContent = '';
        } else {
            const flexionAngle = parseInt(pipFlexionInput.value);
            const flexionImp = this.findImpairment(flexionAngle, FINGERPIPJointData, 'flexion', 'dtFlexion');
            pipFlexionImpOutput.textContent = flexionImp;
            pipImpairment += flexionImp;
        }
        
        if (pipExtensionInput.value === '') {
            pipExtensionImpOutput.textContent = '';
        } else {
            const extensionAngle = parseInt(pipExtensionInput.value);
            const extensionImp = this.findImpairment(extensionAngle, FINGERPIPJointData, 'extension', 'dtExtension');
            pipExtensionImpOutput.textContent = extensionImp;
            pipImpairment += extensionImp;
        }
        
        if (pipAnkylosisInput.value === '') {
            pipAnkylosisImpOutput.textContent = '';
        } else {
            const ankylosisAngle = parseInt(pipAnkylosisInput.value);
            const ankylosisImp = this.findImpairment(ankylosisAngle, FINGERPIPJointData, 'ankylosis', 'dtAnkylosis');
            pipAnkylosisImpOutput.textContent = ankylosisImp;
            pipImpairment = Math.max(pipImpairment, ankylosisImp);
        }
        
        pipImpOutput.textContent = pipImpairment;

        // Calculate MP Joint
        const mpFlexionInput = document.getElementById('little-mp-flexion');
        const mpExtensionInput = document.getElementById('little-mp-extension');
        const mpAnkylosisInput = document.getElementById('little-mp-ankylosis');
        const mpFlexionImpOutput = document.getElementById('little-mp-flexion-imp');
        const mpExtensionImpOutput = document.getElementById('little-mp-extension-imp');
        const mpAnkylosisImpOutput = document.getElementById('little-mp-ankylosis-imp');
        const mpImpOutput = document.getElementById('little-mp-imp');
        
        let mpImpairment = 0;
        
        // Handle MP flexion/extension impairments
        if (mpFlexionInput.value === '') {
            mpFlexionImpOutput.textContent = '';
        } else {
            const flexionAngle = parseInt(mpFlexionInput.value);
            const flexionImp = this.findImpairment(flexionAngle, FINGERMPJointData, 'flexion', 'dtFlexion');
            mpFlexionImpOutput.textContent = flexionImp;
            mpImpairment += flexionImp;
        }
        
        if (mpExtensionInput.value === '') {
            mpExtensionImpOutput.textContent = '';
        } else {
            const extensionAngle = parseInt(mpExtensionInput.value);
            const extensionImp = this.findImpairment(extensionAngle, FINGERMPJointData, 'extension', 'dtExtension');
            mpExtensionImpOutput.textContent = extensionImp;
            mpImpairment += extensionImp;
        }
        
        if (mpAnkylosisInput.value === '') {
            mpAnkylosisImpOutput.textContent = '';
        } else {
            const ankylosisAngle = parseInt(mpAnkylosisInput.value);
            const ankylosisImp = this.findImpairment(ankylosisAngle, FINGERMPJointData, 'ankylosis', 'dtAnkylosis');
            mpAnkylosisImpOutput.textContent = ankylosisImp;
            mpImpairment = Math.max(mpImpairment, ankylosisImp);
        }
        
        mpImpOutput.textContent = mpImpairment;

        // Calculate total using CVC formula
        let impairments = [dipImpairment, pipImpairment, mpImpairment].filter(imp => imp > 0);
        let totalDigitImpairment = this.combineImpairments(impairments);

        // Cap totalDigitImpairment at 100 DT
        totalDigitImpairment = Math.min(totalDigitImpairment, 100);

        // Calculate hand impairment with 10% conversion factor and round to nearest whole number
        const handImpairment = Math.round(totalDigitImpairment * 0.10);

        // Update total
        const totalElement = document.getElementById('little-rom-total');
        if (totalElement) {
            totalElement.textContent = `${totalDigitImpairment} DT = ${handImpairment} HD`;
        }
    }

    static findImpairment(angle, dataArray, angleField, impairmentField) {
        // Special handling for DIP joint edge cases
        if (dataArray === FINGERDIPJointData) {
            // For DIP Flexion: angles less than -30 should return 45
            if (angleField === 'flexion' && angle < -30) {
                return 45;
            }
            // For DIP Extension: angles less than -70 should return 45
            if (angleField === 'extension' && angle < -70) {
                return 45;
            }
            // For DIP Ankylosis: angles less than -30 OR greater than 70 should return 45
            if (angleField === 'ankylosis' && (angle < -30 || angle > 70)) {
                return 45;
            }
        }

        // Special handling for PIP joint edge cases
        if (dataArray === FINGERPIPJointData) {
            // For PIP Flexion: angles less than -30 should return 80
            if (angleField === 'flexion' && angle < -30) {
                return 80;
            }
            // For PIP Extension: angles less than -100 should return 80
            if (angleField === 'extension' && angle < -100) {
                return 80;
            }
            // For PIP Ankylosis: angles less than -30 OR greater than 100 should return 80
            if (angleField === 'ankylosis' && (angle < -30 || angle > 100)) {
                return 80;
            }
        }

        // Special handling for MP joint edge cases
        if (dataArray === FINGERMPJointData) {
            // For MP Flexion: angles less than -20 should return 60
            if (angleField === 'flexion' && angle < -20) {
                return 60;
            }
            // For MP Extension: angles less than -90 should return 100
            if (angleField === 'extension' && angle < -90) {
                return 100;
            }
            // For MP Ankylosis: angles less than -20 should return 60
            if (angleField === 'ankylosis' && angle < -20) {
                return 60;
            }
            // For MP Ankylosis: angles greater than 90 should return 100
            if (angleField === 'ankylosis' && angle > 90) {
                return 100;
            }
        }

        // Handle regular cases
        let exactMatch = dataArray.find(entry => {
            const entryAngle = typeof entry[angleField] === 'string' ? 
                parseInt(entry[angleField].replace(/[<>]/g, '')) : 
                entry[angleField];
            return entryAngle === angle;
        });

        if (exactMatch) {
            return exactMatch[impairmentField];
        }

        // Handle values beyond ranges
        const firstEntry = dataArray[0];
        const lastEntry = dataArray[dataArray.length - 1];

        // Check for values beyond upper range
        if (typeof firstEntry[angleField] === 'string' && firstEntry[angleField].startsWith('>')) {
            const threshold = parseInt(firstEntry[angleField].slice(1));
            if (angle > threshold) {
                return firstEntry[impairmentField];
            }
        }

        // Check for values beyond lower range
        if (typeof lastEntry[angleField] === 'string' && lastEntry[angleField].startsWith('<')) {
            const threshold = parseInt(lastEntry[angleField].slice(1));
            if (angle < threshold) {
                return lastEntry[impairmentField];
            }
        }

        return 0;
    }

    static combineImpairments(impairments) {
        if (impairments.length === 0) return 0;
        if (impairments.length === 1) return impairments[0];

        // Sort impairments in descending order
        impairments.sort((a, b) => b - a);

        // Convert percentages to decimals
        let result = impairments[0];

        // Combine remaining values using CVC formula
        for (let i = 1; i < impairments.length; i++) {
            result = result + (impairments[i] * (1 - result/100));
            result = Math.round(result); // Round after each combination
        }

        return result;
    }
} 