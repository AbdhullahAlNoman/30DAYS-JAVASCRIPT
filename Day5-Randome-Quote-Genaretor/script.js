    const quotes = [
      "Believe you can and you're halfway there. – Theodore Roosevelt",
      "The best way to get started is to quit talking and begin doing. – Walt Disney",
      "Don’t let yesterday take up too much of today. – Will Rogers",
        "Dream big and dare to fail. – Norman Vaughan",
      "Success is not final, failure is not fatal: It is the courage to continue that counts. – Winston Churchill"
    ];

    function generateQuote() {
      const randomIndex = Math.floor(Math.random() * quotes.length);
      document.getElementById("quote").innerText = quotes[randomIndex];
    }
