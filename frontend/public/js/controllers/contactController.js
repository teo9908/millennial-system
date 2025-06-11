// frontend/public/js/controllers/contactController.js

document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('#contacto form');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Recopilamos los datos del formulario
    const formData = new FormData(form);
    const data = {};
    formData.forEach((value, key) => {
      data[key] = value;
    });

    try {
      // Enviar los datos mediante un método POST a un endpoint /api/contact
      // Asegúrate de tener ese endpoint en el backend para procesar mensajes
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();
      if (response.ok) {
        alert('¡Mensaje enviado exitosamente!');
        form.reset();
      } else {
        alert('Ocurrió un error: ' + result.error);
      }
    } catch (error) {
      console.error('Error al enviar el mensaje:', error);
      alert('Ocurrió un error. Intente más tarde.');
    }
  });
});
