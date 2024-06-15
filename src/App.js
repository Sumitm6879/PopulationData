import './App.css';
import BigGraph from './modules/BigGraph';
import SmallGraph from './modules/SmallGraph';
import Continent from './modules/Continent'

const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

function App() {
  const color = getRandomColor();
  return (
    <div className="App">
      <BigGraph gcolor={color} ></BigGraph>
      <SmallGraph gcolor={color}></SmallGraph>
      <Continent gcolor={color} ></Continent>
    </div>
  );
}

export default App;
