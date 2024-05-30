document.addEventListener("DOMContentLoaded", function() {
  const login = document.querySelector(".in");
  const logout = document.querySelector(".out");
  const buttonmodifier = document.querySelector("#buttonmodifier");
  let token = localStorage.getItem("token");
  if (token == null) {
    if (login) login.style.display = "block";
    if (logout) logout.style.display = "none";
    if (buttonmodifier) buttonmodifier.style.display = "none";
  } else {
    if (login) login.style.display = "none";
    if (logout) logout.style.display = "block";
    if (buttonmodifier) buttonmodifier.style.display = "block";
    
    // Gestion du logout
    if (logout) {
      logout.addEventListener("click", function () {
        localStorage.removeItem("token");
        location.reload();
      });
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
    const photomodif = document.querySelector(".photo");
    galerie.innerHTML = ''; // Vide la galerie avant de la remplir
    photomodif.innerHTML='';
    works.forEach(work => {
      const workElement = document.createElement("figure");
      workElement.innerHTML = `
        <img src="${work.imageUrl}" alt="${work.title}">
        <p>${work.title}</p>
      `;
      galerie.appendChild(workElement);
      const photoElement = document.createElement("figure");
                photoElement.style.position="relative";
                photoElement.style.display="inline-block";
                photoElement.innerHTML = `
                  <img src="${work.imageUrl}" alt="${work.title}" style="width: 100%; height: 100%;">
                  <i class="fa-solid fa-trash-can remove" data-id="${work.id}" style="position: absolute;top: 5px;right: 5px;background-color: black;color: white;padding: 5px;" ></i>
                  `;
                photomodif.appendChild(photoElement);
                const removeIcons = document.querySelectorAll(".remove");
                removeIcons.forEach(icon => {
                  icon.addEventListener("click", function() {
                    const id = this.getAttribute("data-id");
                    deleteWork(id);
                  });
                });     
              
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
// Ajout des écouteurs d'événements pour les icônes de suppression




   // function suppression 


   async function deleteWork(id) {
    console.log(`Attempting to delete work with id: ${id}`); // Debugging log
    const token = localStorage.getItem('token');
    if (!token) {
      console.error("Token is not available.");
      return;
    }
    console.log(`Token being used: ${token}`); // Debugging log

    try {
      const response = await fetch(`http://localhost:5678/api/works/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log(response); // Log the response

      if (!response.ok) {
        throw new Error(`HTTP error, status: ${response.status}`);
      }

      // Successfully deleted
      document.querySelector(`.remove[data-id="${id}"]`).parentElement.remove();
      console.log('Element removed from DOM');
    } catch (error) {
      console.error("An error occurred during deletion:", error);
    }
  }

  //button appeler module
  
  const modifier = document.querySelector("#buttonmodifier");

  modifier.addEventListener("click" , function () {
    const module = document.querySelector(".modale");
    module.style.display = "block";
    
  });

});


