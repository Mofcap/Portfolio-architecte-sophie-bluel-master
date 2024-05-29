document.addEventListener("DOMContentLoaded", function() {
  const loginForm = document.querySelector("#loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", async function(event) {
      event.preventDefault(); // Empêche le formulaire de se soumettre normalement
      const email = document.querySelector("#Email").value;
      const password = document.querySelector("#Password").value;

      try {
        const response = await fetch('http://localhost:5678/api/users/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (!data.userId) {
          alert("Erreur identifiant ou mot de passe incorrect");
        } else {
          // On enregistre ID et token dans le local storage, puis on renvoie sur la page index
          localStorage.setItem("token", data.token);
          localStorage.setItem("userId", data.userId);
          window.location.href = "index.html";
          console.log(data.token);
        }
      } catch (error) {
        console.error('Erreur lors de la requête de connexion:', error);
      }
    });
  }
});
