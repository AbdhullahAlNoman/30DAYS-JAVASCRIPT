 
    function calculateTip() {
      const bill = parseFloat(document.getElementById("billAmount").value);
      const tipPercent = parseFloat(document.getElementById("tipPercent").value);


      if (isNaN(bill) || bill <= 0) {
        alert("Please enter a valid bill amount");
        return;
}

      
      if (tipPercent === 0) { 
        alert("Please select a tip percentage");
        return;
      }

      const tip = (bill * tipPercent) / 100;
      const total = bill + tip;

      document.getElementById("result").innerHTML = 
      `Tip Amount:tip.toFixed(2) <br>
        Total Amount:${total.toFixed(2)}`;
    
    }
