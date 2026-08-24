// Footer toggle functionality - deferred for performance
export function toggleFooter(section) {
  // Only work on mobile (screen width <= 768px)
  if (window.innerWidth > 768) return;
  
  const sectionDiv = document.querySelector(`[data-section="${section}"]`);
  if (!sectionDiv) return;
  
  const list = sectionDiv.querySelector('.footer-links-list');
  const button = sectionDiv.querySelector('button');
  const arrow = sectionDiv.querySelector('.footer-arrow');
  
  if (!list || !button) return;
  
  const isOpen = list.classList.contains('open');
  
  // Close all other sections
  document.querySelectorAll('.footer-links-list').forEach(otherList => {
    otherList.classList.remove('open');
  });
  document.querySelectorAll('.footer-grid button').forEach(otherButton => {
    otherButton.setAttribute('aria-expanded', 'false');
    const otherArrow = otherButton.querySelector('.footer-arrow');
    if (otherArrow) otherArrow.style.transform = 'rotate(0deg)';
  });
  
  // Toggle current section
  if (!isOpen) {
    list.classList.add('open');
    button.setAttribute('aria-expanded', 'true');
    if (arrow) arrow.style.transform = 'rotate(180deg)';
  } else {
    list.classList.remove('open');
    button.setAttribute('aria-expanded', 'false');
    if (arrow) arrow.style.transform = 'rotate(0deg)';
  }
}
