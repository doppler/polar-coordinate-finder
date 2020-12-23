import './App.css';
import { useCallback, useRef, useState } from "react"

function App() {

  // const [mouseCoords, setMouseCoords] = useState({x: 0, y: 0, r: 0, a: 0, x2: 0, y2: 0 })
  const [closestAngle, setClosestAngle] = useState(0);
  const [closestRadius, setClosestRadius] = useState(0);
  const [savedCoords, setSavedCoords] = useState({x: 0, y: 0, xy: ""});
  const savedCoordsRef = useRef<HTMLInputElement>(null)

  const size = 1024;

  const center = size / 2;
  const radii = Array.from(Array(18)).map((_, i) => center / 18 * (i+1))

  const angles = Array.from(Array(60)).map((_, i) => i * (360 / 60))

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
    setClosestAngle(angles.reduce((prev, curr) => {
      return (Math.abs(curr - a) < Math.abs(prev - a) ? curr : prev);
    }))
    // const radii = Array.from(Array(18)).map((_, i) => center / 18 * i)
    setClosestRadius(radii.reduce((prev, curr) => {
      return (Math.abs(curr - r) < Math.abs(prev - r) ? curr : prev);
    }))
  }, [center, angles, radii])

  return (
    <div className="App">
      <output>
        <code>
          {JSON.stringify({closestAngle, closestRadius, savedCoords}, null, 2)}
        </code>
        <input ref={savedCoordsRef} value={savedCoords.xy} readOnly/>
      </output>
      <svg onClick={handleClick} onMouseMove={handleMouseMove} xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {angles.map(a => (
          <g key={a}>
            <line className='stroked dim' x1={polarCoords(a, radii[0]).x} y1={polarCoords(a, radii[0]).y} x2={polarCoords(a, radii[radii.length-1]).x} y2={polarCoords(a, radii[radii.length-1]).y} />
          </g>
        ))}
        {radii.map(r => (
          <circle key={r} className='transparent stroked' 
          cx={center} cy={center} r={r} 
          />
        ))}
        <path className="transparent stroked" 
          d={`
            M ${polarCoords(0, center).x} ${polarCoords(0, center).y} 
            L ${polarCoords(120, center).x} ${polarCoords(120, center).y}
            L ${polarCoords(240, center).x} ${polarCoords(240, center).y}
            Z
          `}
        />
        <path className="transparent stroked" 
          d={`
            M ${polarCoords(60, center).x} ${polarCoords(60, center).y} 
            L ${polarCoords(180, center).x} ${polarCoords(180, center).y}
            L ${polarCoords(300, center).x} ${polarCoords(300, center).y}
            Z
          `}
        />
        <line className="stroked bright" x1={center} y1={center} x2={polarCoords(closestAngle, closestRadius).x} y2={polarCoords(closestAngle, closestRadius).y} />
      </svg>
    </div>
  );
}

export default App;
