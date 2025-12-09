// import { useEffect, useState } from "react";

// export default function CustomCursor() {
//   const [pos, setPos] = useState({ x: 0, y: 0 });
//   const [hover, setHover] = useState(false);

//   useEffect(() => {
//     const move = (e) => {
//       setPos({ x: e.clientX, y: e.clientY });
//     };
//     window.addEventListener("mousemove", move);

//     const hoverTargets = document.querySelectorAll(
//       "button, a, input, .cursor-hover"
//     );

//     hoverTargets.forEach((el) => {
//       el.addEventListener("mouseenter", () => setHover(true));
//       el.addEventListener("mouseleave", () => setHover(false));
//     });

//     return () => window.removeEventListener("mousemove", move);
//   }, []);

//   return (
//     <div
//       style={{
//         position: "fixed",
//         top: pos.y,
//         left: pos.x,
//         width: hover ? 45 : 22,
//         height: hover ? 45 : 22,
//         transform: "translate(-50%, -50%)",
//         pointerEvents: "none",
//         zIndex: 9999,

//         // Blue glassy style
//         borderRadius: "50%",
//         background: "rgba(0, 120, 255, 0.3)",
//         boxShadow: hover
//           ? "0 0 20px rgba(0, 150, 255, 0.7)"
//           : "0 0 10px rgba(0, 120, 255, 0.4)",
//         backdropFilter: "blur(4px)",
//         border: "2px solid rgba(0,120,255,0.5)",

//         // Smooth animation
//         transition:
//           "width 0.18s ease, height 0.18s ease, box-shadow 0.25s ease, background 0.25s ease",
//       }}
//     ></div>
//   );
// }
