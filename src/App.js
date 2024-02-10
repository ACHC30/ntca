import './App.css';
import MapWithPin from './components/MapWithPin';
import MultiStepForm from './components/MultiStepForm';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <div>
          <h1>Map with Pin</h1>
          <MapWithPin />
          <MultiStepForm/>
        </div>
      </header>
    </div>
  );
}

export default App;
