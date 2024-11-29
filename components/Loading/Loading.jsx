import "@/components/Loading/animation.css";

export default function Loading() {
  return (
    <>
      <div className="bg-black flex h-full w-full">
        <div className="loading-container">
          <ul className="wave-container">
            <li></li> <span>L</span>
            <li></li> <span>O</span>
            <li></li> <span>A</span>
            <li></li> <span>D</span>
            <li></li> <span>I</span>
            <li></li> <span>N</span>
            <li></li> <span>G</span>
            <li></li>
          </ul>
        </div>
      </div>
    </>
  );
}
