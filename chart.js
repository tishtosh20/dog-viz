window.addEventListener("load", async () => {
  // LOAD THE DATA

  let response = await fetch("./data.json");
  let data = await response.json();

  // Get the five most popular dog names
  let top5 = [...data].sort((a, b) => b.count - a.count).slice(0, 5);

  let names = top5.map((dog) => dog.name);
  let counts = top5.map((dog) => dog.count);

  // GAME VARIABLES

  let guesses = [null, null, null, null, null];
  let selectedName = null;
  let finished = false;

  // bar colors
  let barColors = ["#2457A7", "#F3CA45", "#6EA6E8", "#E9AF29", "#4278CC"];

  // Shuffling the name buttons
  function shuffle(array) {
    let shuffled = [...array];

    for (let i = shuffled.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));

      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return shuffled;
  }

  let shuffledNames = shuffle(names);

  // CREATE THE BAR CHART

  let chart = new Chart(document.getElementById("dogChart"), {
    type: "bar",

    data: {
      labels: ["BAR 1", "BAR 2", "BAR 3", "BAR 4", "BAR 5"],

      datasets: [
        {
          label: "NYC dog licensing records",
          data: counts,

          backgroundColor: [...barColors],
          borderColor: "#173B78",
          borderWidth: 2,
          borderRadius: 12,
        },
      ],
    },

    options: {
      responsive: true,
      maintainAspectRatio: false,

      // When the player clicks a bar
      onClick: (event, elements) => {
        if (finished || selectedName === null) return;
        if (elements.length === 0) return;

        let index = elements[0].index;

        // Remove the name from its previous bar
        guesses = guesses.map((name) => (name === selectedName ? null : name));

        // Place the name on the clicked bar
        guesses[index] = selectedName;

        selectedName = null;

        updateDisplay();
      },

      plugins: {
        legend: {
          display: false,
        },

        tooltip: {
          enabled: false,
        },
      },

      scales: {
        x: {
          ticks: {
            color: "#173B78",
            font: {
              size: 14,
              weight: "bold",
            },
          },

          grid: {
            display: false,
          },
        },

        y: {
          beginAtZero: true,

          ticks: {
            color: "#173B78",
          },

          grid: {
            color: "#D8CB9D",
          },

          title: {
            display: true,
            text: "Dog licensing records",
            color: "#173B78",
          },
        },
      },

      animation: {
        duration: 900,
        easing: "easeOutBounce",
      },
    },
  });

  function updateDisplay() {
    let nameBank = document.getElementById("nameBank");

    nameBank.innerHTML = "";

    shuffledNames.forEach((name) => {
      let button = document.createElement("button");

      button.textContent = name;
      button.className = "name-button";

      // Highlight selected name
      if (selectedName === name) {
        button.classList.add("selected");
      }

      // Fade names already placed on bars
      if (guesses.includes(name)) {
        button.classList.add("used");
      }

      button.disabled = finished;

      button.addEventListener("click", () => {
        selectedName = name;
        updateDisplay();
      });

      nameBank.appendChild(button);
    });

    // Reveal correct names after checking answers
    if (finished) {
      chart.data.labels = names;
    } else {
      chart.data.labels = guesses.map(
        (name, index) => name || `BAR ${index + 1}`,
      );
    }

    chart.update();
  }

  // CHECK ANSWERS BUTTON

  document.getElementById("checkAnswers").addEventListener("click", () => {
    if (finished) return;

    // Make sure all five names are placed
    if (guesses.includes(null)) {
      document.getElementById("result").textContent =
        "PLACE ALL FIVE NAMES FIRST!";
      return;
    }

    finished = true;

    let score = 0;

    guesses.forEach((guess, index) => {
      if (guess === names[index]) {
        score++;
      }
    });

    // BLUE = CORRECT
    // YELLOW = INCORRECT

    chart.data.datasets[0].backgroundColor = guesses.map((guess, index) =>
      guess === names[index] ? "#2457A7" : "#F3CA45",
    );

    document.getElementById("result").textContent =
      `YOU GOT ${score}/5 CORRECT!`;

    updateDisplay();
  });

  // PLAY AGAIN BUTTON

  document.getElementById("resetGame").addEventListener("click", () => {
    guesses = [null, null, null, null, null];

    selectedName = null;
    finished = false;

    shuffledNames = shuffle(names);

    // Restore original blue and yellow bars
    chart.data.datasets[0].backgroundColor = [...barColors];

    document.getElementById("result").textContent = "";

    updateDisplay();
  });

  // SHOW THE GAME WHEN PAGE LOADS

  updateDisplay();

  // POLAR AREA CHART — TOP 20 DOG NAMES

  // Sort all 20 names by popularity
  let top20 = [...data].sort((a, b) => b.count - a.count).slice(0, 20);

  let polarNames = top20.map((dog) => dog.name);
  let polarCounts = top20.map((dog) => dog.count);

  // Alternate different blues and yellows
  let polarColors = [
    "#2457A7",
    "#FFE36B",
    "#6EA6E8",
    "#F3CA45",
    "#4278CC",
    "#E9AF29",
    "#83B9F0",
    "#F9D976",
    "#3568B5",
    "#F0BF39",
    "#94C4F5",
    "#FFDE85",
    "#1D4A91",
    "#E5B52B",
    "#5B92DB",
    "#F6CE56",
    "#769ED5",
    "#EBC04C",
    "#AACDF3",
    "#FFD65C",
  ];

  let polarChart = new Chart(document.getElementById("polarChart"), {
    type: "polarArea",

    data: {
      labels: polarNames,

      datasets: [
        {
          label: "Dog licensing records",
          data: polarCounts,
          backgroundColor: polarColors,
          borderColor: "#173B78",
        },
      ],
    },

    options: {
      responsive: true,
      maintainAspectRatio: false,

      plugins: {
        legend: {
          position: "right",
        },
      },
    },
  });
});

// I used chatgpt to help me understand the game logic abd mechanics since I had only dont it in p5.js before!
