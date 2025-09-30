function showErrorToast(message) {
            const toastContainer = document.getElementById('toastContainer');
            const toast = document.createElement('div');
            toast.className = 'error-toast';
            toast.innerHTML = `
                <span class="error-icon">⚠️</span>
                <span>${message}</span>
            `;
            
            toastContainer.appendChild(toast);
            
            setTimeout(() => {
                toast.classList.add('hiding');
                setTimeout(() => {
                    toast.remove();
                }, 300);
            }, 3000);
        }
        
        // Restrict key inputs to numbers only
        document.addEventListener('DOMContentLoaded', function() {
            const keyInputs = ['monoKey', 'polyKey'];
            keyInputs.forEach(id => {
                const input = document.getElementById(id);
                if (input) {
                    input.addEventListener('input', function(e) {
                        this.value = this.value.replace(/[^0-9]/g, '');
                    });
                }
            });
            
            // Vigenere key accepts numbers and commas only
            const vigenereKeyInput = document.getElementById('vigenereKey');
            if (vigenereKeyInput) {
                vigenereKeyInput.addEventListener('input', function(e) {
                    this.value = this.value.replace(/[^0-9,\s]/g, '');
                });
            }
            
            // Restrict plain text inputs to letters only
            const plainTextInputs = ['monoPlainText', 'polyPlainText', 'vigenerePlainText'];
            plainTextInputs.forEach(id => {
                const input = document.getElementById(id);
                if (input) {
                    input.addEventListener('input', function(e) {
                        this.value = this.value.replace(/[^a-zA-Z\s]/g, '');
                    });
                }
            });
        });
        
        function selectCipher(type) {
            document.getElementById('selectionScreen').style.display = 'none';
            if (type === 'mono') {
                document.getElementById('monoCipher').classList.add('active');
            } else if (type === 'poly') {
                document.getElementById('polyCipher').classList.add('active');
            } else if (type === 'vigenere') {
                document.getElementById('vigenereCipher').classList.add('active');
            }
        }
        
        function goBack() {
            document.querySelectorAll('.cipher-container').forEach(el => {
                el.classList.remove('active');
            });
            document.getElementById('selectionScreen').style.display = 'block';
            
            // Clear inputs
            document.querySelectorAll('.input-box').forEach(input => input.value = '');
            document.querySelectorAll('.output-box').forEach(output => output.textContent = '');
        }
        
        function resetMono() {
            document.getElementById('monoPlainText').value = '';
            document.getElementById('monoKey').value = '';
            document.getElementById('monoOutput').textContent = '';
        }
        
        function resetPoly() {
            document.getElementById('polyPlainText').value = '';
            document.getElementById('polyKey').value = '';
            document.getElementById('polyOutput').textContent = '';
        }
        
        function resetVigenere() {
            document.getElementById('vigenerePlainText').value = '';
            document.getElementById('vigenereKey').value = '';
            document.getElementById('vigenereOutput').textContent = '';
        }
        
        function processMonoCipher() {
            const plainText = document.getElementById('monoPlainText').value.toUpperCase();
            const key = parseInt(document.getElementById('monoKey').value);
            
            if (!plainText || isNaN(key)) {
                showErrorToast('Please enter both plain text and key!');
                return;
            }
            
            const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
            let cipherText = '';
            
            for (let char of plainText) {
                if (alphabet.includes(char)) {
                    const index = alphabet.indexOf(char);
                    const newIndex = (index + key) % 26;
                    cipherText += alphabet[newIndex];
                } else {
                    cipherText += char;
                }
            }
            
            document.getElementById('monoOutput').textContent = cipherText;
        }
        
        function processPolyCipher() {
            const plainText = document.getElementById('polyPlainText').value.toUpperCase();
            const key = parseInt(document.getElementById('polyKey').value);
            
            if (!plainText || isNaN(key)) {
                showErrorToast('Please enter both plain text and key!');
                return;
            }
            
            const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
            let cipherText = '';
            let prevCharValue = key; // First subkey is predefined (the key input)
            
            for (let i = 0; i < plainText.length; i++) {
                const char = plainText[i];
                if (alphabet.includes(char)) {
                    const charValue = alphabet.indexOf(char);
                    const currentKey = prevCharValue;
                    const newValue = (charValue + currentKey) % 26;
                    cipherText += alphabet[newValue];
                    prevCharValue = charValue; // Next subkey is the value of current plaintext character
                } else {
                    cipherText += char;
                }
            }
            
            document.getElementById('polyOutput').textContent = cipherText;
        }
        
        function processVigenereCipher() {
            const plainText = document.getElementById('vigenerePlainText').value.toUpperCase();
            const keyInput = document.getElementById('vigenereKey').value;
            
            if (!plainText || !keyInput) {
                showErrorToast('Please enter both plain text and key!');
                return;
            }
            
            // Parse the key as comma-separated numbers
            const keyArray = keyInput.split(',').map(k => parseInt(k.trim())).filter(k => !isNaN(k));
            
            if (keyArray.length === 0) {
                showErrorToast('Please enter valid numbers separated by commas (e.g., 0,5,8)');
                return;
            }
            
            const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
            let cipherText = '';
            let keyIndex = 0;
            
            for (let char of plainText) {
                if (alphabet.includes(char)) {
                    const charPos = alphabet.indexOf(char);
                    const keyShift = keyArray[keyIndex % keyArray.length];
                    const newPos = (charPos + keyShift) % 26;
                    cipherText += alphabet[newPos];
                    keyIndex++;
                } else {
                    cipherText += char;
                }
            }
            
            document.getElementById('vigenereOutput').textContent = cipherText;
        }