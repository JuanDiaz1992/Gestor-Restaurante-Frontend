import Compressor from 'compressorjs';
const compressImage = (originalImage) => {
  if (originalImage) {
    return new Promise((resolve, reject) => {
      new Compressor(originalImage, {
        quality: 0.9,
        maxWidth: 374,
        maxHeight:480,
        success(result) {
          resolve(result); // Devuelve la imagen comprimida
        },
        error(err) {
          reject(err); // Devuelve un error en caso de fallo
        },
      });
    });
  }else{
    return new Promise((resolve, reject) => {
      resolve(""); 
    })
  }

  };

export default compressImage;