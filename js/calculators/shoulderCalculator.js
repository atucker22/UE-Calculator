import { SHOULDERFlexionExtensionData, SHOULDERAbductionAdductionData, SHOULDERInternalExternalRotationData } from '../data/shoulderData.js';

export class ShoulderCalculator {
    static calculateROM() {
        console.log("Calculating Shoulder ROM");
        this.updateShoulderImpairment();
        this.updateTotalImpairment();
    }

    static updateShoulderImpairment() {
        console.log("Updating Shoulder Impairment");
        const movements = [
            { name: 'flexion', dataArray: SHOULDERFlexionExtensionData, group: 'fe' },
            { name: 'extension', dataArray: SHOULDERFlexionExtensionData, group: 'fe' },
            { name: 'abduction', dataArray: SHOULDERAbductionAdductionData, group: 'aa' },
            { name: 'adduction', dataArray: SHOULDERAbductionAdductionData, group: 'aa' },
            { name: 'internal-rotation', dataArray: SHOULDERInternalExternalRotationData, field: 'internalRotation', group: 'ie' },
            { name: 'external-rotation', dataArray: SHOULDERInternalExternalRotationData, field: 'externalRotation', group: 'ie' }
        ];

        let impairments = {
            fe: { normal: 0, ankylosis: 0 },
            aa: { normal: 0, ankylosis: 0 },
            ie: { normal: 0, ankylosis: 0 }
        };

        movements.forEach(movement => {
            const angleInput = document.getElementById(`shoulder-${movement.name}`);
            const impOutput = document.getElementById(`shoulder-${movement.name}-imp`);
            const angle = angleInput.value !== '' ? parseInt(angleInput.value) : null;

            if (angle !== null) {
                const imp = this.findImpairment(angle, movement.dataArray, movement.field || movement.name);
                impOutput.textContent = imp;
                impairments[movement.group].normal += imp;
            } else {
                impOutput.textContent = '';
            }
        });

        // Handle ankylosis
        ['fe', 'aa', 'ie'].forEach(group => {
            const ankylosisInput = document.getElementById(`shoulder-ankylosis-${group}`);
            const ankylosisImpOutput = document.getElementById(`shoulder-ankylosis-${group}-imp`);
            const ankylosisAngle = ankylosisInput.value !== '' ? parseInt(ankylosisInput.value) : null;

            if (ankylosisAngle !== null) {
                const dataArray = group === 'fe' ? SHOULDERFlexionExtensionData :
                                group === 'aa' ? SHOULDERAbductionAdductionData :
                                SHOULDERInternalExternalRotationData;
                const imp = this.findImpairment(ankylosisAngle, dataArray, 'ankylosis');
                ankylosisImpOutput.textContent = imp;
                impairments[group].ankylosis = imp;
            } else {
                ankylosisImpOutput.textContent = '';
            }
        });

        // Calculate and update subtotals
        let subtotals = [];
        ['fe', 'aa', 'ie'].forEach(group => {
            const subtotal = Math.max(impairments[group].normal, impairments[group].ankylosis);
            document.getElementById(`shoulder-${group}-imp`).textContent = subtotal;
            if (subtotal > 0) {
                subtotals.push(subtotal);
            }
        });

        // Calculate total shoulder impairment by adding subtotals
        let totalImp = subtotals.reduce((sum, value) => sum + value, 0);
        
        // Cap totalImp at 100
        totalImp = Math.min(totalImp, 100);

        // Calculate WPI
        const wpi = Math.round(totalImp * 0.6);

        // Update the ROM total display
        document.getElementById('shoulder-rom-total').textContent = totalImp;
        document.getElementById('shoulder-rom-wpi').textContent = wpi;
    }

    static findImpairment(angle, dataArray, angleField) {
        let impairment = 0;
        for (let i = 0; i < dataArray.length; i++) {
            let dataAngle = dataArray[i][angleField];
            if (typeof dataAngle === 'string') {
                if (dataAngle.startsWith('<') && angle <= parseInt(dataAngle.slice(1))) {
                    impairment = dataArray[i]['ue' + angleField.charAt(0).toUpperCase() + angleField.slice(1)];
                    break;
                } else if (dataAngle.startsWith('>') && angle >= parseInt(dataAngle.slice(1))) {
                    impairment = dataArray[i]['ue' + angleField.charAt(0).toUpperCase() + angleField.slice(1)];
                    break;
                }
            } else if (angle === dataAngle) {
                impairment = dataArray[i]['ue' + angleField.charAt(0).toUpperCase() + angleField.slice(1)];
                break;
            }
        }
        return impairment;
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

    static updateTotalImpairment() {
        // Collect all selected impairment types (whether they have values or not)
        const selectedImpairments = new Set();
        
        // Check which calculators are visible/active
        if (document.getElementById('shoulder-rom-total')) selectedImpairments.add('ROM');
        if (document.getElementById('shoulder-strength-total-ue')) selectedImpairments.add('Strength');
        if (document.getElementById('shoulder-arthroplasty-total')) selectedImpairments.add('Arthroplasty');
        if (document.getElementById('shoulder-instability-total')) selectedImpairments.add('Instability');
        if (document.getElementById('shoulder-synovial-hypertrophy-total')) selectedImpairments.add('Synovial Hypertrophy');

        // Collect all impairments with values
        const impairments = [];
        
        // Get ROM impairment
        const romTotal = parseInt(document.getElementById('shoulder-rom-total')?.textContent) || 0;
        if (selectedImpairments.has('ROM')) impairments.push(romTotal);
        
        // Get Strength impairment
        const strengthText = document.getElementById('shoulder-strength-total-ue')?.textContent || '';
        const strengthMatch = strengthText.match(/(\d+)\s*UE/);
        const strengthValue = strengthMatch ? parseInt(strengthMatch[1]) : 0;
        if (selectedImpairments.has('Strength')) impairments.push(strengthValue);
        
        // Get Arthroplasty impairment
        const arthroplastyText = document.getElementById('shoulder-arthroplasty-total')?.textContent || '';
        const arthroplastyMatch = arthroplastyText.match(/(\d+)\s*UE/);
        const arthroplastyValue = arthroplastyMatch ? parseInt(arthroplastyMatch[1]) : 0;
        if (selectedImpairments.has('Arthroplasty')) impairments.push(arthroplastyValue);
        
        // Get Instability impairment
        const instabilityText = document.getElementById('shoulder-instability-total')?.textContent || '';
        const instabilityMatch = instabilityText.match(/(\d+)\s*UE/);
        const instabilityValue = instabilityMatch ? parseInt(instabilityMatch[1]) : 0;
        if (selectedImpairments.has('Instability')) impairments.push(instabilityValue);
        
        // Get Synovial Hypertrophy impairment
        const synovialText = document.getElementById('shoulder-synovial-hypertrophy-total')?.textContent || '';
        const synovialMatch = synovialText.match(/(\d+)\s*UE/);
        const synovialValue = synovialMatch ? parseInt(synovialMatch[1]) : 0;
        if (selectedImpairments.has('Synovial Hypertrophy')) impairments.push(synovialValue);

        // Sort impairments in descending order
        impairments.sort((a, b) => b - a);

        // Calculate combined impairment
        const combinedUE = this.combineImpairments(impairments);
        const combinedWPI = Math.round(combinedUE * 0.6);

        // Update the total impairment display
        const totalImpairmentDiv = document.getElementById('totalImpairment-shoulder');
        if (totalImpairmentDiv) {
            let breakdownHtml = '<h3>Shoulder - Total Impairment</h3>';
            
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
            if (selectedImpairments.has('Instability')) {
                breakdownHtml += `<p>Instability: ${instabilityValue} UE</p>`;
            }
            if (selectedImpairments.has('Synovial Hypertrophy')) {
                breakdownHtml += `<p>Synovial Hypertrophy: ${synovialValue} UE</p>`;
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
    }

    static updateTotalShoulderStrengthImpairment() {
        const movements = ['flexion', 'extension', 'abduction', 'adduction', 'internal-rotation', 'external-rotation'];
        let totalUEImpairment = 0;

        movements.forEach(movement => {
            const impInput = document.getElementById(`shoulder-${movement}-strength-imp`);
            totalUEImpairment += parseInt(impInput.value) || 0;
        });

        const totalWPI = Math.round(totalUEImpairment * 0.6);
        const totalElement = document.getElementById('shoulder-strength-total-ue');
        if (totalElement) {
            totalElement.textContent = `${totalUEImpairment} UE = ${totalWPI} WPI`;
        }

        // Update the impairment breakdown if it exists
        const impairmentBreakdown = document.getElementById('impairment-breakdown');
        if (impairmentBreakdown) {
            impairmentBreakdown.innerHTML = `
                <p>Strength: ${totalUEImpairment} UE</p>
                <p><strong>Combined: ${totalUEImpairment} UE</strong></p>
            `;
        }
    }

    static calculateStrength(movement, inputType) {
        const deficitInput = document.getElementById(`shoulder-${movement}-strength-deficit`);
        const impInput = document.getElementById(`shoulder-${movement}-strength-imp`);
        const maxUE = parseInt(deficitInput.closest('tr').children[1].textContent);

        if (inputType === 'deficit') {
            let deficit = Math.min(parseFloat(deficitInput.value) || 0, 50);
            deficitInput.value = deficit;
            const impairment = Math.round((deficit / 100) * maxUE);
            impInput.value = impairment;
        } else {
            let impairment = Math.min(parseInt(impInput.value) || 0, Math.floor(maxUE / 2));
            impInput.value = impairment;
            const deficit = Math.round((impairment / maxUE) * 100);
            deficitInput.value = deficit;
        }

        this.updateTotalShoulderStrengthImpairment();
        this.updateTotalImpairment();
    }

    static calculateArthroplasty() {
        const selectedOption = document.querySelector('input[name="shoulder-arthroplasty"]:checked');
        const totalElement = document.getElementById('shoulder-arthroplasty-total');
        
        if (selectedOption) {
            const ueImpairment = parseInt(selectedOption.value);
            const wpi = Math.round(ueImpairment * 0.6);
            totalElement.textContent = `${ueImpairment} UE = ${wpi} WPI`;
        } else {
            totalElement.textContent = '0 UE = 0 WPI';
        }
        
        this.updateTotalImpairment();
    }

    static calculateInstability() {
        const selectedOption = document.querySelector('input[name="shoulder-instability"]:checked');
        const totalElement = document.getElementById('shoulder-instability-total');
        
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
        const totalElement = document.getElementById('shoulder-synovial-hypertrophy-total');
        if (totalElement) {
            totalElement.textContent = `${totalUEImpairment} UE = ${totalWPI} WPI`;
        }

        // Update the impairment breakdown if it exists
        const impairmentBreakdown = document.getElementById('impairment-breakdown');
        if (impairmentBreakdown) {
            impairmentBreakdown.innerHTML = `
                <p>Synovial Hypertrophy: ${totalUEImpairment} UE</p>
                <p><strong>Combined: ${totalUEImpairment} UE</strong></p>
            `;
        }

        this.updateTotalImpairment();
    }

    // Add other calculation methods...
} 
