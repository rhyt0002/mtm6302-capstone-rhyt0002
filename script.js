document.addEventListener('DOMContentLoaded', function() {
    const heartButton = document.querySelector('.heart-button.top-right .card-heart');
  
    heartButton.addEventListener('click', function() {
      if (heartButton.style.color === 'orange') {
        heartButton.style.color = 'white';
      } else {
        heartButton.style.color = 'orange';
      }
    });
  });