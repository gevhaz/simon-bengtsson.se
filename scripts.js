// MAKE TABS CLICKABLE

function openTab(evt, tabName) {
  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }

  document.getElementById(tabName).style.display = "block";
  evt.currentTarget.className += " active";
}

document.getElementById("defaultOpen").click();


// MODALS FOR PHOTO GALLERY

// Get the modal
var modal = document.getElementById("myModal");
var modalImg = document.getElementById("modal-img");
var captionText = document.getElementById("caption");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// Array of all images in gallery
const imgs = [...document.querySelectorAll('.gallery-photo > img')];

// Add index and event listener to all gallery images
imgs.forEach((img, i) => {
  img.dataset.index = i;
  img.addEventListener('click', e => { openModal(e.target); });
});

// Image currently shown in modal
let currentImage; 

function openModal(img) {
  // Get the image and insert it inside the modal - use 
  // its "alt" text as a caption
  modal.style.display = "block";
  currentImage = img;
  modalImg.src = currentImage.src.replace("thumbnails", "fullsize");
  captionText.innerHTML = img.alt;
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
  modalImg.src = "";
}

// Clicking outside modal closes it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
    modalImg.src = "";
  }
}

changeModalImage = direction => {
  const index = currentImage ? parseInt(currentImage.dataset.index) : 0;
  switch (direction) {
    case 'ArrowRight':
      let nextIndex = (index + 1) % imgs.length;
      openModal(imgs[nextIndex]);
      break;
    case 'ArrowLeft': // Go to previous image
      let prevIndex = index != 0 ? (index - 1) % imgs.length : imgs.length - 1;
      openModal(imgs[prevIndex]);
      break;
  }
}

// Pressing escape closes modal
document.onkeydown = function(event) {

  switch (event.key) {
    case 'Escape':
      modal.style.display = "none";
      modalImg.src = "";
      break;
    case 'ArrowRight': changeModalImage(event.key); break;
    case 'ArrowLeft':  changeModalImage(event.key); break;
  }
};
