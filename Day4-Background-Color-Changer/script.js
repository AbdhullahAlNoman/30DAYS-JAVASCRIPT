  function changeBackground() {
      const colors = ['#ff9999', '#99ccff', '#ccffcc', '#ffff99', '#ffccff', '#d9d9d9'];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      document.body.style.backgroundColor = randomColor;
    }