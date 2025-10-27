  function checkPalindrome() {
      const input = document.getElementById("textInput").value;
      const cleaned = input.toLowerCase().replace(/[^a-z0-9]/g, '');
      const reversed = cleaned.split('').reverse().join('');

      const result = (cleaned === reversed)
      ? `"${input}" is a Palindrome ✅`: 
      `"${input}" is NOT a Palindrome ❌`;

      document.getElementById("result").innerText = result;
    }