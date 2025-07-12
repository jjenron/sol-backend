// sessionManager.js
// Manejo simple de sesiones en memoria

const sessions = new Map();

// Devuelve el historial de mensajes para una sesión dada
function getSessionHistory(sessionId) {
  if (!sessions.has(sessionId)) {
    sessions.set(sessionId, []);
  }
  return sessions.get(sessionId);
}

// Agrega un nuevo mensaje al historial de la sesión
function appendToSession(sessionId, message) {
  if (!sessions.has(sessionId)) {
    sessions.set(sessionId, []);
  }
  sessions.get(sessionId).push(message);
}

// Borra el historial de una sesión (si se quiere forzar un reset manual)
function clearSession(sessionId) {
  sessions.delete(sessionId);
}

module.exports = {
  getSessionHistory,
  appendToSession,
  clearSession,
};
