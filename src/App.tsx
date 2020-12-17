import './App.css';
import { useCallback, useRef, useState } from "react"

function App() {

  // const [mouseCoords, setMouseCoords] = useState({x: 0, y: 0, r: 0, a: 0, x2: 0, y2: 0 })
  const [closestAngle, setClosestAngle] = useState(0);
  const [closestRadius, setClosestRadius] = useState(0);
  const [savedCoords, setSavedCoords] = useState({x: 0, y: 0, xy: ""});
  const savedCoordsRef = useRef<HTMLInputElement>(null)

  const size = 512;

  const phi = 1 / (144 / 89);
  const center = size / 2;
  const r1 = size / 2;
  const r2 = r1 * phi;
  const r3 = r1 * phi**2;
  const r4 = r1 * phi**3;

  const pentaAngles = Array.from(Array(10)).map((_, i) => i * (360 / 10))
  const quintaAngles = Array.from(Array(30)).map((_, i) => i * (360 / 30))

  const polarCoords = useCallback((angle: number, radius: number) => {
    return {
      x: center + radius * Math.cos((angle - 90) * (Math.PI / 180)),
      y: center + radius * Math.sin((angle - 90) * (Math.PI / 180))
    }
  }, [center])

  const handleClick = useCallback((event: React.MouseEvent<SVGSVGElement>) => {
    const x = polarCoords(closestAngle, closestRadius).x;
    const y = polarCoords(closestAngle, closestRadius).y;
    setSavedCoords({x, y, xy: `${x} ${y}` })
    savedCoordsRef.current?.setAttribute('value', `${x} ${y}`)
    savedCoordsRef.current?.select()
    document.execCommand('copy')
  }, [closestAngle, closestRadius, polarCoords])

  const handleMouseMove = useCallback((event: React.MouseEvent<SVGSVGElement>) => {
    const dim = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - dim.left;
    const y = event.clientY - dim.top;
    const x2 = - (center - x);
    const y2 = center - y;
    const r = Math.sqrt((center-x)**2 + (center-y)**2)
    let   a = Math.atan(x2 / y2) * 180 / Math.PI
    if(y2 < 0) a = 180 + a
    if(x2 < 0 && y2 > 0) a = a = 360 + a;
    // setMouseCoords({x, y, r, a, x2, y2})
    setClosestAngle(quintaAngles.reduce((prev, curr) => {
      return (Math.abs(curr - a) < Math.abs(prev - a) ? curr : prev);
    }))
    const radii = [r1, r2, r3, r4];
    setClosestRadius(radii.reduce((prev, curr) => {
      return (Math.abs(curr - r) < Math.abs(prev - r) ? curr : prev);
    }))
  }, [center, quintaAngles, r1, r2, r3])

  return (
    <div className="App">
      <output>
        <code>
          {JSON.stringify({size, phi, center, r1, r2, r3, r4, closestAngle, closestRadius, savedCoords}, null, 2)}
        </code>
        <input ref={savedCoordsRef} value={savedCoords.xy} readOnly/>
      </output>
      <svg onClick={handleClick} onMouseMove={handleMouseMove} xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {quintaAngles.map(a => (
          <g key={a}>
            <line className='stroked dim' x1={polarCoords(a, r4).x} y1={polarCoords(a, r4).y} x2={polarCoords(a, r1).x} y2={polarCoords(a, r1).y} />
            <text dominantBaseline="middle" textAnchor="middle" x={polarCoords(a, r2).x} y={polarCoords(a, r2).y}>{a}</text>
          </g>
        ))}
        {[r1, r2, r3, r4].map(r => (
          <circle key={r} className='transparent stroked' 
          cx={center} cy={center} r={r} 
          />
          ))}
        <path className='transparent stroked'
          d={pentaAngles.map((a, i) => `
            ${i === 0 ? 'M ' : 'L '} 
            ${polarCoords(a, a % 72 === 0 ? r1 : r3).x} 
            ${polarCoords(a, a % 72 === 0 ? r1 : r3).y} 
          `).join(' ') + ' Z' }
        />
        {/* <line className="stroked" x1={center} y1={center} x2={mouseCoords.x} y2={mouseCoords.y} /> */}
        <line className="stroked bright" x1={center} y1={center} x2={polarCoords(closestAngle, closestRadius).x} y2={polarCoords(closestAngle, closestRadius).y} />
      </svg>
    </div>
  );
}

export default App;
