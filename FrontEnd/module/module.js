document.addEventListener("DOMContentLoaded", function() {
const addbtn = document.querySelector("#ajouterphoto");
const clos = document.querySelector("#close");

const btnret = document.querySelector(".pervieu");
const modal = document.querySelector(".modale");
const modal1 = document.querySelector("#modal1");
const modal2 = document.querySelector("#modal2");
const closeBtnModal2 = document.querySelector("#close-modal2");



// function pour button ajouter 

addbtn.addEventListener("click", function (){
modal1.style.display = "none";
modal2.style.display = "block";
});
// function pour fermer les modales

clos.addEventListener("click", function () {
    modal.style.display = "none";  
});
closeBtnModal2.addEventListener("click", function () {
    modal.style.display = "none";  
});

// function pour revenire a la page avant
 function returnmodal (){
    modal1.style.display = "block";
    modal2.style.display = "none";
    
     }
btnret.addEventListener("click", returnmodal );

    });


