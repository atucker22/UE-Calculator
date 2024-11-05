import { WRISTFlexionExtensionData, WRISTRadialUlnarDeviationData } from '../data/wristData.js';

export class WristCalculator {
    static calculateROM() {
        this.updateWristImpairment();
        this.updateTotalImpairment();
    }

    static updateWristImpairment() {
        // Calculate Flexion/Extension
        const flexionInput = document.getElementById('wrist-flexion');
        const extensionInput = document.getElementById('wrist-extension');
        const flexionImpOutput = document.getElementById('wrist-flexion-imp');
        const extensionImpOutput = document.getElementById('wrist-extension-imp');
        const feAnkylosisInput = document.getElementById('wrist-ankylosis-fe');
        const feAnkylosisImpOutput = document.getElementById('wrist-ankylosis-fe-imp');
        
        let feImpairment = 0;
        
        // Handle flexion/extension impairments
        if (flexionInput.value === '') {
            flexionImpOutput.textContent = '';
        } else {
            const flexionImp = this.findImpairment(parseInt(flexionInput.value), WRISTFlexionExtensionData, 'flexion', 'ueFlexion');
            flexionImpOutput.textContent = flexionImp || 0;
            feImpairment += flexionImp || 0;
        }
        
        if (extensionInput.value === '') {
            extensionImpOutput.textContent = '';
        } else {
            const extensionImp = this.findImpairment(parseInt(extensionInput.value), WRISTFlexionExtensionData, 'extension', 'ueExtension');
            extensionImpOutput.textContent = extensionImp || 0;
            feImpairment += extensionImp || 0;
        }
        
        if (feAnkylosisInput.value === '') {
            feAnkylosisImpOutput.textContent = '';
        } else {
            const ankylosisImp = this.findImpairment(parseInt(feAnkylosisInput.value), WRISTFlexionExtensionData, 'ankylosis', 'ueAnkylosis');
            feAnkylosisImpOutput.textContent = ankylosisImp || 0;
            feImpairment = Math.max(feImpairment, ankylosisImp || 0);
        }
        
        // Always show total for flexion/extension group
        document.getElementById('wrist-fe-imp').textContent = feImpairment || '0';

        // Calculate Radial/Ulnar Deviation
        const radialInput = document.getElementById('wrist-radial');
        const ulnarInput = document.getElementById('wrist-ulnar');
        const radialImpOutput = document.getElementById('wrist-radial-imp');
        const ulnarImpOutput = document.getElementById('wrist-ulnar-imp');
        const ruAnkylosisInput = document.getElementById('wrist-ankylosis-ru');
        const ruAnkylosisImpOutput = document.getElementById('wrist-ankylosis-ru-imp');
        
        let ruImpairment = 0;
        
        // Handle radial/ulnar deviation impairments
        if (radialInput.value === '') {
            radialImpOutput.textContent = '';
        } else {
            const radialImp = this.findImpairment(parseInt(radialInput.value), WRISTRadialUlnarDeviationData, 'radialDeviation', 'ueRadialDeviation');
            radialImpOutput.textContent = radialImp || 0;
            ruImpairment += radialImp || 0;
        }
        
        if (ulnarInput.value === '') {
            ulnarImpOutput.textContent = '';
        } else {
            const ulnarImp = this.findImpairment(parseInt(ulnarInput.value), WRISTRadialUlnarDeviationData, 'ulnarDeviation', 'ueUlnarDeviation');
            ulnarImpOutput.textContent = ulnarImp || 0;
            ruImpairment += ulnarImp || 0;
        }
        
        if (ruAnkylosisInput.value === '') {
            ruAnkylosisImpOutput.textContent = '';
        } else {
            const ankylosisImp = this.findImpairment(parseInt(ruAnkylosisInput.value), WRISTRadialUlnarDeviationData, 'ankylosis', 'ueAnkylosis');
            ruAnkylosisImpOutput.textContent = ankylosisImp || 0;
            ruImpairment = Math.max(ruImpairment, ankylosisImp || 0);
        }
        
        // Always show total for radial/ulnar deviation group
        document.getElementById('wrist-ru-imp').textContent = ruImpairment || '0';

        // Calculate total
        let totalUE = feImpairment + ruImpairment;
        
        // Cap totalUE at 100
        totalUE = Math.min(totalUE, 100);
        
        const totalWPI = Math.round(totalUE * 0.6);

        // Update the ROM total display
        document.getElementById('wrist-rom-total').textContent = totalUE || '0';
        document.getElementById('wrist-rom-wpi').textContent = totalWPI || '0';

        this.updateTotalImpairment();
    }

    static findImpairment(angle, dataArray, angleField, impairmentField) {
        // Special handling for Wrist Flexion and Ankylosis edge cases
        if (dataArray === WRISTFlexionExtensionData) {
            // For Flexion: angles less than -60 should return 42
            if (angleField === 'flexion' && angle < -60) {
                return 42;
            }
            // For Ankylosis: angles greater than 60 should return 42
            if (angleField === 'ankylosis' && angle > 60) {
                return 42;
            }
        }

        // Special handling for Ulnar Deviation edge cases
        if (dataArray === WRISTRadialUlnarDeviationData) {
            // For Ulnar Deviation: angles less than -20 should return 18
            if (angleField === 'ulnarDeviation' && angle < -20) {
                return 18;
            }
        }

        // Handle regular cases
        const firstEntry = dataArray[0];
        const lastEntry = dataArray[dataArray.length - 1];
        
        // Check for values beyond the upper range
        if (typeof firstEntry[angleField] === 'string' && firstEntry[angleField].startsWith('>')) {
            const threshold = parseInt(firstEntry[angleField].slice(1));
            if (angle > threshold) {
                return firstEntry[impairmentField];
            }
        }
        
        // Check for values beyond the lower range
        if (typeof lastEntry[angleField] === 'string' && lastEntry[angleField].startsWith('<')) {
            const threshold = parseInt(lastEntry[angleField].slice(1));
            if (angle < threshold) {
                return lastEntry[impairmentField];
            }
        }

        // Find exact match
        const exactMatch = dataArray.find(entry => entry[angleField] === angle);
        if (exactMatch) {
            return exactMatch[impairmentField];
        }

        return 0;
    }

    static updateTotalImpairment() {
        const totalImpairmentDiv = document.getElementById('totalImpairment-wrist');
        if (!totalImpairmentDiv) return;

        // Collect all selected impairment types
        const selectedImpairments = new Set();
        
        // Check which calculators are visible/active
        if (document.getElementById('wrist-rom-total')) selectedImpairments.add('ROM');
        if (document.querySelector('.wrist-arthroplasty')) selectedImpairments.add('Arthroplasty');
        if (document.getElementById('wrist-synovial-hypertrophy-total')) selectedImpairments.add('Synovial Hypertrophy');
        if (document.getElementById('wrist-active-deviation-total')) selectedImpairments.add('Excessive Active Mediolateral Deviation');
        if (document.getElementById('wrist-carpal-instability-total')) selectedImpairments.add('Carpal Instability Patterns');

        // Collect all impairments with values
        const impairments = [];
        
        // Get ROM impairment
        const romTotal = parseInt(document.getElementById('wrist-rom-total')?.textContent) || 0;
        if (selectedImpairments.has('ROM')) impairments.push(romTotal);
        
        // Get Arthroplasty impairment
        const arthroplastyText = document.getElementById('wrist-arthroplasty-total-value')?.textContent || '';
        const arthroplastyMatch = arthroplastyText.match(/(\d+)\s*UE/);
        const arthroplastyValue = arthroplastyMatch ? parseInt(arthroplastyMatch[1]) : 0;
        if (selectedImpairments.has('Arthroplasty')) impairments.push(arthroplastyValue);

        // Get Synovial Hypertrophy impairment
        const synovialText = document.getElementById('wrist-synovial-hypertrophy-total')?.textContent || '';
        const synovialMatch = synovialText.match(/(\d+)\s*UE/);
        const synovialValue = synovialMatch ? parseInt(synovialMatch[1]) : 0;
        if (selectedImpairments.has('Synovial Hypertrophy')) impairments.push(synovialValue);

        // Get Active Deviation impairment
        const activeDeviationText = document.getElementById('wrist-active-deviation-total')?.textContent || '';
        const activeDeviationMatch = activeDeviationText.match(/(\d+)\s*UE/);
        const activeDeviationValue = activeDeviationMatch ? parseInt(activeDeviationMatch[1]) : 0;
        if (selectedImpairments.has('Excessive Active Mediolateral Deviation')) impairments.push(activeDeviationValue);

        // Get Carpal Instability impairment
        const carpalInstabilityText = document.getElementById('wrist-carpal-instability-total')?.textContent || '';
        const carpalInstabilityMatch = carpalInstabilityText.match(/(\d+)\s*UE/);
        const carpalInstabilityValue = carpalInstabilityMatch ? parseInt(carpalInstabilityMatch[1]) : 0;
        if (selectedImpairments.has('Carpal Instability Patterns')) impairments.push(carpalInstabilityValue);

        // Sort impairments in descending order
        impairments.sort((a, b) => b - a);

        // Calculate combined impairment
        const combinedUE = this.combineImpairments(impairments);
        const combinedWPI = Math.round(combinedUE * 0.6);

        // Update the total impairment display
        let breakdownHtml = '<h3>Wrist - Total Impairment</h3>';
        
        // Add all selected impairments (even if zero)
        if (selectedImpairments.has('ROM')) {
            breakdownHtml += `<p>ROM: ${romTotal} UE</p>`;
        }
        if (selectedImpairments.has('Arthroplasty')) {
            breakdownHtml += `<p>Arthroplasty: ${arthroplastyValue} UE</p>`;
        }
        if (selectedImpairments.has('Synovial Hypertrophy')) {
            breakdownHtml += `<p>Synovial Hypertrophy: ${synovialValue} UE</p>`;
        }
        if (selectedImpairments.has('Excessive Active Mediolateral Deviation')) {
            breakdownHtml += `<p>Excessive Active Mediolateral Deviation: ${activeDeviationValue} UE</p>`;
        }
        if (selectedImpairments.has('Carpal Instability Patterns')) {
            breakdownHtml += `<p>Carpal Instability Patterns: ${carpalInstabilityValue} UE</p>`;
        }
        
        // Add combined result if there are multiple impairments
        if (impairments.length > 1) {
            breakdownHtml += `<p>Combined: ${impairments.join(' C ')} = ${combinedUE} UE</p>`;
        }
        
        breakdownHtml += `<p><strong>Total: ${combinedUE} UE = ${combinedWPI} WPI</strong></p>`;
        
        totalImpairmentDiv.innerHTML = breakdownHtml;

        // Make sure to call the global updateOverallTotalImpairment function
        if (typeof window.updateOverallTotalImpairment === 'function') {
            window.updateOverallTotalImpairment();
        }
    }

    static combineImpairments(impairments) {
        if (impairments.length === 0) return 0;
        if (impairments.length === 1) return impairments[0];

        // Convert percentages to decimals
        let decimalImpairments = impairments.map(imp => imp / 100);
        
        // Sort in descending order
        decimalImpairments.sort((a, b) => b - a);

        // Combine first two values
        let result = decimalImpairments[0] + decimalImpairments[1] * (1 - decimalImpairments[0]);
        result = Math.round(result * 100); // Convert to percentage and round

        // Combine remaining values
        for (let i = 2; i < decimalImpairments.length; i++) {
            result = result + (decimalImpairments[i] * 100) * (1 - result/100);
            result = Math.round(result); // Round after each combination
        }

        return result;
    }

    static calculateArthroplasty() {
        const checkboxes = document.querySelectorAll('.wrist-arthroplasty input[type="checkbox"]');
        const selectedValues = Array.from(checkboxes)
            .filter(cb => cb.checked)
            .map(cb => parseInt(cb.value))
            .sort((a, b) => b - a);

        let combinedUE = 0;
        const combinedDiv = document.getElementById('wrist-arthroplasty-combined');
        const totalValueElement = document.getElementById('wrist-arthroplasty-total-value');

        if (selectedValues.length > 0) {
            if (selectedValues.length === 1) {
                combinedUE = selectedValues[0];
                combinedDiv.innerHTML = '';
            } else {
                let result = selectedValues[0];
                let combinedText = `<p>Combined: ${selectedValues.join(' C ')} = `;
                
                for (let i = 1; i < selectedValues.length; i++) {
                    result = result + (selectedValues[i] * (1 - result/100));
                    result = Math.round(result);
                }
                
                combinedUE = result;
                combinedText += `${combinedUE} UE</p>`;
                combinedDiv.innerHTML = combinedText;
            }
        } else {
            combinedDiv.innerHTML = '';
            combinedUE = 0;
        }

        const wpi = Math.round(combinedUE * 0.6);
        
        // Update both display elements
        if (totalValueElement) {
            totalValueElement.textContent = `${combinedUE} UE = ${wpi} WPI`;
        }

        // Store the value in a format consistent with other impairments
        let storageElement = document.getElementById('wrist-arthroplasty-total');
        if (!storageElement) {
            storageElement = document.createElement('div');
            storageElement.id = 'wrist-arthroplasty-total';
            document.body.appendChild(storageElement);
        }
        storageElement.textContent = `${combinedUE} UE`;

        this.updateTotalImpairment();
    }

    static calculateSynovialHypertrophy() {
        let totalUEImpairment = 0;
        const checkedBoxes = document.querySelectorAll('.synovial-checkbox:checked');
        
        checkedBoxes.forEach(checkbox => {
            totalUEImpairment += parseInt(checkbox.value) || 0;
        });

        const totalWPI = Math.round(totalUEImpairment * 0.6);
        const totalElement = document.getElementById('wrist-synovial-hypertrophy-total');
        if (totalElement) {
            totalElement.textContent = `${totalUEImpairment} UE = ${totalWPI} WPI`;
        }

        this.updateTotalImpairment();
    }

    static calculateActiveDeviation() {
        let totalUEImpairment = 0;
        const checkedBoxes = document.querySelectorAll('.active-deviation-checkbox:checked');
        
        checkedBoxes.forEach(checkbox => {
            totalUEImpairment += parseInt(checkbox.value) || 0;
        });

        const totalWPI = Math.round(totalUEImpairment * 0.6);
        const totalElement = document.getElementById('wrist-active-deviation-total');
        if (totalElement) {
            totalElement.textContent = `${totalUEImpairment} UE = ${totalWPI} WPI`;
        }

        this.updateTotalImpairment();
    }

    static calculateCarpalInstability() {
        let totalUEImpairment = 0;
        const checkedBox = document.querySelector('.carpal-instability-checkbox:checked');
        
        if (checkedBox) {
            totalUEImpairment = parseInt(checkedBox.value) || 0;
        }

        const totalWPI = Math.round(totalUEImpairment * 0.6);
        const totalElement = document.getElementById('wrist-carpal-instability-total');
        if (totalElement) {
            totalElement.textContent = `${totalUEImpairment} UE = ${totalWPI} WPI`;
        }

        this.updateTotalImpairment();
    }
} 
