import './App.css';

function App() {
  const size = 512;

  const phi = 1 / (144 / 89);
  const center = size / 2;
  const r1 = size / 2;
  const r2 = r1 * phi;
  const r3 = r1 * phi**2;

  const pentaAngles = Array.from(Array(10)).map((_, i) => i * (360 / 10))
  const quintaAngles = Array.from(Array(30)).map((_, i) => i * (360 / 30))

  const polarCoords = (angle: number, radius: number) => {
    return {
      x: center + radius * Math.cos((angle - 90) * (Math.PI / 180)),
      y: center + radius * Math.sin((angle - 90) * (Math.PI / 180))
    }
  }

  return (
    <div className="App">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox={`0 0 ${size} ${size}`}>
        {quintaAngles.map(a => (
          <g key={a}>
            <line className='stroked dim' x1={polarCoords(a, r3).x} y1={polarCoords(a, r3).y} x2={polarCoords(a, r1).x} y2={polarCoords(a, r1).y} />
            <text dominantBaseline="middle" textAnchor="middle" x={polarCoords(a, r2).x} y={polarCoords(a, r2).y}>{a}</text>
          </g>
        ))}
        {[r1, r2, r3].map(r => (
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
      </svg>
    </div>
  );
}

export default App;
