document.addEventListener("DOMContentLoaded", function() {

  const login = document.querySelector(".in");
  const logout = document.querySelector(".out");
  const buttonmodifier = document.querySelector("#buttonmodifier");
  let token = localStorage.getItem("token");

  if (token == null) {
    if (login) login.style.display = "block";
    login.addEventListener("click", function() {
      window.location.href = "login.html"; // Redirige vers la page de connexion
    });
    if (logout) logout.style.display = "none";
    if (buttonmodifier) buttonmodifier.style.display = "none";
  } else {
    if (login) login.style.display = "none";
    if (logout) logout.style.display = "block";
    if (buttonmodifier) buttonmodifier.style.display = "block";
    
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
      genererGalerie(works);
      await CreateMenu();
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

  let works;

  function genererGalerie(works) {
    const galerie = document.querySelector(".gallery");
    const photomodif = document.querySelector(".photo");
    galerie.innerHTML = ''; // Vide la galerie avant de la remplir
    photomodif.innerHTML = '';
    works.forEach(work => {
      const workElement = document.createElement("figure");
      workElement.innerHTML = `
        <img src="${work.imageUrl}" alt="${work.title}">
        <p>${work.title}</p>
      `;
      galerie.appendChild(workElement);

      const photoElement = document.createElement("figure");
      photoElement.style.position = "relative";
      photoElement.style.display = "inline-block";
      photoElement.innerHTML = `
        <img src="${work.imageUrl}" alt="${work.title}" style="width: 100%; height: 100%;">
        <i class="fa-solid fa-trash-can remove" data-id="${work.id}" style="position: absolute; top: 5px; right: 5px; background-color: black; color: white; padding: 5px;"></i>
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

  async function deleteWork(id) {
    const token = localStorage.getItem('token');
    if (!token) {
        console.error("Token is not available.");
        return;
    }

    try {
        const response = await fetch(`http://localhost:5678/api/works/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error, status: ${response.status}`);
        }

        // Supprimer immédiatement l'élément du DOM
        document.querySelector(`.remove[data-id="${id}"]`).parentElement.remove();

        // Récupérer les travaux mis à jour et régénérer la galerie
        const newResponse = await fetch("http://localhost:5678/api/works");
        if (!newResponse.ok) {
            throw new Error("Erreur HTTP, statut " + newResponse.status);
        }

        const works = await newResponse.json();
        genererGalerie(works);

        alert(`Vous avez correctement supprimé l'élément avec l'ID ${id}`);
    } catch (error) {
        console.error("An error occurred during deletion:", error);
    }
  }

  async function ajouterwork() {
    const form = document.querySelector("#ajoutPhotoForm");
    const title = document.getElementById("titre").value;
    const categoryId = document.getElementById("categorie").value;
    const imageInput = document.getElementById("imageinput");
    const buttajou = document.querySelector("#buttonajout");
    const token = localStorage.getItem('token');

    if (!imageInput || !imageInput.files.length) {
      console.error("No file selected.");
      return;
    }

    const image = imageInput.files[0];
    
    const formData = new FormData();
    formData.append("title", title);
    formData.append("category", categoryId);
    formData.append("image", image);

    try {
      const response = await fetch("http://localhost:5678/api/works", {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error, status: ${response.status}`);
      }

      alert(`Vous avez correctement importé ${title}`);
      
      const newResponse = await fetch("http://localhost:5678/api/works");
      if (!newResponse.ok) {
        throw new Error("Erreur HTTP, statut " + newResponse.status);
      }
      works = await newResponse.json();
      genererGalerie(works);

      // Réinitialiser le formulaire après l'ajout de la photo
      form.reset();
      
      // Réinitialiser l'aperçu de la photo
      const photoElement = document.querySelector("#photoPreview");
      const planphoto = document.querySelector(".planphoto");
      const imagelabel = document.querySelector("#image-label");
      const parag = document.querySelector(".parag");
      photoElement.style.display = "none"; 
      photoElement.src = ""; // Réinitialiser la source de l'image
      imageInput.style.display = "block"; 
      imageInput.style.display = "none"; // Cacher l'input de type file après réinitialisation
      planphoto.style.display = "block"; 
      imagelabel.style.display = "block"; 
      parag.style.display = "block";

    } catch (error) {
      console.error("An error occurred while adding the work:", error);
    }
  }
  

  function previewPhoto() {
    const imageInput = document.getElementById("imageinput");
    const planphoto = document.querySelector(".planphoto");
    const photoElement = document.querySelector("#photoPreview");
    const title = document.getElementById("titre").value;
    const categoryId = document.getElementById("categorie").value;
    const buttajou = document.querySelector("#buttonajout");
    const imagelabel = document.querySelector("#image-label");
    const parag = document.querySelector(".parag");

    if (imageInput.files && imageInput.files[0]) {
      const reader = new FileReader();

      reader.onload = function(e) {
        photoElement.src = e.target.result;
        photoElement.style.display = "block"; // Affiche l'élément de prévisualisation de la photo
        imageInput.style.display = "none"; // Cache l'élément input d'image
        planphoto.style.display = "none"; // Cache l'élément planphoto
        parag.style.display = "none";
        imagelabel.style.display = "none";
      };
      reader.readAsDataURL(imageInput.files[0]);
    }

    // Vérifier si le titre et la catégorie sont remplis pour changer la couleur du bouton
    if (title && categoryId && imageInput.files.length) {
      buttajou.style.backgroundColor = "#1D6154"; 
    }
  }

  // Ajouter l'événement de prévisualisation sur les entrées du formulaire
  document.getElementById("titre").addEventListener("input", previewPhoto);
  document.getElementById("categorie").addEventListener("change", previewPhoto);
  document.getElementById("imageinput").addEventListener("change", previewPhoto);

  // Ajouter l'événement de soumission sur le formulaire
  const form = document.querySelector("#ajoutPhotoForm");
  form.addEventListener("submit", function(event) {
    event.preventDefault();
    ajouterwork();
  });

  // Ajouter l'événement d'ouverture de la modal
  const modifier = document.querySelector("#buttonmodifier");
  if (modifier) {
    modifier.addEventListener("click", function() {
      const module = document.querySelector(".modale");
      if (module) {
        module.style.display = "block";
      }
    });
  }
});
