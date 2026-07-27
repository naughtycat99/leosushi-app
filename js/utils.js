// Utility Functions
// Helper function to escape HTML
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Format price to German format
function formatPrice(price) {
  return `€${price.toFixed(2).replace('.', ',')}`;
}

