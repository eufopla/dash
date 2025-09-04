let questions, currentIndex, score;

document.addEventListener("DOMContentLoaded", () => {
    questions = document.querySelectorAll(".question");
    currentIndex = 0;
    score = 10;

    questions.forEach((q, i) => {
        q.style.display = i === 0 ? "flex" : "none";
    });

    const submitBtn = document.querySelector("#securityForm button[type='submit']");
    if (submitBtn) submitBtn.style.display = "none";
});

function afficherResultat() {
    let message = "";
    if (score === 10) message = "Un surfer modèle, attitude exemplaire !";
    else if (score === 9) message = "Proche de la perfection...";
    else if (score >= 6) message = "Peut mieux faire.";
    else if (score >= 3) message = "C'est pas bon !";
    else message = "Une proie très facile...";

    document.getElementById('resform').textContent = `Score : ${score}/10 — ${message}`;
}

function suivant() {
    const currentCheckbox = questions[currentIndex].querySelector("input[type='checkbox']");
    if (currentCheckbox.checked) {
        score--;
    }

    questions[currentIndex].style.display = "none";
    currentIndex++;

    if (currentIndex >= questions.length) {

        const nextBtn = document.querySelector(".suivant_f");
        if (nextBtn) nextBtn.style.display = "none";

        afficherResultat();

        return;
    }

    questions[currentIndex].style.display = "flex";
}

function conseil(){
    let message = "→ Réutiliser un mot de passe augmente les risques : si un site est piraté, tous vos comptes peuvent l’être. \n\nCliquer sur un lien inconnu peut conduire à un site de phishing ou déclencher le téléchargement de logiciels malveillants. \n\nUtiliser des informations personnelles dans un mot de passe le rend vulnérable aux attaques par ingénierie sociale. \n\nCela peut conduire à un vol d’argent ou d’identité si le site est malveillant. \n\nUn profil public expose des données exploitables pour des attaques ciblées. \n\nNe pas utiliser de gestionnaire de mots de passe augmente le risque de choisir des mots de passe faibles ou réutilisés. \n\nPartager un mot de passe avec quelqu’un compromet la sécurité et la maîtrise des accès. \n\nAccepter automatiquement les cookies permet à des tiers de suivre votre activité en ligne, parfois à des fins douteuses. \n\nTélécharger sans vérifier la source peut introduire des malwares ou des logiciels espions dans votre système. \n\nLa fonction Se souvenir de moi peut exposer vos comptes si votre appareil tombe entre de mauvaises mains.";
    const expln = document.getElementById("expln");
    expln.textContent = message;
    document.getElementById("expln").classList.remove("hidden");
    document.getElementById("expln").classList.add("visible");
}