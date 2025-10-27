   function calculate() {
      const num1 = parseFloat(document.getElementById("num1").value);
      const num2 = parseFloat(document.getElementById("num2").value);
      const op = document.getElementById("operator").value;
      let result = 0;

      if (isNaN(num1) || isNaN(num2)) {
        document.getElementById("result").innerText = "Please enter valid numbers.";
        return;
      }

      switch(op) {
        case '+': result = num1 + num2; break;
        case '-': result = num1 - num2; break;
        case '*': result = num1 * num2; break;
        case '/': 
          result = num2 !== 0 ? (num1 / num2) : "Cannot divide by 0";
          break;
      }

      document.getElementById("result").innerText =` Result: ${result}`;
    }