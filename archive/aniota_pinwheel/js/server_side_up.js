

const services = ['backend', 'static', 'dashboard', 'db'];
const actions = ['start', 'test', 'stop'];

function pollServiceStatuses() {
  services.forEach(service => {
    serviceAction(service, 'test');
  });
}

setInterval(pollServiceStatuses, 5000);

window.addEventListener('DOMContentLoaded', pollServiceStatuses);

function serviceAction(service, action) {
  const statusSpan = document.getElementById(`${service}-status`);
  statusSpan.textContent = `Status: ${action.charAt(0).toUpperCase() + action.slice(1)}ing...`;
  statusSpan.className = 'status pending';

  // Simulate async operation
  setTimeout(() => {
    if (action === 'test') {
      // Simulate test result
      const isUp = Math.random() > 0.3;
      statusSpan.textContent = isUp ? 'Status: UP' : 'Status: DOWN';
      statusSpan.className = isUp ? 'status up' : 'status down';
    } else {
      statusSpan.textContent = `Status: ${action.charAt(0).toUpperCase() + action.slice(1)}ed`;
      statusSpan.className = 'status changed';
    }
  }, 800);
}
