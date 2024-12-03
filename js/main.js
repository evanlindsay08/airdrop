document.addEventListener('DOMContentLoaded', function() {
    // Get all necessary elements
    const overlay = document.getElementById('tutorialOverlay');
    const nextBtn = document.getElementById('nextStep');
    const prevBtn = document.getElementById('prevStep');
    const steps = document.querySelectorAll('.step');
    const dotsContainer = document.querySelector('.step-dots');
    let currentStep = 1;
    const totalSteps = steps.length;

    // Create dots
    for (let i = 0; i < totalSteps; i++) {
        const dot = document.createElement('div');
        dot.className = 'dot' + (i === 0 ? ' active' : '');
        dotsContainer.appendChild(dot);
    }

    // Function to update step display
    function updateStep(stepNumber) {
        // Hide all steps
        steps.forEach(step => step.classList.remove('active'));
        
        // Show current step
        steps[stepNumber - 1].classList.add('active');
        
        // Update dots
        const dots = dotsContainer.querySelectorAll('.dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === stepNumber - 1);
        });
        
        // Update buttons
        prevBtn.disabled = stepNumber === 1;
        nextBtn.textContent = stepNumber === totalSteps ? 'Finish' : 'Next';
        
        currentStep = stepNumber;
    }

    // Next button click handler
    nextBtn.addEventListener('click', () => {
        if (currentStep === totalSteps) {
            // If on last step, close tutorial
            localStorage.setItem('tutorialSeen', 'true');
            overlay.style.display = 'none';
        } else {
            // Go to next step
            updateStep(currentStep + 1);
        }
    });

    // Previous button click handler
    prevBtn.addEventListener('click', () => {
        if (currentStep > 1) {
            updateStep(currentStep - 1);
        }
    });

    // Show tutorial if first visit
    if (!localStorage.getItem('tutorialSeen')) {
        overlay.style.display = 'flex';
        updateStep(1);
    } else {
        overlay.style.display = 'none';
    }

    // Help button to reopen tutorial
    const helpBtn = document.getElementById('showTutorial');
    if (helpBtn) {
        helpBtn.addEventListener('click', () => {
            overlay.style.display = 'flex';
            updateStep(1);
        });
    }

    // Copy address functionality
    const copyBtn = document.getElementById('copyAddress');
    copyBtn.addEventListener('click', function() {
        const address = 'DsXCHZVsg38wewrAtwQyjAe6s42twkbtw7eUv8rxXBp8';
        navigator.clipboard.writeText(address).then(() => {
            copyBtn.innerHTML = '<i class="fas fa-check"></i>';
            setTimeout(() => {
                copyBtn.innerHTML = '<i class="fas fa-copy"></i>';
            }, 2000);
        });
    });

    // Validate Addresses Button
    document.getElementById('validateAddresses').addEventListener('click', function() {
        console.log('Validate button clicked'); // Debug log
        const textarea = document.getElementById('recipientsList');
        const addresses = textarea.value.split('\n').filter(line => line.trim() !== '');
        
        if (addresses.length === 0) {
            window.alert('Please enter addresses to validate.');
            return;
        }

        let validCount = 0;
        let invalidCount = 0;
        let validAddresses = [];

        addresses.forEach(line => {
            const [address] = line.split(',').map(item => item.trim());
            if (address && address.length >= 32 && address.length <= 44) {
                validCount++;
                validAddresses.push(line);
            } else {
                invalidCount++;
            }
        });

        // Update textarea with valid addresses
        textarea.value = validAddresses.join('\n');

        // Show results in alert
        window.alert(`Validation Results:\n\nValid Addresses: ${validCount}\nInvalid Addresses: ${invalidCount}`);
        
        // Update counts
        document.getElementById('totalRecipients').textContent = validCount;
        document.getElementById('recipientCount').textContent = validCount;
    });

    // CSV Import functionality
    document.getElementById('importCsv').addEventListener('click', function() {
        console.log('Import CSV clicked'); // Debug log
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.csv';
        
        input.onchange = function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    const content = event.target.result;
                    const lines = content.split('\n')
                        .filter(line => line.trim())
                        .map(line => line.trim());

                    document.getElementById('recipientsList').value = lines.join('\n');
                    window.alert(`Imported ${lines.length} addresses from CSV.`);
                    
                    // Update counts
                    document.getElementById('totalRecipients').textContent = lines.length;
                    document.getElementById('recipientCount').textContent = lines.length;
                };
                reader.readAsText(file);
            }
        };

        input.click();
    });

    // Start Airdrop Button
    document.getElementById('startAirdrop').addEventListener('click', function() {
        console.log('Start Airdrop clicked'); // Debug log
        const recipients = document.getElementById('recipientsList').value.trim();
        
        if (!recipients) {
            window.alert('Please add recipient addresses before starting the airdrop.');
            return;
        }

        const recipientCount = document.getElementById('recipientCount').textContent;
        const distributionType = document.querySelector('input[name="distributionType"]:checked').value;
        
        // Show confirmation dialog
        const confirmMessage = 
            'Confirm Airdrop Details:\n\n' +
            `Number of Recipients: ${recipientCount}\n` +
            `Distribution Type: ${distributionType}\n\n` +
            'Are you sure you want to start the airdrop?';

        if (window.confirm(confirmMessage)) {
            window.alert('Airdrop initiated! Please wait for confirmation.');
            // Here you would add the actual airdrop logic
        }
    });

    // Helper function to update recipient count
    function updateRecipientCount() {
        const textarea = document.getElementById('recipientsList');
        const count = textarea.value.split('\n').filter(line => line.trim()).length;
        document.getElementById('totalRecipients').textContent = count;
        document.getElementById('recipientCount').textContent = count;
    }

    // Add listener for textarea changes
    document.getElementById('recipientsList').addEventListener('input', updateRecipientCount);
});
