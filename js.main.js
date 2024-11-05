import { ShoulderCalculator } from './calculators/shoulderCalculator.js';
import { ElbowCalculator } from './calculators/elbowCalculator.js';
import { WristCalculator } from './calculators/wristCalculator.js';
import { ThumbCalculator } from './calculators/thumbCalculator.js';
import { IndexCalculator } from './calculators/indexCalculator.js';
import { MiddleCalculator } from './calculators/middleCalculator.js';
import { RingCalculator } from './calculators/ringCalculator.js';
import { LittleCalculator } from './calculators/littleCalculator.js';

let updateOverallTotalImpairment;

// Make WristCalculator available globally
window.WristCalculator = WristCalculator;

// Make MiddleCalculator available globally
window.MiddleCalculator = MiddleCalculator;

// Make RingCalculator available globally
window.RingCalculator = RingCalculator;

// Make LittleCalculator available globally
window.LittleCalculator = LittleCalculator;

// Add this to your initialization code
IndexCalculator.initialize();

document.addEventListener('DOMContentLoaded', (event) => {
    console.log("DOM fully loaded");

    // Initialize variables
    let selectedCards = [];
    let selectedOptions = {};
    let currentCardIndex = 0;

    // Define card options
    const cardOptions = {
        shoulder: ['ROM', 'Strength', 'Arthroplasty', 'Instability/Subluxation/Dislocation', 'Synovial Hypertrophy'],
        elbow: [
            'ROM', 
            'Strength', 
            'Arthroplasty', 
            'Synovial Hypertrophy',
            'Persistent Subluxation/Dislocation',
            'Excessive Passive Mediolateral Instability',
            'Excessive Active Mediolateral Deviation'
        ],
        wrist: [
            'ROM', 
            'Arthroplasty', 
            'Synovial Hypertrophy',
            'Excessive Active Mediolateral Deviation',
            'Carpal Instability Patterns'
        ],
        thumb: [
            'ROM',
            'Arthroplasty',
            'Sensory',
            'Amputation',
            'Synovial Hypertrophy',
            'Lateral Deviation',
            'Digit Rotational Deformity',
            'Persistent Joint Subluxation/Dislocation',
            'Joint Passive Mediolateral Instability',
            'Constrictive Tenosynovitis'
        ],
        index: [
            'ROM',
            'Arthroplasty',
            'Sensory',
            'Amputation',
            'Synovial Hypertrophy',
            'Lateral Deviation',
            'Digit Rotational Deformity',
            'Persistent Joint Subluxation/Dislocation',
            'Joint Passive Mediolateral Instability',
            'Intrinsic Tightness',
            'Constrictive Tenosynovitis',
            'Extensor Tendon Subluxation at MP Joint'
        ],
        middle: [
            'ROM',
            'Arthroplasty',
            'Sensory',
            'Amputation',
            'Synovial Hypertrophy',
            'Lateral Deviation',
            'Digit Rotational Deformity',
            'Persistent Joint Subluxation/Dislocation',
            'Joint Passive Mediolateral Instability',
            'Intrinsic Tightness',
            'Constrictive Tenosynovitis',
            'Extensor Tendon Subluxation at MP Joint'
        ],
        ring: [
            'ROM',
            'Arthroplasty',
            'Sensory',
            'Amputation',
            'Synovial Hypertrophy',
            'Lateral Deviation',
            'Digit Rotational Deformity',
            'Persistent Joint Subluxation/Dislocation',
            'Joint Passive Mediolateral Instability',
            'Intrinsic Tightness',
            'Constrictive Tenosynovitis',
            'Extensor Tendon Subluxation at MP Joint'
        ],
        little: [
            'ROM',
            'Arthroplasty',
            'Sensory',
            'Amputation',
            'Synovial Hypertrophy',
            'Lateral Deviation',
            'Digit Rotational Deformity',
            'Persistent Joint Subluxation/Dislocation',
            'Joint Passive Mediolateral Instability',
            'Intrinsic Tightness',
            'Constrictive Tenosynovitis',
            'Extensor Tendon Subluxation at MP Joint'
        ],
        nerve: [
            'Peripheral Nerves',
            'CRPS',
            'Spinal Nerves',
            'Brachial Plexus'
        ],
        vascular: [
            'Option 1',
            'Option 2',
            'Option 3'
        ],
        grip: [
            'Grip Strength',
            'Pinch Strength'
        ],
        amputation: [
            'Option 1',
            'Option 2',
            'Option 3'
        ]
    };

    function setupEventListeners() {
        const cards = document.querySelectorAll('.card');
        const calculateBtn = document.getElementById('calculate');
        const nextCardBtn = document.getElementById('nextCard');
        const finalizeImpairmentBtn = document.getElementById('finalizeImpairment');
        
        cards.forEach(card => {
            card.addEventListener('click', () => {
                console.log("Card clicked:", card.dataset.value);
                card.classList.toggle('selected');
            });
        });

        calculateBtn.addEventListener('click', handleCalculateClick);
        nextCardBtn.addEventListener('click', handleNextCard);
        finalizeImpairmentBtn.addEventListener('click', handleFinalizeImpairment);
    }

    function handleCalculateClick() {
        selectedCards = Array.from(document.querySelectorAll('.card.selected'))
            .map(card => card.dataset.value);
        
        if (selectedCards.length > 0) {
            currentCardIndex = 0;
            selectedOptions = {};
            showOptionsForCard(selectedCards[currentCardIndex]);
        } else {
            document.getElementById('result').textContent = "Please select at least one card.";
        }
    }

    function showOptionsForCard(cardValue) {
        const currentCardTitle = document.getElementById('currentCardTitle');
        const optionsList = document.getElementById('optionsList');
        const optionsContainer = document.getElementById('optionsContainer');
        const calculatorsContainer = document.getElementById('calculatorsContainer');

        currentCardTitle.textContent = `Options for ${cardValue.charAt(0).toUpperCase() + cardValue.slice(1)}`;
        optionsList.innerHTML = '';
        
        cardOptions[cardValue].forEach(option => {
            const optionElement = document.createElement('div');
            optionElement.classList.add('option');
            optionElement.textContent = option;
            optionElement.addEventListener('click', () => {
                optionElement.classList.toggle('selected');
            });
            optionsList.appendChild(optionElement);
        });

        optionsContainer.style.display = 'block';
        calculatorsContainer.style.display = 'none';
    }

    function handleNextCard() {
        const cardValue = selectedCards[currentCardIndex];
        selectedOptions[cardValue] = Array.from(document.querySelectorAll('.option.selected'))
            .map(option => option.textContent);

        // Only show arthroplasty notice if Arthroplasty is the ONLY selection
        if (selectedOptions[cardValue].length === 1 && selectedOptions[cardValue].includes('Arthroplasty')) {
            const noticeDialog = document.createElement('div');
            noticeDialog.style.position = 'fixed';
            noticeDialog.style.top = '50%';
            noticeDialog.style.left = '50%';
            noticeDialog.style.transform = 'translate(-50%, -50%)';
            noticeDialog.style.backgroundColor = 'white';
            noticeDialog.style.padding = '20px';
            noticeDialog.style.borderRadius = '5px';
            noticeDialog.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
            noticeDialog.style.zIndex = '1000';
            noticeDialog.style.maxWidth = '600px';
            noticeDialog.style.width = '90%';

            noticeDialog.innerHTML = `
                <p style="margin-bottom: 20px;">If there is reduced ROM in the joint with the arthroplasty, consider entering ROM measurements or consult physician for clarification, as ROM and Arthroplasty impairments should be combined per page 505 of The AMA Guides 5th Edition.</p>
                <div style="display: flex; justify-content: center; gap: 10px;">
                    <button id="proceedButton" style="padding: 8px 16px;">Proceed</button>
                    <button id="goBackButton" style="padding: 8px 16px;">Go Back</button>
                </div>
            `;

            const overlay = document.createElement('div');
            overlay.style.position = 'fixed';
            overlay.style.top = '0';
            overlay.style.left = '0';
            overlay.style.width = '100%';
            overlay.style.height = '100%';
            overlay.style.backgroundColor = 'rgba(0,0,0,0.5)';
            overlay.style.zIndex = '999';

            document.body.appendChild(overlay);
            document.body.appendChild(noticeDialog);

            document.getElementById('proceedButton').addEventListener('click', () => {
                overlay.remove();
                noticeDialog.remove();
                checkOtherWarnings();
            });

            document.getElementById('goBackButton').addEventListener('click', () => {
                overlay.remove();
                noticeDialog.remove();
            });
        } else {
            checkOtherWarnings();
        }

        function checkOtherWarnings() {
            // Create array of warnings to show
            const warnings = [];
            
            // Check for ROM and Strength combination for both Shoulder and Elbow
            if ((cardValue === 'shoulder' || cardValue === 'elbow') && 
                selectedOptions[cardValue].includes('ROM') && 
                selectedOptions[cardValue].includes('Strength')) {
                
                warnings.push({
                    warningText: "Per page 508 of The AMA Guides 5th Edition, decreased strength cannot be rated in the presence of decreased motion that prevents effective application of maximal force. Impairment due to loss of strength can be combined with other impairments, only if based on unrelated etiologic or pathomechanical causes.",
                    overrideText: "By clicking \"Override\" it will be assumed that decreased motion did not prevent effective application of maximal force and that strength impairment and other impairments are based on unrelated etiologic or pathomechanical causes, or alternatively, that Almaraz/Guzman is being invoked."
                });
            }

            // Check for Synovial Hypertrophy with any other impairment for Shoulder, Elbow, and Wrist
            if ((cardValue === 'shoulder' || cardValue === 'elbow' || cardValue === 'wrist') && 
                selectedOptions[cardValue].includes('Synovial Hypertrophy') && 
                selectedOptions[cardValue].length > 1) {
                
                warnings.push({
                    warningText: "Per page 500 of The AMA Guides 5th Edition, synovial hypertrophy impairment cannot be combined with any other impairments. If synovial hypertrophy is the only finding, it should be exclusively rated.",
                    overrideText: "By clicking \"Override\" it will be assumed that Almaraz/Guzman is being invoked."
                });
            }

            // Check for ROM and Persistent Subluxation/Dislocation for Elbow
            if (cardValue === 'elbow' && 
                selectedOptions[cardValue].includes('ROM') && 
                selectedOptions[cardValue].includes('Persistent Subluxation/Dislocation')) {
                
                warnings.push({
                    warningText: "Per pages 499 & 501 of The AMA Guides 5th Edition, ROM impairment should not be combined with Persistent Subluxation/Dislocation impairment, and Persistent Subluxation/Dislocation impairment should only be rated if there is no restricted motion.",
                    overrideText: "By clicking \"Override\" it will be assumed that Almaraz/Guzman is being invoked."
                });
            }

            // Check for multiple joint translocation impairments for Elbow
            if (cardValue === 'elbow') {
                const translocationImpairments = [
                    'Persistent Subluxation/Dislocation',
                    'Excessive Passive Mediolateral Instability',
                    'Excessive Active Mediolateral Deviation'
                ];
                
                const selectedTranslocations = translocationImpairments.filter(imp => 
                    selectedOptions[cardValue].includes(imp)
                );

                if (selectedTranslocations.length > 1) {
                    warnings.push({
                        warningText: "Per page 499 of The AMA Guides 5th Edition, only one joint translocation impairment should be rated (i.e., Persisitent Subluxation/Dislocation, Excessive Passive Mediolateral Instability, and Excessive Active Mediolateral Deviation, cannot be rated in combination with one another).",
                        overrideText: "By clicking \"Override\" it will be assumed that Almaraz/Guzman is being invoked."
                    });
                }
            }

            // Check for Arthroplasty and Excessive Passive Mediolateral Instability for Elbow
            if (cardValue === 'elbow' && 
                selectedOptions[cardValue].includes('Arthroplasty') && 
                selectedOptions[cardValue].includes('Excessive Passive Mediolateral Instability')) {
                
                warnings.push({
                    warningText: "Per page 499 of The AMA Guides 5th Edition, instability impairment should not be combined with arthroplasty impairment.",
                    overrideText: "By clicking \"Override\" it will be assumed that Almaraz/Guzman is being invoked."
                });
            }

            // Check for Arthroplasty and Excessive Active Mediolateral Deviation for Elbow
            if (cardValue === 'elbow' && 
                selectedOptions[cardValue].includes('Arthroplasty') && 
                selectedOptions[cardValue].includes('Excessive Active Mediolateral Deviation')) {
                
                warnings.push({
                    warningText: "Excessive Active Mediolateral Deviation is a form of instability. Per page 499 of The AMA Guides 5th Edition, instability impairment should not be combined with arthroplasty impairment.",
                    overrideText: "By clicking \"Override\" it will be assumed that Almaraz/Guzman is being invoked."
                });
            }

            // Check for Arthroplasty and Persistent Subluxation/Dislocation for Elbow
            if (cardValue === 'elbow' && 
                selectedOptions[cardValue].includes('Arthroplasty') && 
                selectedOptions[cardValue].includes('Persistent Subluxation/Dislocation')) {
                
                warnings.push({
                    warningText: 'Per page 505 of The AMA Guides 5th Edition, "impairment due to arthroplasty cannot be combined with impairments due to instability, subluxation, or dislocation."',
                    overrideText: "By clicking \"Override\" it will be assumed that Almaraz/Guzman is being invoked."
                });
            }

            // Check for Instability with anything other than ROM for Shoulder
            if (cardValue === 'shoulder' && 
                selectedOptions[cardValue].includes('Instability/Subluxation/Dislocation') &&
                selectedOptions[cardValue].some(option => 
                    option !== 'ROM' && 
                    option !== 'Instability/Subluxation/Dislocation')) {
                
                warnings.push({
                    warningText: "Per page 504 of The AMA Guides 5th Edition, instability/subluxation/dislocation impairment of the shoulder can only be combined with ROM impairment.",
                    overrideText: "By clicking \"Override\" it will be assumed that Almaraz/Guzman is being invoked."
                });
            }

            // Check for Arthroplasty and Excessive Active Mediolateral Deviation for both Elbow and Wrist
            if ((cardValue === 'elbow' || cardValue === 'wrist') && 
                selectedOptions[cardValue].includes('Arthroplasty') && 
                selectedOptions[cardValue].includes('Excessive Active Mediolateral Deviation')) {
                
                warnings.push({
                    warningText: "Excessive Active Mediolateral Deviation is a form of instability. Per page 499 of The AMA Guides 5th Edition, instability impairment should not be combined with arthroplasty impairment.",
                    overrideText: "By clicking \"Override\" it will be assumed that Almaraz/Guzman is being invoked."
                });
            }

            // Check for Carpal Instability with non-ROM impairments for Wrist
            if (cardValue === 'wrist' && 
                selectedOptions[cardValue].includes('Carpal Instability Patterns') && 
                selectedOptions[cardValue].some(option => 
                    option !== 'ROM' && 
                    option !== 'Carpal Instability Patterns')) {
                
                warnings.push({
                    warningText: "Per page 503 of The AMA Guides 5th Edition, carpal instability impairment may only be combined with wrist ROM impairment.",
                    overrideText: "By clicking \"Override\" it will be assumed that Almaraz/Guzman is being invoked."
                });
            }

            // Show warnings in sequence
            function showNextWarning(index) {
                if (index < warnings.length) {
                    showWarningDialog(
                        warnings[index].warningText,
                        warnings[index].overrideText,
                        () => showNextWarning(index + 1)
                    );
                } else {
                    proceedToNext();
                }
            }

            if (warnings.length > 0) {
                showNextWarning(0);
            } else {
                proceedToNext();
            }
        }
    }

    function showWarningDialog(warningText, overrideText, onOverride) {
        const warningDialog = document.createElement('div');
        warningDialog.style.position = 'fixed';
        warningDialog.style.top = '50%';
        warningDialog.style.left = '50%';
        warningDialog.style.transform = 'translate(-50%, -50%)';
        warningDialog.style.backgroundColor = 'white';
        warningDialog.style.padding = '20px';
        warningDialog.style.borderRadius = '5px';
        warningDialog.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
        warningDialog.style.zIndex = '1000';
        warningDialog.style.maxWidth = '600px';
        warningDialog.style.width = '90%';

        warningDialog.innerHTML = `
            <p style="margin-bottom: 20px;">${warningText}</p>
            <p style="margin-bottom: 20px;">${overrideText}</p>
            <div style="display: flex; justify-content: center; gap: 10px;">
                <button id="overrideButton" style="padding: 8px 16px;">Override</button>
                <button id="goBackButton" style="padding: 8px 16px;">Go Back</button>
            </div>
        `;

        const overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'rgba(0,0,0,0.5)';
        overlay.style.zIndex = '999';

        document.body.appendChild(overlay);
        document.body.appendChild(warningDialog);

        document.getElementById('overrideButton').addEventListener('click', () => {
            overlay.remove();
            warningDialog.remove();
            onOverride();
        });

        document.getElementById('goBackButton').addEventListener('click', () => {
            overlay.remove();
            warningDialog.remove();
        });
    }

    function checkROMAndSynovial() {
        const cardValue = selectedCards[currentCardIndex];
        if (cardValue === 'shoulder' && 
            selectedOptions[cardValue].includes('ROM') && 
            selectedOptions[cardValue].includes('Synovial Hypertrophy')) {
            
            // Create warning dialog
            const warningDialog = document.createElement('div');
            warningDialog.style.position = 'fixed';
            warningDialog.style.top = '50%';
            warningDialog.style.left = '50%';
            warningDialog.style.transform = 'translate(-50%, -50%)';
            warningDialog.style.backgroundColor = 'white';
            warningDialog.style.padding = '20px';
            warningDialog.style.borderRadius = '5px';
            warningDialog.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
            warningDialog.style.zIndex = '1000';
            warningDialog.style.maxWidth = '600px';
            warningDialog.style.width = '90%';

            warningDialog.innerHTML = `
                <p style="margin-bottom: 20px;">Per page 500 of The AMA Guides 5th Edition, Synovial Hypertrophy cannot be combined with impairment due to decreased motion.</p>
                <p style="margin-bottom: 20px;">By clicking "Override" it will be assumed that Almaraz/Guzman is being invoked.</p>
                <div style="display: flex; justify-content: center; gap: 10px;">
                    <button id="overrideButton" style="padding: 8px 16px;">Override</button>
                    <button id="goBackButton" style="padding: 8px 16px;">Go Back</button>
                </div>
            `;

            // Add overlay
            const overlay = document.createElement('div');
            overlay.style.position = 'fixed';
            overlay.style.top = '0';
            overlay.style.left = '0';
            overlay.style.width = '100%';
            overlay.style.height = '100%';
            overlay.style.backgroundColor = 'rgba(0,0,0,0.5)';
            overlay.style.zIndex = '999';

            document.body.appendChild(overlay);
            document.body.appendChild(warningDialog);

            document.getElementById('overrideButton').addEventListener('click', () => {
                overlay.remove();
                warningDialog.remove();
                proceedToNext();
            });

            document.getElementById('goBackButton').addEventListener('click', () => {
                overlay.remove();
                warningDialog.remove();
            });
        } else {
            proceedToNext();
        }
    }

    function proceedToNext() {
        currentCardIndex++;
        if (currentCardIndex < selectedCards.length) {
            showOptionsForCard(selectedCards[currentCardIndex]);
        } else {
            showCalculators();
        }
    }

    // Update the updateOverallTotalImpairment function
    window.updateOverallTotalImpairment = function() {
        const overallTotalDiv = document.getElementById('overallTotalImpairment');
        if (!overallTotalDiv) return;

        let html = '';

        // Get Shoulder impairment
        const shoulderDiv = document.getElementById('totalImpairment-shoulder');
        if (shoulderDiv) {
            const shoulderTotal = shoulderDiv.querySelector('strong')?.textContent.match(/Total: (\d+) UE = (\d+) WPI/);
            if (shoulderTotal) {
                const selectedOptions = Array.from(shoulderDiv.querySelectorAll('p'))
                    .filter(p => !p.querySelector('strong'))  // Exclude the total line
                    .map(p => p.textContent.split(':')[0])
                    .filter(text => !text.includes('Combined'));
                html += `<p><strong>Shoulder</strong> (${selectedOptions.join(', ')}) : <strong>${shoulderTotal[2]} WPI</strong></p>`;
            }
        }

        // Get Elbow impairment
        const elbowDiv = document.getElementById('totalImpairment-elbow');
        if (elbowDiv) {
            const elbowTotal = elbowDiv.querySelector('strong')?.textContent.match(/Total: (\d+) UE = (\d+) WPI/);
            if (elbowTotal) {
                const selectedOptions = Array.from(elbowDiv.querySelectorAll('p'))
                    .filter(p => !p.querySelector('strong'))  // Exclude the total line
                    .map(p => p.textContent.split(':')[0])
                    .filter(text => !text.includes('Combined'));
                html += `<p><strong>Elbow</strong> (${selectedOptions.join(', ')}) : <strong>${elbowTotal[2]} WPI</strong></p>`;
            }
        }

        // Get Wrist impairment
        const wristDiv = document.getElementById('totalImpairment-wrist');
        if (wristDiv) {
            const wristTotal = wristDiv.querySelector('strong')?.textContent.match(/Total: (\d+) UE = (\d+) WPI/);
            if (wristTotal) {
                const selectedOptions = Array.from(wristDiv.querySelectorAll('p'))
                    .filter(p => !p.querySelector('strong'))  // Exclude the total line
                    .map(p => p.textContent.split(':')[0])
                    .filter(text => !text.includes('Combined'));
                html += `<p><strong>Wrist</strong> (${selectedOptions.join(', ')}) : <strong>${wristTotal[2]} WPI</strong></p>`;
            }
        }

        overallTotalDiv.innerHTML = html;
    };

    function showCalculators() {
        const calculatorsList = document.getElementById('calculatorsList');
        calculatorsList.innerHTML = '';

        document.getElementById('optionsContainer').style.display = 'none';
        document.getElementById('calculatorsContainer').style.display = 'block';

        // Create calculator cards and body part total impairment cards
        Object.entries(selectedOptions).forEach(([cardValue, options]) => {
            options.forEach(option => {
                // Remove the arthroplasty notice check from here since it's now handled in handleNextCard
                // Continue with creating calculator cards...
                if (cardValue === 'shoulder' && option === 'ROM') {
                    const calculatorCard = document.createElement('div');
                    calculatorCard.classList.add('calculator-card');
                    calculatorCard.innerHTML = `
                        <h3>Shoulder - ROM</h3>
                        <table class="rom-table">
                            <tr>
                                <th style="width: 16.25%"></th>
                                <th style="width: 22.5%">Flexion</th>
                                <th style="width: 22.5%">Extension</th>
                                <th style="width: 22.5%">Ankylosis</th>
                                <th style="width: 16.25%">Imp%</th>
                            </tr>
                            <tr>
                                <td>Angle°</td>
                                <td><input type="number" id="shoulder-flexion" oninput="ShoulderCalculator.calculateROM()"></td>
                                <td><input type="number" id="shoulder-extension" oninput="ShoulderCalculator.calculateROM()"></td>
                                <td><input type="number" id="shoulder-ankylosis-fe" oninput="ShoulderCalculator.calculateROM()"></td>
                                <td rowspan="2" id="shoulder-fe-imp">0</td>
                            </tr>
                            <tr>
                                <td>Imp%</td>
                                <td id="shoulder-flexion-imp"></td>
                                <td id="shoulder-extension-imp"></td>
                                <td id="shoulder-ankylosis-fe-imp"></td>
                            </tr>
                        </table>
                        <table class="rom-table">
                            <tr>
                                <th style="width: 16.25%"></th>
                                <th style="width: 22.5%">Abduction</th>
                                <th style="width: 22.5%">Adduction</th>
                                <th style="width: 22.5%">Ankylosis</th>
                                <th style="width: 16.25%">Imp%</th>
                            </tr>
                            <tr>
                                <td>Angle°</td>
                                <td><input type="number" id="shoulder-abduction" oninput="ShoulderCalculator.calculateROM()"></td>
                                <td><input type="number" id="shoulder-adduction" oninput="ShoulderCalculator.calculateROM()"></td>
                                <td><input type="number" id="shoulder-ankylosis-aa" oninput="ShoulderCalculator.calculateROM()"></td>
                                <td rowspan="2" id="shoulder-aa-imp">0</td>
                            </tr>
                            <tr>
                                <td>Imp%</td>
                                <td id="shoulder-abduction-imp"></td>
                                <td id="shoulder-adduction-imp"></td>
                                <td id="shoulder-ankylosis-aa-imp"></td>
                            </tr>
                        </table>
                        <table class="rom-table">
                            <tr>
                                <th style="width: 16.25%"></th>
                                <th style="width: 22.5%">Internal Rotation</th>
                                <th style="width: 22.5%">External Rotation</th>
                                <th style="width: 22.5%">Ankylosis</th>
                                <th style="width: 16.25%">Imp%</th>
                            </tr>
                            <tr>
                                <td>Angle°</td>
                                <td><input type="number" id="shoulder-internal-rotation" oninput="ShoulderCalculator.calculateROM()"></td>
                                <td><input type="number" id="shoulder-external-rotation" oninput="ShoulderCalculator.calculateROM()"></td>
                                <td><input type="number" id="shoulder-ankylosis-ie" oninput="ShoulderCalculator.calculateROM()"></td>
                                <td rowspan="2" id="shoulder-ie-imp">0</td>
                            </tr>
                            <tr>
                                <td>Imp%</td>
                                <td id="shoulder-internal-rotation-imp"></td>
                                <td id="shoulder-external-rotation-imp"></td>
                                <td id="shoulder-ankylosis-ie-imp"></td>
                            </tr>
                        </table>
                        <div class="instructions">
                            <p>Instructions: Enter the angle measurements for each plane of motion provided by physician.</p>
                        </div>
                        <div class="reference">
                            <p>Reference: Figures 16-40, 16-43 & 16-46 on pages 476 - 479 of The AMA Guides 5th Ed. UE impairment values contributed by each motion unit within the shoulder are added together per page 479 of The Guides.</p>
                        </div>
                        <p style="text-align: left;"><strong>Total: <span id="shoulder-rom-total">0</span> UE = <span id="shoulder-rom-wpi">0</span> WPI</strong></p>
                    `;
                    calculatorsList.appendChild(calculatorCard);

                    // Add event listeners to all ROM inputs
                    const romInputs = calculatorCard.querySelectorAll('input[type="number"]');
                    romInputs.forEach(input => {
                        input.addEventListener('input', () => ShoulderCalculator.calculateROM());
                    });
                } else if (cardValue === 'shoulder' && option === 'Strength') {
                    const calculatorCard = document.createElement('div');
                    calculatorCard.classList.add('calculator-card');
                    calculatorCard.innerHTML = `
                        <h3>Shoulder - Muscle Strength</h3>
                        <table class="strength-table">
                            <tr class="header-row">
                                <th>Motion</th>
                                <th>Max UE</th>
                                <th>Strength Deficit % (max 50%)</th>
                                <th>UE Impairment</th>
                            </tr>
                            <tr>
                                <td>Flexion</td>
                                <td>24</td>
                                <td><input type="number" id="shoulder-flexion-strength-deficit" min="0" max="50" step="1"></td>
                                <td><input type="number" id="shoulder-flexion-strength-imp" min="0" max="12" step="1"></td>
                            </tr>
                            <tr>
                                <td>Extension</td>
                                <td>6</td>
                                <td><input type="number" id="shoulder-extension-strength-deficit" min="0" max="50" step="1"></td>
                                <td><input type="number" id="shoulder-extension-strength-imp" min="0" max="3" step="1"></td>
                            </tr>
                            <tr>
                                <td>Abduction</td>
                                <td>12</td>
                                <td><input type="number" id="shoulder-abduction-strength-deficit" min="0" max="50" step="1"></td>
                                <td><input type="number" id="shoulder-abduction-strength-imp" min="0" max="6" step="1"></td>
                            </tr>
                            <tr>
                                <td>Adduction</td>
                                <td>6</td>
                                <td><input type="number" id="shoulder-adduction-strength-deficit" min="0" max="50" step="1"></td>
                                <td><input type="number" id="shoulder-adduction-strength-imp" min="0" max="3" step="1"></td>
                            </tr>
                            <tr>
                                <td>Internal Rotation</td>
                                <td>6</td>
                                <td><input type="number" id="shoulder-internal-rotation-strength-deficit" min="0" max="50" step="1"></td>
                                <td><input type="number" id="shoulder-internal-rotation-strength-imp" min="0" max="3" step="1"></td>
                            </tr>
                            <tr>
                                <td>External Rotation</td>
                                <td>6</td>
                                <td><input type="number" id="shoulder-external-rotation-strength-deficit" min="0" max="50" step="1"></td>
                                <td><input type="number" id="shoulder-external-rotation-strength-imp" min="0" max="3" step="1"></td>
                            </tr>
                        </table>
                        <div class="instructions">
                            <p>Instructions: Enter the strength deficit % provided by physician for each motion. If a strength deficit % is not provided by physician, enter the strength UE impairment for each motion provided by physician. For reference, Grade 4 strength is 1 to 25% strength deficit and Grade 3 Strength is 26 to 50% strength deficit.</p>
                        </div>
                        <div class="reference">
                            <p>Reference: Table 16-35 on page 510 of The AMA Guides 5th Ed.</p>
                        </div>
                        <p class="total-impairment"><strong>Total: <span id="shoulder-strength-total-ue">0 UE = 0 WPI</span></strong></p>
                    `;
                    calculatorsList.appendChild(calculatorCard);

                    // Add event listeners for strength inputs
                    const movements = ['flexion', 'extension', 'abduction', 'adduction', 'internal-rotation', 'external-rotation'];
                    movements.forEach(movement => {
                        const deficitInput = document.getElementById(`shoulder-${movement}-strength-deficit`);
                        const impInput = document.getElementById(`shoulder-${movement}-strength-imp`);
                        
                        deficitInput.addEventListener('input', () => ShoulderCalculator.calculateStrength(movement, 'deficit'));
                        impInput.addEventListener('input', () => ShoulderCalculator.calculateStrength(movement, 'imp'));
                    });
                } else if (cardValue === 'shoulder' && option === 'Arthroplasty') {
                    const calculatorCard = document.createElement('div');
                    calculatorCard.classList.add('calculator-card');
                    calculatorCard.innerHTML = `
                        <h3>Shoulder - Arthroplasty</h3>
                        <div class="arthroplasty-options">
                            <div class="arthroplasty-option">
                                <input type="radio" id="total-shoulder-resection" name="shoulder-arthroplasty" value="30">
                                <label for="total-shoulder-resection">Total Shoulder Resection Arthroplasty (30 UE)</label>
                            </div>
                            <div class="arthroplasty-option">
                                <input type="radio" id="total-shoulder-implant" name="shoulder-arthroplasty" value="24">
                                <label for="total-shoulder-implant">Total Shoulder Implant Arthroplasty (24 UE)</label>
                            </div>
                            <div class="arthroplasty-option">
                                <input type="radio" id="distal-clavicle-resection" name="shoulder-arthroplasty" value="10">
                                <label for="distal-clavicle-resection">Distal Clavicle Resection Arthroplasty (10 UE)</label>
                            </div>
                            <div class="arthroplasty-option">
                                <input type="radio" id="proximal-clavicle-resection" name="shoulder-arthroplasty" value="3">
                                <label for="proximal-clavicle-resection">Proximal Clavicle Resection Arthroplasty (3 UE)</label>
                            </div>
                        </div>
                        <div class="instructions">
                            <p>Instructions: Select the applicable arthroplasty.</p>
                        </div>
                        <div class="reference">
                            <p>Reference: Table 16-27 on page 506 of The AMA Guides 5th Ed.</p>
                        </div>
                        <p class="total-impairment"><strong>Total: <span id="shoulder-arthroplasty-total">0 UE = 0 WPI</span></strong></p>
                    `;
                    calculatorsList.appendChild(calculatorCard);

                    // Add event listeners for arthroplasty radio buttons
                    const arthroplastyOptions = calculatorCard.querySelectorAll('input[name="shoulder-arthroplasty"]');
                    arthroplastyOptions.forEach(option => {
                        option.addEventListener('click', (e) => {
                            if (e.target.checked && e.target._justChecked) {
                                e.target.checked = false;
                                e.target._justChecked = false;
                                ShoulderCalculator.calculateArthroplasty();
                            } else {
                                e.target._justChecked = true;
                                ShoulderCalculator.calculateArthroplasty();
                            }
                        });
                    });
                } else if (cardValue === 'shoulder' && option === 'Instability/Subluxation/Dislocation') {
                    const calculatorCard = document.createElement('div');
                    calculatorCard.classList.add('calculator-card');
                    calculatorCard.innerHTML = `
                        <h3>Shoulder - Instability/Subluxation/Dislocation</h3>
                        <div class="instability-options">
                            <div class="instability-option">
                                <input type="radio" id="class-1-instability" name="shoulder-instability" value="6">
                                <label for="class-1-instability">Class 1 - Occult Instability (6 UE)</label>
                            </div>
                            <div class="instability-option">
                                <input type="radio" id="class-2-instability" name="shoulder-instability" value="12">
                                <label for="class-2-instability">Class 2 - Subluxating Humeral Head (12 UE)</label>
                            </div>
                            <div class="instability-option">
                                <input type="radio" id="class-3-instability" name="shoulder-instability" value="24">
                                <label for="class-3-instability">Class 3 - Dislocating Humeral Head (24 UE)</label>
                            </div>
                        </div>
                        <div class="instructions">
                            <p>Instructions: Select the appropriate class of impairment.</p>
                        </div>
                        <div class="reference">
                            <p>Reference: Table 16-26 on page 505 of The AMA Guides 5th Ed.</p>
                        </div>
                        <p class="total-impairment"><strong>Total: <span id="shoulder-instability-total">0 UE = 0 WPI</span></strong></p>
                    `;
                    calculatorsList.appendChild(calculatorCard);

                    // Add event listeners for instability radio buttons
                    const instabilityOptions = calculatorCard.querySelectorAll('input[name="shoulder-instability"]');
                    instabilityOptions.forEach(option => {
                        option.addEventListener('click', (e) => {
                            if (e.target.checked && e.target._justChecked) {
                                e.target.checked = false;
                                e.target._justChecked = false;
                                ShoulderCalculator.calculateInstability();
                            } else {
                                e.target._justChecked = true;
                                ShoulderCalculator.calculateInstability();
                            }
                        });
                    });
                } else if (cardValue === 'shoulder' && option === 'Synovial Hypertrophy') {
                    const calculatorCard = document.createElement('div');
                    calculatorCard.classList.add('calculator-card');
                    calculatorCard.innerHTML = `
                        <h3>Shoulder - Synovial Hypertrophy</h3>
                        <table class="synovial-hypertrophy-table">
                            <thead>
                                <tr>
                                    <th>Joint</th>
                                    <th>Max UE</th>
                                    <th>Mild (10%)</th>
                                    <th>Moderate (20%)</th>
                                    <th>Severe (30%)</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Glenohumeral</td>
                                    <td>60</td>
                                    <td><input type="checkbox" class="synovial-checkbox" value="6"> 6</td>
                                    <td><input type="checkbox" class="synovial-checkbox" value="12"> 12</td>
                                    <td><input type="checkbox" class="synovial-checkbox" value="18"> 18</td>
                                </tr>
                                <tr>
                                    <td>Acromioclavicular</td>
                                    <td>25</td>
                                    <td><input type="checkbox" class="synovial-checkbox" value="3"> 3</td>
                                    <td><input type="checkbox" class="synovial-checkbox" value="5"> 5</td>
                                    <td><input type="checkbox" class="synovial-checkbox" value="8"> 8</td>
                                </tr>
                                <tr>
                                    <td>Sternoclavicular</td>
                                    <td>5</td>
                                    <td><input type="checkbox" class="synovial-checkbox" value="1"> 1</td>
                                    <td><input type="checkbox" class="synovial-checkbox" value="1"> 1</td>
                                    <td><input type="checkbox" class="synovial-checkbox" value="2"> 2</td>
                                </tr>
                            </tbody>
                        </table>
                        <div class="instructions">
                            <p>Instructions: Check up to one box for each joint as applicable.</p>
                        </div>
                        <div class="key">
                            <p>Key - Joint Swelling Descriptions:</p>
                            <p>• Mild = visibly apparent</p>
                            <p>• Moderate = palpably apparent</p>
                            <p>• Severe = greater than 10% increase in size</p>
                        </div>
                        <div class="reference">
                            <p>Reference: Tables 16-19 & 16-18 on pages 500 & 499 of The AMA Guides 5th Ed.</p>
                        </div>
                        <p class="total-impairment"><strong>Total: <span id="shoulder-synovial-hypertrophy-total">0 UE = 0 WPI</span></strong></p>
                    `;
                    calculatorsList.appendChild(calculatorCard);

                    // Add event listeners for synovial hypertrophy checkboxes
                    const synovialCheckboxes = calculatorCard.querySelectorAll('.synovial-checkbox');
                    synovialCheckboxes.forEach(checkbox => {
                        checkbox.addEventListener('change', (e) => {
                            if (e.target.checked) {
                                // Get all checkboxes in the same row
                                const row = e.target.closest('tr');
                                const rowCheckboxes = row.querySelectorAll('.synovial-checkbox');
                                
                                // Uncheck other boxes in the same row
                                rowCheckboxes.forEach(cb => {
                                    if (cb !== e.target) {
                                        cb.checked = false;
                                    }
                                });
                            }
                            
                            ShoulderCalculator.calculateSynovialHypertrophy();
                        });
                    });
                } else if (cardValue === 'elbow' && option === 'ROM') {
                    const calculatorCard = document.createElement('div');
                    calculatorCard.classList.add('calculator-card');
                    calculatorCard.innerHTML = `
                        <h3>Elbow - ROM</h3>
                        <table class="rom-table">
                            <tr>
                                <th></th>
                                <th>Flexion</th>
                                <th>Extension</th>
                                <th>Ankylosis</th>
                                <th>Imp%</th>
                            </tr>
                            <tr>
                                <td>Angle°</td>
                                <td><input type="number" id="elbow-flexion"></td>
                                <td><input type="number" id="elbow-extension"></td>
                                <td><input type="number" id="elbow-ankylosis-fe"></td>
                                <td rowspan="2" id="elbow-fe-imp">0</td>
                            </tr>
                            <tr>
                                <td>Imp%</td>
                                <td id="elbow-flexion-imp"></td>
                                <td id="elbow-extension-imp"></td>
                                <td id="elbow-ankylosis-fe-imp"></td>
                            </tr>
                            <tr>
                                <th class="blue-header"></th>
                                <th class="blue-header">Pronation</th>
                                <th class="blue-header">Supination</th>
                                <th class="blue-header">Ankylosis</th>
                                <th class="blue-header">Imp%</th>
                            </tr>
                            <tr>
                                <td>Angle°</td>
                                <td><input type="number" id="elbow-pronation" step="1"></td>
                                <td><input type="number" id="elbow-supination" step="1"></td>
                                <td><input type="number" id="elbow-ankylosis-ps" step="1"></td>
                                <td rowspan="2" id="elbow-ps-imp">0</td>
                            </tr>
                            <tr>
                                <td>Imp%</td>
                                <td id="elbow-pronation-imp"></td>
                                <td id="elbow-supination-imp"></td>
                                <td id="elbow-ankylosis-ps-imp"></td>
                            </tr>
                        </table>
                        <div class="instructions">
                            <p>Instructions: Enter the angle measurements for each plane of motion provided by physician.</p>
                        </div>
                        <div class="reference">
                            <p>Reference: Figures 16-34 & 16-37 on pages 472 - 474 of The AMA Guides 5th Ed. UE impairment values contributed by each motion unit within the elbow are added together per page 473 of The Guides.</p>
                        </div>
                        <p class="total-impairment"><strong>Total: <span id="elbow-rom-total">0</span> UE = <span id="elbow-rom-wpi">0</span> WPI</strong></p>
                    `;
                    calculatorsList.appendChild(calculatorCard);

                    // Add event listeners for inputs
                    const inputs = calculatorCard.querySelectorAll('input[type="number"]');
                    inputs.forEach(input => {
                        input.addEventListener('input', () => {
                            ElbowCalculator.calculateROM();
                        });
                    });
                } else if (cardValue === 'elbow' && option === 'Strength') {
                    const calculatorCard = document.createElement('div');
                    calculatorCard.classList.add('calculator-card');
                    calculatorCard.innerHTML = `
                        <h3>Elbow - Muscle Strength</h3>
                        <table class="strength-table">
                            <tr class="header-row">
                                <th>Motion</th>
                                <th>Max UE</th>
                                <th>Strength Deficit % (max 50%)</th>
                                <th>UE Impairment</th>
                            </tr>
                            <tr>
                                <td>Flexion</td>
                                <td>21</td>
                                <td><input type="number" id="elbow-flexion-strength-deficit" min="0" max="50" step="1"></td>
                                <td><input type="number" id="elbow-flexion-strength-imp" min="0" max="10.5" step="1"></td>
                            </tr>
                            <tr>
                                <td>Extension</td>
                                <td>21</td>
                                <td><input type="number" id="elbow-extension-strength-deficit" min="0" max="50" step="1"></td>
                                <td><input type="number" id="elbow-extension-strength-imp" min="0" max="10.5" step="1"></td>
                            </tr>
                            <tr>
                                <td>Pronation</td>
                                <td>14</td>
                                <td><input type="number" id="elbow-pronation-strength-deficit" min="0" max="50" step="1"></td>
                                <td><input type="number" id="elbow-pronation-strength-imp" min="0" max="7" step="1"></td>
                            </tr>
                            <tr>
                                <td>Supination</td>
                                <td>14</td>
                                <td><input type="number" id="elbow-supination-strength-deficit" min="0" max="50" step="1"></td>
                                <td><input type="number" id="elbow-supination-strength-imp" min="0" max="7" step="1"></td>
                            </tr>
                        </table>
                        <div class="instructions">
                            <p>Instructions: Enter the strength deficit % provided by physician for each motion. If a strength deficit % is not provided by physician, enter the strength UE impairment for each motion provided by physician. For reference, Grade 4 strength is 1 to 25% strength deficit and Grade 3 Strength is 26 to 50% strength deficit.</p>
                        </div>
                        <div class="reference">
                            <p>Reference: Table 16-35 on page 510 of The AMA Guides 5th Ed.</p>
                        </div>
                        <p class="total-impairment"><strong>Total: <span id="elbow-strength-total-ue">0 UE = 0 WPI</span></strong></p>
                    `;
                    calculatorsList.appendChild(calculatorCard);

                    // Add event listeners for strength inputs
                    const movements = ['flexion', 'extension', 'pronation', 'supination'];
                    movements.forEach(movement => {
                        const deficitInput = document.getElementById(`elbow-${movement}-strength-deficit`);
                        const impInput = document.getElementById(`elbow-${movement}-strength-imp`);
                        
                        deficitInput.addEventListener('input', () => ElbowCalculator.calculateStrength(movement, 'deficit'));
                        impInput.addEventListener('input', () => ElbowCalculator.calculateStrength(movement, 'imp'));
                    });
                } else if (cardValue === 'elbow' && option === 'Arthroplasty') {
                    const calculatorCard = document.createElement('div');
                    calculatorCard.classList.add('calculator-card');
                    calculatorCard.innerHTML = `
                        <h3>Elbow - Arthroplasty</h3>
                        <div class="arthroplasty-options">
                            <div class="arthroplasty-option">
                                <input type="radio" id="total-elbow-resection" name="elbow-arthroplasty" value="35">
                                <label for="total-elbow-resection">Total Elbow Resection Arthroplasty (35 UE)</label>
                            </div>
                            <div class="arthroplasty-option">
                                <input type="radio" id="total-elbow-implant" name="elbow-arthroplasty" value="28">
                                <label for="total-elbow-implant">Total Elbow Implant Arthroplasty (28 UE)</label>
                            </div>
                            <div class="arthroplasty-option">
                                <input type="radio" id="radial-head-resection" name="elbow-arthroplasty" value="10">
                                <label for="radial-head-resection">Radial Head Resection Arthroplasty (10 UE)</label>
                            </div>
                            <div class="arthroplasty-option">
                                <input type="radio" id="radial-head-implant" name="elbow-arthroplasty" value="8">
                                <label for="radial-head-implant">Radial Head Implant Arthroplasty (8 UE)</label>
                            </div>
                        </div>
                        <div class="instructions">
                            <p>Instructions: Select the applicable arthroplasty.</p>
                        </div>
                        <div class="reference">
                            <p>Reference: Table 16-27 on page 506 of The AMA Guides 5th Ed.</p>
                        </div>
                        <p class="total-impairment"><strong>Total: <span id="elbow-arthroplasty-total">0 UE = 0 WPI</span></strong></p>
                    `;
                    calculatorsList.appendChild(calculatorCard);

                    // Add event listeners for arthroplasty radio buttons
                    const arthroplastyOptions = calculatorCard.querySelectorAll('input[name="elbow-arthroplasty"]');
                    arthroplastyOptions.forEach(option => {
                        option.addEventListener('click', (e) => {
                            if (e.target.checked && e.target._justChecked) {
                                e.target.checked = false;
                                e.target._justChecked = false;
                                ElbowCalculator.calculateArthroplasty();
                            } else {
                                e.target._justChecked = true;
                                ElbowCalculator.calculateArthroplasty();
                            }
                        });
                    });
                } else if (cardValue === 'elbow' && option === 'Synovial Hypertrophy') {
                    const calculatorCard = document.createElement('div');
                    calculatorCard.classList.add('calculator-card');
                    calculatorCard.innerHTML = `
                        <h3>Elbow - Synovial Hypertrophy</h3>
                        <table class="synovial-hypertrophy-table">
                            <thead>
                                <tr>
                                    <th>Joint</th>
                                    <th>Max UE</th>
                                    <th>Mild (10%)</th>
                                    <th>Moderate (20%)</th>
                                    <th>Severe (30%)</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Entire Elbow</td>
                                    <td>70</td>
                                    <td><input type="checkbox" class="synovial-checkbox" value="7" data-group="entire"> 7</td>
                                    <td><input type="checkbox" class="synovial-checkbox" value="14" data-group="entire"> 14</td>
                                    <td><input type="checkbox" class="synovial-checkbox" value="21" data-group="entire"> 21</td>
                                </tr>
                                <tr>
                                    <td>Ulnohumeral</td>
                                    <td>50</td>
                                    <td><input type="checkbox" class="synovial-checkbox" value="5" data-group="individual"> 5</td>
                                    <td><input type="checkbox" class="synovial-checkbox" value="10" data-group="individual"> 10</td>
                                    <td><input type="checkbox" class="synovial-checkbox" value="15" data-group="individual"> 15</td>
                                </tr>
                                <tr>
                                    <td>Proximal Radioulnar</td>
                                    <td>20</td>
                                    <td><input type="checkbox" class="synovial-checkbox" value="2" data-group="individual"> 2</td>
                                    <td><input type="checkbox" class="synovial-checkbox" value="4" data-group="individual"> 4</td>
                                    <td><input type="checkbox" class="synovial-checkbox" value="6" data-group="individual"> 6</td>
                                </tr>
                            </tbody>
                        </table>
                        <div class="instructions">
                            <p>Instructions: Check up to one box for each joint as applicable, or alternatively, check an applicable box for the Entire Elbow.</p>
                        </div>
                        <div class="key">
                            <p>Key - Joint Swelling Descriptions:</p>
                            <p>• Mild = visibly apparent</p>
                            <p>• Moderate = palpably apparent</p>
                            <p>• Severe = greater than 10% increase in size</p>
                        </div>
                        <div class="reference">
                            <p>Reference: Tables 16-19 & 16-18 on pages 500 & 499 of The AMA Guides 5th Ed.</p>
                        </div>
                        <p class="total-impairment"><strong>Total: <span id="elbow-synovial-hypertrophy-total">0 UE = 0 WPI</span></strong></p>
                    `;
                    calculatorsList.appendChild(calculatorCard);

                    // Add event listeners for synovial hypertrophy checkboxes
                    const synovialCheckboxes = calculatorCard.querySelectorAll('.synovial-checkbox');
                    synovialCheckboxes.forEach(checkbox => {
                        checkbox.addEventListener('change', (e) => {
                            const group = e.target.dataset.group;
                            const row = e.target.closest('tr');
                            const rowCheckboxes = row.querySelectorAll('.synovial-checkbox');
                            
                            // If checking a box
                            if (e.target.checked) {
                                // Uncheck other severity levels in same row
                                rowCheckboxes.forEach(cb => {
                                    if (cb !== e.target) cb.checked = false;
                                });

                                // Get all currently checked groups
                                const checkedGroups = Array.from(document.querySelectorAll('.synovial-checkbox:checked'))
                                    .map(cb => cb.dataset.group);

                                // Handle Entire Wrist selection
                                if (group === 'entire') {
                                    // Uncheck all other joints
                                    synovialCheckboxes.forEach(cb => {
                                        if (cb.dataset.group !== 'entire') {
                                            cb.checked = false;
                                        }
                                    });
                                } else {
                                    // Uncheck Entire Wrist if selecting any other joint
                                    synovialCheckboxes.forEach(cb => {
                                        if (cb.dataset.group === 'entire') {
                                            cb.checked = false;
                                        }
                                    });

                                    // Handle incompatible combinations
                                    if (group === 'radiocarpal') {
                                        // If selecting radiocarpal, uncheck proximal carpal row
                                        synovialCheckboxes.forEach(cb => {
                                            if (cb.dataset.group === 'carpal') {
                                                cb.checked = false;
                                            }
                                        });
                                    } else if (group === 'carpal') {
                                        // If selecting proximal carpal row, uncheck radiocarpal
                                        synovialCheckboxes.forEach(cb => {
                                            if (cb.dataset.group === 'radiocarpal') {
                                                cb.checked = false;
                                            }
                                        });
                                    }

                                    // If more than two joints are selected, uncheck the oldest selection
                                    const checkedBoxes = Array.from(document.querySelectorAll('.synovial-checkbox:checked'));
                                    if (checkedBoxes.length > 2) {
                                        checkedBoxes[0].checked = false;
                                    }
                                }
                            }
                            
                            ElbowCalculator.calculateSynovialHypertrophy();
                        });
                    });
                } else if (cardValue === 'elbow' && option === 'Persistent Subluxation/Dislocation') {
                    const calculatorCard = document.createElement('div');
                    calculatorCard.classList.add('calculator-card');
                    calculatorCard.innerHTML = `
                        <h3>Elbow - Persistent Subluxation/Dislocation</h3>
                        <table class="synovial-hypertrophy-table">
                            <thead>
                                <tr>
                                    <th>Joint</th>
                                    <th>Max UE</th>
                                    <th>Mild (20%)</th>
                                    <th>Moderate (40%)</th>
                                    <th>Severe (60%)</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Entire Elbow</td>
                                    <td>70</td>
                                    <td><input type="checkbox" class="subluxation-checkbox" value="14" data-group="entire"> 14</td>
                                    <td><input type="checkbox" class="subluxation-checkbox" value="28" data-group="entire"> 28</td>
                                    <td><input type="checkbox" class="subluxation-checkbox" value="42" data-group="entire"> 42</td>
                                </tr>
                                <tr>
                                    <td>Ulnohumeral</td>
                                    <td>50</td>
                                    <td><input type="checkbox" class="subluxation-checkbox" value="10" data-group="individual"> 10</td>
                                    <td><input type="checkbox" class="subluxation-checkbox" value="20" data-group="individual"> 20</td>
                                    <td><input type="checkbox" class="subluxation-checkbox" value="30" data-group="individual"> 30</td>
                                </tr>
                                <tr>
                                    <td>Proximal Radioulnar</td>
                                    <td>20</td>
                                    <td><input type="checkbox" class="subluxation-checkbox" value="4" data-group="individual"> 4</td>
                                    <td><input type="checkbox" class="subluxation-checkbox" value="8" data-group="individual"> 8</td>
                                    <td><input type="checkbox" class="subluxation-checkbox" value="12" data-group="individual"> 12</td>
                                </tr>
                            </tbody>
                        </table>
                        <div class="instructions">
                            <p>Instructions: Check up to one box for each joint as applicable, or alternatively, check an applicable box for the Entire Elbow.</p>
                        </div>
                        <div class="key">
                            <p>Key - Subluxation/Dislocation Descriptions:</p>
                            <p>• Mild = can be completely reduced manually</p>
                            <p>• Moderate = cannot be completely reduced manually</p>
                            <p>• Severe = cannot be reduced</p>
                        </div>
                        <div class="reference">
                            <p>Reference: Tables 16-22 & 16-18 on pages 501 & 499 of The AMA Guides 5th Ed.</p>
                        </div>
                        <p class="total-impairment"><strong>Total: <span id="elbow-subluxation-total">0 UE = 0 WPI</span></strong></p>
                    `;
                    calculatorsList.appendChild(calculatorCard);

                    // Add event listeners for subluxation checkboxes
                    const subluxationCheckboxes = calculatorCard.querySelectorAll('.subluxation-checkbox');
                    subluxationCheckboxes.forEach(checkbox => {
                        checkbox.addEventListener('change', (e) => {
                            const group = e.target.dataset.group;
                            const row = e.target.closest('tr');
                            const rowCheckboxes = row.querySelectorAll('.subluxation-checkbox');
                            
                            // If checking a box
                            if (e.target.checked) {
                                // Uncheck other severity levels in same row
                                rowCheckboxes.forEach(cb => {
                                    if (cb !== e.target) cb.checked = false;
                                });
                                
                                // If checking "Entire Elbow", uncheck all others
                                if (group === 'entire') {
                                    subluxationCheckboxes.forEach(cb => {
                                        if (cb.dataset.group === 'individual') {
                                            cb.checked = false;
                                        }
                                    });
                                }
                                // If checking an individual joint, uncheck "Entire Elbow"
                                else if (group === 'individual') {
                                    subluxationCheckboxes.forEach(cb => {
                                        if (cb.dataset.group === 'entire') {
                                            cb.checked = false;
                                        }
                                    });
                                }
                            }
                            
                            ElbowCalculator.calculateSubluxation();
                        });
                    });
                } else if (cardValue === 'elbow' && option === 'Excessive Passive Mediolateral Instability') {
                    const calculatorCard = document.createElement('div');
                    calculatorCard.classList.add('calculator-card');
                    calculatorCard.innerHTML = `
                        <h3>Elbow - Excessive Passive Mediolateral Instability</h3>
                        <table class="synovial-hypertrophy-table">
                            <thead>
                                <tr>
                                    <th>Joint</th>
                                    <th>Max UE</th>
                                    <th style="min-width: 120px">Mild <10° (20%)</th>
                                    <th style="min-width: 140px">Moderate 10°-20° (40%)</th>
                                    <th style="min-width: 120px">Severe >20° (60%)</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Entire Elbow</td>
                                    <td>70</td>
                                    <td><input type="checkbox" class="passive-instability-checkbox" value="14" data-group="entire"> 14</td>
                                    <td><input type="checkbox" class="passive-instability-checkbox" value="28" data-group="entire"> 28</td>
                                    <td><input type="checkbox" class="passive-instability-checkbox" value="42" data-group="entire"> 42</td>
                                </tr>
                                <tr>
                                    <td>Ulnohumeral</td>
                                    <td>50</td>
                                    <td><input type="checkbox" class="passive-instability-checkbox" value="10" data-group="individual"> 10</td>
                                    <td><input type="checkbox" class="passive-instability-checkbox" value="20" data-group="individual"> 20</td>
                                    <td><input type="checkbox" class="passive-instability-checkbox" value="30" data-group="individual"> 30</td>
                                </tr>
                                <tr>
                                    <td>Proximal Radioulnar</td>
                                    <td>20</td>
                                    <td><input type="checkbox" class="passive-instability-checkbox" value="4" data-group="individual"> 4</td>
                                    <td><input type="checkbox" class="passive-instability-checkbox" value="8" data-group="individual"> 8</td>
                                    <td><input type="checkbox" class="passive-instability-checkbox" value="12" data-group="individual"> 12</td>
                                </tr>
                            </tbody>
                        </table>
                        <div class="instructions">
                            <p>Instructions: Check up to one box for each joint as applicable, or alternatively, check an applicable box for the Entire Elbow.</p>
                        </div>
                        <div class="reference">
                            <p>Reference: Tables 16-23 & 16-18 on pages 502 & 499 of The AMA Guides 5th Ed.</p>
                        </div>
                        <p class="total-impairment"><strong>Total: <span id="elbow-passive-instability-total">0 UE = 0 WPI</span></strong></p>
                    `;
                    calculatorsList.appendChild(calculatorCard);

                    // Add event listeners for passive instability checkboxes
                    const passiveInstabilityCheckboxes = calculatorCard.querySelectorAll('.passive-instability-checkbox');
                    passiveInstabilityCheckboxes.forEach(checkbox => {
                        checkbox.addEventListener('change', (e) => {
                            const group = e.target.dataset.group;
                            const row = e.target.closest('tr');
                            const rowCheckboxes = row.querySelectorAll('.passive-instability-checkbox');
                            
                            // If checking a box
                            if (e.target.checked) {
                                // Uncheck other severity levels in same row
                                rowCheckboxes.forEach(cb => {
                                    if (cb !== e.target) cb.checked = false;
                                });
                                
                                // If checking "Entire Elbow", uncheck all others
                                if (group === 'entire') {
                                    passiveInstabilityCheckboxes.forEach(cb => {
                                        if (cb.dataset.group === 'individual') {
                                            cb.checked = false;
                                        }
                                    });
                                }
                                // If checking an individual joint, uncheck "Entire Elbow"
                                else if (group === 'individual') {
                                    passiveInstabilityCheckboxes.forEach(cb => {
                                        if (cb.dataset.group === 'entire') {
                                            cb.checked = false;
                                        }
                                    });
                                }
                            }
                            
                            ElbowCalculator.calculatePassiveInstability();
                        });
                    });
                } else if (cardValue === 'elbow' && option === 'Excessive Active Mediolateral Deviation') {
                    const calculatorCard = document.createElement('div');
                    calculatorCard.classList.add('calculator-card');
                    calculatorCard.innerHTML = `
                        <h3>Elbow - Excessive Active Mediolateral Deviation</h3>
                        <table class="synovial-hypertrophy-table">
                            <thead>
                                <tr>
                                    <th>Joint</th>
                                    <th>Max UE</th>
                                    <th style="min-width: 120px">Mild <20° (10%)</th>
                                    <th style="min-width: 140px">Moderate 20°-30° (20%)</th>
                                    <th style="min-width: 120px">Severe >30° (30%)</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Entire Elbow</td>
                                    <td>70</td>
                                    <td><input type="checkbox" class="active-deviation-checkbox" value="7" data-group="entire"> 7</td>
                                    <td><input type="checkbox" class="active-deviation-checkbox" value="14" data-group="entire"> 14</td>
                                    <td><input type="checkbox" class="active-deviation-checkbox" value="21" data-group="entire"> 21</td>
                                </tr>
                                <tr>
                                    <td>Ulnohumeral</td>
                                    <td>50</td>
                                    <td><input type="checkbox" class="active-deviation-checkbox" value="5" data-group="individual"> 5</td>
                                    <td><input type="checkbox" class="active-deviation-checkbox" value="10" data-group="individual"> 10</td>
                                    <td><input type="checkbox" class="active-deviation-checkbox" value="15" data-group="individual"> 15</td>
                                </tr>
                                <tr>
                                    <td>Proximal Radioulnar</td>
                                    <td>20</td>
                                    <td><input type="checkbox" class="active-deviation-checkbox" value="2" data-group="individual"> 2</td>
                                    <td><input type="checkbox" class="active-deviation-checkbox" value="4" data-group="individual"> 4</td>
                                    <td><input type="checkbox" class="active-deviation-checkbox" value="6" data-group="individual"> 6</td>
                                </tr>
                            </tbody>
                        </table>
                        <div class="instructions">
                            <p>Instructions: Check up to one box for each joint as applicable, or alternatively, check an applicable box for the Entire Elbow.</p>
                        </div>
                        <div class="reference">
                            <p>Reference: Tables 16-24 & 16-18 on pages 502 & 499 of The AMA Guides 5th Ed.</p>
                        </div>
                        <p class="total-impairment"><strong>Total: <span id="elbow-active-deviation-total">0 UE = 0 WPI</span></strong></p>
                    `;
                    calculatorsList.appendChild(calculatorCard);

                    // Add event listeners for active deviation checkboxes
                    const activeDeviationCheckboxes = calculatorCard.querySelectorAll('.active-deviation-checkbox');
                    activeDeviationCheckboxes.forEach(checkbox => {
                        checkbox.addEventListener('change', (e) => {
                            const group = e.target.dataset.group;
                            const row = e.target.closest('tr');
                            const rowCheckboxes = row.querySelectorAll('.active-deviation-checkbox');
                            
                            // If checking a box
                            if (e.target.checked) {
                                // Uncheck other severity levels in same row
                                rowCheckboxes.forEach(cb => {
                                    if (cb !== e.target) cb.checked = false;
                                });
                                
                                // If checking "Entire Elbow", uncheck all others
                                if (group === 'entire') {
                                    activeDeviationCheckboxes.forEach(cb => {
                                        if (cb.dataset.group === 'individual') {
                                            cb.checked = false;
                                        }
                                    });
                                }
                                // If checking an individual joint, uncheck "Entire Elbow"
                                else if (group === 'individual') {
                                    activeDeviationCheckboxes.forEach(cb => {
                                        if (cb.dataset.group === 'entire') {
                                            cb.checked = false;
                                        }
                                    });
                                }
                            }
                            
                            ElbowCalculator.calculateActiveDeviation();
                        });
                    });
                } else if (cardValue === 'wrist' && option === 'ROM') {
                    const calculatorCard = document.createElement('div');
                    calculatorCard.classList.add('calculator-card');
                    calculatorCard.innerHTML = `
                        <h3>Wrist - ROM</h3>
                        <table class="rom-table">
                            <tr>
                                <th style="width: 16.25%"></th>
                                <th style="width: 22.5%">Flexion</th>
                                <th style="width: 22.5%">Extension</th>
                                <th style="width: 22.5%">Ankylosis</th>
                                <th style="width: 16.25%">Imp%</th>
                            </tr>
                            <tr>
                                <td>Angle°</td>
                                <td><input type="number" id="wrist-flexion" oninput="WristCalculator.calculateROM()"></td>
                                <td><input type="number" id="wrist-extension" oninput="WristCalculator.calculateROM()"></td>
                                <td><input type="number" id="wrist-ankylosis-fe" oninput="WristCalculator.calculateROM()"></td>
                                <td rowspan="2" id="wrist-fe-imp">0</td>
                            </tr>
                            <tr>
                                <td>Imp%</td>
                                <td id="wrist-flexion-imp"></td>
                                <td id="wrist-extension-imp"></td>
                                <td id="wrist-ankylosis-fe-imp"></td>
                            </tr>
                        </table>
                        <table class="rom-table">
                            <tr>
                                <th style="width: 16.25%"></th>
                                <th style="width: 22.5%">Radial Deviation</th>
                                <th style="width: 22.5%">Ulnar Deviation</th>
                                <th style="width: 22.5%">Ankylosis</th>
                                <th style="width: 16.25%">Imp%</th>
                            </tr>
                            <tr>
                                <td>Angle°</td>
                                <td><input type="number" id="wrist-radial" oninput="WristCalculator.calculateROM()"></td>
                                <td><input type="number" id="wrist-ulnar" oninput="WristCalculator.calculateROM()"></td>
                                <td><input type="number" id="wrist-ankylosis-ru" oninput="WristCalculator.calculateROM()"></td>
                                <td rowspan="2" id="wrist-ru-imp">0</td>
                            </tr>
                            <tr>
                                <td>Imp%</td>
                                <td id="wrist-radial-imp"></td>
                                <td id="wrist-ulnar-imp"></td>
                                <td id="wrist-ankylosis-ru-imp"></td>
                            </tr>
                        </table>
                        <div class="instructions">
                            <p>Instructions: Enter the angle measurements for each plane of motion provided by physician.</p>
                        </div>
                        <div class="reference">
                            <p>Reference: Figures 16-28 & 16-31 on pages 467 - 469 of The AMA Guides 5th Ed. UE impairment values contributed by each motion unit within the wrist are added together per page 470 of The Guides.</p>
                        </div>
                        <p style="text-align: left;"><strong>Total: <span id="wrist-rom-total">0</span> UE = <span id="wrist-rom-wpi">0</span> WPI</strong></p>
                    `;
                    calculatorsList.appendChild(calculatorCard);
                } else if (cardValue === 'wrist' && option === 'Arthroplasty') {
                    const calculatorCard = document.createElement('div');
                    calculatorCard.classList.add('calculator-card');
                    calculatorCard.innerHTML = `
                        <h3>Wrist - Arthroplasty</h3>
                        <div class="arthroplasty-options">
                            <div class="arthroplasty-option wrist-arthroplasty">
                                <input type="checkbox" id="wrist-arthroplasty-total" value="24" data-group="total">
                                <label for="wrist-arthroplasty-total">Total Wrist Implant Arthroplasty (24 UE)</label>
                            </div>
                            <div class="arthroplasty-option wrist-arthroplasty">
                                <input type="checkbox" id="wrist-arthroplasty-radiocarpal" value="16" data-group="radiocarpal">
                                <label for="wrist-arthroplasty-radiocarpal">Radiocarpal Implant Arthroplasty (16 UE)</label>
                            </div>
                            <div class="arthroplasty-option wrist-arthroplasty">
                                <input type="checkbox" id="wrist-arthroplasty-proximal" value="12" data-group="proximal">
                                <label for="wrist-arthroplasty-proximal">Proximal Row Carpectomy Resection Arthroplasty (12 UE)</label>
                            </div>
                            <div class="arthroplasty-option wrist-arthroplasty">
                                <input type="checkbox" id="wrist-arthroplasty-ulnar-resection" value="10" data-group="ulnar">
                                <label for="wrist-arthroplasty-ulnar-resection">Ulnar Head Resection Arthroplasty (10 UE)</label>
                            </div>
                            <div class="arthroplasty-option wrist-arthroplasty">
                                <input type="checkbox" id="wrist-arthroplasty-carpal-resection" value="10" data-group="carpal">
                                <label for="wrist-arthroplasty-carpal-resection">Carpal Bone Resection Arthroplasty (10 UE)</label>
                            </div>
                            <div class="arthroplasty-option wrist-arthroplasty">
                                <input type="checkbox" id="wrist-arthroplasty-ulnar-implant" value="8" data-group="ulnar">
                                <label for="wrist-arthroplasty-ulnar-implant">Ulnar Head Implant Arthroplasty (8 UE)</label>
                            </div>
                            <div class="arthroplasty-option wrist-arthroplasty">
                                <input type="checkbox" id="wrist-arthroplasty-carpal-implant" value="8" data-group="carpal">
                                <label for="wrist-arthroplasty-carpal-implant">Carpal Bone Implant Arthroplasty (8 UE)</label>
                            </div>
                            <div class="arthroplasty-option wrist-arthroplasty">
                                <input type="checkbox" id="wrist-arthroplasty-radial" value="5" data-group="radial">
                                <label for="wrist-arthroplasty-radial">Radial Styloid Resection Arthroplasty (5 UE)</label>
                            </div>
                        </div>
                        <div class="instructions" style="margin-bottom: 10px;">
                            <p>Instructions: Select the applicable arthroplasty(ies).</p>
                        </div>
                        <div class="reference" style="margin-bottom: 10px;">
                            <p>Reference: Table 16-27 on page 506 of The AMA Guides 5th Ed.</p>
                        </div>
                        <div id="wrist-arthroplasty-combined" style="text-align: left; margin-bottom: 10px;"></div>
                        <p class="total-impairment"><strong>Total: <span id="wrist-arthroplasty-total-value">0 UE = 0 WPI</span></strong></p>
                        <div id="wrist-arthroplasty-total" style="display: none;">0 UE</div>  <!-- Add this line -->
                    `;
                    calculatorsList.appendChild(calculatorCard);

                    // Add event listeners for arthroplasty checkboxes - now scoped specifically to wrist
                    const wristArthroplastyCheckboxes = calculatorCard.querySelectorAll('.wrist-arthroplasty input[type="checkbox"]');
                    wristArthroplastyCheckboxes.forEach(checkbox => {
                        checkbox.addEventListener('change', (e) => {
                            if (e.target.checked) {
                                const group = e.target.dataset.group;
                                const id = e.target.id;

                                // Rule 1: Total wrist replacement can't be combined with any other arthroplasty
                                if (id === 'wrist-arthroplasty-total') {
                                    wristArthroplastyCheckboxes.forEach(cb => {
                                        if (cb !== e.target) {
                                            cb.checked = false;
                                        }
                                    });
                                } else {
                                    // If selecting any other option, uncheck total wrist replacement
                                    const totalWristCheckbox = document.getElementById('wrist-arthroplasty-total');
                                    if (totalWristCheckbox) {
                                        totalWristCheckbox.checked = false;
                                    }
                                }

                                // Rule 2: Ulnar Head Resection vs Implant
                                if (id === 'wrist-arthroplasty-ulnar-resection' || id === 'wrist-arthroplasty-ulnar-implant') {
                                    wristArthroplastyCheckboxes.forEach(cb => {
                                        if ((cb.id === 'wrist-arthroplasty-ulnar-resection' || 
                                             cb.id === 'wrist-arthroplasty-ulnar-implant') && 
                                            cb !== e.target) {
                                            cb.checked = false;
                                        }
                                    });
                                }

                                // Rule 3: Radiocarpal Implant incompatibilities
                                if (id === 'wrist-arthroplasty-radiocarpal') {
                                    const incompatibleIds = [
                                        'wrist-arthroplasty-proximal',  // Changed from proximal-row
                                        'wrist-arthroplasty-carpal-resection',
                                        'wrist-arthroplasty-carpal-implant',
                                        'wrist-arthroplasty-radial'     // Changed from radial-styloid
                                    ];
                                    wristArthroplastyCheckboxes.forEach(cb => {
                                        if (incompatibleIds.includes(cb.id)) {
                                            cb.checked = false;
                                        }
                                    });
                                } else if (['wrist-arthroplasty-proximal',     // Changed from proximal-row
                                           'wrist-arthroplasty-carpal-resection',
                                           'wrist-arthroplasty-carpal-implant',
                                           'wrist-arthroplasty-radial'].includes(id)) {  // Changed from radial-styloid
                                    const radiocarpalCheckbox = document.getElementById('wrist-arthroplasty-radiocarpal');
                                    if (radiocarpalCheckbox) {
                                        radiocarpalCheckbox.checked = false;
                                    }
                                }

                                // Rule 4: Proximal Row Carpectomy incompatibilities
                                if (id === 'wrist-arthroplasty-proximal') {    // Changed from proximal-row
                                    const incompatibleIds = [
                                        'wrist-arthroplasty-carpal-resection',
                                        'wrist-arthroplasty-carpal-implant'
                                    ];
                                    wristArthroplastyCheckboxes.forEach(cb => {
                                        if (incompatibleIds.includes(cb.id)) {
                                            cb.checked = false;
                                        }
                                    });
                                } else if (['wrist-arthroplasty-carpal-resection',
                                           'wrist-arthroplasty-carpal-implant'].includes(id)) {
                                    const proximalRowCheckbox = document.getElementById('wrist-arthroplasty-proximal'); // Changed from proximal-row
                                    if (proximalRowCheckbox) {
                                        proximalRowCheckbox.checked = false;
                                    }
                                }
                            }
                            
                            // Calculate total impairment (existing code remains the same)
                            const checkedBoxes = Array.from(wristArthroplastyCheckboxes)
                                .filter(cb => cb.checked);
                            
                            const checkedValues = checkedBoxes
                                .map(cb => parseInt(cb.value))
                                .sort((a, b) => b - a);
                            
                            let ueValue = 0;
                            if (checkedValues.length > 0) {
                                ueValue = checkedValues.reduce((acc, val) => {
                                    if (acc === 0) return val;
                                    return Math.round(acc + val * (1 - acc/100));
                                }, 0);

                                if (checkedValues.length > 1) {
                                    const combinedText = checkedValues.join(' C ') + ' = ' + ueValue + ' UE';
                                    document.getElementById('wrist-arthroplasty-combined').textContent = 'Combined: ' + combinedText;
                                } else {
                                    document.getElementById('wrist-arthroplasty-combined').textContent = '';
                                }
                            } else {
                                document.getElementById('wrist-arthroplasty-combined').textContent = '';
                            }
                            
                            const wpiValue = Math.round(ueValue * 0.6);
                            document.getElementById('wrist-arthroplasty-total-value').textContent = `${ueValue} UE = ${wpiValue} WPI`;
                            
                            // Add this line to update the total impairment card
                            WristCalculator.updateTotalImpairment();
                        });
                    });
                } else if (cardValue === 'wrist' && option === 'Synovial Hypertrophy') {
                    const calculatorCard = document.createElement('div');
                    calculatorCard.classList.add('calculator-card');
                    calculatorCard.innerHTML = `
                        <h3>Wrist - Synovial Hypertrophy</h3>
                        <table class="synovial-hypertrophy-table">
                            <thead>
                                <tr>
                                    <th>Joint</th>
                                    <th>Max UE</th>
                                    <th>Mild (10%)</th>
                                    <th>Moderate (20%)</th>
                                    <th>Severe (30%)</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Entire Wrist</td>
                                    <td>60</td>
                                    <td><input type="checkbox" class="synovial-checkbox" value="6" data-group="entire"> 6</td>
                                    <td><input type="checkbox" class="synovial-checkbox" value="12" data-group="entire"> 12</td>
                                    <td><input type="checkbox" class="synovial-checkbox" value="18" data-group="entire"> 18</td>
                                </tr>
                                <tr>
                                    <td>Radiocarpal</td>
                                    <td>40</td>
                                    <td><input type="checkbox" class="synovial-checkbox" value="4" data-group="radiocarpal"> 4</td>
                                    <td><input type="checkbox" class="synovial-checkbox" value="8" data-group="radiocarpal"> 8</td>
                                    <td><input type="checkbox" class="synovial-checkbox" value="12" data-group="radiocarpal"> 12</td>
                                </tr>
                                <tr>
                                    <td>Distal Radioulnar</td>
                                    <td>20</td>
                                    <td><input type="checkbox" class="synovial-checkbox" value="2" data-group="radioulnar"> 2</td>
                                    <td><input type="checkbox" class="synovial-checkbox" value="4" data-group="radioulnar"> 4</td>
                                    <td><input type="checkbox" class="synovial-checkbox" value="6" data-group="radioulnar"> 6</td>
                                </tr>
                                <tr>
                                    <td>Proximal Carpal Row</td>
                                    <td>30</td>
                                    <td><input type="checkbox" class="synovial-checkbox" value="3" data-group="carpal"> 3</td>
                                    <td><input type="checkbox" class="synovial-checkbox" value="6" data-group="carpal"> 6</td>
                                    <td><input type="checkbox" class="synovial-checkbox" value="9" data-group="carpal"> 9</td>
                                </tr>
                            </tbody>
                        </table>
                        <div class="instructions">
                            <p>Instructions: Check up to one box for each joint as applicable, or alternatively, check an applicable box for the Entire Wrist.</p>
                        </div>
                        <div class="key">
                            <p>Key - Joint Swelling Descriptions:</p>
                            <p>• Mild = visibly apparent</p>
                            <p>• Moderate = palpably apparent</p>
                            <p>• Severe = greater than 10% increase in size</p>
                        </div>
                        <div class="reference">
                            <p>Reference: Tables 16-19 & 16-18 on pages 500 & 499 of The AMA Guides 5th Ed.</p>
                        </div>
                        <p class="total-impairment"><strong>Total: <span id="wrist-synovial-hypertrophy-total">0 UE = 0 WPI</span></strong></p>
                    `;
                    calculatorsList.appendChild(calculatorCard);

                    // Add event listeners for synovial hypertrophy checkboxes
                    const synovialCheckboxes = calculatorCard.querySelectorAll('.synovial-checkbox');
                    synovialCheckboxes.forEach(checkbox => {
                        checkbox.addEventListener('change', (e) => {
                            const group = e.target.dataset.group;
                            const row = e.target.closest('tr');
                            const rowCheckboxes = row.querySelectorAll('.synovial-checkbox');
                            
                            // If checking a box
                            if (e.target.checked) {
                                // Uncheck other severity levels in same row
                                rowCheckboxes.forEach(cb => {
                                    if (cb !== e.target) cb.checked = false;
                                });

                                // Get all currently checked groups
                                const checkedGroups = Array.from(document.querySelectorAll('.synovial-checkbox:checked'))
                                    .map(cb => cb.dataset.group);

                                // Handle Entire Wrist selection
                                if (group === 'entire') {
                                    // Uncheck all other joints
                                    synovialCheckboxes.forEach(cb => {
                                        if (cb.dataset.group !== 'entire') {
                                            cb.checked = false;
                                        }
                                    });
                                } else {
                                    // Uncheck Entire Wrist if selecting any other joint
                                    synovialCheckboxes.forEach(cb => {
                                        if (cb.dataset.group === 'entire') {
                                            cb.checked = false;
                                        }
                                    });

                                    // Handle incompatible combinations
                                    if (group === 'radiocarpal') {
                                        // If selecting radiocarpal, uncheck proximal carpal row
                                        synovialCheckboxes.forEach(cb => {
                                            if (cb.dataset.group === 'carpal') {
                                                cb.checked = false;
                                            }
                                        });
                                    } else if (group === 'carpal') {
                                        // If selecting proximal carpal row, uncheck radiocarpal
                                        synovialCheckboxes.forEach(cb => {
                                            if (cb.dataset.group === 'radiocarpal') {
                                                cb.checked = false;
                                            }
                                        });
                                    }

                                    // If more than two joints are selected, uncheck the oldest selection
                                    const checkedBoxes = Array.from(document.querySelectorAll('.synovial-checkbox:checked'));
                                    if (checkedBoxes.length > 2) {
                                        checkedBoxes[0].checked = false;
                                    }
                                }
                            }
                            
                            WristCalculator.calculateSynovialHypertrophy();
                        });
                    });
                } else if (cardValue === 'wrist' && option === 'Excessive Active Mediolateral Deviation') {
                    const calculatorCard = document.createElement('div');
                    calculatorCard.classList.add('calculator-card');
                    calculatorCard.innerHTML = `
                        <h3>Wrist - Excessive Active Mediolateral Deviation</h3>
                        <table class="synovial-hypertrophy-table">
                            <thead>
                                <tr>
                                    <th>Joint</th>
                                    <th>Max UE</th>
                                    <th style="min-width: 120px">Mild <20° (10%)</th>
                                    <th style="min-width: 140px">Moderate 20°-30° (20%)</th>
                                    <th style="min-width: 120px">Severe >30° (30%)</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Entire Wrist</td>
                                    <td>60</td>
                                    <td><input type="checkbox" class="active-deviation-checkbox" value="6" data-group="entire"> 6</td>
                                    <td><input type="checkbox" class="active-deviation-checkbox" value="12" data-group="entire"> 12</td>
                                    <td><input type="checkbox" class="active-deviation-checkbox" value="18" data-group="entire"> 18</td>
                                </tr>
                                <tr>
                                    <td>Radiocarpal</td>
                                    <td>40</td>
                                    <td><input type="checkbox" class="active-deviation-checkbox" value="4" data-group="individual"> 4</td>
                                    <td><input type="checkbox" class="active-deviation-checkbox" value="8" data-group="individual"> 8</td>
                                    <td><input type="checkbox" class="active-deviation-checkbox" value="12" data-group="individual"> 12</td>
                                </tr>
                                <tr>
                                    <td>Distal Radioulnar</td>
                                    <td>20</td>
                                    <td><input type="checkbox" class="active-deviation-checkbox" value="2" data-group="individual"> 2</td>
                                    <td><input type="checkbox" class="active-deviation-checkbox" value="4" data-group="individual"> 4</td>
                                    <td><input type="checkbox" class="active-deviation-checkbox" value="6" data-group="individual"> 6</td>
                                </tr>
                                <tr>
                                    <td>Proximal Carpal Row</td>
                                    <td>30</td>
                                    <td><input type="checkbox" class="active-deviation-checkbox" value="3" data-group="individual"> 3</td>
                                    <td><input type="checkbox" class="active-deviation-checkbox" value="6" data-group="individual"> 6</td>
                                    <td><input type="checkbox" class="active-deviation-checkbox" value="9" data-group="individual"> 9</td>
                                </tr>
                            </tbody>
                        </table>
                        <div class="instructions">
                            <p>Instructions: Check up to one box for each joint as applicable, or alternatively, check an applicable box for the Entire Wrist.</p>
                        </div>
                        <div class="reference">
                            <p>Reference: Tables 16-24 & 16-18 on pages 502 & 499 of The AMA Guides 5th Ed.</p>
                        </div>
                        <div id="wrist-active-deviation-combined" style="text-align: left; margin-top: 10px;"></div>
                        <p class="total-impairment"><strong>Total: <span id="wrist-active-deviation-total">0 UE = 0 WPI</span></strong></p>
                    `;
                    calculatorsList.appendChild(calculatorCard);

                    // Add event listeners for active deviation checkboxes
                    const activeDeviationCheckboxes = calculatorCard.querySelectorAll('.active-deviation-checkbox');
                    activeDeviationCheckboxes.forEach(checkbox => {
                        checkbox.addEventListener('change', (e) => {
                            const group = e.target.dataset.group;
                            const row = e.target.closest('tr');
                            const rowCheckboxes = row.querySelectorAll('.active-deviation-checkbox');
                            
                            // If checking a box
                            if (e.target.checked) {
                                // Uncheck other severity levels in same row
                                rowCheckboxes.forEach(cb => {
                                    if (cb !== e.target) cb.checked = false;
                                });

                                // Get all currently checked groups
                                const checkedGroups = Array.from(document.querySelectorAll('.active-deviation-checkbox:checked'))
                                    .map(cb => cb.closest('tr'))
                                    .map(tr => tr.querySelector('td').textContent.trim());

                                // Handle Entire Wrist selection
                                if (group === 'entire') {
                                    // Uncheck all other joints
                                    activeDeviationCheckboxes.forEach(cb => {
                                        if (cb.dataset.group === 'individual') {
                                            cb.checked = false;
                                        }
                                    });
                                } else {
                                    // Uncheck Entire Wrist if selecting any other joint
                                    activeDeviationCheckboxes.forEach(cb => {
                                        if (cb.dataset.group === 'entire') {
                                            cb.checked = false;
                                        }
                                    });

                                    // Handle specific combinations
                                    const currentJoint = row.querySelector('td').textContent.trim();
                                    
                                    if (currentJoint === 'Proximal Carpal Row') {
                                        // If selecting Proximal Carpal Row, uncheck Radiocarpal but keep Distal Radioulnar
                                        activeDeviationCheckboxes.forEach(cb => {
                                            const jointRow = cb.closest('tr');
                                            const jointName = jointRow.querySelector('td').textContent.trim();
                                            if (jointName === 'Radiocarpal') {
                                                cb.checked = false;
                                            }
                                        });
                                    } else if (currentJoint === 'Radiocarpal') {
                                        // If selecting Radiocarpal, uncheck Proximal Carpal Row
                                        activeDeviationCheckboxes.forEach(cb => {
                                            const jointRow = cb.closest('tr');
                                            const jointName = jointRow.querySelector('td').textContent.trim();
                                            if (jointName === 'Proximal Carpal Row') {
                                                cb.checked = false;
                                            }
                                        });
                                    }
                                }
                            }
                            
                            WristCalculator.calculateActiveDeviation();
                        });
                    });
                } else if (cardValue === 'wrist' && option === 'Carpal Instability Patterns') {
                    const calculatorCard = document.createElement('div');
                    calculatorCard.classList.add('calculator-card');
                    calculatorCard.innerHTML = `
                        <h3>Wrist - Carpal Instability Patterns</h3>
                        <table class="synovial-hypertrophy-table">
                            <thead>
                                <tr>
                                    <th>Roentgenographic Findings</th>
                                    <th>Mild (8% UE)</th>
                                    <th>Moderate (16% UE)</th>
                                    <th>Severe (24% UE)</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Radiolunate angle</td>
                                    <td><input type="checkbox" class="carpal-instability-checkbox" value="8"> 11°-20°</td>
                                    <td><input type="checkbox" class="carpal-instability-checkbox" value="16"> 21°-30°</td>
                                    <td><input type="checkbox" class="carpal-instability-checkbox" value="24"> >30°</td>
                                </tr>
                                <tr>
                                    <td>Scapholunate angle</td>
                                    <td><input type="checkbox" class="carpal-instability-checkbox" value="8"> 61°-70°</td>
                                    <td><input type="checkbox" class="carpal-instability-checkbox" value="16"> 71°-80°</td>
                                    <td><input type="checkbox" class="carpal-instability-checkbox" value="24"> >80°</td>
                                </tr>
                                <tr>
                                    <td>Scapholunate gap</td>
                                    <td><input type="checkbox" class="carpal-instability-checkbox" value="8"> >3 mm</td>
                                    <td><input type="checkbox" class="carpal-instability-checkbox" value="16"> >5 mm</td>
                                    <td><input type="checkbox" class="carpal-instability-checkbox" value="24"> >8 mm</td>
                                </tr>
                                <tr>
                                    <td>Triquetrolunate stepoff</td>
                                    <td><input type="checkbox" class="carpal-instability-checkbox" value="8"> >1 mm</td>
                                    <td><input type="checkbox" class="carpal-instability-checkbox" value="16"> >2 mm</td>
                                    <td><input type="checkbox" class="carpal-instability-checkbox" value="24"> >3 mm</td>
                                </tr>
                                <tr>
                                    <td>Ulnar translation</td>
                                    <td><input type="checkbox" class="carpal-instability-checkbox" value="8"> Mild</td>
                                    <td><input type="checkbox" class="carpal-instability-checkbox" value="16"> Moderate</td>
                                    <td><input type="checkbox" class="carpal-instability-checkbox" value="24"> Severe</td>
                                </tr>
                            </tbody>
                        </table>
                        <div class="instructions">
                            <p>Instructions: Select one category of severity of carpal instability based on the greatest severity of the roentgenographic findings.</p>
                        </div>
                        <div class="reference">
                            <p>Reference: Table 16-25 on page 503 of The AMA Guides 5th Ed.</p>
                        </div>
                        <p class="total-impairment"><strong>Total: <span id="wrist-carpal-instability-total">0 UE = 0 WPI</span></strong></p>
                    `;
                    calculatorsList.appendChild(calculatorCard);

                    // Add event listeners for carpal instability checkboxes
                    const carpalInstabilityCheckboxes = calculatorCard.querySelectorAll('.carpal-instability-checkbox');
                    carpalInstabilityCheckboxes.forEach(checkbox => {
                        checkbox.addEventListener('change', (e) => {
                            if (e.target.checked) {
                                // Uncheck all other checkboxes
                                carpalInstabilityCheckboxes.forEach(cb => {
                                    if (cb !== e.target) {
                                        cb.checked = false;
                                    }
                                });
                            }
                            
                            WristCalculator.calculateCarpalInstability();
                        });
                    });
                } else if (cardValue === 'thumb' && option === 'ROM') {
                    const calculatorCard = document.createElement('div');
                    calculatorCard.classList.add('calculator-card');
                    calculatorCard.innerHTML = `
                        <h3>Thumb - ROM</h3>
                        <table class="rom-table">
                            <tr>
                                <th>Joint</th>
                                <th></th>
                                <th>Flexion</th>
                                <th>Extension</th>
                                <th>Ankylosis</th>
                                <th>Imp%</th>
                            </tr>
                            <tr>
                                <td style="color: black; vertical-align: middle;" rowspan="2">IP</td>
                                <td>Angle°</td>
                                <td><input type="number" id="ip-flexion"></td>
                                <td><input type="number" id="ip-extension"></td>
                                <td><input type="number" id="ip-ankylosis"></td>
                                <td rowspan="2" id="ip-imp">0</td>
                            </tr>
                            <tr>
                                <td>Imp%</td>
                                <td id="ip-flexion-imp"></td>
                                <td id="ip-extension-imp"></td>
                                <td id="ip-ankylosis-imp"></td>
                            </tr>
                            <tr>
                                <td style="color: black; vertical-align: middle;" rowspan="2">MP</td>
                                <td>Angle°</td>
                                <td><input type="number" id="mp-flexion"></td>
                                <td><input type="number" id="mp-extension"></td>
                                <td><input type="number" id="mp-ankylosis"></td>
                                <td rowspan="2" id="mp-imp">0</td>
                            </tr>
                            <tr>
                                <td>Imp%</td>
                                <td id="mp-flexion-imp"></td>
                                <td id="mp-extension-imp"></td>
                                <td id="mp-ankylosis-imp"></td>
                            </tr>
                            <tr>
                                <th class="blue-header"></th>
                                <th class="blue-header"></th>
                                <th class="blue-header"></th>
                                <th class="blue-header">Motion</th>
                                <th class="blue-header">Ankylosis</th>
                                <th class="blue-header">Imp%</th>
                            </tr>
                            <tr>
                                <td style="color: black;" rowspan="6">CMC</td>
                                <td rowspan="2">Radial Abduction</td>
                                <td>Angle°</td>
                                <td><input type="number" id="radial-abduction"></td>
                                <td><input type="number" id="radial-abduction-ankylosis"></td>
                                <td rowspan="2" id="radial-abduction-imp">0</td>
                            </tr>
                            <tr>
                                <td>Imp%</td>
                                <td id="radial-abduction-motion-imp"></td>
                                <td id="radial-abduction-ankylosis-imp"></td>
                            </tr>
                            <tr>
                                <td rowspan="2">Adduction</td>
                                <td>CM</td>
                                <td><input type="number" id="cmc-adduction" step="0.1"></td>
                                <td><input type="number" id="cmc-adduction-ankylosis" step="0.1"></td>
                                <td rowspan="2" id="cmc-adduction-imp">0</td>
                            </tr>
                            <tr>
                                <td>Imp%</td>
                                <td id="cmc-adduction-motion-imp"></td>
                                <td id="cmc-adduction-ankylosis-imp"></td>
                            </tr>
                            <tr>
                                <td rowspan="2">Opposition</td>
                                <td>CM</td>
                                <td><input type="number" id="opposition" step="0.1"></td>
                                <td><input type="number" id="opposition-ankylosis" step="0.1"></td>
                                <td rowspan="2" id="opposition-imp">0</td>
                            </tr>
                            <tr>
                                <td>Imp%</td>
                                <td id="opposition-motion-imp"></td>
                                <td id="opposition-ankylosis-imp"></td>
                            </tr>
                        </table>
                        <div class="instructions">
                            <p>Instructions: Enter the measurements provided by physician for each thumb joint as applicable.</p>
                        </div>
                        <div class="reference">
                            <p>Reference: Figures 16-12 & 16-15 on pages 456 & 457 and Tables 16-8a, 16-8b & 16-9 on pages 459 & 460 of The AMA Guides 5th Ed. Digit impairment values contributed by each motion unit within the thumb are added together per page 460 of The Guides.</p>
                        </div>
                        <div id="total-imp" style="text-align: left; color: #000000; font-weight: bold; padding-left: 0;">Total: 0 DT = 0 HD</div>
                    `;
                    calculatorsList.appendChild(calculatorCard);

                    // Add event listeners for inputs
                    const inputs = calculatorCard.querySelectorAll('input[type="number"]');
                    inputs.forEach(input => {
                        input.addEventListener('input', () => {
                            ThumbCalculator.calculateROM();
                        });
                    });
                } else if (cardValue === 'index' && option === 'ROM') {
                    const calculatorCard = document.createElement('div');
                    calculatorCard.classList.add('calculator-card');
                    calculatorCard.innerHTML = `
                        <h3>Index Finger - ROM</h3>
                        <table class="rom-table">
                            <tr>
                                <th>Joint</th>
                                <th></th>
                                <th>Flexion</th>
                                <th>Extension</th>
                                <th>Ankylosis</th>
                                <th>Imp%</th>
                            </tr>
                            <tr>
                                <td rowspan="2">DIP</td>
                                <td>Angle°</td>
                                <td><input type="number" id="dip-flexion" oninput="window.IndexCalculator.calculateROM()"></td>
                                <td><input type="number" id="dip-extension" oninput="window.IndexCalculator.calculateROM()"></td>
                                <td><input type="number" id="dip-ankylosis" oninput="window.IndexCalculator.calculateROM()"></td>
                                <td rowspan="2" id="dip-imp">0</td>
                            </tr>
                            <tr>
                                <td>Imp%</td>
                                <td id="dip-flexion-imp"></td>
                                <td id="dip-extension-imp"></td>
                                <td id="dip-ankylosis-imp"></td>
                            </tr>
                            <tr>
                                <td rowspan="2">PIP</td>
                                <td>Angle°</td>
                                <td><input type="number" id="pip-flexion" oninput="window.IndexCalculator.calculateROM()"></td>
                                <td><input type="number" id="pip-extension" oninput="window.IndexCalculator.calculateROM()"></td>
                                <td><input type="number" id="pip-ankylosis" oninput="window.IndexCalculator.calculateROM()"></td>
                                <td rowspan="2" id="pip-imp">0</td>
                            </tr>
                            <tr>
                                <td>Imp%</td>
                                <td id="pip-flexion-imp"></td>
                                <td id="pip-extension-imp"></td>
                                <td id="pip-ankylosis-imp"></td>
                            </tr>
                            <tr>
                                <td rowspan="2">MP</td>
                                <td>Angle°</td>
                                <td><input type="number" id="index-mp-flexion" oninput="window.IndexCalculator.calculateROM()"></td>
                                <td><input type="number" id="index-mp-extension" oninput="window.IndexCalculator.calculateROM()"></td>
                                <td><input type="number" id="index-mp-ankylosis" oninput="window.IndexCalculator.calculateROM()"></td>
                                <td rowspan="2" id="index-mp-imp">0</td>
                            </tr>
                            <tr>
                                <td>Imp%</td>
                                <td id="index-mp-flexion-imp"></td>
                                <td id="index-mp-extension-imp"></td>
                                <td id="index-mp-ankylosis-imp"></td>
                            </tr>
                        </table>
                        <div class="instructions" style="margin-bottom: 5px;">
                            <p>Instructions: Enter the measurements provided by physician for each finger joint as applicable.</p>
                        </div>
                        <div class="reference" style="margin-bottom: 5px;">
                            <p>Reference: Figures 16-21, 16-23 & 16-25 on pages 461 - 464 of The AMA Guides 5th Ed. Flexion & extension impairments within a joint are added together, then total joint impairments are combined using the CVC per pages 461 - 465 of The Guides.</p>
                        </div>
                        <p style="text-align: left;"><strong>Total: <span id="index-rom-total">0 DT = 0 HD</span></strong></p>
                    `;
                    calculatorsList.appendChild(calculatorCard);

                    // Make IndexCalculator available globally
                    window.IndexCalculator = IndexCalculator;
                } else if (cardValue === 'middle' && option === 'ROM') {
                    const calculatorCard = document.createElement('div');
                    calculatorCard.classList.add('calculator-card');
                    calculatorCard.innerHTML = `
                        <h3>Middle Finger - ROM</h3>
                        <table class="rom-table">
                            <tr>
                                <th>Joint</th>
                                <th></th>
                                <th>Flexion</th>
                                <th>Extension</th>
                                <th>Ankylosis</th>
                                <th>Imp%</th>
                            </tr>
                            <tr>
                                <td rowspan="2">DIP</td>
                                <td>Angle°</td>
                                <td><input type="number" id="middle-dip-flexion" oninput="window.MiddleCalculator.calculateROM()"></td>
                                <td><input type="number" id="middle-dip-extension" oninput="window.MiddleCalculator.calculateROM()"></td>
                                <td><input type="number" id="middle-dip-ankylosis" oninput="window.MiddleCalculator.calculateROM()"></td>
                                <td rowspan="2" id="middle-dip-imp">0</td>
                            </tr>
                            <tr>
                                <td>Imp%</td>
                                <td id="middle-dip-flexion-imp"></td>
                                <td id="middle-dip-extension-imp"></td>
                                <td id="middle-dip-ankylosis-imp"></td>
                            </tr>
                            <tr>
                                <td rowspan="2">PIP</td>
                                <td>Angle°</td>
                                <td><input type="number" id="middle-pip-flexion" oninput="window.MiddleCalculator.calculateROM()"></td>
                                <td><input type="number" id="middle-pip-extension" oninput="window.MiddleCalculator.calculateROM()"></td>
                                <td><input type="number" id="middle-pip-ankylosis" oninput="window.MiddleCalculator.calculateROM()"></td>
                                <td rowspan="2" id="middle-pip-imp">0</td>
                            </tr>
                            <tr>
                                <td>Imp%</td>
                                <td id="middle-pip-flexion-imp"></td>
                                <td id="middle-pip-extension-imp"></td>
                                <td id="middle-pip-ankylosis-imp"></td>
                            </tr>
                            <tr>
                                <td rowspan="2">MP</td>
                                <td>Angle°</td>
                                <td><input type="number" id="middle-mp-flexion" oninput="window.MiddleCalculator.calculateROM()"></td>
                                <td><input type="number" id="middle-mp-extension" oninput="window.MiddleCalculator.calculateROM()"></td>
                                <td><input type="number" id="middle-mp-ankylosis" oninput="window.MiddleCalculator.calculateROM()"></td>
                                <td rowspan="2" id="middle-mp-imp">0</td>
                            </tr>
                            <tr>
                                <td>Imp%</td>
                                <td id="middle-mp-flexion-imp"></td>
                                <td id="middle-mp-extension-imp"></td>
                                <td id="middle-mp-ankylosis-imp"></td>
                            </tr>
                        </table>
                        <div class="instructions" style="margin-bottom: 5px;">
                            <p>Instructions: Enter the measurements provided by physician for each finger joint as applicable.</p>
                        </div>
                        <div class="reference" style="margin-bottom: 5px;">
                            <p>Reference: Figures 16-21, 16-23 & 16-25 on pages 461 - 464 of The AMA Guides 5th Ed. Flexion & extension impairments within a joint are added together, then total joint impairments are combined using the CVC per pages 461 - 465 of The Guides.</p>
                        </div>
                        <p style="text-align: left;"><strong>Total: <span id="middle-rom-total">0 DT = 0 HD</span></strong></p>
                    `;
                    calculatorsList.appendChild(calculatorCard);

                    // Make MiddleCalculator available globally
                    window.MiddleCalculator = MiddleCalculator;
                } else if (cardValue === 'ring' && option === 'ROM') {
                    const calculatorCard = document.createElement('div');
                    calculatorCard.classList.add('calculator-card');
                    calculatorCard.innerHTML = `
                        <h3>Ring Finger - ROM</h3>
                        <table class="rom-table">
                            <tr>
                                <th>Joint</th>
                                <th></th>
                                <th>Flexion</th>
                                <th>Extension</th>
                                <th>Ankylosis</th>
                                <th>Imp%</th>
                            </tr>
                            <tr>
                                <td rowspan="2">DIP</td>
                                <td>Angle°</td>
                                <td><input type="number" id="ring-dip-flexion" oninput="window.RingCalculator.calculateROM()"></td>
                                <td><input type="number" id="ring-dip-extension" oninput="window.RingCalculator.calculateROM()"></td>
                                <td><input type="number" id="ring-dip-ankylosis" oninput="window.RingCalculator.calculateROM()"></td>
                                <td rowspan="2" id="ring-dip-imp">0</td>
                            </tr>
                            <tr>
                                <td>Imp%</td>
                                <td id="ring-dip-flexion-imp"></td>
                                <td id="ring-dip-extension-imp"></td>
                                <td id="ring-dip-ankylosis-imp"></td>
                            </tr>
                            <tr>
                                <td rowspan="2">PIP</td>
                                <td>Angle°</td>
                                <td><input type="number" id="ring-pip-flexion" oninput="window.RingCalculator.calculateROM()"></td>
                                <td><input type="number" id="ring-pip-extension" oninput="window.RingCalculator.calculateROM()"></td>
                                <td><input type="number" id="ring-pip-ankylosis" oninput="window.RingCalculator.calculateROM()"></td>
                                <td rowspan="2" id="ring-pip-imp">0</td>
                            </tr>
                            <tr>
                                <td>Imp%</td>
                                <td id="ring-pip-flexion-imp"></td>
                                <td id="ring-pip-extension-imp"></td>
                                <td id="ring-pip-ankylosis-imp"></td>
                            </tr>
                            <tr>
                                <td rowspan="2">MP</td>
                                <td>Angle°</td>
                                <td><input type="number" id="ring-mp-flexion" oninput="window.RingCalculator.calculateROM()"></td>
                                <td><input type="number" id="ring-mp-extension" oninput="window.RingCalculator.calculateROM()"></td>
                                <td><input type="number" id="ring-mp-ankylosis" oninput="window.RingCalculator.calculateROM()"></td>
                                <td rowspan="2" id="ring-mp-imp">0</td>
                            </tr>
                            <tr>
                                <td>Imp%</td>
                                <td id="ring-mp-flexion-imp"></td>
                                <td id="ring-mp-extension-imp"></td>
                                <td id="ring-mp-ankylosis-imp"></td>
                            </tr>
                        </table>
                        <div class="instructions" style="margin-bottom: 5px;">
                            <p>Instructions: Enter the measurements provided by physician for each finger joint as applicable.</p>
                        </div>
                        <div class="reference" style="margin-bottom: 5px;">
                            <p>Reference: Figures 16-21, 16-23 & 16-25 on pages 461 - 464 of The AMA Guides 5th Ed. Flexion & extension impairments within a joint are added together, then total joint impairments are combined using the CVC per pages 461 - 465 of The Guides.</p>
                        </div>
                        <p style="text-align: left;"><strong>Total: <span id="ring-rom-total">0 DT = 0 HD</span></strong></p>
                    `;
                    calculatorsList.appendChild(calculatorCard);

                    // Make RingCalculator available globally
                    window.RingCalculator = RingCalculator;
                } else if (cardValue === 'little' && option === 'ROM') {
                    const calculatorCard = document.createElement('div');
                    calculatorCard.classList.add('calculator-card');
                    calculatorCard.innerHTML = `
                        <h3>Little Finger - ROM</h3>
                        <table class="rom-table">
                            <tr>
                                <th>Joint</th>
                                <th></th>
                                <th>Flexion</th>
                                <th>Extension</th>
                                <th>Ankylosis</th>
                                <th>Imp%</th>
                            </tr>
                            <tr>
                                <td rowspan="2">DIP</td>
                                <td>Angle°</td>
                                <td><input type="number" id="little-dip-flexion" oninput="window.LittleCalculator.calculateROM()"></td>
                                <td><input type="number" id="little-dip-extension" oninput="window.LittleCalculator.calculateROM()"></td>
                                <td><input type="number" id="little-dip-ankylosis" oninput="window.LittleCalculator.calculateROM()"></td>
                                <td rowspan="2" id="little-dip-imp">0</td>
                            </tr>
                            <tr>
                                <td>Imp%</td>
                                <td id="little-dip-flexion-imp"></td>
                                <td id="little-dip-extension-imp"></td>
                                <td id="little-dip-ankylosis-imp"></td>
                            </tr>
                            <tr>
                                <td rowspan="2">PIP</td>
                                <td>Angle°</td>
                                <td><input type="number" id="little-pip-flexion" oninput="window.LittleCalculator.calculateROM()"></td>
                                <td><input type="number" id="little-pip-extension" oninput="window.LittleCalculator.calculateROM()"></td>
                                <td><input type="number" id="little-pip-ankylosis" oninput="window.LittleCalculator.calculateROM()"></td>
                                <td rowspan="2" id="little-pip-imp">0</td>
                            </tr>
                            <tr>
                                <td>Imp%</td>
                                <td id="little-pip-flexion-imp"></td>
                                <td id="little-pip-extension-imp"></td>
                                <td id="little-pip-ankylosis-imp"></td>
                            </tr>
                            <tr>
                                <td rowspan="2">MP</td>
                                <td>Angle°</td>
                                <td><input type="number" id="little-mp-flexion" oninput="window.LittleCalculator.calculateROM()"></td>
                                <td><input type="number" id="little-mp-extension" oninput="window.LittleCalculator.calculateROM()"></td>
                                <td><input type="number" id="little-mp-ankylosis" oninput="window.LittleCalculator.calculateROM()"></td>
                                <td rowspan="2" id="little-mp-imp">0</td>
                            </tr>
                            <tr>
                                <td>Imp%</td>
                                <td id="little-mp-flexion-imp"></td>
                                <td id="little-mp-extension-imp"></td>
                                <td id="little-mp-ankylosis-imp"></td>
                            </tr>
                        </table>
                        <div class="instructions" style="margin-bottom: 5px;">
                            <p>Instructions: Enter the measurements provided by physician for each finger joint as applicable.</p>
                        </div>
                        <div class="reference" style="margin-bottom: 5px;">
                            <p>Reference: Figures 16-21, 16-23 & 16-25 on pages 461 - 464 of The AMA Guides 5th Ed. Flexion & extension impairments within a joint are added together, then total joint impairments are combined using the CVC per pages 461 - 465 of The Guides.</p>
                        </div>
                        <p style="text-align: left;"><strong>Total: <span id="little-rom-total">0 DT = 0 HD</span></strong></p>
                    `;
                    calculatorsList.appendChild(calculatorCard);

                    // Make LittleCalculator available globally
                    window.LittleCalculator = LittleCalculator;
                } else if (cardValue === 'little' && option === 'Sensory') {
                    const calculatorCard = document.createElement('div');
                    calculatorCard.classList.add('calculator-card');
                    calculatorCard.innerHTML = `
                        <h3>Little Finger - Sensory</h3>
                        <div style="margin: 20px 0;">
                            <label for="little-sensory-input">Enter impairment value: </label>
                            <input type="number" id="little-sensory-input" min="0" max="100" style="width: 60px;">
                        </div>
                        <p style="text-align: left;"><strong>Total: <span id="little-sensory-total">0 DT = 0 HD</span></strong></p>
                    `;
                    calculatorsList.appendChild(calculatorCard);

                    // Add event listener for the input
                    const sensoryInput = calculatorCard.querySelector('#little-sensory-input');
                    sensoryInput.addEventListener('input', () => {
                        const value = parseInt(sensoryInput.value) || 0;
                        const handValue = Math.round(value * 0.10); // 10% conversion for little finger
                        document.getElementById('little-sensory-total').textContent = `${value} DT = ${handValue} HD`;
                    });
                } else if (cardValue === 'thumb' && option === 'Arthroplasty') {
                    const calculatorCard = document.createElement('div');
                    calculatorCard.classList.add('calculator-card');
                    calculatorCard.innerHTML = `
                        <h3>Thumb - Arthroplasty</h3>
                        <div class="arthroplasty-options">
                            <div class="arthroplasty-option thumb-arthroplasty">
                                <input type="checkbox" id="thumb-arthroplasty-cmc-implant" value="9" data-group="cmc">
                                <label for="thumb-arthroplasty-cmc-implant">CMC Implant Arthroplasty (9 UE)</label>
                            </div>
                            <div class="arthroplasty-option thumb-arthroplasty">
                                <input type="checkbox" id="thumb-arthroplasty-cmc-resection" value="11" data-group="cmc">
                                <label for="thumb-arthroplasty-cmc-resection">CMC Resection Arthroplasty (11 UE)</label>
                            </div>
                            <div class="arthroplasty-option thumb-arthroplasty">
                                <input type="checkbox" id="thumb-arthroplasty-mp-implant" value="2" data-group="mp">
                                <label for="thumb-arthroplasty-mp-implant">MP Implant Arthroplasty (2 UE)</label>
                            </div>
                            <div class="arthroplasty-option thumb-arthroplasty">
                                <input type="checkbox" id="thumb-arthroplasty-mp-resection" value="3" data-group="mp">
                                <label for="thumb-arthroplasty-mp-resection">MP Resection Arthroplasty (3 UE)</label>
                            </div>
                            <div class="arthroplasty-option thumb-arthroplasty">
                                <input type="checkbox" id="thumb-arthroplasty-ip-implant" value="4" data-group="ip">
                                <label for="thumb-arthroplasty-ip-implant">IP Implant Arthroplasty (4 UE)</label>
                            </div>
                            <div class="arthroplasty-option thumb-arthroplasty">
                                <input type="checkbox" id="thumb-arthroplasty-ip-resection" value="5" data-group="ip">
                                <label for="thumb-arthroplasty-ip-resection">IP Resection Arthroplasty (5 UE)</label>
                            </div>
                        </div>
                        <div class="instructions" style="margin-bottom: 10px;">
                            <p>Instructions: Select the applicable arthroplasty(ies).</p>
                        </div>
                        <div class="reference" style="margin-bottom: 10px;">
                            <p>Reference: Table 16-27 on page 506 of The AMA Guides 5th Ed.</p>
                        </div>
                        <div id="thumb-arthroplasty-combined" style="text-align: left; margin-bottom: 10px;"></div>
                        <p class="total-impairment"><strong>Total: <span id="thumb-arthroplasty-total">0 UE = 0 WPI</span></strong></p>
                    `;
                    calculatorsList.appendChild(calculatorCard);

                    // Add event listeners for arthroplasty checkboxes
                    const thumbArthroplastyCheckboxes = calculatorCard.querySelectorAll('.thumb-arthroplasty input[type="checkbox"]');
                    thumbArthroplastyCheckboxes.forEach(checkbox => {
                        checkbox.addEventListener('change', (e) => {
                            if (e.target.checked) {
                                // Get all checkboxes in the same joint group
                                const group = e.target.dataset.group;
                                thumbArthroplastyCheckboxes.forEach(cb => {
                                    if (cb !== e.target && cb.dataset.group === group) {
                                        cb.checked = false;
                                    }
                                });
                            }
                            
                            // Calculate total impairment
                            const checkedBoxes = Array.from(thumbArthroplastyCheckboxes)
                                .filter(cb => cb.checked);
                            
                            const checkedValues = checkedBoxes
                                .map(cb => parseInt(cb.value))
                                .sort((a, b) => b - a); // Sort values in descending order
                            
                            let ueValue = 0;
                            if (checkedValues.length > 0) {
                                // Combine values using Combined Values Chart
                                ueValue = checkedValues.reduce((acc, val) => {
                                    if (acc === 0) return val;
                                    // Use the Combined Values Chart formula: A + B(1 - A/100)
                                    return Math.round(acc + val * (1 - acc/100));
                                }, 0);

                                // Only show combined values text if there are multiple selections
                                if (checkedValues.length > 1) {
                                    const combinedText = checkedValues.join(' C ') + ' = ' + ueValue + ' UE';
                                    document.getElementById('thumb-arthroplasty-combined').textContent = 'Combined: ' + combinedText;
                                } else {
                                    document.getElementById('thumb-arthroplasty-combined').textContent = '';
                                }
                            } else {
                                document.getElementById('thumb-arthroplasty-combined').textContent = '';
                            }
                            
                            const wpiValue = Math.round(ueValue * 0.6);
                            document.getElementById('thumb-arthroplasty-total').textContent = `${ueValue} UE = ${wpiValue} WPI`;
                        });
                    });
                }
                // Add other calculator types here (Strength, Arthroplasty, etc.)
            });

            // Create a total impairment card for each body part
            const totalImpairmentCard = document.createElement('div');
            totalImpairmentCard.classList.add('calculator-card');
            totalImpairmentCard.innerHTML = `
                <div id="totalImpairment-${cardValue}"></div>
            `;
            calculatorsList.appendChild(totalImpairmentCard);
        });

        // Create single overall Total Impairment card at the end
        const overallTotalCard = document.createElement('div');
        overallTotalCard.classList.add('calculator-card', 'overall-total');
        overallTotalCard.id = 'overallTotalCard';
        overallTotalCard.innerHTML = `
            <h3>Total Impairment</h3>
            <div id="overallTotalImpairment"></div>
        `;
        calculatorsList.appendChild(overallTotalCard);

        // Initial update of the overall total
        setTimeout(() => {
            updateOverallTotalImpairment();
        }, 100);
    }

    function handleFinalizeImpairment() {
        console.log("Finalizing impairment calculation");
        // Implement finalization logic here
    }

    // Initialize calculator
    setupEventListeners();
}); 

// Function to show calculators content after proceeding
function showCalculatorsContent(options) {
    document.getElementById('optionsContainer').style.display = 'none';
    document.getElementById('calculatorsContainer').style.display = 'block';
    // Continue with the rest of your calculator display logic...
}

// Add this to your showCalculator function if you have one
function showCalculator(calculatorId) {
    // Hide all calculator sections
    const calculatorSections = document.querySelectorAll('.calculator-section');
    calculatorSections.forEach(section => section.style.display = 'none');

    // Show the selected calculator section
    const selectedSection = document.getElementById(calculatorId);
    if (selectedSection) {
        selectedSection.style.display = 'block';
    }
}
