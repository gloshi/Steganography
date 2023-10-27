import React, { useState } from 'react';

const Steganography = () => {
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState('');
  const [encodedImage, setEncodedImage] = useState(null);
  const [decodedMessage, setDecodedMessage] = useState('');

  // Функция для кодирования сообщения в изображение
  const encodeMessage = () => {
    if (image && message) {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;

        context.drawImage(img, 0, 0);
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = imageData.data;

        const binaryMessage = stringToBinary(message);

        // Кодирование сообщения в пиксели изображения
        for (let i = 0; i < binaryMessage.length; i++) {
          pixels[i] = (pixels[i] & 0xFE) | parseInt(binaryMessage[i], 2);
        }

        context.putImageData(imageData, 0, 0);

        setEncodedImage(canvas.toDataURL());
        setMessage('');
      };

      img.src = URL.createObjectURL(image);
    }
  };

  // Функция для декодирования сообщения из изображения
  const decodeMessage = () => {
    if (image) {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;

        context.drawImage(img, 0, 0);
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = imageData.data
        let binaryMessage = '';

        // Извлечение сообщения из пикселей изображения
        for (let i = 0; i < pixels.length; i++) {
          binaryMessage += (pixels[i] & 1).toString();
        }

        const decodedMessage = binaryToString(binaryMessage);
        setDecodedMessage(decodedMessage);
      };

      img.src = URL.createObjectURL(image);
    }
  };

  // Функция для преобразования строки в бинарный формат
  const stringToBinary = (str) => {
    let binary = '';
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i).toString(2).padStart(8, '0');
      binary += char;
    }
    return binary;
  };

  // Функция для преобразования бинарного формата в строку
  const binaryToString = (binary) => {
    let str = '';
    for (let i = 0; i < binary.length; i += 8) {
      const charCode = parseInt(binary.slice(i, i + 8), 2);
      str += String.fromCharCode(charCode);
    }
    return str;
  };

  // Обработчик события изменения изображения
  const handleImageChange = (event) => {
    const selectedImage = event.target.files[0];
    setImage(selectedImage);
  };

  // Обработчик события изменения сообщения
  const handleMessageChange = (event) => {
    const selectedMessage = event.target.value;
    setMessage(selectedMessage);
  };
  console.log(decodedMessage)
  return (
    <div>
      <h2>Steganography</h2>

      <label htmlFor='image'>Select an image:</label>
      <input type='file' id='image' accept='image/*' onChange={handleImageChange} />

      <label htmlFor='message'>Enter a message:</label>
      <input type='text' id='message' value={message} onChange={handleMessageChange} />

      <button onClick={encodeMessage}>Encode Message</button>
      <button onClick={decodeMessage}>Decode Message</button>

      {encodedImage && <img src={encodedImage} alt='Encoded Image' />}
      {decodedMessage && <p>Decoded Message: {decodedMessage}</p>}
    </div>
  );
};

export default Steganography;