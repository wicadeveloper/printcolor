document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const gradientDisplay = document.getElementById('gradientDisplay');
    const color1Input = document.getElementById('color1');
    const color2Input = document.getElementById('color2');
    const color1Value = document.getElementById('color1Value');
    const color2Value = document.getElementById('color2Value');
    const gradientType = document.getElementById('gradientType');
    const degree = document.getElementById('degree');
    const degreeValue = document.getElementById('degreeValue');
    const degreeOption = document.getElementById('degreeOption');
    const cssCode = document.getElementById('cssCode');
    const randomizeBtn = document.getElementById('randomizeBtn');
    const savedGradientsGrid = document.getElementById('savedGradientsGrid');
    const toast = document.getElementById('toast');
    const copyButtons = document.querySelectorAll('.copy-btn');
    
    // Load saved gradients from localStorage
    let savedGradients = JSON.parse(localStorage.getItem('savedGradients')) || [];
    
    // Initialize the app
    updateGradient();
    renderSavedGradients();
    
    // Event Listeners
    color1Input.addEventListener('input', function() {
        color1Value.textContent = this.value;
        updateGradient();
    });
    
    color2Input.addEventListener('input', function() {
        color2Value.textContent = this.value;
        updateGradient();
    });
    
    gradientType.addEventListener('change', function() {
        if (this.value === 'radial') {
            degreeOption.style.display = 'none';
        } else {
            degreeOption.style.display = 'flex';
        }
        updateGradient();
    });
    
    degree.addEventListener('input', function() {
        degreeValue.textContent = this.value + '°';
        updateGradient();
    });
    
    randomizeBtn.addEventListener('click', randomizeColors);
    
    // Copy functionality
    copyButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            const targetElement = document.getElementById(targetId);
            const textToCopy = targetElement.textContent;
            
            navigator.clipboard.writeText(textToCopy)
                .then(() => showToast())
                .catch(err => console.error('Failed to copy: ', err));
        });
    });
    
    // Double-click to save gradient
    gradientDisplay.addEventListener('dblclick', saveGradient);
    
    // Functions
    function updateGradient() {
        const color1 = color1Input.value;
        const color2 = color2Input.value;
        const type = gradientType.value;
        const degreeVal = degree.value;
        
        let gradientCSS;
        let cssCodeText;
        
        if (type === 'linear') {
            gradientCSS = `linear-gradient(${degreeVal}deg, ${color1}, ${color2})`;
            cssCodeText = `background: linear-gradient(${degreeVal}deg, ${color1}, ${color2});`;
        } else {
            gradientCSS = `radial-gradient(circle, ${color1}, ${color2})`;
            cssCodeText = `background: radial-gradient(circle, ${color1}, ${color2});`;
        }
        
        gradientDisplay.style.background = gradientCSS;
        cssCode.textContent = cssCodeText;
    }
    
    function randomizeColors() {
        const randomColor1 = getRandomColor();
        const randomColor2 = getRandomColor();
        
        color1Input.value = randomColor1;
        color2Input.value = randomColor2;
        color1Value.textContent = randomColor1;
        color2Value.textContent = randomColor2;
        
        updateGradient();
    }
    
    function getRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }
    
    function saveGradient() {
        const color1 = color1Input.value;
        const color2 = color2Input.value;
        const type = gradientType.value;
        const degreeVal = type === 'linear' ? degree.value : null;
        
        const gradientData = {
            color1,
            color2,
            type,
            degree: degreeVal,
            id: Date.now()
        };
        
        savedGradients.push(gradientData);
        localStorage.setItem('savedGradients', JSON.stringify(savedGradients));
        
        renderSavedGradients();
        showToast('Gradient saved!');
    }
    
    function renderSavedGradients() {
        savedGradientsGrid.innerHTML = '';
        
        savedGradients.forEach(gradient => {
            const gradientElement = document.createElement('div');
            gradientElement.classList.add('saved-gradient');
            
            let gradientCSS;
            if (gradient.type === 'linear') {
                gradientCSS = `linear-gradient(${gradient.degree}deg, ${gradient.color1}, ${gradient.color2})`;
            } else {
                gradientCSS = `radial-gradient(circle, ${gradient.color1}, ${gradient.color2})`;
            }
            
            gradientElement.style.background = gradientCSS;
            
            // Delete button
            const deleteBtn = document.createElement('button');
            deleteBtn.classList.add('delete-btn');
            deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                deleteGradient(gradient.id);
            });
            
            gradientElement.appendChild(deleteBtn);
            
            // Click to load gradient
            gradientElement.addEventListener('click', () => {
                loadGradient(gradient);
            });
            
            savedGradientsGrid.appendChild(gradientElement);
        });
    }
    
    function deleteGradient(id) {
        savedGradients = savedGradients.filter(gradient => gradient.id !== id);
        localStorage.setItem('savedGradients', JSON.stringify(savedGradients));
        renderSavedGradients();
        showToast('Gradient deleted!');
    }
    
    function loadGradient(gradient) {
        color1Input.value = gradient.color1;
        color2Input.value = gradient.color2;
        color1Value.textContent = gradient.color1;
        color2Value.textContent = gradient.color2;
        gradientType.value = gradient.type;
        
        if (gradient.type === 'linear') {
            degree.value = gradient.degree;
            degreeValue.textContent = gradient.degree + '°';
            degreeOption.style.display = 'flex';
        } else {
            degreeOption.style.display = 'none';
        }
        
        updateGradient();
        showToast('Gradient loaded!');
    }
    
    function showToast(message = 'Copied to clipboard!') {
        toast.textContent = message;
        toast.classList.add('show');
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
});

