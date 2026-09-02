const LANDING_NAME = "w50-raw-gravity";

const AMAZON_URLS = {
  tiktok:
    "https://www.amazon.com/dp/B0GTWB11LW?maas=maas_adg_9EAB36473ED1EB5F2AC4DBD00BF649CE_afap_abs&ref_=aa_maas&tag=maas",

  meta:
    "https://www.amazon.com/dp/B0GTWB11LW?maas=maas_adg_B05D582BAB7E5BC8F40DEBA1EBC61AEE_afap_abs&ref_=aa_maas&tag=maas",

  klaviyo:
    "https://www.amazon.com/dp/B0GTWB11LW?maas=maas_adg_25B95FF8BD805EF1A9DF6465C32333F9_afap_abs&ref_=aa_maas&tag=maas",

  instagram:
    "https://www.amazon.com/dp/B0GTWB11LW?maas=maas_adg_DA3922AD16009007A17A120E9C2F3E79_afap_abs&ref_=aa_maas&tag=maas"
};

const DEFAULT_AMAZON_URL = AMAZON_URLS.meta;

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

    const params = new URLSearchParams(window.location.search);

    const source =
      params.get("source") || "unknown";

    const creative =
      params.get("creative") || "unknown";

    const normalizedSource = source.toLowerCase();

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
          source,
          creative
        })
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Subscription failed");
      }

      emailFormState.style.display = "none";
      successState.style.display = "block";

      window.rawGravityTrackTikTokLead();
      window.rawGravityTrackMetaLead();

      setTimeout(() => {
        window.location.href =
          AMAZON_URLS[normalizedSource] ||
          result.amazonUrl ||
          DEFAULT_AMAZON_URL;
      }, 2000);

    } catch (error) {
      console.error("Klaviyo submission error:", error);

      submitButton.disabled = false;
      submitButton.textContent = "Get my 25% code →";

      alert("Something went wrong. Please try again.");
    }
  });
}