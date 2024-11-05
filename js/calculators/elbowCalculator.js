import { ELBOWFlexionExtensionData, ELBOWPronationSupinationData } from '../data/elbowData.js';

export class ElbowCalculator {
    static calculateROM() {
        this.updateElbowImpairment();
        this.updateTotalImpairment();
    }

    static updateElbowImpairment() {
        // Calculate Flexion/Extension
        const flexionInput = document.getElementById('elbow-flexion');
        const extensionInput = document.getElementById('elbow-extension');
        const flexionImpOutput = document.getElementById('elbow-flexion-imp');
        const extensionImpOutput = document.getElementById('elbow-extension-imp');
        const feAnkylosisInput = document.getElementById('elbow-ankylosis-fe');
        const feAnkylosisImpOutput = document.getElementById('elbow-ankylosis-fe-imp');
        
        let feImpairment = 0;
        
        // Handle flexion/extension impairments
        if (flexionInput.value === '') {
            flexionImpOutput.textContent = '';
        } else {
            const flexionAngle = parseInt(flexionInput.value);
            const flexionImp = this.findImpairment(flexionAngle, ELBOWFlexionExtensionData, 'flexion', 'ueFlexion');
            flexionImpOutput.textContent = flexionImp;
            feImpairment += flexionImp;
        }
        
        if (extensionInput.value === '') {
            extensionImpOutput.textContent = '';
        } else {
            const extensionAngle = parseInt(extensionInput.value);
            const extensionImp = this.findImpairment(extensionAngle, ELBOWFlexionExtensionData, 'extension', 'ueExtension');
            extensionImpOutput.textContent = extensionImp;
            feImpairment += extensionImp;
        }
        
        if (feAnkylosisInput.value === '') {
            feAnkylosisImpOutput.textContent = '';
        } else {
            const ankylosisAngle = parseInt(feAnkylosisInput.value);
            const ankylosisImp = this.findImpairment(ankylosisAngle, ELBOWFlexionExtensionData, 'ankylosis', 'ueAnkylosis');
            feAnkylosisImpOutput.textContent = ankylosisImp;
            feImpairment = Math.max(feImpairment, ankylosisImp);
        }
        
        // Always show total for flexion/extension group
        document.getElementById('elbow-fe-imp').textContent = feImpairment;

        // Calculate Pronation/Supination
        const pronationInput = document.getElementById('elbow-pronation');
        const supinationInput = document.getElementById('elbow-supination');
        const pronationImpOutput = document.getElementById('elbow-pronation-imp');
        const supinationImpOutput = document.getElementById('elbow-supination-imp');
        const psAnkylosisInput = document.getElementById('elbow-ankylosis-ps');
        const psAnkylosisImpOutput = document.getElementById('elbow-ankylosis-ps-imp');
        
        let psImpairment = 0;
        
        // Handle pronation/supination impairments
        if (pronationInput.value === '') {
            pronationImpOutput.textContent = '';
        } else {
            const pronationAngle = parseInt(pronationInput.value);
            const pronationImp = this.findImpairment(pronationAngle, ELBOWPronationSupinationData, 'pronation', 'uePronation');
            pronationImpOutput.textContent = pronationImp;
            psImpairment += pronationImp;
        }
        
        if (supinationInput.value === '') {
            supinationImpOutput.textContent = '';
        } else {
            const supinationAngle = parseInt(supinationInput.value);
            const supinationImp = this.findImpairment(supinationAngle, ELBOWPronationSupinationData, 'supination', 'ueSupination');
            supinationImpOutput.textContent = supinationImp;
            psImpairment += supinationImp;
        }
        
        if (psAnkylosisInput.value === '') {
            psAnkylosisImpOutput.textContent = '';
        } else {
            const ankylosisAngle = parseInt(psAnkylosisInput.value);
            const ankylosisImp = this.findImpairment(ankylosisAngle, ELBOWPronationSupinationData, 'ankylosis', 'ueAnkylosis');
            psAnkylosisImpOutput.textContent = ankylosisImp;
            psImpairment = Math.max(psImpairment, ankylosisImp);
        }
        
        // Always show total for pronation/supination group
        document.getElementById('elbow-ps-imp').textContent = psImpairment;

        // Calculate total
        let totalUE = feImpairment + psImpairment;
        
        // Cap totalUE at 100
        totalUE = Math.min(totalUE, 100);
        
        const totalWPI = Math.round(totalUE * 0.6);

        // Update the ROM total display
        document.getElementById('elbow-rom-total').textContent = totalUE;
        document.getElementById('elbow-rom-wpi').textContent = totalWPI;

        this.updateTotalImpairment();
    }

    static findImpairment(angle, dataArray, angleField, impairmentField) {
        // Special handling for Elbow Flexion/Extension edge cases
        if (dataArray === ELBOWFlexionExtensionData) {
            // For Flexion: angles over 140 should return 0, angles under 0 should return 42
            if (angleField === 'flexion') {
                if (angle > 140) return 0;
                if (angle < 0) return 42;
            }
            // For Extension: angles over 140 should return 42, angles under 0 should return 0
            if (angleField === 'extension') {
                if (angle > 140) return 42;
                if (angle < 0) return 0;
            }
            // For Ankylosis: angles over 140 should return 42, angles under 0 should return 42
            if (angleField === 'ankylosis') {
                if (angle > 140 || angle < 0) return 42;
            }
        }

        // Special handling for Pronation/Supination edge cases
        if (dataArray === ELBOWPronationSupinationData) {
            // For Supination: angles less than -80 should return 28
            if (angleField === 'supination' && angle < -80) {
                return 28;
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
        const exactMatch = dataArray.find(entry => {
            const entryAngle = typeof entry[angleField] === 'string' ? 
                parseInt(entry[angleField].replace(/[<>]/g, '')) : 
                entry[angleField];
            return entryAngle === angle;
        });
        
        if (exactMatch) {
            return exactMatch[impairmentField];
        }

        return 0;
    }

    static calculateStrength(movement, inputType) {
        const deficitInput = document.getElementById(`elbow-${movement}-strength-deficit`);
        const impInput = document.getElementById(`elbow-${movement}-strength-imp`);
        const maxUE = parseInt(deficitInput.closest('tr').children[1].textContent);

        if (inputType === 'deficit') {
            let deficit = Math.min(parseFloat(deficitInput.value) || 0, 50);
            deficitInput.value = deficit || ''; // Clear if zero
            const impairment = Math.round((deficit / 100) * maxUE);
            impInput.value = impairment || ''; // Clear if zero
        } else {
            let impairment = Math.min(parseInt(impInput.value) || 0, Math.floor(maxUE / 2));
            impInput.value = impairment || ''; // Clear if zero
            const deficit = Math.round((impairment / maxUE) * 100);
            deficitInput.value = deficit || ''; // Clear if zero
        }

        this.updateTotalElbowStrengthImpairment();
    }

    static updateTotalElbowStrengthImpairment() {
        const movements = ['flexion', 'extension', 'pronation', 'supination'];
        let totalUEImpairment = 0;

        movements.forEach(movement => {
            const impInput = document.getElementById(`elbow-${movement}-strength-imp`);
            totalUEImpairment += parseInt(impInput.value) || 0;
        });

        const totalWPI = Math.round(totalUEImpairment * 0.6);
        const totalElement = document.getElementById('elbow-strength-total-ue');
        if (totalElement) {
            totalElement.textContent = `${totalUEImpairment} UE = ${totalWPI} WPI`;
        }

        // Call updateTotalImpairment to ensure strength is included in total
        this.updateTotalImpairment();
    }

    static calculateArthroplasty() {
        const selectedOption = document.querySelector('input[name="elbow-arthroplasty"]:checked');
        const totalElement = document.getElementById('elbow-arthroplasty-total');
        
        if (selectedOption) {
            const ueImpairment = parseInt(selectedOption.value);
            const wpi = Math.round(ueImpairment * 0.6);
            totalElement.textContent = `${ueImpairment} UE = ${wpi} WPI`;
        } else {
            totalElement.textContent = '0 UE = 0 WPI';
        }
        
        this.updateTotalImpairment();
    }

    static calculateSynovialHypertrophy() {
        let totalUEImpairment = 0;
        const checkedBoxes = document.querySelectorAll('.synovial-checkbox:checked');
        
        checkedBoxes.forEach(checkbox => {
            totalUEImpairment += parseInt(checkbox.value) || 0;
        });

        const totalWPI = Math.round(totalUEImpairment * 0.6);
        const totalElement = document.getElementById('elbow-synovial-hypertrophy-total');
        if (totalElement) {
            totalElement.textContent = `${totalUEImpairment} UE = ${totalWPI} WPI`;
        }

        // Call updateTotalImpairment instead of directly updating the display
        this.updateTotalImpairment();
    }

    static updateTotalImpairment() {
        // Collect all selected impairment types (whether they have values or not)
        const selectedImpairments = new Set();
        
        // Check which calculators are visible/active
        if (document.getElementById('elbow-rom-total')) selectedImpairments.add('ROM');
        if (document.getElementById('elbow-strength-total-ue')) selectedImpairments.add('Strength');
        if (document.getElementById('elbow-arthroplasty-total')) selectedImpairments.add('Arthroplasty');
        if (document.getElementById('elbow-synovial-hypertrophy-total')) selectedImpairments.add('Synovial Hypertrophy');
        if (document.getElementById('elbow-subluxation-total')) selectedImpairments.add('Persistent Subluxation/Dislocation');
        if (document.getElementById('elbow-passive-instability-total')) selectedImpairments.add('Excessive Passive Mediolateral Instability');
        if (document.getElementById('elbow-active-deviation-total')) selectedImpairments.add('Excessive Active Mediolateral Deviation');

        // Collect all impairments with values
        const impairments = [];
        
        // Get ROM impairment
        const romTotal = parseInt(document.getElementById('elbow-rom-total')?.textContent) || 0;
        if (selectedImpairments.has('ROM')) impairments.push(romTotal);
        
        // Get Strength impairment
        const strengthText = document.getElementById('elbow-strength-total-ue')?.textContent || '';
        const strengthMatch = strengthText.match(/(\d+)\s*UE/);
        const strengthValue = strengthMatch ? parseInt(strengthMatch[1]) : 0;
        if (selectedImpairments.has('Strength')) impairments.push(strengthValue);
        
        // Get Arthroplasty impairment
        const arthroplastyText = document.getElementById('elbow-arthroplasty-total')?.textContent || '';
        const arthroplastyMatch = arthroplastyText.match(/(\d+)\s*UE/);
        const arthroplastyValue = arthroplastyMatch ? parseInt(arthroplastyMatch[1]) : 0;
        if (selectedImpairments.has('Arthroplasty')) impairments.push(arthroplastyValue);
        
        // Get Synovial Hypertrophy impairment
        const synovialText = document.getElementById('elbow-synovial-hypertrophy-total')?.textContent || '';
        const synovialMatch = synovialText.match(/(\d+)\s*UE/);
        const synovialValue = synovialMatch ? parseInt(synovialMatch[1]) : 0;
        if (selectedImpairments.has('Synovial Hypertrophy')) impairments.push(synovialValue);

        // Get Subluxation/Dislocation impairment
        const subluxationText = document.getElementById('elbow-subluxation-total')?.textContent || '';
        const subluxationMatch = subluxationText.match(/(\d+)\s*UE/);
        const subluxationValue = subluxationMatch ? parseInt(subluxationMatch[1]) : 0;
        if (selectedImpairments.has('Persistent Subluxation/Dislocation')) impairments.push(subluxationValue);

        // Get Passive Instability impairment
        const passiveInstabilityText = document.getElementById('elbow-passive-instability-total')?.textContent || '';
        const passiveInstabilityMatch = passiveInstabilityText.match(/(\d+)\s*UE/);
        const passiveInstabilityValue = passiveInstabilityMatch ? parseInt(passiveInstabilityMatch[1]) : 0;
        if (selectedImpairments.has('Excessive Passive Mediolateral Instability')) impairments.push(passiveInstabilityValue);

        // Get Active Deviation impairment
        const activeDeviationText = document.getElementById('elbow-active-deviation-total')?.textContent || '';
        const activeDeviationMatch = activeDeviationText.match(/(\d+)\s*UE/);
        const activeDeviationValue = activeDeviationMatch ? parseInt(activeDeviationMatch[1]) : 0;
        if (selectedImpairments.has('Excessive Active Mediolateral Deviation')) impairments.push(activeDeviationValue);

        // Sort impairments in descending order
        impairments.sort((a, b) => b - a);

        // Calculate combined impairment
        const combinedUE = this.combineImpairments(impairments);
        const combinedWPI = Math.round(combinedUE * 0.6);

        // Update the total impairment display
        const totalImpairmentDiv = document.getElementById('totalImpairment-elbow');
        if (totalImpairmentDiv) {
            let breakdownHtml = '<h3>Elbow - Total Impairment</h3>';
            
            // Add all selected impairments (even if zero)
            if (selectedImpairments.has('ROM')) {
                breakdownHtml += `<p>ROM: ${romTotal} UE</p>`;
            }
            if (selectedImpairments.has('Strength')) {
                breakdownHtml += `<p>Strength: ${strengthValue} UE</p>`;
            }
            if (selectedImpairments.has('Arthroplasty')) {
                breakdownHtml += `<p>Arthroplasty: ${arthroplastyValue} UE</p>`;
            }
            if (selectedImpairments.has('Synovial Hypertrophy')) {
                breakdownHtml += `<p>Synovial Hypertrophy: ${synovialValue} UE</p>`;
            }
            if (selectedImpairments.has('Persistent Subluxation/Dislocation')) {
                breakdownHtml += `<p>Persistent Subluxation/Dislocation: ${subluxationValue} UE</p>`;
            }
            if (selectedImpairments.has('Excessive Passive Mediolateral Instability')) {
                breakdownHtml += `<p>Excessive Passive Mediolateral Instability: ${passiveInstabilityValue} UE</p>`;
            }
            if (selectedImpairments.has('Excessive Active Mediolateral Deviation')) {
                breakdownHtml += `<p>Excessive Active Mediolateral Deviation: ${activeDeviationValue} UE</p>`;
            }
            
            // Add combined result if there are multiple impairments
            if (impairments.length > 1) {
                breakdownHtml += `<p>Combined: ${impairments.join(' C ')} = ${combinedUE} UE</p>`;
            }
            
            breakdownHtml += `<p><strong>Total: ${combinedUE} UE = ${combinedWPI} WPI</strong></p>`;
            
            totalImpairmentDiv.innerHTML = breakdownHtml;
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

    static calculateSubluxation() {
        let totalUEImpairment = 0;
        const checkedBoxes = document.querySelectorAll('.subluxation-checkbox:checked');
        
        checkedBoxes.forEach(checkbox => {
            totalUEImpairment += parseInt(checkbox.value) || 0;
        });

        const totalWPI = Math.round(totalUEImpairment * 0.6);
        const totalElement = document.getElementById('elbow-subluxation-total');
        if (totalElement) {
            totalElement.textContent = `${totalUEImpairment} UE = ${totalWPI} WPI`;
        }

        // Call updateTotalImpairment instead of directly updating the display
        this.updateTotalImpairment();
    }

    static calculatePassiveInstability() {
        let totalUEImpairment = 0;
        const checkedBoxes = document.querySelectorAll('.passive-instability-checkbox:checked');
        
        checkedBoxes.forEach(checkbox => {
            totalUEImpairment += parseInt(checkbox.value) || 0;
        });

        const totalWPI = Math.round(totalUEImpairment * 0.6);
        const totalElement = document.getElementById('elbow-passive-instability-total');
        if (totalElement) {
            totalElement.textContent = `${totalUEImpairment} UE = ${totalWPI} WPI`;
        }

        // Call updateTotalImpairment instead of directly updating the display
        this.updateTotalImpairment();
    }

    static calculateActiveDeviation() {
        let totalUEImpairment = 0;
        const checkedBoxes = document.querySelectorAll('.active-deviation-checkbox:checked');
        
        checkedBoxes.forEach(checkbox => {
            totalUEImpairment += parseInt(checkbox.value) || 0;
        });

        const totalWPI = Math.round(totalUEImpairment * 0.6);
        const totalElement = document.getElementById('elbow-active-deviation-total');
        if (totalElement) {
            totalElement.textContent = `${totalUEImpairment} UE = ${totalWPI} WPI`;
        }

        // Call updateTotalImpairment instead of directly updating the display
        this.updateTotalImpairment();
    }
} 
