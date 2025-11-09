export const changeTheme = async () => {
  const savedTheme = localStorage.getItem('theme');

  if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
  }

  const toggleButton = document.getElementById('theme-toggle') as HTMLButtonElement;

  function updateButton() {
    const theme = document.documentElement.getAttribute('data-theme');
    toggleButton.textContent = theme === 'dark' ? '☀️' : '🌙';
  }
  const toggleTheme = () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateButton();
  };
  updateButton();

  if (toggleButton) {
    toggleButton.addEventListener('click', toggleTheme);
  }
};
