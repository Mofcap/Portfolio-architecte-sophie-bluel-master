let token = localStorage.getItem("token");
if (token !== null) {
  const login = document.querySelector(".in");
  const logout = document.querySelector(".out");

  if (login && logout) {
    login.style.display = "none";
    logout.style.display = "block"; 
    // Gestion du logout
    logout.addEventListener("click", function () {
      localStorage.removeItem("token");
      location.reload();
    });
  } else {
    console.error("Les éléments de login/logout n'ont pas été trouvés dans le DOM.");
  }
}
// Fonction principale pour récupérer et afficher les travaux
(async function() {
  try {
    const response = await fetch("http://localhost:5678/api/works");
    if (!response.ok) {
      throw new Error("Erreur HTTP, statut " + response.status);
    }
    works = await response.json();

    // Appel de la fonction pour générer la galerie avec les travaux récupérés
    genererGalerie(works);

    // Appel de la fonction pour créer le menu des catégories
    await CreateMenu();
    
    // Filtrage des travaux
    filter();
   
  } catch (error) {
    console.error("Une erreur s'est produite lors de la récupération des travaux:", error);
  }
})();

// Fonction pour créer le menu des catégories
async function CreateMenu() {
  try {
    const response = await fetch("http://localhost:5678/api/categories");
    if (!response.ok) {
      throw new Error("Erreur HTTP, statut " + response.status);
    }
    const categories = await response.json();
    const portfolio = document.querySelector("#portfolio");
    portfolio.style.display = "flex";
    portfolio.style.flexDirection = "column";
    portfolio.style.alignItems = "center";
    
    const menu = document.querySelector(".menu");
    categories.forEach(category => {
      const button = document.createElement("button");
      button.setAttribute("id", `${category.id}`);
      button.textContent = category.name;
      menu.appendChild(button);
    });
  } catch (error) {
    console.error("Une erreur s'est produite lors de la récupération des catégories:", error);
  }
}

let works; // Déclarez la variable works dans une portée accessible à toutes les fonctions

// Fonction pour générer les éléments de la galerie
function genererGalerie(works) {
  const galerie = document.querySelector(".gallery");
  
  galerie.innerHTML = ''; // Vide la galerie avant de la remplir
  works.forEach(work => {
    const workElement = document.createElement("figure");
    workElement.innerHTML = `
      <img src="${work.imageUrl}" alt="${work.title}">
      <p>${work.title}</p>
    `;
    galerie.appendChild(workElement);
  });
}

// Fonction pour filtrer les travaux
function filter() {
  const buttons = document.querySelectorAll("#portfolio .menu button");
  buttons.forEach(button => {
    button.addEventListener("click", function() {
      const id = this.getAttribute("id");
      if (!isNaN(id) && id > 0) {
        const worksFiltrees = works.filter(work => work.categoryId == id);
        updateGallery(worksFiltrees);
      } else {
        genererGalerie(works);
      }
    });
  });
}

// Fonction pour mettre à jour la galerie avec des travaux filtrés
function updateGallery(filteredWorks) {
  const galerie = document.querySelector(".gallery");
  galerie.innerHTML = ''; // Efface tous les éléments existants dans la galerie
  filteredWorks.forEach(work => {
    const workElement = document.createElement("figure");
    workElement.innerHTML = `
      <img src="${work.imageUrl}" alt="${work.title}">
      <p>${work.title}</p>
    `;
    galerie.appendChild(workElement);
  });
}
