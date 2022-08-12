// import logo from './logo.svg';
import "./App.css";
import { useReducer } from "react";

const Header = (props) => {
  return (
    <header className="header">
      <h1>{props.title ?? "Default"}</h1>
    </header>
  );
};
const ToDoList = (props) => {
  const onComplete = (index) => {
    console.log("index: ", index);
    props.dispatch({ type: "completeTodo", payload: { index } });
  };

  const onDelete = (index) => {
    console.log("index: ", index);
    props.dispatch({ type: "deleteTodo", payload: { index } });
  };

  const onChangeText = (index, text) => {
    console.log("index: ", index);
    props.dispatch({ type: "changeTodo", payload: { index, text } });
  }; 
  return (
    <>
      {props.todos.map((itm, index) => {
        return (
          <li
            key={index}
            className={itm.status === "COMPLETED" ? "completed" : ""}
          >
            <div className="view">
              <input
                className="toggle1"
                type="checkbox"
                checked={itm.status === "COMPLETED" ? true : false}
                onChange={() => {
                  onComplete(index);
                }}
              />
              {itm.status === "COMPLETED" ? (
                <label>{itm.text}</label>
              ) : (
                <input
                  className="edit"
                  value={itm.text}
                  onChange={(evt) => {
                    console.log(evt.target.value);
                    onChangeText(index, evt.target.value);
                  }}
                />
              )}
              <button
                className="destroy"
                onClick={() => {
                  onDelete(index);
                }}
              ></button>
            </div>
          </li>
        );
      })}
    </>
  );
};
const FILTER_ITEMS = {
  ALL: { title: "All" },
  ACTIVE: { title: "Active" },
  COMPLETED: { title: "Completed" },
};

const Filter = (props) => {
  const {
    titleForAll,
    titleForActive,
    titleForCompleted,
    selected,
    onFilterTodoListByStatus,
  } = props;
  <>{console.log("Last SelectedFilter: ", selected)}</>;
  return (
    <ul className="filters">
      <li>
        <a
          className={selected === "ALL" ? "selected" : ""}
          href="#/"
          onClick={() => onFilterTodoListByStatus("ALL")}
        >
          {titleForAll ?? FILTER_ITEMS["ALL"].title}
        </a>
      </li>
      <li>
        <a
          className={selected === "ACTIVE" ? "selected" : ""}
          href="#/"
          onClick={() => onFilterTodoListByStatus("ACTIVE")}
        >
          {titleForActive ?? FILTER_ITEMS["ACTIVE"].title}
        </a>
      </li>
      <li>
        <a
          className={selected === "COMPLETED" ? "selected" : ""}
          href="#/completed"
          onClick={() => onFilterTodoListByStatus("COMPLETED")}
        >
          {titleForCompleted ?? FILTER_ITEMS["COMPLETED"].title}
        </a>
      </li>
    </ul>
  );
};

const initialData = {
  title: "todos",
  newTodoText: "",
  todos: [
    // {
    //   status: "COMPLETED",
    //   text: "Learn React",
    // },
    // {
    //   status: "ACTIVE",
    //   text: "Learn Javascript",
    // },
  ],
  filterTodos: [],
  titleForAll: "All",
  titleForActive: "Active",
  titleForCompleted: "Completed",
  selectedFilter: "ALL",
};

function reducer(state, action) {
  switch (action.type) {
    case "setNewTodoText": {
      return { ...state, newTodoText: action.payload };
    }

    case "addTodo": {
      let _todos = [...state.todos];
      let _filterObject = [...state.filterTodos];
      // const _index = action.payload.index
      //test data by output console log
      console.log("Todos Object: ", _todos);
      console.log("Action Payload Text: ", action.payload.newTodoText);
      console.log("Filter Object: ", _filterObject);

      //get the typing text (action->payload->text)
      let _text = action.payload.newTodoText;
      const _todo = { text: _text, status: "ACTIVE" };

      _todos.splice(_todos.length, 0, _todo);
      return { ...state, todos: _todos, filterTodos: _todos, newTodoText: "" };
    }

    case "deleteTodo": {
      let _todos = [...state.todos];
      const _index = action.payload.index;
      // const _todo = { ..._todos[_index], status: 'COMPLETED' }

      _todos.splice(_index, 1);
      return { ...state, todos: _todos, filterTodos: _todos };
    }

    case "completeTodo": {
      let _todos = [...state.todos];
      const _index = action.payload.index;
      const _todo = { ..._todos[_index], status: "COMPLETED" };

      _todos.splice(_index, 1, _todo);
      return { ...state, todos: _todos, filterTodos: _todos };
    }

    case "changeTodo": {
      //index, text
      let _todos = [...state.todos];
      const _index = action.payload.index;
      const _todo = { ..._todos[_index], text: action.payload.text };

      _todos.splice(_index, 1, _todo);
      return { ...state, todos: _todos, filterTodos: _todos };
    }

    case "clearTodo": {
      let _todos = [...state.todos];
      //Filter out the completed
      _todos = _todos.filter((c) => c.status !== "COMPLETED");
      console.log("After Filter Completed Task :", _todos);
      return { ...state, todos: _todos, filterTodos: _todos };
    }

    case "filterTodoListByStatus": {
      let _todos = [...state.todos];

      let _selectedFilter = action.payload.selectedFilter;
      console.log("Come into case,status is: ", _selectedFilter);

      _todos = _todos.filter((s) => s.status === _selectedFilter);

      console.log("TodoList After Filter: ", _todos);
      return { ...state, filterTodos: _todos, selectedFilter: _selectedFilter };
    }
    default:
      throw new Error();
  }
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialData);

  const onChangeNewTodoText = (evt) => {
    dispatch({ type: "setNewTodoText", payload: evt.target.value });
  };

  const onAddTodo = (evt) => {
    if (evt.keyCode === 13 && state.newTodoText.trim().length > 0) {
      console.log("Enter key pressed:", state.newTodoText);
      dispatch({
        type: "addTodo",
        payload: { newTodoText: state.newTodoText.trim() },
      });
    }
  };

  

  const onClear = () => {
    console.log("call on clear");
    dispatch({ type: "clearTodo" });
  };

  // const onFilterAll = () => {
  //   console.log("Click on Filter all: ");
  //   dispatch({ type: "filterAllTodo" });
  // };

  // const onFilterActive = () => {
  //   console.log("Click on Filter Active: ");
  //   dispatch({ type: "filterActiveTodo" });
  // };

  const onFilterTodoListByStatus = (selectedFilter) => {
    console.log("Click on Filter By Status: ", selectedFilter);
    dispatch({
      type: "filterTodoListByStatus",
      payload: { selectedFilter: selectedFilter },
    });
  };

  

  return (
    <>
      <section className="todoapp">
        <Header title={state.title} />
        <input
          className="new-todo"
          placeholder="What needs to be done?"
          autoFocus
          value={state.newTodoText}
          onChange={onChangeNewTodoText}
          onKeyDown={onAddTodo}
        />
        <section className="main">
          <input id="toggle-all" className="toggle-all" type="checkbox" />
          <label htmlFor="toggle-all">Mark all as complete</label>
          <ul className="todo-list">
            {console.log("Filter Todos:", state.filterTodos)}
            <ToDoList todos={state.filterTodos.length === 0 ? state.todos : state.filterTodos} dispatch={dispatch}/>
          </ul>
        </section>
        <footer className="footer">
          <span className="todo-count">
            <strong>
              {state.todos.filter((c) => c.status !== "COMPLETED").length}
            </strong>{" "}
            item
            {state.todos.filter((c) => (c.status !== "COMPLETED").length) > 0
              ? "s"
              : ""}{" "}
            left
          </span>

          <Filter
            titleForAll={state.titleForAll}
            titleForActive={state.titleForActive}
            titleForCompleted={state.titleForCompleted}
            selected={state.selectedFilter}
            //onFilterAll={onFilterAll}
            //onFilterActive={onFilterActive}
            onFilterTodoListByStatus={onFilterTodoListByStatus}
          />
          <button
            className="clear-completed"
            onClick={() => {
              onClear();
            }}
          >
            Clear completed
          </button>
        </footer>
      </section>
    </>
  );
}

export default App;
