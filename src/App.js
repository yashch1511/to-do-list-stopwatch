import React, { useState, useEffect } from "react";

function App() {
  const [field, settext] = useState("");
  const [listitem, additem] = useState([]);
  const [openStopwatch, setOpenStopwatch] = useState(false);
  const [currentTaskId, setCurrentTaskId] = useState(null);
  const [times, setTimes] = useState({});
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval;
    if (isRunning && currentTaskId !== null) {
      interval = setInterval(() => {
        setTimes((prev) => ({
          ...prev,
          [currentTaskId]: (prev[currentTaskId] || 0) + 1,
        }));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, currentTaskId]);

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const openTimer = (id) => {
    console.log(`Opening timer for task ID: ${id}`); 
    setCurrentTaskId(id);
    setOpenStopwatch(true);
    if (!times[id]) {
      setTimes((prev) => ({ ...prev, [id]: 0 }));
    }
  };

  function updatetext(event) {
    settext(event.target.value);
    
    
  }

  function itemadded() {

    if (field.trim() === "") { 
      alert("Enter a task"); 
      return; 
  }
    additem((previtems) => {
      return [...previtems, field];
    });
    settext("");
  }

  function deleteItem(id) {
    additem((prevItems) => {
      return prevItems.filter((item, index) => index !== id);
    });
  }

  return (
    <>
      <div className="container">
        <div className="heading">
          <h1>To-Do List📝</h1>
        </div>
        <div className="form">
          <input onChange={updatetext} type="text" value={field} />
          <button onClick={itemadded}>
            <span>Add</span>
          </button>
        </div>
        <div>
          <ul className="tasks">
            {listitem.map((todoItem, index) => (
              <ToDoItem
                key={index}
                id={index}
                text={todoItem}
                onChecked={deleteItem}
                openTimer={openTimer} 
              />
            ))}
          </ul>
          {openStopwatch && (
            <div className="dialogbox">
              <div className="dialogContent">
                <h2 className="headingText">⏱️ Stopwatch</h2>
                <div className="stopwatchDisplay">
                  {formatTime(times[currentTaskId] || 0)}
                </div>
                <div className="stopwatchControls">
                  <button onClick={() => setIsRunning(!isRunning)}  
                    
                    >
                    <span className="span1" 
                    style={{
                      backgroundColor: isRunning ? "yellow" : "green", 
                    }}
                    >
                      {isRunning ? "Pause" : "Start"}
                    </span>
                  </button>
                  <button
                    onClick={() => {
                      setIsRunning(false);
                      setTimes((prev) => ({ ...prev, [currentTaskId]: 0 }));
                    }}
                  >
                    <span className="span2"
                    style={{
                      backgroundColor: "red", 
                    }}
                    >Reset</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsRunning(false);
                      setOpenStopwatch(false);
                    }}
                  >
                    <span className="span3">Close</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function ToDoItem(props) {
  return (
    <div className="each-task">
      <input
        className="tick"
        type="checkbox"
        onChange={() => props.onChecked(props.id)}
      />
      <li>{props.text}</li>
      <button
        className="settime"
        onClick={() => {
          console.log(`Set timer clicked for task ID: ${props.id}`);
          props.openTimer(props.id);
        }}
      >
        Set time
      </button>
    </div>
  );
}

export default App;
