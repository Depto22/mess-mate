// index.js
// Initializes dashboard-specific features on index.html only

document.addEventListener('DOMContentLoaded', () => {
  // Get Started button scrolls to dashboard
  const getStartedBtn = document.getElementById('get-started-btn');
  if (getStartedBtn) {
    getStartedBtn.addEventListener('click', () => {
      const dashboardSection = document.getElementById('dashboard');
      if (dashboardSection) {
        dashboardSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // Initialize modules that exist on index.html
  initDebtTracker();
  initNoticeBoard();
  initReviews();

  // Do not initialize page-specific modules for other pages here.
});