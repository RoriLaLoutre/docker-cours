import axios from "axios";

const API_URL = "http://localhost:3000/api";
const LOGIN_ENDPOINT = "/auth/login";
const TARGET_ENDPOINT = "/games";

const EMAIL = "admin";
const PASSWORD = "AdminSecurePass123!";

async function getToken() {
  const res = await axios.post(`${API_URL}${LOGIN_ENDPOINT}`, {
    username: EMAIL,
    password: PASSWORD
  });
  return res.data.token;
}

async function bombard(token, requests = 100) {
  const headers = { Authorization: `Bearer ${token}` };

  const promises = Array.from({ length: requests }, (_, i) =>
    axios.get(`${API_URL}${TARGET_ENDPOINT}`, { headers })
      .then(() => console.log(`✅ Request ${i}`))
      .catch(err => console.error(`❌ Request ${i}`, err.response?.status))
  );

  await Promise.allSettled(promises); // 👈 clé ici
}

(async () => {
  let timerStarted = false;

  try {
    const token = await getToken();
    console.log("JWT récupéré");

    console.time("timer");
    timerStarted = true;

    await bombard(token, 1000000);
  } catch (err) {
    console.error("Erreur", err.response?.data || err.message);
  } finally {
    if (timerStarted) {
      console.timeEnd("timer");
    }
  }
})();



