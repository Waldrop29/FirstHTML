 // Load from localStorage on startup
    let groceries = JSON.parse(localStorage.getItem('groceries') || '[]');
    groceries = groceries.map(item =>
        typeof item === 'string' ? { text: item, struck: false } : item
    );
    const list = document.getElementById('groceries');
    const input = document.getElementById('itemInput');
    const button = document.getElementById('button');

    function renderList() {
        list.innerHTML = '';
        groceries.forEach((item, idx) => {
            const li = document.createElement('li');

            // Create a span for the text
            const textSpan = document.createElement('span');
            textSpan.textContent = item.text;
            textSpan.style.textDecoration = item.struck ? 'line-through' : 'none';

            textSpan.onclick = function() {
                groceries[idx].struck = !groceries[idx].struck;
                saveAndRender();
            };

            // Add delete button
            const delBtn = document.createElement('button');
            delBtn.textContent = 'Delete';
            delBtn.className = 'delete-btn';
            delBtn.onclick = function(event) {
                event.stopPropagation();
                groceries.splice(idx, 1);
                saveAndRender();
            };

            li.appendChild(textSpan);
            li.appendChild(delBtn);
            list.appendChild(li);
        });
    }



    function saveAndRender() {
        localStorage.setItem('groceries', JSON.stringify(groceries));
        renderList();
    }

    function addItem() {
        const val = input.value.trim();
        if (val === '') return;
        groceries.push({ text: val, struck: false });
        input.value = '';
        saveAndRender();
        input.focus();
    }
    //delete all button
    const delAllBtn = document.getElementById('del-all-btn')
    delAllBtn.onclick = delAll
    function delAll() {
      groceries = []
      saveAndRender()
    }

    //delete all with keyboard shortcut Ctrl+Shift+D
    document.addEventListener('keydown', function(event) {
        if (event.ctrlKey && event.shiftKey && event.key === 'D') {
            delAll()
        }
        }); 


    button.addEventListener('click', addItem);
    input.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') addItem();
    });

    // Initial render
    renderList();
    
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