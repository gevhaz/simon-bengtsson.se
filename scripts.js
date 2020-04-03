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

function openModal(img) {
  // Get the image and insert it inside the modal - use 
  // its "alt" text as a caption
  modal.style.display = "block";
  modalImg.src = img.src.replace("thumbnails", "fullsize");
  captionText.innerHTML = img.alt;
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
  modalImg.src = "";
}

// When the user clicks anywhere outside of the modal, 
// close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
    modalImg.src = "";
  }
}

const imgs = document.querySelectorAll('.gallery-photo > img');
[...imgs].forEach(img => {
    img.addEventListener('click', e => { openModal(e.target); });
});
