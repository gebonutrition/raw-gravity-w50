const LANDING_NAME = "w50-raw-gravity";
const AMAZON_URL = "https://amazon.com";

const form = document.getElementById("lead-form");
const emailInput = document.getElementById("email-input");
const submitButton = document.getElementById("email-submit");
const emailFormState = document.getElementById("email-form-state");
const successState = document.getElementById("success-state");

if (!form || !emailInput || !submitButton || !emailFormState || !successState) {
  console.error("Email form elements not found.");
} else {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = emailInput.value.trim();

    if (!email) {
      return;
    }

    const source =
      new URLSearchParams(window.location.search).get("source") || "unknown";

    submitButton.disabled = true;
    submitButton.textContent = "Sending...";

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          landing: LANDING_NAME,
          source
        })
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Subscription failed");
      }

      emailFormState.style.display = "none";
      successState.style.display = "block";

      setTimeout(() => {
        window.location.href = AMAZON_URL;
      }, 2000);

    } catch (error) {
      console.error("Klaviyo submission error:", error);

      submitButton.disabled = false;
      submitButton.textContent = "Get my 40% code →";

      alert("Something went wrong. Please try again.");
    }
  });
}