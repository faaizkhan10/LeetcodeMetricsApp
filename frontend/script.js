document.addEventListener("DOMContentLoaded", function () {
  const searchButton = document.getElementById("search-btn");
  const usernameInput = document.getElementById("user-input");
  const statsContainer = document.querySelector(".stats-container");
  const easyProgressCircle = document.querySelector(".easy-progress");
  const mediumProgressCircle = document.querySelector(".medium-progress");
  const hardProgressCircle = document.querySelector(".hard-progress");
  const easyLabel = document.getElementById("easy-label");
  const mediumLabel = document.getElementById("medium-label");
  const hardLabel = document.getElementById("hard-label");
  const cardStatsContainer = document.querySelector(".stats-cards");

  function validateUsername(username) {
    if (username.trim() == "") {
      alert("Username should not be empty");
      return false;
    }
    const regex = /^[a-zA-Z][a-zA-Z0-9_]{3,14}$/;
    const isMatching = regex.test(username);
    if (!isMatching) {
      alert("Invalid Username");
    }
    return isMatching;
  }

  async function fetchUserDetails(username) {
    try {
      searchButton.textContent = "Searching...";
      searchButton.disabled = true;

      const response = await fetch("http://localhost:3001/leetcode-stats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      });
      if (!response.ok) {
        throw new Error("Unable to fetch the User details");
      }
      const parsedData = await response.json();
      console.log("Logging data: ", parsedData);

      displayUserData(parsedData);
    } catch (error) {
      statsContainer.innerHTML = `<p>${error.message}</p>`;
    } finally {
      searchButton.textContent = "Search";
      searchButton.disabled = false;
    }
  }

  function updateProgress(solved, total, label, circle) {
    const progressDegree = (solved / total) * 100;
    circle.style.setProperty("--progress-degree", `${progressDegree}%`);
    label.textContent = `${solved}/${total}`;
  }
  function displayUserData(parsedData) {
    const acSubmissionNum =
      parsedData.data?.matchedUser?.submitStats?.acSubmissionNum;
    const allQuestionsCount = parsedData.data?.allQuestionsCount;
    if (
      Array.isArray(acSubmissionNum) &&
      acSubmissionNum.length >= 4 &&
      Array.isArray(allQuestionsCount) &&
      allQuestionsCount.length >= 4
    ) {
      const solvedTotalQues = acSubmissionNum[0].count;
      const solvedTotalEasyQues = acSubmissionNum[1].count;
      const solvedTotalMediumQues = acSubmissionNum[2].count;
      const solvedTotalHardQues = acSubmissionNum[3].count;

      const totalEasyQues =
        allQuestionsCount.find((q) => q.difficulty === "Easy")?.count || 0;
      const totalMediumQues =
        allQuestionsCount.find((q) => q.difficulty === "Medium")?.count || 0;
      const totalHardQues =
        allQuestionsCount.find((q) => q.difficulty === "Hard")?.count || 0;

      updateProgress(
        solvedTotalEasyQues,
        totalEasyQues,
        easyLabel,
        easyProgressCircle
      );
      updateProgress(
        solvedTotalMediumQues,
        totalMediumQues,
        mediumLabel,
        mediumProgressCircle
      );
      updateProgress(
        solvedTotalHardQues,
        totalHardQues,
        hardLabel,
        hardProgressCircle
      );

      const cardsData = [
        { label: "Overall Submissions", value: acSubmissionNum[0].submissions },
        { label: "Easy Submissions", value: acSubmissionNum[1].submissions },
        { label: "Medium Submissions", value: acSubmissionNum[2].submissions },
        { label: "Hard Submissions", value: acSubmissionNum[3].submissions },
      ];

      cardStatsContainer.innerHTML = cardsData
        .map(
          (data) =>
            `<div class="card"><h4>${data.label}</h4><p>${data.value}</p></div>`
        )
        .join("");
    } else {
      statsContainer.innerHTML = `<p>Data not available for this user.</p>`;
    }
  }

  searchButton.addEventListener("click", function () {
    const username = usernameInput.value;
    console.log("loggin username :", username);
    if (validateUsername(username)) {
      fetchUserDetails(username);
    }
  });
});
