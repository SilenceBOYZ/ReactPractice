import { useState } from "react";

export default function App() {
  const [workList, setWorkList] = useState([]);
  const [workListIsOpen, setWorkListIsOpen] = useState(true);
  return (
    <div className="todolistapp">
      <h1>To do list</h1>
      <div className="workSpaceWrap">
        <WorkAddingForm onHandleAddWork={setWorkList} />
        <WorkList
          workListsToDo={workList}
          onHandleClearAll={setWorkList}
          onHandleSingleItem={setWorkList}
          onSelectItem={setWorkList} 
          onOpenWorkList={workListIsOpen}
          onHandleOpen={setWorkListIsOpen} />
      </div>
    </div>
  )
}


function WorkToDoList({ time, workTitle, workSelected, onSelectItem }) {

  function handleSelectItem(workSelected) {
    if (workSelected) {
      onSelectItem(workList => workList.map(
        work => work.id === workSelected.id ? { ...work, selected: !work.selected } : work
      ));
    }
    else return;
  }

  return (
    <div className={workSelected?.selected ? "WorkToDoList WorkToDoListActive" : "WorkToDoList"} onClick={() => handleSelectItem(workSelected)}>
      <div className="title-workList">
        <span>Time</span>
        <h3>{time}</h3>
      </div>
      <div className="title-workList">
        <span>Work title</span>
        <h3 className="workTitle">{workTitle}</h3>
      </div>
    </div>
  );
}

function WorkAddingForm({ onHandleAddWork }) {
  const [workTitle, setWorkTitle] = useState("");
  const [workTime, setWorkTime] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!workTitle || !workTime) return;

    const newWorkList = {
      id: crypto.randomUUID(),
      workTitle: workTitle,
      time: workTime,
    }
    setWorkTitle("");
    setWorkTime("");
    onHandleAddWork((workLists) => [...workLists, newWorkList]);
  }

  return (
    <form className="formSpace" onSubmit={(e) => handleSubmit(e)}>
      <h2>Add some work</h2>
      <label>🧰 Work</label>
      <input type="text" placeholder="Add your work" value={workTitle} onChange={(e) => setWorkTitle(e.target.value)} />

      <label>⌚ Time</label>
      <input type="time" value={workTime} onChange={(e) => setWorkTime(e.target.value)} />

      <Button>Add</Button>
    </form>
  )
}

function WorkList({ workListsToDo, onHandleClearAll, onHandleSingleItem, onSelectItem, onHandleOpen, onOpenWorkList }) {
  const newWorkSorted = workListsToDo.map(work => work);
  newWorkSorted.sort((a, b) => a.time.localeCompare(b.time));

  console.log(newWorkSorted);

  function HandleClearAllWork() {
    if (workListsToDo.length < 1) return;
    const isConfirm = window.confirm("Are your sure to clear all work in your list !!!");
    if (isConfirm) {
      onHandleClearAll([]);
    }
  }

  function HandleClearWorkSelected() {
    onHandleSingleItem(workList => workList.filter(work => work.selected === false || work.selected === undefined));
  }

  function HandleOpenWorkList() {
    onHandleOpen(isOpen => !isOpen);
  }

  return (
    <div className="workListSpace">
      <div className="title">
        <h2>Work list</h2>
      </div>
      {onOpenWorkList &&  
        <div className="WorkToDoListWrap">
          {newWorkSorted.length < 1 ?
            (<h2 className="Message">Add some work for tomorow</h2>)
            :
            (newWorkSorted.map(work =>
              (<WorkToDoList time={work.time} workTitle={work.workTitle} key={work.id} id={work.id} workSelected={work} onSelectItem={onSelectItem} />))
            )
          }
        </div>
      }
      <span className="icon" onClick={() => HandleOpenWorkList()}>{onOpenWorkList ? "🙉" : "🙈"} </span>
      <button className="workListBtn" onClick={() => HandleClearAllWork()}>Clear All</button>
      <button className="workListBtn workListBtnRemove" onClick={() => HandleClearWorkSelected()}> Remove </button>
    </div>
  )
}

function Button({ children }) {
  return <button className="btn">{children}</button>
}
