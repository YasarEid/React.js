import React, { useState, useEffect, useCallback, useContext } from "react";
import Gallery from "react-photo-gallery";
import Carousel, { Modal, ModalGateway } from "react-images";
import Header from "../Components/HomeComponents/Header";
import app from '../base'
import { AuthContext } from "../Components/AuthComponents/Auth";
import Spinner from 'react-bootstrap/Spinner'
import "./Home.css";

function Home() {
  const { currentUser } = useContext(AuthContext);
  const [currentImage, setCurrentImage] = useState(0);
  const [viewerIsOpen, setViewerIsOpen] = useState(false);
  const [data, setData] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const getGalleryImage = (url, callback) => {
    const img = new Image();
    img.src = url;
    img.onload = function () {
      callback(img.width, img.height)
    }
  }
  const onUploadComplete = (urls, filesToUploadName) => {
    let imageGalleries = []
    urls.forEach(url => {
      getGalleryImage(url, (width, height) => {
        imageGalleries.push({ src: url, 'width': width, 'height': height });
        if (urls.length === imageGalleries.length) {
          setData(prevData => [...prevData, ...imageGalleries]
          )
          setPhotos(prevData => [...prevData, ...filesToUploadName]
          )
        }
      })
    })
  }

  const openLightbox = useCallback((event, { photo, index }) => {
    setCurrentImage(index);
    setViewerIsOpen(true);
  }, []);

  const closeLightbox = () => {
    setCurrentImage(0);
    setViewerIsOpen(false);
  };

  useEffect(() => {
    const imageGalleries = []
    const photoGalleries = []
    async function fetchData() {
      const images = await app.storage().ref().child('images/').listAll();
      if (images.items.length === 0) {
        setIsLoading(false)
      }
      images.items.forEach(async (item) => {
        photoGalleries.push(item.name)
        const imageUrls = await item.getDownloadURL()
        getGalleryImage(imageUrls, (width, height) => {
          imageGalleries.push({ src: imageUrls, 'width': width, 'height': height });
          if (imageGalleries.length === images.items.length) {
            setIsLoading(false)
            setData(imageGalleries)
            setPhotos(photoGalleries)
          }
        });
      });

    }
    fetchData();

  }, [])
  return (
    <div >
      <div>
        {currentUser && ( (data && photos) || !data) 
        && <Header onUploadComplete={onUploadComplete} photos={photos} />
        }

        {data && <Gallery photos={data} onClick={openLightbox} />}
        {data && <ModalGateway>
          {viewerIsOpen ? (
            <Modal onClose={closeLightbox}>
              <Carousel
                currentIndex={currentImage}
                views={data.map(x => ({
                  ...x,
                  srcset: x.srcSet,
                  caption: x.title
                }))}
              />
            </Modal>
          ) : null}
        </ModalGateway>}
      </div>
      {isLoading && data.length === 0 && <div className='container4'> <Spinner animation="border" /> </div>}
      {!isLoading && data.length === 0 && <div className='container4'> <h1>There are no images</h1> </div>}
    </div>
  );
}

export default Home;
