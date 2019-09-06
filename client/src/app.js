// Connect to socket
window.socketConnection = io.connect("http://localhost:5001");

initPage();

// Gallery modal
function openImageModal(targetImage) {
  let modal = document.getElementsByClassName("modal-gallery")[0];
  let modalImg = document.getElementsByClassName("modal-image")[0];
  modal.style.display = "flex";
  modalImg.src = targetImage.getAttribute("fullimage");
}

function closeImageModal() {
  let modal = document.getElementsByClassName("modal-gallery")[0];
  modal.style.display = "none";
}

// Garbage
function addImageToGarbage(garbageBtn) {
  let imageId = garbageBtn.parentNode.previousElementSibling.getAttribute(
    "dateId"
  );
  if (imageId) {
    localStorage.setItem(
      "garbage",
      JSON.stringify([
        ...(JSON.parse(localStorage.getItem("garbage")) || []),
        imageId
      ])
    );
  }
  garbageBtn.parentNode.parentNode.style.display = "none";
}

// Get cities
window.socketConnection.on("response_cities", function(cities) {
  let citiesHTML = prepareHTMLCities(cities);
  importCitiesToPage(citiesHTML);
});

function prepareHTMLCities(cities) {
  let htmlCities = "";
  cities.forEach((city, cityIndex) => {
    htmlCities += `<option value="${city}"> ${city} </option> \n`;
  });
  return htmlCities;
}

function importCitiesToPage(htmlCities) {
  document.getElementById("citySelector").innerHTML = htmlCities;
}

// Get images from server
window.socketConnection.on("response_images", function(images) {
  if (images.length > 0) {
    let imagesHTML = prepareHTMLImages(images);
    importImagesToPage(imagesHTML);
    toogleErrorOnPage(false);
  } else {
    toogleErrorOnPage(true);
  }
});

function prepareFilterForGetImgaes() {
  let select = document.getElementById("citySelector");
  let input = document.getElementById("authorInput");

  return {
    deletedImages: JSON.parse(localStorage.getItem("garbage")) || [],
    imageZoom: getRetinaValue() ? "x2" : "x1",
    city:
      select.selectedIndex > -1
        ? select.options[select.selectedIndex].value
        : null,
    name: input.value || null
  };
}

function prepareHTMLImages(images) {
  let htmlImages = "";
  images.forEach(image => {
    htmlImages += `
        <div class="container-content-body-photoCart">
          <img
            onClick="openImageModal(this)"
            src="${image.preview}"
            dateId="${image.id}"
            fullImage="${image.fullsize}"
          />
          <div class="container-content-body-photoCart-garbage">
            <i onClick="addImageToGarbage(this)" class="fa fa-trash"></i>
          </div>
        </div>`;
  });
  return htmlImages;
}

function importImagesToPage(htmlImages) {
  document.getElementsByClassName(
    "container-content-body"
  )[0].innerHTML = htmlImages;
}

function getUpdatedImageList() {
  window.socketConnection.emit("requst_images", prepareFilterForGetImgaes());
}

function initPage() {
  window.socketConnection.emit("requst_cities");
  window.socketConnection.emit("requst_images", prepareFilterForGetImgaes());
}

function getRetinaValue() {
  return window.devicePixelRatio > 1;
}

function toogleErrorOnPage(error) {
  let errorBlock = document.getElementsByClassName(
    "container-content-error"
  )[0];
  let imagesBlock = document.getElementsByClassName(
    "container-content-body"
  )[0];

  if (error) {
    errorBlock.style.display = "flex";
    imagesBlock.style.display = "none";
  } else {
    errorBlock.style.display = "none";
    imagesBlock.style.display = "flex";
  }
}

try {
  require("./style.scss");
} catch (err) {}
