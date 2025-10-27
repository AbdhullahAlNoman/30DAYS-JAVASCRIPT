    async function getWeather() {
      const city = document.getElementById("cityInput").value.trim();
      const apiKey = "450cb3f8dab1b866377f51a3d0cdbc78";
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

      const resultDiv = document.getElementById("weatherResult");
      resultDiv.innerHTML = "⏳ Loading...";

      try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.cod === "404" || data.cod === 404) {
          resultDiv.innerHTML = "❌ City not found!";
          return;
        }

        // 🔹 আবহাওয়ার আইকন লিংক
        const iconCode = data.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

        const weatherInfo = `
          <img src="${iconUrl}" alt="Weather Icon" class="icon" />
          <h3>${data.name}, ${data.sys.country}</h3>
          <p>🌡 Temperature: ${data.main.temp}°C</p>
          <p>☁ Condition: ${data.weather[0].description}</p>
          <p>💧 Humidity: ${data.main.humidity}%</p>
          <p>💨 Wind: ${data.wind.speed} m/s</p>
        `;

        resultDiv.innerHTML = weatherInfo;
      } catch (error) {
        resultDiv.innerHTML = "⚠ Something went wrong!";
        console.error(error);
      }
    }
