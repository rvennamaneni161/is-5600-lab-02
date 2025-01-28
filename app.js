document.addEventListener('DOMContentLoaded', () => {
    const stocksData = JSON.parse(stockContent); // Loaded from stocks-complete.js
    const userData = JSON.parse(userContent); // Loaded from users.js

    const deleteButton = document.querySelector('#btnDelete');
    const saveButton = document.querySelector('#btnSave');

    /**
     * Renders the user list on the left panel.
     * @param {*} users
     */
    function generateUserList(users) {
        const userList = document.querySelector('.user-list');
        userList.innerHTML = ''; // Clear the list

        users.forEach(({ user, id }) => {
            const listItem = document.createElement('li');
            listItem.innerText = `${user.lastname}, ${user.firstname}`;
            listItem.setAttribute('id', id);
            userList.appendChild(listItem);
        });

        userList.addEventListener('click', (event) => handleUserListClick(event, users));
    }

    /**
     * Handles click events on the user list.
     * @param {*} event
     * @param {*} users
     */
    function handleUserListClick(event, users) {
        const userId = event.target.id;
        if (!userId) return;

        const user = users.find(user => user.id == userId);
        if (user) {
            populateForm(user);
            renderPortfolio(user);
        }
    }

    /**
     * Populates the form with user details.
     * @param {*} user
     */
    function populateForm({ user, id }) {
        document.querySelector('#userID').value = id;
        document.querySelector('#firstname').value = user.firstname;
        document.querySelector('#lastname').value = user.lastname;
        document.querySelector('#address').value = user.address;
        document.querySelector('#city').value = user.city;
        document.querySelector('#email').value = user.email;
    }

    /**
     * Renders the user's portfolio on the dashboard.
     * @param {*} user
     */
    function renderPortfolio(user) {
        const portfolioList = document.querySelector('.portfolio-list');
        portfolioList.innerHTML = ''; // Clear the portfolio

        const { portfolio } = user;
        if (!portfolio || portfolio.length === 0) {
            portfolioList.innerHTML = '<p>No portfolio items available.</p>';
            return;
        }

        portfolio.forEach(({ symbol, owned }) => {
            const row = document.createElement('div');
            row.classList.add('portfolio-row');

            const symbolEl = document.createElement('p');
            const sharesEl = document.createElement('p');
            const actionEl = document.createElement('button');

            symbolEl.textContent = symbol;
            sharesEl.textContent = `Shares: ${owned}`;
            actionEl.textContent = 'View';
            actionEl.setAttribute('id', symbol);
            actionEl.classList.add('view-button');

            row.appendChild(symbolEl);
            row.appendChild(sharesEl);
            row.appendChild(actionEl);
            portfolioList.appendChild(row);
        });

        portfolioList.addEventListener('click', (event) => handlePortfolioClick(event));
    }

    /**
     * Handles click events on the portfolio to view stock details.
     * @param {*} event
     */
    function handlePortfolioClick(event) {
        if (event.target.tagName === 'BUTTON' && event.target.classList.contains('view-button')) {
            const symbol = event.target.id;
            viewStock(symbol);
        }
    }

    /**
     * Displays the stock details for a selected symbol.
     * @param {*} symbol
     */
    function viewStock(symbol) {
        const stockDetails = stocksData.find(stock => stock.symbol === symbol);
        if (!stockDetails) {
            console.error(`Stock with symbol ${symbol} not found.`);
            return;
        }

        document.querySelector('#stockName').textContent = stockDetails.name;
        document.querySelector('#stockSector').textContent = stockDetails.sector;
        document.querySelector('#stockIndustry').textContent = stockDetails.subIndustry;
        document.querySelector('#stockAddress').textContent = stockDetails.address;
        document.querySelector('#logo').src = `logos/${symbol}.svg`;
    }

    /**
     * Deletes the selected user and clears the portfolio.
     */
    deleteButton.addEventListener('click', (event) => {
        event.preventDefault();
        const userId = document.querySelector('#userID').value;

        const userIndex = userData.findIndex(user => user.id == userId);
        if (userIndex > -1) {
            userData.splice(userIndex, 1);
            generateUserList(userData);
            clearFormAndPortfolio();
        }
    });

    /**
     * Saves the updated user details and refreshes the user list.
     */
    saveButton.addEventListener('click', (event) => {
        event.preventDefault();
        const userId = document.querySelector('#userID').value;

        const user = userData.find(user => user.id == userId);
        if (user) {
            user.user.firstname = document.querySelector('#firstname').value;
            user.user.lastname = document.querySelector('#lastname').value;
            user.user.address = document.querySelector('#address').value;
            user.user.city = document.querySelector('#city').value;
            user.user.email = document.querySelector('#email').value;

            generateUserList(userData);
        }
    });

    /**
     * Clears the form and portfolio details.
     */
    function clearFormAndPortfolio() {
        document.querySelector('#userID').value = '';
        document.querySelector('#firstname').value = '';
        document.querySelector('#lastname').value = '';
        document.querySelector('#address').value = '';
        document.querySelector('#city').value = '';
        document.querySelector('#email').value = '';
        document.querySelector('.portfolio-list').innerHTML = '<p>No portfolio items available.</p>';
    }

    // Initialize the dashboard
    generateUserList(userData);
});