 // Load from localStorage on startup
    let groceries = JSON.parse(localStorage.getItem('groceries') || '[]');
    groceries = groceries.map(item =>
        typeof item === 'string' ? { text: item } : item
    );
    let struckGroceries = JSON.parse(localStorage.getItem('struckGroceries') || '[]');

    // Undo history stacks
    let groceriesHistory = [];
    let struckGroceriesHistory = [];
    const list = document.getElementById('groceries');
    const input = document.getElementById('itemInput');
    const button = document.getElementById('button');

    function renderList() {
        list.innerHTML = '';
        groceries.forEach((item) => {
            const li = document.createElement('li');
            const textSpan = document.createElement('span');
            textSpan.textContent = item.text;
            textSpan.style.textDecoration = 'none';
            textSpan.onclick = function() {
                struckGroceries.push(item);
                groceries = groceries.filter(g => g !== item);
                saveAndRender();
                // Animate the newly added struck item
                setTimeout(() => {
                    const struckList = document.getElementById('struckList');
                    if (struckList && struckList.lastChild) {
                        struckList.lastChild.classList.add('struck-animate');
                    }
                }, 50);
            };
            const delBtn = document.createElement('button');
            delBtn.textContent = 'Delete';
            delBtn.className = 'delete-btn';
            delBtn.onclick = function(event) {
                event.stopPropagation();
                if (confirm('Are you sure you want to delete this item?')) {
                    groceries = groceries.filter(g => g !== item);
                    saveAndRender();
                }
            };
            li.appendChild(textSpan);
            li.appendChild(delBtn);
            list.appendChild(li);
        });
    }



    function saveAndRender() {
        // Save current state to history before changing
        groceriesHistory.push(JSON.stringify(groceries));
        struckGroceriesHistory.push(JSON.stringify(struckGroceries));
        localStorage.setItem('groceries', JSON.stringify(groceries));
        localStorage.setItem('struckGroceries', JSON.stringify(struckGroceries));
        renderList();
        renderStruckList();
    }

    // Undo function
    function undo() {
        if (groceriesHistory.length > 0 && struckGroceriesHistory.length > 0) {
            groceries = JSON.parse(groceriesHistory.pop());
            struckGroceries = JSON.parse(struckGroceriesHistory.pop());
            localStorage.setItem('groceries', JSON.stringify(groceries));
            localStorage.setItem('struckGroceries', JSON.stringify(struckGroceries));
            renderList();
            renderStruckList();
        }
    }

    function checkList() {
        const val = input.value.trim();
        if (val === '') return;
        groceries.push({ text: val });
        input.value = '';
        saveAndRender();
        input.focus();
    }
    //delete all button
    const delAllBtn = document.getElementById('del-all-btn')
    delAllBtn.onclick = delAll
        function delAll() {
            struckGroceries = [];
            saveAndRender();
        }

    //delete all with keyboard shortcut Ctrl+Shift+D
    document.addEventListener('keydown', function(event) {
        if (event.ctrlKey && event.shiftKey && event.key === 'D') {
            delAll()
        }
        }); 
    button.addEventListener('click', checkList);
    input.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') checkList();
    });

    // Initial render
    renderList();

    // Add Undo button wiring
    const undoBtn = document.getElementById('undo-btn');
    if (undoBtn) {
        undoBtn.onclick = undo;
    }
    
        // Dark mode toggle logic
        const darkModeBtn = document.getElementById('darkModeToggle');
        function setDarkMode(on) {
            document.body.classList.toggle('dark-mode', on);
            localStorage.setItem('darkMode', on ? '1' : '0');
            darkModeBtn.textContent = on ? 'Light Mode' : 'Dark Mode';
        }
        // Load dark mode preference
        setDarkMode(localStorage.getItem('darkMode') === '1');
        darkModeBtn.onclick = () => setDarkMode(!document.body.classList.contains('dark-mode'));
        
        function renderStruckList() {
            const struckList = document.getElementById('struckList');
            struckList.innerHTML = '';
            struckGroceries.forEach(item => {
                const li = document.createElement('li');
                li.textContent = item.text;
                struckList.appendChild(li);
            });
        }