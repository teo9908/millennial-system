// aboutController.js

document.addEventListener('DOMContentLoaded', () => {
  // Selecciona todas las secciones dentro del main
  const sections = document.querySelectorAll('main section');
  
  // Opciones para el IntersectionObserver (cuando al menos el 20% es visible)
  const options = { threshold: 0.2 };

  // Función que se ejecuta cuando las secciones aparecen en el viewport
  const handleIntersect = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Añade la clase que activa la animación definida en CSS
        entry.target.classList.add('visible');
        // Opcional: Deja de observar la sección para mejorar el rendimiento
        observer.unobserve(entry.target);
      }
    });
  };

  // Crea el IntersectionObserver
  const observer = new IntersectionObserver(handleIntersect, options);

  // Agrega una clase inicial a cada sección y las observa
  sections.forEach(section => {
    section.classList.add('before-visible');
    observer.observe(section);
  });

  console.log("AboutController loaded: animaciones de entrada inicializadas.");
});
