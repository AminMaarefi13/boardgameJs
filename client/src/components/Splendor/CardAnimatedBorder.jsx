import React from "react";

export default function CardAnimatedBorder({
  color = "#fff", // یا "#FFD600"
  glow = true,
  borderRadius = 12,
  width = 80,
  height = 128,
  strokeWidth = 4,
  duration = 2.5,
}) {
  const w = width + strokeWidth;
  const h = height + strokeWidth;
  const r = borderRadius;
  const dash = 2 * (width + height - 2 * r) + 2 * Math.PI * r; // محیط مستطیل با گوشه گرد
  const dashLength = dash / 6; // طول تکه خط (هرچه کوچکتر، خط کوتاه‌تر و حرکت نرم‌تر)
  const gapLength = dash - dashLength; // فاصله تا کامل شدن محیط

  return (
    <svg
      width={w}
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      style={{
        position: "absolute",
        top: `-${strokeWidth / 2}px`,
        left: `-${strokeWidth / 2}px`,
        pointerEvents: "none",
        zIndex: 30,
      }}
    >
      <rect
        x={strokeWidth / 2}
        y={strokeWidth / 2}
        width={width}
        height={height}
        rx={r}
        ry={r}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeDasharray={`${dashLength},${gapLength}`}
        strokeDashoffset="0"
        filter={glow ? "url(#glow)" : undefined}
      >
        <animate
          attributeName="stroke-dashoffset"
          from="0"
          to={`-${dash}`}
          dur={`${duration}s`}
          repeatCount="indefinite"
        />
      </rect>
      {glow && (
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      )}
    </svg>
  );
}
// import React from "react";

// export default function CardAnimatedBorder({
//   color = "#fff", // یا "#FFD600"
//   glow = false,
//   borderRadius = 12,
//   width = 80,
//   height = 128,
//   strokeWidth = 4,
//   duration = 2.5,
// }) {
//   const w = width + strokeWidth;
//   const h = height + strokeWidth;
//   const r = borderRadius;
//   const dash = 2 * (width + height - 2 * r) + 2 * Math.PI * r; // محیط مستطیل با گوشه گرد
//   const dashLength = dash / 4; // طول خط (یک تکه خط)

//   return (
//     <svg
//       width={w}
//       height={h}
//       viewBox={`0 0 ${w} ${h}`}
//       style={{
//         position: "absolute",
//         top: `-${strokeWidth / 2}px`,
//         left: `-${strokeWidth / 2}px`,
//         pointerEvents: "none",
//         zIndex: 30,
//       }}
//     >
//       <rect
//         x={strokeWidth / 2}
//         y={strokeWidth / 2}
//         width={width}
//         height={height}
//         rx={r}
//         ry={r}
//         fill="none"
//         stroke={color}
//         strokeWidth={strokeWidth}
//         strokeDasharray={`${dashLength}, ${dash}`} // یک تکه خط و فاصله تا محیط کامل
//         strokeDashoffset="0"
//         filter={glow ? "url(#glow)" : undefined}
//       >
//         <animate
//           attributeName="stroke-dashoffset"
//           from="0"
//           to={`-${dash}`}
//           dur={`${duration}s`}
//           repeatCount="indefinite"
//         />
//       </rect>
//       {glow && (
//         <defs>
//           <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
//             <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
//             <feMerge>
//               <feMergeNode in="blur" />
//               <feMergeNode in="SourceGraphic" />
//             </feMerge>
//           </filter>
//         </defs>
//       )}
//     </svg>
//   );
// }
// // import React from "react";

// // export default function CardAnimatedBorder({
// //   color = "#fff", // یا "#FFD600"
// //   glow = false,
// //   borderRadius = 12,
// //   width = 80,
// //   height = 128,
// //   strokeWidth = 4,
// //   duration = 2.5,
// // }) {
// //   const w = width + strokeWidth;
// //   const h = height + strokeWidth;
// //   const r = borderRadius;
// //   const dash = 2 * (width + height - 2 * r) + 2 * Math.PI * r; // محیط مستطیل با گوشه گرد
// //   const dashLength = dash / 6; // طول ثابت خط
// //   const gapLength = dash / 6; // فاصله بین خطوط

// //   return (
// //     <svg
// //       width={w}
// //       height={h}
// //       viewBox={`0 0 ${w} ${h}`}
// //       style={{
// //         position: "absolute",
// //         top: `-${strokeWidth / 2}px`,
// //         left: `-${strokeWidth / 2}px`,
// //         pointerEvents: "none",
// //         zIndex: 30,
// //       }}
// //     >
// //       <rect
// //         x={strokeWidth / 2}
// //         y={strokeWidth / 2}
// //         width={width}
// //         height={height}
// //         rx={r}
// //         ry={r}
// //         fill="none"
// //         stroke={color}
// //         strokeWidth={strokeWidth}
// //         strokeDasharray={`${dashLength}, ${gapLength}`} // طول خط و فاصله بین خطوط
// //         strokeDashoffset="0"
// //         filter={glow ? "url(#glow)" : undefined}
// //       >
// //         <animate
// //           attributeName="stroke-dashoffset"
// //           from="0"
// //           to={`-${dash}`}
// //           dur={`${duration}s`}
// //           repeatCount="indefinite"
// //         />
// //       </rect>
// //       {glow && (
// //         <defs>
// //           <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
// //             <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
// //             <feMerge>
// //               <feMergeNode in="blur" />
// //               <feMergeNode in="SourceGraphic" />
// //             </feMerge>
// //           </filter>
// //         </defs>
// //       )}
// //     </svg>
// //   );
// // }
// // // import React from "react";

// // // export default function CardAnimatedBorder({
// // //   color = "#fff", // یا "#FFD600"
// // //   glow = false,
// // //   borderRadius = 12,
// // //   width = 80,
// // //   height = 128,
// // //   strokeWidth = 4,
// // //   duration = 2.5,
// // // }) {
// // //   const w = width + strokeWidth;
// // //   const h = height + strokeWidth;
// // //   const r = borderRadius;
// // //   const dash = 2 * (width + height - 2 * r) + 2 * Math.PI * r; // محیط مستطیل با گوشه گرد
// // //   const dashLength = dash / 6; // طول ثابت خط
// // //   const gapLength = dash; // فاصله بین خطوط

// // //   return (
// // //     <svg
// // //       width={w}
// // //       height={h}
// // //       viewBox={`0 0 ${w} ${h}`}
// // //       style={{
// // //         position: "absolute",
// // //         top: `-${strokeWidth / 2}px`,
// // //         left: `-${strokeWidth / 2}px`,
// // //         pointerEvents: "none",
// // //         zIndex: 30,
// // //       }}
// // //     >
// // //       <rect
// // //         x={strokeWidth / 2}
// // //         y={strokeWidth / 2}
// // //         width={width}
// // //         height={height}
// // //         rx={r}
// // //         ry={r}
// // //         fill="none"
// // //         stroke={color}
// // //         strokeWidth={strokeWidth}
// // //         strokeDasharray={`${dashLength}, ${gapLength}`} // طول خط و فاصله بین خطوط
// // //         strokeDashoffset="0"
// // //         filter={glow ? "url(#glow)" : undefined}
// // //       >
// // //         <animate
// // //           attributeName="stroke-dashoffset"
// // //           from="0"
// // //           to={`-${dash}`}
// // //           dur={`${duration}s`}
// // //           repeatCount="indefinite"
// // //         />
// // //       </rect>
// // //       {glow && (
// // //         <defs>
// // //           <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
// // //             <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
// // //             <feMerge>
// // //               <feMergeNode in="blur" />
// // //               <feMergeNode in="SourceGraphic" />
// // //             </feMerge>
// // //           </filter>
// // //         </defs>
// // //       )}
// // //     </svg>
// // //   );
// // // }
// // // // import React from "react";

// // // // export default function CardAnimatedBorder({
// // // //   color = "#fff", // یا "#FFD600"
// // // //   glow = false,
// // // //   borderRadius = 12,
// // // //   width = 80,
// // // //   height = 128,
// // // //   strokeWidth = 4,
// // // //   duration = 2.5,
// // // // }) {
// // // //   const w = width + strokeWidth;
// // // //   const h = height + strokeWidth;
// // // //   const r = borderRadius;
// // // //   const dash = 2 * (width + height - 2 * r) + 2 * Math.PI * r; // محیط مستطیل با گوشه گرد

// // // //   return (
// // // //     <svg
// // // //       width={w}
// // // //       height={h}
// // // //       viewBox={`0 0 ${w} ${h}`}
// // // //       style={{
// // // //         position: "absolute",
// // // //         top: `-${strokeWidth / 2}px`,
// // // //         left: `-${strokeWidth / 2}px`,
// // // //         pointerEvents: "none",
// // // //         zIndex: 30,
// // // //       }}
// // // //     >
// // // //       <rect
// // // //         x={strokeWidth / 2}
// // // //         y={strokeWidth / 2}
// // // //         width={width}
// // // //         height={height}
// // // //         rx={r}
// // // //         ry={r}
// // // //         fill="none"
// // // //         stroke={color}
// // // //         strokeWidth={strokeWidth}
// // // //         strokeDasharray={dash} // کل محیط مستطیل استفاده می‌شود
// // // //         strokeDashoffset="0"
// // // //         filter={glow ? "url(#glow)" : undefined}
// // // //       >
// // // //         <animate
// // // //           attributeName="stroke-dashoffset"
// // // //           from="0"
// // // //           to={`-${dash}`}
// // // //           dur={`${duration}s`}
// // // //           repeatCount="indefinite"
// // // //         />
// // // //       </rect>
// // // //       {glow && (
// // // //         <defs>
// // // //           <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
// // // //             <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
// // // //             <feMerge>
// // // //               <feMergeNode in="blur" />
// // // //               <feMergeNode in="SourceGraphic" />
// // // //             </feMerge>
// // // //           </filter>
// // // //         </defs>
// // // //       )}
// // // //     </svg>
// // // //   );
// // // // }
// // // // // import React from "react";

// // // // // export default function CardAnimatedBorder({
// // // // //   color = "#fff", // یا "#FFD600"
// // // // //   glow = false,
// // // // //   borderRadius = 12,
// // // // //   width = 80,
// // // // //   height = 128,
// // // // //   strokeWidth = 4,
// // // // //   duration = 2.5,
// // // // // }) {
// // // // //   const w = width + strokeWidth;
// // // // //   const h = height + strokeWidth;
// // // // //   const r = borderRadius;
// // // // //   const dash = 2 * (width + height - 2 * r) + 2 * Math.PI * r; // محیط مستطیل با گوشه گرد
// // // // //   return (
// // // // //     <svg
// // // // //       width={w}
// // // // //       height={h}
// // // // //       viewBox={`0 0 ${w} ${h}`}
// // // // //       style={{
// // // // //         position: "absolute",
// // // // //         top: `-${strokeWidth / 2}px`,
// // // // //         left: `-${strokeWidth / 2}px`,
// // // // //         pointerEvents: "none",
// // // // //         zIndex: 30,
// // // // //       }}
// // // // //     >
// // // // //       <rect
// // // // //         x={strokeWidth / 2}
// // // // //         y={strokeWidth / 2}
// // // // //         width={width}
// // // // //         height={height}
// // // // //         rx={r}
// // // // //         ry={r}
// // // // //         fill="none"
// // // // //         stroke={color}
// // // // //         strokeWidth={strokeWidth}
// // // // //         strokeDasharray={dash / 4 + "," + (dash - dash / 4)}
// // // // //         strokeDashoffset="0"
// // // // //         filter={glow ? "url(#glow)" : undefined}
// // // // //       >
// // // // //         <animate
// // // // //           attributeName="stroke-dashoffset"
// // // // //           values={`0;-${dash}`}
// // // // //           dur={`${duration}s`}
// // // // //           repeatCount="indefinite"
// // // // //         />
// // // // //       </rect>
// // // // //       {glow && (
// // // // //         <defs>
// // // // //           <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
// // // // //             <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
// // // // //             <feMerge>
// // // // //               <feMergeNode in="blur" />
// // // // //               <feMergeNode in="SourceGraphic" />
// // // // //             </feMerge>
// // // // //           </filter>
// // // // //         </defs>
// // // // //       )}
// // // // //     </svg>
// // // // //   );
// // // // // }
