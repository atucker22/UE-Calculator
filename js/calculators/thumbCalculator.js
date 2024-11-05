import { 
    THUMBIPFlexionExtensionData, 
    THUMBMPFlexionExtensionData,
    THUMBCMCData 
} from '../data/thumbData.js';

export class ThumbCalculator {
    static calculateROM() {
        // Add input validation for CMC inputs
        const cmcInputs = [
            'radial-abduction',
            'radial-abduction-ankylosis',
            'cmc-adduction',
            'cmc-adduction-ankylosis',
            'opposition',
            'opposition-ankylosis'
        ];

        cmcInputs.forEach(inputId => {
            const input = document.getElementById(inputId);
            if (input) {
                input.min = "0"; // Set minimum value to 0
                
                // Prevent negative values on input
                input.addEventListener('input', (e) => {
                    if (e.target.value < 0) {
                        e.target.value = 0;
                    }
                });
            }
        });

        this.updateThumbImpairment();
    }

    static updateThumbImpairment() {
        // Calculate IP Flexion/Extension
        const ipFlexionInput = document.getElementById('ip-flexion');
        const ipExtensionInput = document.getElementById('ip-extension');
        const ipAnkylosisInput = document.getElementById('ip-ankylosis');
        const ipFlexionImpOutput = document.getElementById('ip-flexion-imp');
        const ipExtensionImpOutput = document.getElementById('ip-extension-imp');
        const ipAnkylosisImpOutput = document.getElementById('ip-ankylosis-imp');
        const ipTotalImpOutput = document.getElementById('ip-imp');

        let ipImpairment = 0;
        
        // Handle IP impairments
        if (ipFlexionInput.value !== '') {
            const flexionImp = this.findImpairment(parseInt(ipFlexionInput.value), THUMBIPFlexionExtensionData, 'flexion', 'dtFlexion');
            ipFlexionImpOutput.textContent = flexionImp;
            ipImpairment += flexionImp;
        } else {
            ipFlexionImpOutput.textContent = '';
        }
        
        if (ipExtensionInput.value !== '') {
            const extensionImp = this.findImpairment(parseInt(ipExtensionInput.value), THUMBIPFlexionExtensionData, 'extension', 'dtExtension');
            ipExtensionImpOutput.textContent = extensionImp;
            ipImpairment += extensionImp;
        } else {
            ipExtensionImpOutput.textContent = '';
        }
        
        if (ipAnkylosisInput.value !== '') {
            const ankylosisImp = this.findImpairment(parseInt(ipAnkylosisInput.value), THUMBIPFlexionExtensionData, 'ankylosis', 'dtAnkylosis');
            ipAnkylosisImpOutput.textContent = ankylosisImp;
            ipImpairment = Math.max(ipImpairment, ankylosisImp);
        } else {
            ipAnkylosisImpOutput.textContent = '';
        }
        
        ipTotalImpOutput.textContent = ipImpairment;

        // Calculate MP Flexion/Extension
        const mpFlexionInput = document.getElementById('mp-flexion');
        const mpExtensionInput = document.getElementById('mp-extension');
        const mpAnkylosisInput = document.getElementById('mp-ankylosis');
        const mpFlexionImpOutput = document.getElementById('mp-flexion-imp');
        const mpExtensionImpOutput = document.getElementById('mp-extension-imp');
        const mpAnkylosisImpOutput = document.getElementById('mp-ankylosis-imp');
        const mpTotalImpOutput = document.getElementById('mp-imp');

        let mpImpairment = 0;

        if (mpFlexionInput.value !== '') {
            const flexionImp = this.findImpairment(parseInt(mpFlexionInput.value), THUMBMPFlexionExtensionData, 'flexion', 'dtFlexion');
            mpFlexionImpOutput.textContent = flexionImp;
            mpImpairment += flexionImp;
        } else {
            mpFlexionImpOutput.textContent = '';
        }

        if (mpExtensionInput.value !== '') {
            const extensionImp = this.findImpairment(parseInt(mpExtensionInput.value), THUMBMPFlexionExtensionData, 'extension', 'dtExtension');
            mpExtensionImpOutput.textContent = extensionImp;
            mpImpairment += extensionImp;
        } else {
            mpExtensionImpOutput.textContent = '';
        }

        if (mpAnkylosisInput.value !== '') {
            const ankylosisImp = this.findImpairment(parseInt(mpAnkylosisInput.value), THUMBMPFlexionExtensionData, 'ankylosis', 'dtAnkylosis');
            mpAnkylosisImpOutput.textContent = ankylosisImp;
            mpImpairment = Math.max(mpImpairment, ankylosisImp);
        } else {
            mpAnkylosisImpOutput.textContent = '';
        }

        mpTotalImpOutput.textContent = mpImpairment;

        // Calculate CMC Motions
        const radialAbductionInput = document.getElementById('radial-abduction');
        const radialAbductionAnkylosisInput = document.getElementById('radial-abduction-ankylosis');
        const radialAbductionMotionImpOutput = document.getElementById('radial-abduction-motion-imp');
        const radialAbductionAnkylosisImpOutput = document.getElementById('radial-abduction-ankylosis-imp');
        const radialAbductionTotalImpOutput = document.getElementById('radial-abduction-imp');

        let radialAbductionImpairment = 0;

        if (radialAbductionInput.value !== '') {
            const motionImp = this.findCMCImpairment(parseInt(radialAbductionInput.value), THUMBCMCData.radialAbduction, 'radialAbduction', 'dtAbnormalMotion');
            radialAbductionMotionImpOutput.textContent = motionImp;
            radialAbductionImpairment += motionImp;
        } else {
            radialAbductionMotionImpOutput.textContent = '';
        }

        if (radialAbductionAnkylosisInput.value !== '') {
            const ankylosisImp = this.findCMCImpairment(parseInt(radialAbductionAnkylosisInput.value), THUMBCMCData.radialAbduction, 'radialAbduction', 'dtAnkylosis');
            radialAbductionAnkylosisImpOutput.textContent = ankylosisImp;
            radialAbductionImpairment = Math.max(radialAbductionImpairment, ankylosisImp);
        } else {
            radialAbductionAnkylosisImpOutput.textContent = '';
        }

        radialAbductionTotalImpOutput.textContent = radialAbductionImpairment;

        // 2. Add Adduction calculations
        const adductionInput = document.getElementById('cmc-adduction');
        const adductionAnkylosisInput = document.getElementById('cmc-adduction-ankylosis');
        const adductionMotionImpOutput = document.getElementById('cmc-adduction-motion-imp');
        const adductionAnkylosisImpOutput = document.getElementById('cmc-adduction-ankylosis-imp');
        const adductionTotalImpOutput = document.getElementById('cmc-adduction-imp');

        let adductionImpairment = 0;

        if (adductionInput.value !== '') {
            const motionImp = this.findCMCImpairment(parseFloat(adductionInput.value), THUMBCMCData.adduction, 'cm', 'dtAbnormalMotion');
            adductionMotionImpOutput.textContent = motionImp;
            adductionImpairment += motionImp;
        } else {
            adductionMotionImpOutput.textContent = '';
        }

        if (adductionAnkylosisInput.value !== '') {
            const ankylosisImp = this.findCMCImpairment(parseFloat(adductionAnkylosisInput.value), THUMBCMCData.adduction, 'cm', 'dtAnkylosis');
            adductionAnkylosisImpOutput.textContent = ankylosisImp;
            adductionImpairment = Math.max(adductionImpairment, ankylosisImp);
        } else {
            adductionAnkylosisImpOutput.textContent = '';
        }

        adductionTotalImpOutput.textContent = adductionImpairment;

        // 3. Add Opposition calculations
        const oppositionInput = document.getElementById('opposition');
        const oppositionAnkylosisInput = document.getElementById('opposition-ankylosis');
        const oppositionMotionImpOutput = document.getElementById('opposition-motion-imp');
        const oppositionAnkylosisImpOutput = document.getElementById('opposition-ankylosis-imp');
        const oppositionTotalImpOutput = document.getElementById('opposition-imp');

        let oppositionImpairment = 0;

        if (oppositionInput.value !== '') {
            const motionImp = this.findCMCImpairment(parseFloat(oppositionInput.value), THUMBCMCData.opposition, 'cm', 'dtAbnormalMotion');
            oppositionMotionImpOutput.textContent = motionImp;
            oppositionImpairment += motionImp;
        } else {
            oppositionMotionImpOutput.textContent = '';
        }

        if (oppositionAnkylosisInput.value !== '') {
            const ankylosisImp = this.findCMCImpairment(parseFloat(oppositionAnkylosisInput.value), THUMBCMCData.opposition, 'cm', 'dtAnkylosis');
            oppositionAnkylosisImpOutput.textContent = ankylosisImp;
            oppositionImpairment = Math.max(oppositionImpairment, ankylosisImp);
        } else {
            oppositionAnkylosisImpOutput.textContent = '';
        }

        oppositionTotalImpOutput.textContent = oppositionImpairment;

        // Calculate total thumb impairment
        let totalDT = ipImpairment + mpImpairment + radialAbductionImpairment + adductionImpairment + oppositionImpairment;
        
        // Cap totalDT at 100
        totalDT = Math.min(totalDT, 100);
        
        const totalHD = Math.round(totalDT * 0.4); // Convert digit to hand

        document.getElementById('total-imp').textContent = `Total: ${totalDT} DT = ${totalHD} HD`;
    }

    static findImpairment(angle, dataArray, angleField, impairmentField) {
        // Special handling for IP joint edge cases
        if (dataArray === THUMBIPFlexionExtensionData) {
            // For IP Flexion: angles less than -30 should return 15
            if (angleField === 'flexion' && angle < -30) {
                return 15;
            }
            // For IP Extension: angles less than -80 should return 15
            if (angleField === 'extension' && angle < -80) {
                return 15;
            }
            // For IP Ankylosis: angles less than -30 or greater than 80 should return 15
            if (angleField === 'ankylosis' && (angle < -30 || angle > 80)) {
                return 15;
            }
        }

        // Special handling for MP joint edge cases
        if (dataArray === THUMBMPFlexionExtensionData) {
            // For MP Flexion: angles less than -40 should return 10
            if (angleField === 'flexion' && angle < -40) {
                return 10;
            }
            // For MP Extension: angles less than -60 should return 10
            if (angleField === 'extension' && angle < -60) {
                return 10;
            }
            // For MP Ankylosis: angles less than -40 or greater than 60 should return 10
            if (angleField === 'ankylosis' && (angle < -40 || angle > 60)) {
                return 10;
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

    static findCMCImpairment(value, dataArray, valueField, impairmentField) {
        const exactMatch = dataArray.find(entry => entry[valueField] === value);
        if (exactMatch) {
            return exactMatch[impairmentField];
        }

        // Find closest value if no exact match
        let closestEntry = dataArray[0];
        let minDiff = Math.abs(dataArray[0][valueField] - value);

        for (const entry of dataArray) {
            const diff = Math.abs(entry[valueField] - value);
            if (diff < minDiff) {
                minDiff = diff;
                closestEntry = entry;
            }
        }

        return closestEntry[impairmentField];
    }
} 
