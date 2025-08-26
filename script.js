// Get Started button functionality
document.addEventListener('DOMContentLoaded', () => {
  const getStartedBtn = document.getElementById('get-started-btn');
  if (getStartedBtn) {
    getStartedBtn.addEventListener('click', () => {
      const dashboardSection = document.getElementById('dashboard');
      if (dashboardSection) {
        dashboardSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }
});

// Generic button handler for other buttons
document.querySelectorAll('button').forEach(btn => {
  if (!btn.closest('#debt-form') && !btn.hasAttribute('onclick') && btn.id !== 'get-started-btn') {
    btn.addEventListener('click', () => {
      alert(`${btn.innerText} feature coming soon!`);
    });
  }
});

document.getElementById('debt-form').addEventListener('submit', e => {
  e.preventDefault();
  const name = e.target.querySelector('input[type="text"]').value.trim();
  const amount = e.target.querySelector('input[type="number"]').value.trim();
  if (name && amount) {
    const row = document.createElement('tr');
    row.innerHTML = `<td>${name}</td><td>${amount}</td>`;
    document.querySelector('#debt-table tbody').appendChild(row);
    e.target.reset();
  }
});
//alert("Enter your name: ");
//console.log(name);
