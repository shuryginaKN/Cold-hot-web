class Database {
    constructor() {
        this.dbName = 'GameResultsDB';
        this.storeName = 'results';
        this.db = null;
        this.init();
    }

    init() {
        const request = indexedDB.open("GamesDB", 1);

        request.onupgradeneeded = (event) => {
            this.db = event.target.result;
            if (!this.db.objectStoreNames.contains('results')) {
                this.db.createObjectStore('results', { keyPath: 'id', autoIncrement: true });
            }
        };

        request.onsuccess = (event) => {
            this.db = event.target.result;
            console.log('Database successfully opened.');
        };

        request.onerror = (event) => {
            console.error('Database error:', event.target.error);
        };
    }

    storeResult(username, secretNumber, attempts) {
        const transaction = this.db.transaction([this.storeName], 'readwrite');
        const store = transaction.objectStore(this.storeName);
        
        const result = {
            username: username,
            secretNumber: secretNumber,
            attempts: attempts,
            date: new Date().toISOString(),
        };

        const request = store.add(result);

        request.onsuccess = () => {
            console.log('Result saved:', result);
        };

        request.onerror = (event) => {
            console.error('Error saving result:', event.target.error);
        };
    }


    getResults(callback) {
        const transaction = this.db.transaction([this.storeName], 'readonly');
        const store = transaction.objectStore(this.storeName);
        const request = store.getAll();
    
        request.onsuccess = (event) => {
            callback(event.target.result); 
        };
    
        request.onerror = (event) => {
            console.error('Error fetching results:', event.target.error);
            callback([]); 
        };
    }
    
}

export default Database;
