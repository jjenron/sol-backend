module.exports = function(intent) {
  switch (intent) {
    case 'saludo_inicial':
      return '¡Hola! 👋 ¿Querés consultar precios, reservar o saber más sobre la excursión?';
    case 'hacer_reserva':
      return 'Genial 😄 ¿Para qué fecha te gustaría reservar y cuántas personas serían?';
    case 'consultar_tarifas':
      return 'Las tarifas actuales son: Mayores $35.000, Menores $20.000, Jubilados $25.000.';
    case 'consultar_excursiones':
      return 'Tenemos salidas martes, viernes y domingos desde Bahía Brava. ¿Te interesa alguna en particular?';
    case 'consulta_logistica':
      return 'Salimos desde el muelle de Bahía Brava. Te recomendamos llegar 30 min antes con lo que desees comer o tomar.';
    case 'niños_bebes':
      return 'Los menores de 4 años no abonan. Cochecitos son bienvenidos a bordo 😉';
    case 'pregunta_abierta_informacion':
      return 'Es un paseo de 3 horas al Bosque de Arrayanes con guía del Parque Nacional. Incluye navegación y caminata guiada.';
    case 'consulta_pago':
      return 'Podés pagar con efectivo, débito, crédito, Mercado Pago o transferencia.';
    case 'despedida':
      return '¡Gracias por escribirnos! Te esperamos a bordo 🚤';
    default:
      return 'Disculpá, no entendí bien 😅 ¿Podés reformularlo?';
  }
};