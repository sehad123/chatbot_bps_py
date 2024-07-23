document.addEventListener("DOMContentLoaded", function () {
  let form = document.getElementById("chat-form");
  let output = document.getElementById("output");
  let imageUpload = document.getElementById("image-upload");
  let imagePreview = document.getElementById("image-preview");
  let copyButton = document.getElementById("copy-button");
  let historyList = document.getElementById("history-list");
  let darkModeToggle = document.getElementById("dark-mode-toggle");

  let history = [];
  let historyIndex = 0;

  imageUpload.onchange = () => {
    let file = imageUpload.files[0];
    if (file && file.type.startsWith("image/")) {
      let reader = new FileReader();
      reader.onload = (e) => {
        imagePreview.innerHTML = `<img src="${e.target.result}" alt="Image preview">`;
      };
      reader.readAsDataURL(file);
    } else {
      imagePreview.innerHTML = "";
    }
  };

  form.onsubmit = async (ev) => {
    ev.preventDefault();
    output.textContent = "Generating...";
    copyButton.style.display = "none"; // Hide the copy button initially

    try {
      let formData = new FormData(form);
      let response = await fetch("/get_response", {
        method: "POST",
        body: formData,
      });
      let data = await response.json();
      let userPrompt = formData.get("user_input");

      output.textContent = data.response;

      // Show the copy button after output is generated
      copyButton.style.display = "block";

      // Save history
      let historyItem = {
        id: historyIndex++,
        prompt: userPrompt,
        output: data.response,
      };
      history.push(historyItem);
      updateHistoryList();

      // Clear the input fields after submission
      form.reset();
      imageUpload.value = "";
      imagePreview.innerHTML = "";
    } catch (e) {
      output.innerHTML += "<hr>" + e;
    }
  };

  function updateHistoryList() {
    historyList.innerHTML = "";
    history.forEach((item) => {
      let listItem = document.createElement("li");
      listItem.textContent = item.prompt;
      listItem.onclick = () => {
        output.textContent = item.output;
        copyButton.style.display = "block";
      };
      historyList.appendChild(listItem);
    });
  }

  copyButton.onclick = () => {
    let textToCopy = output.innerText;
    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        alert("Output copied to clipboard");
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };

  darkModeToggle.onclick = () => {
    document.body.classList.toggle("dark-mode");
  };
});
