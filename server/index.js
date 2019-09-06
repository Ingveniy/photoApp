import express from "express";
import http from "http";
import socketIO from "socket.io";
import promise from "bluebird";
import imagesData from "./photos_db";

const app = express();
app.use(express.static("public"));
const server = http.Server(app);
const io = socketIO(server);

server.listen(5001);

io.on("connection", function(socket) {
  socket.on("requst_cities", async function() {
    let cities = await getUniqCitiesFromDB(imagesData);
    socket.emit("response_cities", cities);
  });
  socket.on("requst_images", async function(imageFilter) {
    let images = await getImagesFromDB(imageFilter, imagesData);
    socket.emit("response_images", images);
  });
});

async function getImagesFromDB(imageFilter = {}, imagesData) {
  let filtredImages = [];

  await promise.each(imagesData, imageData => {
    let filterByAuthor = imageFilter.name
      ? imageData.name.indexOf(imageFilter.name) > -1
      : true;
    let filterByCity = imageFilter.city
      ? imageData.city === imageFilter.city
      : true;
    let filterByBlacklist = imageFilter.deletedImages
      ? imageFilter.deletedImages.indexOf(imageData.id) == -1
      : true;

    if (filterByAuthor && filterByCity && filterByBlacklist) {
      filtredImages.push({
        id: imageData.id,
        preview: `http://127.0.0.1:5001/photos/preview/${imageFilter.imageZoom}/${imageData.src}`,
        fullsize: `http://127.0.0.1:5001/photos/full/${imageData.src}`
      });
    }
  });
  return filtredImages;
}

async function getUniqCitiesFromDB(imagesData) {
  let cities = [];
  await promise.each(imagesData, imageData => {
    cities.push(imageData.city);
  });
  cities = cities.filter((value, index, self) => self.indexOf(value) === index);
  return cities;
}
