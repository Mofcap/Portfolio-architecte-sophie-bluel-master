let token = localStorage.getItem("token");
if (token !== null) {
    const login = document.querySelector(".in");
    const logout = document.querySelector(".out");

    login.style.display = "none";
    logout.style.display="block"; 
    // Gestion du logout
    logout.addEventListener("click", function () {
      localStorage.removeItem("token");
      location.reload();
    });
  }
  