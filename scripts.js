// MAKE TABS CLICKABLE

openTab = (evt, tabName) => {
  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

  p5jsIframe = document.querySelectorAll('.p5js');

  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");

    for (let i = 0; i < p5jsIframe.length; i++) {
      p5jsIframe[i].src = "";
    }
  }

  if (tabName == 'projects') {
    for (let i = 0; i < p5jsIframe.length; i++) {
      p5jsIframe[i].src = p5jsIframe[i].dataset.src;
    }
  }

  document.getElementById(tabName).style.display = "block";
  evt.currentTarget.className += " active";
};

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

openModal = img => {
  // Get the image and insert it inside the modal - use 
  // its "alt" text as a caption
  modal.style.display = "block";
  currentImage = img;
  modalImg.src = currentImage.src.replace("thumbnails", "fullsize");
  captionText.innerHTML = img.alt;
}

closeModal = () => {
  modal.style.display = "none";
  modalImg.src = "";

  // Image get selected upon closing on mobile so deselect
  if(window.getSelection) {
    window.getSelection().removeAllRanges();
  }
  if (document.selection) {
    document.selection.empty();
  }
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  closeModal();
}

changeModalImage = direction => {
  if (modal.style.display == "block") {
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
}

// Pressing escape closes modal
document.onkeydown = event => {
  switch (event.key) {
    case 'Escape':     closeModal(); break;
    case 'ArrowRight': changeModalImage(event.key); break;
    case 'ArrowLeft':  changeModalImage(event.key); break;
  }
};

// Unify touch and click cases
unify = e => { return e.changedTouches ? e.changedTouches[0] : e };

let x0 = null;

lock = event => { x0 = unify(event).clientX };

move = event => {
  if (x0 || x0 === 0) {
    let dx = unify(event).clientX - x0;
    sign = Math.sign(dx);

    switch (sign) {
      case -1: changeModalImage('ArrowRight'); break;
      case  1: changeModalImage('ArrowLeft'); break;
    }
  }
}

modal.addEventListener('click', closeModal, false);
modal.addEventListener('mousedown', lock, false);
modal.addEventListener('touchstart', lock, false);
modal.addEventListener('mouseup', move, false);
modal.addEventListener('touchend', move, false);
modal.addEventListener('touchmove', e => {e.preventDefault()}, false)
modal.addEventListener('mousemove', e => {e.preventDefault()}, false)
