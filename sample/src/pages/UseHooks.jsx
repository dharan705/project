import { useEffect, useState } from "react";
import "./Hooks.css";

const data = [
  "https://cdn.pixabay.com/photo/2015/04/19/08/32/flower-729510_1280.jpg",
  "https://static.vecteezy.com/system/resources/thumbnails/057/068/323/small/single-fresh-red-strawberry-on-table-green-background-food-fruit-sweet-macro-juicy-plant-image-photo.jpg",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTc9APxkj0xClmrU3PpMZglHQkx446nQPG6lA&s",
  "https://img.freepik.com/free-photo/closeup-shot-beautiful-butterfly-with-interesting-textures-orange-petaled-flower_181624-7640.jpg",
  "https://shorthand.com/the-craft/raster-images/assets/5kVrMqC0wp/sh-unsplash_5qt09yibrok-4096x2731.jpeg"
];

const UseHooks = () => {
  const [current, setCurrent] = useState(0);

  // NEXT
  const inc = () => {
    setCurrent(prev => (prev + 1) % data.length);
  };
 
  const dec = () => {
    setCurrent(prev => (prev - 1 + data.length) % data.length);
  };

  useEffect(()=>{
    const t=setTimeout(() => {
        dec()
    }, 1000);
    return ()=>{clearTimeout(t)}
  },[current])

  return (
    <div className="div">
      <button onClick={dec}>Prev</button>
      <img src={data[current]} alt="img" />
      <button onClick={inc}>Next</button>
    </div>
  );
};

export default UseHooks;