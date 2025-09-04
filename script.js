const passwordInput = document.getElementById("password");
const forceDiv = document.getElementById("force");
const tempsDiv = document.getElementById("temps");
const result = document.getElementById("result");
let timeoutId;

passwordInput.addEventListener("input", () => {
  const pwd = passwordInput.value;

  if (!pwd) {
    forceDiv.classList.remove("visible");
    tempsDiv.classList.remove("visible");
    result.classList.remove("visible");

    forceDiv.textContent = "";
    tempsDiv.textContent = "";
    result.textContent = "";
    return;
  }

  const seconds = estimateCrackTimeInSeconds(pwd);
  const readableTime = formatTime(seconds);
  const strength = evaluateStrengthFromTime(seconds);

  forceDiv.textContent = "Niveau de sécurité : " + strength.label;
  forceDiv.className = strength.class + " visible";

  tempsDiv.textContent = "Temps estimé pour le trouver : " + readableTime;
  tempsDiv.className = "visible";

  clearTimeout(timeoutId);
  timeoutId = setTimeout(() => {
    checkPassword();
  }, 1000);
});

function estimateCrackTimeInSeconds(pwd) {
  const length = pwd.length;
  let charsetSize = 0;

  if (/[a-z]/.test(pwd)) charsetSize += 26;
  if (/[A-Z]/.test(pwd)) charsetSize += 26;
  if (/\d/.test(pwd)) charsetSize += 10;
  if (/[^a-zA-Z0-9]/.test(pwd)) charsetSize += 32;

  if (charsetSize === 0) return 0n;

  const combinations = BigInt(Math.pow(charsetSize, length));
  const attemptsPerSecond = BigInt(1e10);
  return combinations / attemptsPerSecond;
}

function evaluateStrengthFromTime(seconds) {
  const fiveMinutes = 5n * 60n;
  const threeHours = 3n * 60n * 60n;
  const oneDay = 24n * 60n * 60n;
  const oneWeek = 7n * oneDay;

  if (seconds < fiveMinutes) return { label: "Très faible", class: "faible" };
  if (seconds < threeHours) return { label: "Faible", class: "faible" };
  if (seconds < oneDay) return { label: "Moyen", class: "moyen" };
  if (seconds < oneWeek) return { label: "Fort", class: "fort" };
  return { label: "Très fort", class: "tresfort" };
}

function formatTime(seconds) {
  if (seconds < 60n) return `${seconds} secondes`;
  const minutes = seconds / 60n;
  if (minutes < 60n) return `${minutes} minutes`;
  const hours = minutes / 60n;
  if (hours < 24n) return `${hours} heures`;
  const days = hours / 24n;
  if (days < 365n) return `${days} jours`;
  const years = days / 365n;
  if (years > 1000000000n) return "Des milliards d'années";
  return `${years} ans`;
}

async function checkPassword() {
  const password = document.getElementById("password").value;
  const result = document.getElementById("result");

  result.classList.remove("visible");

  if (!password) {
    result.textContent = "";
    return;
  }

  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-1", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, "0")).join("").toUpperCase();

  const prefix = hashHex.substring(0, 5);
  const suffix = hashHex.substring(5);

  const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
  const text = await response.text();

  const lines = text.split("\n");
  const found = lines.find(line => line.startsWith(suffix));

  if (found) {
    const count = found.split(":")[1].trim();
    result.textContent = `Ce mot de passe a été trouvé ${count} fois dans des fuites de données.`;
    result.style.color = "red";
  } else {
    result.textContent = "Ce mot de passe n’a pas fuité."
    result.style.color = "green";
  }

  result.classList.add("visible");
}

function genererMdp(longueur = 12) {
  const caracteres = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+";
  let motDePasse = "";
  for (let i = 0; i < longueur; i++) {
    const index = Math.floor(Math.random() * caracteres.length);
    motDePasse += caracteres[index];
  }
  document.getElementById("resmdp").value = motDePasse;
}

function copyMdp() {
  const textarea = document.getElementById("resmdp");

  textarea.select();
  textarea.setSelectionRange(0, 99999);

  try {
    const ok = document.execCommand("copy");
    if (ok) {
      alert("Mot de passe copié !");
    } else {
      alert("La copie a échoué.");
    }
  } catch (err) {
    alert("Erreur lors de la copie : " + err);
  }
}

