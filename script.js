class QuoteGenerator {
    constructor() {
        this.quotes = [
            {
                text: "Единственный способ делать великие дела — любить то, что вы делаете.",
                author: "Стив Джобс",
                category: "motivation"
            },
            {
                text: "Не откладывай на завтра то, что можно сделать послезавтра.",
                author: "Марк Твен",
                category: "funny"
            },
            {
                text: "Успех — это способность идти от неудачи к неудаче, не теряя энтузиазма.",
                author: "Уинстон Черчилль",
                category: "success"
            },
            {
                text: "Жизнь — это то, что происходит с тобой, пока ты строишь другие планы.",
                author: "Джон Леннон",
                category: "life"
            },
            {
                text: "Лучший способ предсказать будущее — создать его.",
                author: "Питер Друкер",
                category: "wisdom"
            },
            {
                text: "Самый большой риск — не рисковать вообще.",
                author: "Марк Цукерберг",
                category: "success"
            },
            {
                text: "Ты никогда не пересечешь океан, если не наберешься смелости потерять берег из виду.",
                author: "Христофор Колумб",
                category: "motivation"
            },
            {
                text: "Единственная настоящая ошибка — та, из которой мы ничему не научились.",
                author: "Генри Форд",
                category: "wisdom"
            },
            {
                text: "Счастье не в том, чтобы делать всегда то, что хочешь, а в том, чтобы всегда хотеть того, что делаешь.",
                author: "Лев Толстой",
                category: "life"
            },
            {
                text: "Если проблему можно решить за деньги, то это не проблема, а расходы.",
                author: "Генри Форд",
                category: "wisdom"
            }
        ];
        
        this.currentQuote = null;
        this.favorites = JSON.parse(localStorage.getItem('quoteFavorites')) || [];
        this.quoteCount = parseInt(localStorage.getItem('dailyQuoteCount')) || 0;
        this.autoChangeInterval = null;
        
        this.init();
    }
    
    init() {
        this.displayQuoteCount();
        this.renderFavorites();
        this.setupEventListeners();
        this.showNotification('Добро пожаловать! Нажмите "Новая цитата" для начала', 'success');
    }
    
    setupEventListeners() {
        document.getElementById('newQuoteBtn').addEventListener('click', () => {
            this.generateNewQuote();
        });
        
        document.getElementById('copyQuoteBtn').addEventListener('click', () => {
            this.copyQuoteToClipboard();
        });
        
        document.getElementById('addToFavoritesBtn').addEventListener('click', () => {
            this.addToFavorites();
        });
        
        document.getElementById('categorySelect').addEventListener('change', () => {
            this.generateNewQuote();
        });
        
        document.getElementById('autoChange').addEventListener('change', (e) => {
            this.toggleAutoChange(e.target.checked);
        });
    }
    
    getFilteredQuotes() {
        const category = document.getElementById('categorySelect').value;
        return category === 'all' 
            ? this.quotes 
            : this.quotes.filter(quote => quote.category === category);
    }
    
    generateNewQuote() {
        const filteredQuotes = this.getFilteredQuotes();
        
        if (filteredQuotes.length === 0) {
            this.showNotification('Нет цитат в выбранной категории', 'error');
            return;
        }
        
        let newQuote;
        do {
            newQuote = filteredQuotes[Math.floor(Math.random() * filteredQuotes.length)];
        } while (newQuote === this.currentQuote && filteredQuotes.length > 1);
        
        this.currentQuote = newQuote;
        this.displayQuote(newQuote);
        this.incrementQuoteCount();
    }
    
    displayQuote(quote) {
        document.getElementById('quoteText').textContent = quote.text;
        document.getElementById('quoteAuthor').textContent = quote.author;
    }
    
    displayQuoteCount() {
        document.getElementById('quoteCount').textContent = this.quoteCount;
    }
    
    incrementQuoteCount() {
        this.quoteCount++;
        localStorage.setItem('dailyQuoteCount', this.quoteCount.toString());
        this.displayQuoteCount();
    }
    
    copyQuoteToClipboard() {
        if (!this.currentQuote) {
            this.showNotification('Сначала получите цитату!', 'error');
            return;
        }
        
        const textToCopy = `"${this.currentQuote.text}" — ${this.currentQuote.author}`;
        
        navigator.clipboard.writeText(textToCopy).then(() => {
            this.showNotification('Цитата скопирована в буфер обмена!', 'success');
        }).catch(() => {
            this.showNotification('Не удалось скопировать цитату', 'error');
        });
    }
    
    addToFavorites() {
        if (!this.currentQuote) {
            this.showNotification('Сначала получите цитату!', 'error');
            return;
        }
        
        const quoteString = JSON.stringify(this.currentQuote);
        
        if (this.favorites.includes(quoteString)) {
            this.showNotification('Эта цитата уже в избранном!', 'warning');
            return;
        }
        
        this.favorites.push(quoteString);
        localStorage.setItem('quoteFavorites', JSON.stringify(this.favorites));
        this.renderFavorites();
        this.showNotification('Цитата добавлена в избранное!', 'success');
    }
    
    removeFromFavorite(quoteString) {
        this.favorites = this.favorites.filter(fav => fav !== quoteString);
        localStorage.setItem('quoteFavorites', JSON.stringify(this.favorites));
        this.renderFavorites();
        this.showNotification('Цитата удалена из избранного', 'info');
    }
    
    renderFavorites() {
        const container = document.getElementById('favoritesContainer');
        
        if (this.favorites.length === 0) {
            container.innerHTML = '<div class="empty-favorites">Избранных цитат пока нет</div>';
            return;
        }
        
        container.innerHTML = this.favorites.map(quoteString => {
            const quote = JSON.parse(quoteString);
            return `
                <div class="favorite-item">
                    <button class="remove-favorite" onclick="quoteGenerator.removeFromFavorite('${quoteString.replace(/'/g, "\\'")}')">
                        ×
                    </button>
                    <div class="favorite-text">"${quote.text}"</div>
                    <div class="favorite-author">— ${quote.author}</div>
                </div>
            `;
        }).join('');
    }
    
    toggleAutoChange(enabled) {
        if (this.autoChangeInterval) {
            clearInterval(this.autoChangeInterval);
            this.autoChangeInterval = null;
        }
        
        if (enabled) {
            this.autoChangeInterval = setInterval(() => {
                this.generateNewQuote();
            }, 10000);
            this.showNotification('Автосмена включена (10 сек)', 'info');
        } else {
            this.showNotification('Автосмена выключена', 'info');
        }
    }
    
    showNotification(message, type = 'info') {
        const notification = document.getElementById('notification');
        notification.textContent = message;
        notification.className = `notification ${type} show`;
        
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }
}

// Создаем глобальный экземпляр для использования в onclick
const quoteGenerator = new QuoteGenerator();

// Сбрасываем счетчик в полночь
function resetDailyCounter() {
    const lastReset = localStorage.getItem('lastResetDate');
    const today = new Date().toDateString();
    
    if (lastReset !== today) {
        localStorage.setItem('dailyQuoteCount', '0');
        localStorage.setItem('lastResetDate', today);
        quoteGenerator.quoteCount = 0;
        quoteGenerator.displayQuoteCount();
    }
}

// Проверяем сброс при загрузке
document.addEventListener('DOMContentLoaded', resetDailyCounter);