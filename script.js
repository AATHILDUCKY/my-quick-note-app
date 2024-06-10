document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("search-input");
  const resultsDiv = document.getElementById("results");

  fetch("notes.json")
    .then((response) => response.json())
    .then((data) => {
      searchInput.addEventListener("input", () => {
        const query = searchInput.value.toLowerCase().trim();
        resultsDiv.innerHTML = "";

        if (query === "") {
          return; // Exit the function if the input is empty
        }

        const queryKeywords = query.split(",").map((keyword) => keyword.trim());

        let filteredNotes = data;

        // Filter and sort notes by each keyword progressively
        queryKeywords.forEach((keyword) => {
          filteredNotes = filteredNotes
            .map((note) => {
              const noteKeywords = note.keywords
                .toLowerCase()
                .split(",")
                .map((keyword) => keyword.trim());
              const matchingKeywordsCount = noteKeywords.filter((noteKeyword) =>
                noteKeyword.includes(keyword)
              ).length;

              return { ...note, matchingKeywordsCount };
            })
            .filter((note) => note.matchingKeywordsCount > 0)
            .sort((a, b) => b.matchingKeywordsCount - a.matchingKeywordsCount);
        });

        filteredNotes.forEach((note) => {
          fetch(note.note)
            .then((response) => response.text())
            .then((content) => {
              const noteDiv = document.createElement("div");
              noteDiv.className = "p-4 mb-4 bg-gray-800 text-white rounded-xl";
              noteDiv.innerHTML = content;
              resultsDiv.appendChild(noteDiv);
            });
        });
      });
    });
});
